# blackboard.py
import requests
import json

try:
    import RPi.GPIO as GPIO  # Biblioteca para controle do GPIO na Raspberry Pi
except ImportError:
    GPIO = None  # Para permitir testes em sistemas sem GPIO

class Blackboard:
    def __init__(self):
        self.data = {}
        self.led_pin = 18  # Pino GPIO para o LED (ajuste conforme necessário)

        if GPIO:
            # Configuração inicial do GPIO
            GPIO.setmode(GPIO.BCM)  # Modo de numeração dos pinos
            GPIO.setup(self.led_pin, GPIO.OUT)  # Configura o pino como saída
            GPIO.output(self.led_pin, GPIO.LOW)  # Garante que o LED começa apagado

    def add_input(self, key, value):
        """Adiciona um novo dado à blackboard com uma chave específica."""
        self.data[key] = value

    def get_input(self, key):
        """Obtém o valor de um dado armazenado na blackboard pela chave."""
        return self.data.get(key, None)

    def display(self):
        """Exibe todos os dados armazenados na blackboard."""
        for key, value in self.data.items():
            print(f"{key}: {value}")

    def prompt_for_input(self):
        """Método para solicitar entradas ao usuário e adicionar à blackboard."""
        print("Digite os dados para adicionar à Blackboard:")
        key = input("Chave: ")
        value = input("Valor: ")
        self.add_input(key, value)
        print(f"Entrada '{key}: {value}' adicionada com sucesso!\n")

    def send_data_to_server(self):
        """Envio de dados para o servidor TypeScript via POST."""
        url = 'http://localhost:3000/receive-data'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=json.dumps(self.data), headers=headers)
        
        if response.status_code == 200:
            print("Dados enviados para o servidor com sucesso!")
        else:
            print(f"Falha no envio: {response.status_code}")

    def control_led(self, state):
        """Controla o estado do LED (ON ou OFF)."""
        if GPIO:
            if state.lower() == 'on':
                GPIO.output(self.led_pin, GPIO.HIGH)
                print("LED ligado.")
            elif state.lower() == 'off':
                GPIO.output(self.led_pin, GPIO.LOW)
                print("LED desligado.")
            else:
                print("Estado inválido. Use 'on' ou 'off'.")
        else:
            print("Controle de LED não disponível. Certifique-se de estar em um dispositivo compatível com GPIO.")

    def cleanup(self):
        """Limpa a configuração do GPIO antes de sair."""
        if GPIO:
            GPIO.cleanup()
            print("Configuração do GPIO limpa.")

if __name__ == "__main__":
    blackboard = Blackboard()

    try:
        while True:
            action = input("Escolha uma ação (add, send, led, exit): ").strip().lower()
            if action == "add":
                blackboard.prompt_for_input()
            elif action == "send":
                blackboard.send_data_to_server()
            elif action == "led":
                state = input("Digite o estado do LED (on/off): ").strip().lower()
                blackboard.control_led(state)
            elif action == "exit":
                print("Saindo do programa.")
                break
            else:
                print("Ação inválida. Tente novamente.")

        blackboard.display()
    finally:
        blackboard.cleanup()