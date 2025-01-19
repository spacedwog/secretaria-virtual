import  threading
import  time
import  serial
from    flask import Flask, jsonify

class Blackboard:
    
    """
    Uma classe para simular um sistema de blackboard, permitindo que múltiplos agentes
    adicionem e consultem informações de forma concorrente.
    Também inclui controle de LED integrado a um Arduino via comunicação serial e expõe uma API REST.
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

# Instância da BlackBoard
blackboard = Blackboard()
blackboard.add_entry("paciente_1", {"nome": "João", "idade": 30})
blackboard.toggle_led = True

# Configuração do Flask para API REST
app = Flask(__name__)

@app.route("/data", methods=["GET"])
def get_data():
    """Retorna os dados da blackboard e o estado do LED."""
    return jsonify({
        "data": blackboard.data,
        "led_state": blackboard.get_led_state()
    })

if __name__ == "__main__":
    app.run(port=3000)