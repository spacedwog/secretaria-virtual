import threading
import time
import serial
import requests
from flask import Flask, jsonify
import tkinter as tk
from tkinter import messagebox

class Blackboard:
    """
    Uma classe para simular um sistema de blackboard, permitindo que múltiplos agentes
    adicionem e consultem informações de forma concorrente.
    Também inclui controle de LED integrado a um Arduino via comunicação serial e expõe uma API REST.
    Integração com um servidor TypeScript via requisições HTTP.
    """

    def __init__(self, serial_port="COM4", baud_rate=9600, server_url="http://localhost:3000"):
        # Dicionário que armazena os dados da blackboard
        self.data = {}
        # Lock para controle de concorrência
        self.lock = threading.Lock()
        # Estado do LED (False = desligado, True = ligado)
        self.led_state = False
        # URL do servidor TypeScript
        self.server_url = server_url
        self.UPDATE_DATA_ENDPOINT = "/update-data"

        # Configuração da comunicação serial com o Arduino
        try:
            self.arduino = serial.Serial(serial_port, baud_rate, timeout=1)
            time.sleep(2)  # Aguarda a inicialização do Arduino
            print(f"Conectado ao Arduino em {serial_port}.")
        except serial.SerialException as e:
            print(f"Erro ao conectar ao Arduino: {e}")
            self.arduino = None

    def add_entry(self, key, value):
        """Adiciona uma entrada à blackboard."""
        with self.lock:
            if key in self.data:
                self.data[key].append(value)
            else:
                self.data[key] = [value]
            print(f"Entrada adicionada: {key} -> {value} no blackboard")
            self.send_data({"key": key, "value": value})

    def get_entry(self, key):
        """Recupera uma entrada da blackboard com base na chave."""
        with self.lock:
            return self.data.get(key, [])

    def remove_entry(self, key):
        """Remove uma entrada da blackboard com base na chave."""
        with self.lock:
            if key in self.data:
                del self.data[key]
                print(f"Entrada removida: {key}")

    def turn_on_led(self):
        """Liga o LED."""
        with self.lock:
            self.led_state = True
            self._send_command_to_arduino("ON")
            print("LED ligado!")

    def turn_off_led(self):
        """Desliga o LED."""
        with self.lock:
            self.led_state = False
            self._send_command_to_arduino("OFF")
            print("LED desligado!")

    def get_led_state(self):
        """Retorna o estado atual do LED."""
        with self.lock:
            return self.led_state

    def _send_command_to_arduino(self, command):
        """Envia um comando ao Arduino via serial."""
        if self.arduino:
            try:
                self.arduino.write((command + '\n').encode())
                response = self.arduino.readline().decode().strip()
                print(f"Resposta do Arduino: {response}")
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

    def add_entry():
        key = key_entry.get()
        value = value_entry.get()
        if key and value:
            blackboard.add_entry(key, value)
            messagebox.showinfo("Sucesso", f"Entrada adicionada: {key} -> {value}")
        else:
            messagebox.showwarning("Erro", "Por favor, preencha ambos os campos.")

    def get_entry():
        key = key_entry.get()
        if key:
            result = blackboard.get_entry(key)
            if result:
                messagebox.showinfo("Resultado", f"Dados encontrados: {result}")
            else:
                messagebox.showwarning("Erro", "Nenhum dado encontrado para esta chave.")
        else:
            messagebox.showwarning("Erro", "Por favor, insira uma chave para buscar.")

    def remove_entry():
        key = key_entry.get()
        if key:
            blackboard.remove_entry(key)
            messagebox.showinfo("Sucesso", f"Entrada removida: {key}")
        else:
            messagebox.showwarning("Erro", "Por favor, insira uma chave para remover.")

    def turn_on_led():
        blackboard.turn_on_led()
        messagebox.showinfo("LED", "LED ligado!")

    def turn_off_led():
        blackboard.turn_off_led()
        messagebox.showinfo("LED", "LED desligado!")

    def check_led_state():
        state = "Ligado" if blackboard.get_led_state() else "Desligado"
        messagebox.showinfo("Estado do LED", f"O LED está {state}.")

    # Configuração da janela principal
    root = tk.Tk()
    root.title("Blackboard GUI")

    # Configura layout responsivo
    root.columnconfigure(0, weight=1)
    root.columnconfigure(1, weight=1)
    root.rowconfigure(0, weight=1)
    root.rowconfigure(1, weight=1)
    root.rowconfigure(2, weight=1)
    root.rowconfigure(3, weight=1)
    root.rowconfigure(4, weight=1)

    # Campos de entrada e botões
    tk.Label(root, text="Chave:").grid(row=0, column=0, padx=10, pady=5, sticky="ew")
    key_entry = tk.Entry(root)
    key_entry.grid(row=0, column=1, padx=10, pady=5, sticky="ew")

    tk.Label(root, text="Valor:").grid(row=1, column=0, padx=10, pady=5, sticky="ew")
    value_entry = tk.Entry(root)
    value_entry.grid(row=1, column=1, padx=10, pady=5, sticky="ew")

    tk.Button(root, text="Adicionar Entrada", command=add_entry).grid(row=2, column=0, padx=10, pady=5, sticky="ew")
    tk.Button(root, text="Consultar Entrada", command=get_entry).grid(row=2, column=1, padx=10, pady=5, sticky="ew")
    tk.Button(root, text="Remover Entrada", command=remove_entry).grid(row=3, column=0, padx=10, pady=5, sticky="ew")

    tk.Button(root, text="Ligar LED", command=turn_on_led).grid(row=4, column=0, padx=10, pady=5, sticky="ew")
    tk.Button(root, text="Desligar LED", command=turn_off_led).grid(row=4, column=1, padx=10, pady=5, sticky="ew")
    tk.Button(root, text="Estado do LED", command=check_led_state).grid(row=5, column=0, columnspan=2, padx=10, pady=5, sticky="ew")

    root.mainloop()

# Executa a GUI
if __name__ == "__main__":
    create_gui()