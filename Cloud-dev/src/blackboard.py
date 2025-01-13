import requests
import json
import serial  # Para comunicação com o Arduino
import time


class Blackboard:
    def __init__(self, arduino_port="COM4", baud_rate=9600):
        self.data = {}
        self.arduino = None

        # Tenta conectar ao Arduino
        try:
            self.arduino = serial.Serial(arduino_port, baud_rate, timeout=1)
            time.sleep(2)  # Aguarda a inicialização do Arduino
            print(f"Conectado ao Arduino na porta {arduino_port}.")
        except serial.SerialException as e:
            print(f"Erro ao conectar ao Arduino: {e}")
            self.arduino = None

    def add_input(self, key, value):
        """Adiciona um novo dado à blackboard com uma chave específica."""
        self.data[key] = value

    def get_input(self, key):
        """Obtém o valor de um dado armazenado na blackboard pela chave."""
        return self.data.get(key, None)

    def display(self):
        """Exibe todos os dados armazenados na blackboard."""
        print("\n=== Dados na Blackboard ===")
        for key, value in self.data.items():
            print(f"{key}: {value}")
        print("===========================\n")

    def prompt_for_input(self):
        """Método para solicitar entradas ao usuário e adicionar à blackboard."""
        print("Digite os dados para adicionar à Blackboard:")
        key = input("Chave: ").strip()
        value = input("Valor: ").strip()
        self.add_input(key, value)
        print(f"Entrada '{key}: {value}' adicionada com sucesso!\n")

    def send_data_to_server(self):
        """Envio de dados para o servidor TypeScript via POST."""
        url = 'http://localhost:3001/receive-data'
        headers = {'Content-Type': 'application/json'}

        try:
            response = requests.post(url, data=json.dumps(self.data), headers=headers)
            if response.status_code == 200:
                print("Dados enviados para o servidor com sucesso!")
            else:
                print(f"Falha no envio. Código de status: {response.status_code}")
        except requests.RequestException as e:
            print(f"Erro ao conectar ao servidor: {e}")

    def control_led(self, led_number, state):
        """Envia comandos para o Arduino controlar LEDs individuais ou múltiplos."""
        if self.arduino:
            if state.lower() in ['on', 'off']:
                command = f"{led_number}:{state.upper()}"  # Formato: "LED_NUMBER:STATE"
                self.arduino.write(f"{command}\n".encode())  # Envia o comando via serial
                print(f"Comando '{command}' enviado ao Arduino.")
                time.sleep(0.1)  # Delay para garantir a entrega
            else:
                print("Estado inválido. Use 'on' ou 'off'.")
        else:
            print("Arduino não está conectado.")

    def cleanup(self):
        """Fecha a conexão com o Arduino."""
        if self.arduino:
            self.arduino.close()
            print("Conexão com o Arduino encerrada.")


if __name__ == "__main__":
    blackboard = Blackboard()

    try:
        while True:
            action = input("Escolha uma ação (add, send, led, display, exit): ").strip().lower()
            if action == "add":
                blackboard.prompt_for_input()
            elif action == "send":
                blackboard.send_data_to_server()
            elif action == "led":
                led_number = input("Digite o número do LED (ou 'all' para todos): ").strip().lower()
                state = input("Digite o estado do LED (on/off): ").strip().lower()
                blackboard.control_led(led_number, state)
            elif action == "display":
                blackboard.display()
            elif action == "exit":
                print("Saindo do programa.")
                break
            else:
                print("Ação inválida. Tente novamente.")
    finally:
        blackboard.cleanup()