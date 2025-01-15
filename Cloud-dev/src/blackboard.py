import requests
from time import sleep

# Simulação do GPIO para ambientes sem hardware (como no Windows)
class MockGPIO:
    BCM = "BCM"
    OUT = "OUT"
    HIGH = True
    LOW = False

    def setmode(self, mode):
        print(f"Modo configurado para: {mode}")

    def setup(self, pin, mode):
        print(f"Pino {pin} configurado como {mode}")

    def output(self, pin, state):
        print(f"Pino {pin} definido como {'ALTO' if state else 'BAIXO'}")

    def cleanup(self):
        print("GPIO limpo")

GPIO = MockGPIO()  # Usando o mock GPIO

class LEDController:
    def __init__(self, pin=18):
        self.pin = pin
        GPIO.setmode(GPIO.BCM)  # Definindo o modo do GPIO
        GPIO.setup(self.pin, GPIO.OUT)  # Configurando o pino
        self.state = False  # Estado inicial da LED (desligada)

    def turn_on(self):
        GPIO.output(self.pin, GPIO.HIGH)  # Ligando a LED
        self.state = True
        print("💡 LED Ligada")

    def turn_off(self):
        GPIO.output(self.pin, GPIO.LOW)  # Desligando a LED
        self.state = False
        print("💡 LED Desligada")

    def toggle(self):
        if self.state:
            self.turn_off()
        else:
            self.turn_on()

    def cleanup(self):
        GPIO.cleanup()  # Limpando a configuração GPIO
        print("✅ GPIO limpo")

# Classes existentes
class Blackboard:
    def __init__(self):
        self.data_store = []

    def add_data(self, data):
        self.data_store.append(data)
        print(f"✅ Dados adicionados ao Blackboard: {data}")

    def get_data(self):
        return self.data_store

    def clear_data(self):
        self.data_store.clear()
        print("✅ Todos os dados foram limpos do Blackboard.")

class DataSender:
    def __init__(self, server_url, blackboard, led_controller):
        self.server_url = server_url
        self.blackboard = blackboard
        self.led_controller = led_controller

    def send_data(self):
        data = self.blackboard.get_data()
        if not data:
            print("⚠️ Nenhum dado disponível no Blackboard para enviar.")
            return

        try:
            response = requests.post(f"{self.server_url}/receive-data", json={"entries": data})
            response.raise_for_status()
            print(f"✅ Dados enviados com sucesso: {response.json()}")
            self.blackboard.clear_data()
            self.led_controller.turn_on()  # Liga a LED ao enviar dados com sucesso
            sleep(1)
            self.led_controller.turn_off()  # Desliga após 1 segundo
        except requests.ConnectionError:
            print("❌ Erro de conexão: Não foi possível acessar o servidor.")
        except requests.Timeout:
            print("❌ Tempo de espera excedido ao tentar enviar os dados.")
        except requests.RequestException as e:
            print(f"❌ Erro ao enviar dados: {e}")

    def display_menu(self):
        while True:
            print("\n=== Menu Principal ===")
            print("1. Adicionar dados ao Blackboard")
            print("2. Visualizar dados do Blackboard")
            print("3. Enviar dados ao servidor")
            print("4. Limpar Blackboard")
            print("5. Alterar URL do servidor")
            print("6. Alternar LED")
            print("7. Sair")
            choice = input("Escolha uma opção: ")

            if choice == "1":
                self.handle_add_data()
            elif choice == "2":
                self.handle_view_data()
            elif choice == "3":
                self.send_data()
            elif choice == "4":
                self.blackboard.clear_data()
            elif choice == "5":
                self.change_server_url()
            elif choice == "6":
                self.led_controller.toggle()
            elif choice == "7":
                print("👋 Saindo do programa...")
                self.led_controller.cleanup()
                break
            else:
                print("⚠️ Opção inválida. Tente novamente.")

    def handle_add_data(self):
        print("\n--- Adicionar Dados ao Blackboard ---")
        key = input("Digite o tipo do medicamento: ").strip()
        value = input("Digite o código do medicamento: ").strip()

        if not key or not value:
            print("⚠️ Os campos não podem estar vazios. Tente novamente.")
            return

        data = {"key": key, "value": value}
        self.blackboard.add_data(data)

    def handle_view_data(self):
        print("\n--- Dados no Blackboard ---")
        data = self.blackboard.get_data()
        if not data:
            print("⚠️ Nenhum dado disponível.")
        else:
            for index, entry in enumerate(data, start=1):
                print(f"{index}. Tipo: {entry['key']}, Código: {entry['value']}")

    def change_server_url(self):
        print(f"\nURL atual do servidor: {self.server_url}")
        new_url = input("Digite a nova URL do servidor: ").strip()
        if new_url:
            self.server_url = new_url
            print(f"✅ URL do servidor atualizada para: {self.server_url}")
        else:
            print("⚠️ URL não alterada.")

if __name__ == "__main__":
    # Instância do Blackboard
    blackboard = Blackboard()

    # URL padrão do servidor
    server_url = "http://localhost:3001"

    # Instância do LEDController
    led_controller = LEDController()

    # Instância do DataSender com integração ao Blackboard e LEDController
    sender = DataSender(server_url, blackboard, led_controller)

    # Exibir o menu
    sender.display_menu()