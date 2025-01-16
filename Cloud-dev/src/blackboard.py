import requests
from time import sleep, strftime
import logging

# Configurar logs para depuração
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s]: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Simulação do GPIO para ambientes sem hardware (como no Windows)
class MockGPIO:
    BCM = "BCM"
    OUT = "OUT"
    HIGH = True
    LOW = False

    def __init__(self):
        self.pin_states = {}

    def setmode(self, mode):
        logging.info(f"Modo GPIO configurado para: {mode}")

    def setup(self, pin, mode):
        self.pin_states[pin] = MockGPIO.LOW
        logging.info(f"Pino {pin} configurado como {mode}")

    def output(self, pin, state):
        if pin in self.pin_states:
            self.pin_states[pin] = state
            logging.info(f"Pino {pin} definido como {'ALTO' if state else 'BAIXO'}")
        else:
            logging.error(f"Pino {pin} não configurado.")

    def cleanup(self):
        self.pin_states.clear()
        logging.info("GPIO limpo e restaurado ao estado inicial")

GPIO = MockGPIO()  # Usando o mock GPIO

class LEDController:
    def __init__(self, pin=13):
        self.pin = pin
        GPIO.setmode(GPIO.BCM)  # Definindo o modo do GPIO
        GPIO.setup(self.pin, GPIO.OUT)  # Configurando o pino
        self.state = GPIO.LOW  # Estado inicial da LED (desligada)

    def turn_on(self):
        GPIO.output(self.pin, GPIO.HIGH)  # Ligando a LED
        self.state = GPIO.HIGH
        logging.info("💡 LED ligada")

    def turn_off(self):
        GPIO.output(self.pin, GPIO.LOW)  # Desligando a LED
        self.state = GPIO.LOW
        logging.info("💡 LED desligada")

    def toggle(self):
        if self.state == GPIO.HIGH:
            self.turn_off()
        else:
            self.turn_on()

    def cleanup(self):
        GPIO.cleanup()  # Limpando a configuração GPIO
        logging.info("✅ Configuração do LED restaurada")

class Blackboard:
    def __init__(self):
        self.data_store = []

    def add_data(self, data):
        self.data_store.append(data)
        logging.info(f"✅ Dados adicionados ao Blackboard: {data}")

    def get_data(self):
        return self.data_store

    def clear_data(self):
        self.data_store.clear()
        logging.info("✅ Todos os dados foram limpos do Blackboard.")

class DataSender:
    def __init__(self, server_url, blackboard, led_controller, timeout=5):
        self.server_url = server_url
        self.blackboard = blackboard
        self.led_controller = led_controller
        self.timeout = timeout

    def send_data(self):
        data = self.blackboard.get_data()
        if not data:
            logging.warning("⚠️ Nenhum dado disponível no Blackboard para enviar.")
            return

        try:
            response = requests.post(
                f"{self.server_url}/receive-data", 
                json={"entries": data}, 
                timeout=self.timeout
            )
            response.raise_for_status()
            logging.info(f"✅ Dados enviados com sucesso: {response.json()}")
            self.blackboard.clear_data()
            self.led_controller.turn_on()
            sleep(1)
            self.led_controller.turn_off()
        except requests.ConnectionError:
            logging.error("❌ Erro de conexão: Não foi possível acessar o servidor.")
        except requests.Timeout:
            logging.error("❌ Tempo de espera excedido ao tentar enviar os dados.")
        except requests.RequestException as e:
            logging.error(f"❌ Erro ao enviar dados: {e}")

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
            choice = input("Escolha uma opção: ").strip()

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
                logging.info("👋 Saindo do programa...")
                self.led_controller.cleanup()
                break
            else:
                logging.warning("⚠️ Opção inválida. Tente novamente.")

    def handle_add_data(self):
        key = input("Digite o tipo do medicamento: ").strip()
        value = input("Digite o código do medicamento: ").strip()
        if key and value:
            self.blackboard.add_data({"key": key, "value": value})
        else:
            logging.warning("⚠️ Os campos não podem estar vazios.")

    def handle_view_data(self):
        data = self.blackboard.get_data()
        if data:
            for index, entry in enumerate(data, start=1):
                print(f"{index}. Tipo: {entry['key']}, Código: {entry['value']}")
        else:
            logging.info("⚠️ Nenhum dado disponível no Blackboard.")

    def change_server_url(self):
        new_url = input(f"URL atual: {self.server_url}\nNova URL: ").strip()
        if new_url:
            self.server_url = new_url
            logging.info(f"✅ URL do servidor atualizada para: {self.server_url}")
        else:
            logging.warning("⚠️ URL não alterada.")

if __name__ == "__main__":
    blackboard = Blackboard()
    led_controller = LEDController()
    sender = DataSender("http://localhost:3001", blackboard, led_controller)
    sender.display_menu()