import json
import threading
import time
import serial
import requests
from flask import Flask, jsonify
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
    """
    Uma classe para simular um sistema de blackboard, permitindo que múltiplos agentes
    adicionem e consultem informações de forma concorrente.
    """
    def __init__(self, serial_port="COM4", baud_rate=9600, server_url="http://localhost:3000"):
        self.data = {}
        self.lock = threading.Lock()
        self.led_state = False
        self.server_url = server_url
        self.UPDATE_DATA_ENDPOINT = "/update-data"
        self.user_profile = None  # Adiciona suporte ao perfil de usuário

        # Configuração do Arduino
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
        
def create_gui():
    blackboard = Blackboard()

    def configure_user_profile():
        """Configura o perfil do usuário."""
        name = name_entry.get()
        email = email_entry.get()
        role = role_entry.get()

        if name and email and role:
            blackboard.set_user_profile(name, email, role)
            messagebox.showinfo("Sucesso", "Perfil configurado com sucesso!")
            profile_window.destroy()
        else:
            messagebox.showwarning("Erro", "Por favor, preencha todos os campos.")

    # Janela para configurar o perfil do usuário
    profile_window = tk.Tk()
    profile_window.title("Configurar Perfil do Usuário")

    tk.Label(profile_window, text="Nome:").grid(row=0, column=0, padx=10, pady=5, sticky="e")
    name_entry = tk.Entry(profile_window)
    name_entry.grid(row=0, column=1, padx=10, pady=5, sticky="ew")

    tk.Label(profile_window, text="Email:").grid(row=1, column=0, padx=10, pady=5, sticky="e")
    email_entry = tk.Entry(profile_window)
    email_entry.grid(row=1, column=1, padx=10, pady=5, sticky="ew")

    tk.Label(profile_window, text="Função:").grid(row=2, column=0, padx=10, pady=5, sticky="e")
    role_entry = tk.Entry(profile_window)
    role_entry.grid(row=2, column=1, padx=10, pady=5, sticky="ew")

    tk.Button(profile_window, text="Salvar Perfil", command=configure_user_profile).grid(row=3, column=0, columnspan=2, pady=10)

    profile_window.mainloop()
