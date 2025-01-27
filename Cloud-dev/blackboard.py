import json
import sqlite3
import threading
import time
import serial
import requests
import tkinter as tk
from tkinter import messagebox

class UserProfile:
    """Classe para gerenciar o perfil do usuário."""
    def __init__(self, name, email, role):
        self.name = name
        self.email = email
        self.role = role

    def display(self):
        return f"Nome: {self.name}, Email: {self.email}, Função: {self.role}"


class Blackboard:
    """Classe principal para gerenciamento do sistema Blackboard."""
    def __init__(self, serial_port="COM4", baud_rate=9600, server_url="http://localhost:3001", db_name="secretaria_virtual"):
        self.data = {}
        self.lock = threading.Lock()
        self.led_state = False
        self.server_url = server_url
        self.UPDATE_DATA_ENDPOINT = "/update-data"
        self.RECORD_DATA_ENDPOINT = "/record-data"
        self.db_name = db_name
        self.user_profile = None
        self.leds = {}  # Dicionário para armazenar o estado e intensidade dos LEDs
        self.arduino = None

        try:
            self.arduino = serial.Serial(serial_port, baud_rate, timeout=1)
            time.sleep(2)
            print(f"Conectado ao Arduino em {serial_port}.")
        except serial.SerialException as e:
            print(f"Erro ao conectar ao Arduino: {e}")
            self.arduino = None

        # Configura banco de dados
        self._setup_database()
        
    def _setup_database(self):
        """Configura o banco de dados e cria as tabelas necessárias."""
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS leds (
                    id TEXT PRIMARY KEY,
                    state BOOLEAN NOT NULL,
                    intensity INTEGER NOT NULL
                )
            """)
            conn.commit()
            print("Banco de dados configurado.")
    def add_led(self, led_id):
        """Adiciona um LED ao sistema e ao banco de dados."""
        if led_id not in self.leds:
            self.leds[led_id] = {"state": False, "intensity": 0}
            with sqlite3.connect(self.db_name) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT OR IGNORE INTO leds (id, state, intensity)
                    VALUES (?, ?, ?)
                """, (led_id, False, 0))
                conn.commit()
            print(f"LED '{led_id}' adicionado ao sistema e ao banco de dados.")

    def set_user_profile(self, name, email, role):
        """Define o perfil do usuário."""
        self.user_profile = UserProfile(name, email, role)
        print("Perfil de usuário configurado:")
        print(self.user_profile.display())

    def add_entry(self, key, value):
        """Adiciona uma entrada à blackboard."""
        with self.lock:
            if key in self.data:
                self.data[key].append(value)
            else:
                self.data[key] = [value]
            self.send_data(key, value)
            print(f"Entrada adicionada: {key} -> {value} no blackboard")

    def record_entry(self, id_paciente, id_medico, id_receita,
                            code_medic, id_medic, nome_medic, tipo_medic, data_medic,
                            dosagem, frequencia, consumo, observacao):
        """Grava dados de uma receita no blackboard."""
        with self.lock:
            if id_receita in self.data:
                self.data[id_receita].append(
                    {
                        "id_paciente": id_paciente,
                        "id_medico": id_medico,
                        "id_receita": id_receita,
                        "code_medic": code_medic,
                        "id_medic": id_medic,
                        "nome_medic": nome_medic,
                        "tipo_medic": tipo_medic,
                        "data_medic": data_medic,
                        "dosagem": dosagem,
                        "frequencia": frequencia,
                        "consumo": consumo,
                        "observacao": observacao
                    }
                )
            else:
                self.data[id_receita] = [
                    {
                        "id_paciente": id_paciente,
                        "id_medico": id_medico,
                        "id_receita": id_receita,
                        "code_medic": code_medic,
                        "id_medic": id_medic,
                        "nome_medic": nome_medic,
                        "tipo_medic": tipo_medic,
                        "data_medic": data_medic,
                        "dosagem": dosagem,
                        "frequencia": frequencia,
                        "consumo": consumo,
                        "observacao": observacao
                    }
                ]
            self.record_data(id_paciente, id_medico, id_receita,
                            code_medic, id_medic, nome_medic, tipo_medic, data_medic,
                            dosagem, frequencia, consumo, observacao)
            print(f"Receita médica gravada no blackboard: {id_receita}")

    def get_led_state(self):
        """Retorna o estado do LED."""
        return self.led_state

    def toggle_led(self, led_id, state):
        """Liga ou desliga um LED e atualiza o banco de dados."""
        if led_id in self.leds:
            self.leds[led_id]["state"] = state
            command = f"LED:{led_id}:ON" if state else f"LED:{led_id}:OFF"
            self._send_command_to_arduino(command)

            with sqlite3.connect(self.db_name) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    UPDATE leds SET state = ? WHERE id = ?
                """, (state, led_id))
                conn.commit()
            print(f"LED '{led_id}' {'ligado' if state else 'desligado'} e atualizado no banco de dados.")

    def set_led_intensity(self, led_id, intensity):
        """Define a intensidade de um LED e atualiza o banco de dados."""
        if led_id in self.leds:
            if 0 <= intensity <= 100:
                self.leds[led_id]["intensity"] = intensity
                command = f"LED:{led_id}:INTENSITY:{intensity}"
                print(command)
                self._send_command_to_arduino(command)

                with sqlite3.connect(self.db_name) as conn:
                    cursor = conn.cursor()
                    cursor.execute("""
                        UPDATE leds SET intensity = ? WHERE id = ?
                    """, (intensity, led_id))
                    conn.commit()
                print(f"Intensidade do LED '{led_id}' definida para {intensity}% e atualizada no banco de dados.")
            else:
                print("Erro: Intensidade deve estar entre 0 e 100.")

    def send_data(self, key, value):
        """Envia dados ao servidor TypeScript."""
        url = f"{self.server_url}{self.UPDATE_DATA_ENDPOINT}"
        payload = {"key": key, "value": value}
        headers = {"Content-Type": "application/json"}

        try:
            response = requests.post(url, data=json.dumps(payload), headers=headers)
            response.raise_for_status()
            print("Dados enviados com sucesso:", response.json())
        except requests.exceptions.HTTPError as http_err:
            print(f"Erro HTTP: {http_err}")
        except Exception as err:
            print(f"Erro ao enviar dados: {err}")

    def record_data(self, id_paciente, id_medico, id_receita,
                            code_medic, id_medic, nome_medic, tipo_medic, data_medic,
                            dosagem, frequencia, consumo, observacao):
        """Grava dados de uma receita no sistema."""
        url = f"{self.server_url}{self.RECORD_DATA_ENDPOINT}"
        payload = {
            "id_paciente": id_paciente,
            "id_medico": id_medico,
            "id_receita": id_receita,
            "code_medic": code_medic,
            "id_medic": id_medic,
            "nome_medic": nome_medic,
            "tipo_medic": tipo_medic,
            "data_medic": data_medic,
            "dosagem": dosagem,
            "frequencia": frequencia,
            "consumo": consumo,
            "observacao": observacao
        }

        try:
            response = requests.post(url, data=json.dumps(payload))
            response.raise_for_status()
            print("Dados enviados com sucesso:", response.json())
        except requests.exceptions.HTTPError as http_err:
            print(f"Erro HTTP: {http_err}")
        except Exception as err:
            print(f"Erro ao enviar dados: {err}")

    def _send_command_to_arduino(self, command):
        """Envia comandos ao Arduino via Serial."""
        if self.arduino:
            try:
                self.arduino.write((command + "\n").encode())
                response = self.arduino.readline().decode().strip()
                print(f"Resposta do Arduino: {response}")
            except serial.SerialException as e:
                print(f"Erro ao enviar comando ao Arduino: {e}")

    def load_leds_from_database(self):
        """Carrega LEDs do banco de dados para o sistema."""
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, state, intensity FROM leds")
            rows = cursor.fetchall()
            for row in rows:
                self.leds[row[0]] = {"state": bool(row[1]), "intensity": row[2]}
        print("LEDs carregados do banco de dados:", self.leds)


# Interface gráfica usando Tkinter
def create_gui():
    blackboard = Blackboard()
    blackboard.add_led("led1")
    blackboard.add_led("led2")
    blackboard.load_leds_from_database()

    def switch_to_frame(frame_to_show):
        """Troca para a tela especificada."""
        for frame in frames:
            frame.pack_forget()
        frame_to_show.pack(fill="both", expand=True)

    def configure_user_profile():
        """Configura o perfil do usuário."""
        name = name_entry.get()
        email = email_entry.get()
        role = role_entry.get()
        if name and email and role:
            blackboard.set_user_profile(name, email, role)
            messagebox.showinfo("Sucesso", "Perfil configurado com sucesso!")
            switch_to_frame(main_frame)
        else:
            messagebox.showwarning("Erro", "Por favor, preencha todos os campos.")

    def register_medic_recip():
        """Registrar a receita médica."""

        id_paciente = pacient_entry.get()
        id_medico = medico_entry.get()
        id_receita = receita_entry.get()
        code_medic = code_entry.get()
        id_medic = medicamento_entry.get()
        nome_medic = nome_medicamento_entry.get()
        tipo_medic = tipo_medicamento_entry.get()
        data_medicacao = data_medicacao_entry.get()
        dosagem = dosagem_entry.get()
        frequencia = frequencia_entry.get()
        consumo = consumo_entry.get()
        observacao = observacao_entry.get()

        blackboard.record_entry(id_paciente, id_medico, id_receita,
                        code_medic, id_medic, nome_medic,
                        tipo_medic, data_medicacao,
                        dosagem, frequencia, consumo, observacao)

    def add_entry():
        """Adiciona uma entrada no Blackboard."""
        key = key_entry.get()
        value = value_entry.get()
        if key and value:
            blackboard.add_entry(key, value)
            messagebox.showinfo("Sucesso", f"Entrada adicionada: {key} -> {value}")
        else:
            messagebox.showwarning("Erro", "Por favor, preencha ambos os campos.")

    def update_led_list():
        """Atualiza a lista de LEDs na interface."""
        led_list.delete(0, tk.END)
        for led_id, details in blackboard.leds.items():
            state = "Ligado" if details["state"] else "Desligado"
            led_list.insert(tk.END, f"{led_id} - Estado: {state}, Intensidade: {details['intensity']}%")

    def toggle_selected_led():
        """Liga ou desliga o LED selecionado."""
        selected = led_list.curselection()
        if selected:
            led_id = list(blackboard.leds.keys())[selected[0]]
            current_state = blackboard.leds[led_id]["state"]
            blackboard.toggle_led(led_id, not current_state)
            update_led_list()

    def set_selected_led_intensity():
        """Define a intensidade do LED selecionado."""
        selected = led_list.curselection()
        if selected:
            led_id = list(blackboard.leds.keys())[selected[0]]
            try:
                intensity = int(intensity_entry.get())
                blackboard.set_led_intensity(led_id, intensity)
                update_led_list()
            except ValueError:
                messagebox.showerror("Erro", "Por favor, insira um valor válido para a intensidade.")


    # Janela principal
    root = tk.Tk()
    root.title("Blackboard GUI")
    root.geometry("400x500")

    # Frames para navegação
    main_frame = tk.Frame(root)
    record_frame = tk.Frame(root)
    profile_frame = tk.Frame(root)
    led_control_frame = tk.Frame(root)

    # Lista de frames
    frames = [main_frame, record_frame, profile_frame, led_control_frame]

    # Tela principal
    tk.Label(main_frame, text="Tipo do Medicamento:").pack(pady=5)
    key_entry = tk.Entry(main_frame)
    key_entry.pack(pady=5)

    tk.Label(main_frame, text="Código do Medicamento:").pack(pady=5)
    value_entry = tk.Entry(main_frame)
    value_entry.pack(pady=5)

    tk.Button(main_frame, text="Adicionar Entrada", command=add_entry).pack(pady=5)
    tk.Button(main_frame, text="Receita Médica", command=lambda: switch_to_frame(record_frame)).pack(pady=5)
    tk.Button(main_frame, text="Configurar Perfil", command=lambda: switch_to_frame(profile_frame)).pack(pady=5)
    tk.Button(main_frame, text="Controle de LED", command=lambda: switch_to_frame(led_control_frame)).pack(pady=5)

    #Tela de Recording
    tk.Label(record_frame, text="ID do Paciente").grid(row=0, column=0, padx=5, pady=5)
    pacient_entry = tk.Entry(record_frame)
    pacient_entry.grid(row=1, column=0, padx=5, pady=5)

    tk.Label(record_frame, text="ID do Médico").grid(row=0, column=1, padx=5, pady=5)
    medico_entry = tk.Entry(record_frame)
    medico_entry.grid(row=1, column=1, padx=5, pady=5)

    tk.Label(record_frame, text="ID da Receita").grid(row=2, column=0, padx=5, pady=5)
    receita_entry = tk.Entry(record_frame)
    receita_entry.grid(row=3, column=0, padx=5, pady=5)

    tk.Label(record_frame, text="Código do Medicamento").grid(row=2, column=1, padx=5, pady=5)
    code_entry = tk.Entry(record_frame)
    code_entry.grid(row=3, column=1, padx=5, pady=5)

    tk.Label(record_frame, text="ID do Medicamento").grid(row=4, column=0, padx=5, pady=5)
    medicamento_entry = tk.Entry(record_frame)
    medicamento_entry.grid(row=5, column=0, padx=5, pady=5)

    tk.Label(record_frame, text="Nome do Medicamento").grid(row=4, column=1, padx=5, pady=5)
    nome_medicamento_entry = tk.Entry(record_frame)
    nome_medicamento_entry.grid(row=5, column=1, padx=5, pady=5)

    tk.Label(record_frame, text="Tipo do Medicamento").grid(row=6, column=0, padx=5, pady=5)
    tipo_medicamento_entry = tk.Entry(record_frame)
    tipo_medicamento_entry.grid(row=7, column=0, padx=5, pady=5)

    tk.Label(record_frame, text="Data da medicação").grid(row=6, column=1, padx=5, pady=5)
    data_medicacao_entry = tk.Entry(record_frame)
    data_medicacao_entry.grid(row=7, column=1, padx=5, pady=5)

    tk.Label(record_frame, text="Dosagem da medicação").grid(row=8, column=0, padx=5, pady=5)
    dosagem_entry = tk.Entry(record_frame)
    dosagem_entry.grid(row=9, column=0, padx=5, pady=5)

    tk.Label(record_frame, text="Frequência da medicação").grid(row=8, column=1, padx=5, pady=5)
    frequencia_entry = tk.Entry(record_frame)
    frequencia_entry.grid(row=9, column=1, padx=5, pady=5)

    tk.Label(record_frame, text="Duração da Dose").grid(row=10, column=0, padx=5, pady=5)
    consumo_entry = tk.Entry(record_frame)
    consumo_entry.grid(row=11, column=0, padx=5, pady=5)

    tk.Label(record_frame, text="Observações").grid(row=10, column=1, padx=5, pady=5)
    observacao_entry = tk.Entry(record_frame)
    observacao_entry.grid(row=11, column=1, padx=5, pady=5)

    tk.Button(record_frame, text="Registrar Receita Médica", command=register_medic_recip).grid(row=12, column=0, padx=5)
    tk.Button(record_frame, text="Voltar", command=lambda: switch_to_frame(main_frame)).grid(row=12, column=1, padx=5)

    # Tela de perfil
    tk.Label(profile_frame, text="Nome:").pack(pady=5)
    name_entry = tk.Entry(profile_frame)
    name_entry.pack(pady=5)

    tk.Label(profile_frame, text="Email:").pack(pady=5)
    email_entry = tk.Entry(profile_frame)
    email_entry.pack(pady=5)

    tk.Label(profile_frame, text="Função:").pack(pady=5)
    role_entry = tk.Entry(profile_frame)
    role_entry.pack(pady=5)

    tk.Button(profile_frame, text="Salvar Perfil", command=configure_user_profile).pack(pady=5)
    tk.Button(profile_frame, text="Voltar", command=lambda: switch_to_frame(main_frame)).pack(pady=5)

    # Tela de controle de LED
    tk.Label(led_control_frame, text="Controle de LEDs", font=("Arial", 14)).pack(pady=10)

    led_list = tk.Listbox(led_control_frame)
    led_list.pack(pady=10, fill="both", expand=True)

    tk.Button(led_control_frame, text="Alternar LED Selecionado", command=toggle_selected_led).pack(pady=5)

    tk.Label(led_control_frame, text="Definir Intensidade (0-100):").pack(pady=5)
    intensity_entry = tk.Entry(led_control_frame)
    intensity_entry.pack(pady=5)

    tk.Button(led_control_frame, text="Definir Intensidade", command=set_selected_led_intensity).pack(pady=5)
    tk.Button(led_control_frame, text="Voltar", command=lambda: switch_to_frame(main_frame)).pack(pady=5)

    # Inicia na tela principal
    main_frame.pack(fill="both", expand=True)

    update_led_list()
    root.mainloop()


# Executa a GUI
if __name__ == "__main__":
    create_gui()