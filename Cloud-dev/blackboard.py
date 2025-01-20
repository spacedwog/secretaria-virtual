import json
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
    def __init__(self, serial_port="COM4", baud_rate=9600, server_url="http://localhost:3000"):
        self.data = {}
        self.lock = threading.Lock()
        self.led_state = False
        self.server_url = server_url
        self.UPDATE_DATA_ENDPOINT = "/update-data"
        self.user_profile = None

        try:
            self.arduino = serial.Serial(serial_port, baud_rate, timeout=1)
            time.sleep(2)
            print(f"Conectado ao Arduino em {serial_port}.")
        except serial.SerialException as e:
            print(f"Erro ao conectar ao Arduino: {e}")
            self.arduino = None

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

    def get_led_state(self):
        """Retorna o estado do LED."""
        return self.led_state

    def toggle_led(self, state):
        """Alterna o estado do LED."""
        self.led_state = state
        command = "ON" if state else "OFF"
        if self.arduino:
            try:
                self.arduino.write((command + '\n').encode())
                print(f"Comando enviado ao Arduino: {command}")
            except serial.SerialException as e:
                print(f"Erro ao enviar comando ao Arduino: {e}")
                
    def send_data(self, key, value):
        url = f"{self.server_url}{self.UPDATE_DATA_ENDPOINT}"
        payload = {
            "key": key,
            "value": value
        }
        headers = {"Content-Type": "application/json"}

        try:
            response = requests.post(url, data=json.dumps(payload), headers=headers)
            response.raise_for_status()
            print("Dados enviados com sucesso:", response.json())
        except requests.exceptions.HTTPError as http_err:
            print(f"Erro HTTP: {http_err}")
        except Exception as err:
            print(f"Erro ao enviar dados: {err}")

# Interface gráfica usando Tkinter
def create_gui():
    blackboard = Blackboard()

    def switch_to_profile():
        """Troca para a tela de configuração de perfil."""
        main_frame.pack_forget()
        profile_frame.pack(fill="both", expand=True)

    def switch_to_main():
        """Troca para a tela principal."""
        profile_frame.pack_forget()
        main_frame.pack(fill="both", expand=True)

    def configure_user_profile():
        """Configura o perfil do usuário."""
        name = name_entry.get()
        email = email_entry.get()
        role = role_entry.get()
        if name and email and role:
            blackboard.set_user_profile(name, email, role)
            messagebox.showinfo("Sucesso", "Perfil configurado com sucesso!")
            switch_to_main()
        else:
            messagebox.showwarning("Erro", "Por favor, preencha todos os campos.")

    def add_entry():
        key = key_entry.get()
        value = value_entry.get()
        if key and value:
            blackboard.add_entry(key, value)
            messagebox.showinfo("Sucesso", f"Entrada adicionada: {key} -> {value}")
        else:
            messagebox.showwarning("Erro", "Por favor, preencha ambos os campos.")

    def toggle_led():
        current_state = blackboard.get_led_state()
        new_state = not current_state
        blackboard.toggle_led(new_state)
        led_button.config(text="Desligar LED" if new_state else "Ligar LED")
        messagebox.showinfo("LED", f"LED {'ligado' if new_state else 'desligado'}!")

    # Janela principal
    root = tk.Tk()
    root.title("Blackboard GUI")
    root.geometry("400x300")

    # Frame principal
    main_frame = tk.Frame(root)
    profile_frame = tk.Frame(root)

    # Tela principal
    tk.Label(main_frame, text="Chave:").pack(pady=5)
    key_entry = tk.Entry(main_frame)
    key_entry.pack(pady=5)

    tk.Label(main_frame, text="Valor:").pack(pady=5)
    value_entry = tk.Entry(main_frame)
    value_entry.pack(pady=5)

    tk.Button(main_frame, text="Adicionar Entrada", command=add_entry).pack(pady=5)
    led_button = tk.Button(main_frame, text="Ligar LED", command=toggle_led)
    led_button.pack(pady=5)
    tk.Button(main_frame, text="Configurar Perfil", command=switch_to_profile).pack(pady=5)

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
    tk.Button(profile_frame, text="Voltar", command=switch_to_main).pack(pady=5)

    # Inicia na tela principal
    main_frame.pack(fill="both", expand=True)

    root.mainloop()

# Executa a GUI
if __name__ == "__main__":
    create_gui()