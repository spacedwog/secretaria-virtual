import threading
import time
import serial

class Blackboard:
    """
    Uma classe para simular um sistema de blackboard, permitindo que múltiplos agentes
    adicionem e consultem informações de forma concorrente.
    Também inclui controle de LED integrado a um Arduino via comunicação serial.
    """

    def __init__(self, serial_port="COM4", baud_rate=9600):
        # Dicionário que armazena os dados da blackboard
        self.data = {}
        # Lock para controle de concorrência
        self.lock = threading.Lock()
        # Estado do LED (False = desligado, True = ligado)
        self.led_state = False

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
            print(f"Entrada adicionada: {key} -> {value}")

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

# Menu interativo
if __name__ == "__main__":
    blackboard = Blackboard()

    while True:
        print("\nMenu Interativo:")
        print("1. Adicionar entrada")
        print("2. Consultar entrada")
        print("3. Remover entrada")
        print("4. Ligar LED")
        print("5. Desligar LED")
        print("6. Verificar estado do LED")
        print("7. Sair")

        escolha = input("Escolha uma opção: ")

        if escolha == "1":
            chave = input("Digite a chave: ")
            valor = input("Digite o valor (em formato chave:valor, separado por vírgulas): ")
            try:
                valor_dict = {k.strip(): v.strip() for k, v in (item.split(":") for item in valor.split(","))}
                blackboard.add_entry(chave, valor_dict)
            except Exception as e:
                print(f"Erro ao adicionar entrada: {e}")

        elif escolha == "2":
            chave = input("Digite a chave para consultar: ")
            resultado = blackboard.get_entry(chave)
            if resultado:
                print(f"Dados encontrados: {resultado}")
            else:
                print("Nenhum dado encontrado para esta chave.")

        elif escolha == "3":
            chave = input("Digite a chave para remover: ")
            blackboard.remove_entry(chave)

        elif escolha == "4":
            blackboard.turn_on_led()

        elif escolha == "5":
            blackboard.turn_off_led()

        elif escolha == "6":
            estado_led = "Ligado" if blackboard.get_led_state() else "Desligado"
            print(f"Estado atual do LED: {estado_led}")

        elif escolha == "7":
            print("Saindo do programa. Até mais!")
            break

        else:
            print("Opção inválida. Tente novamente.")