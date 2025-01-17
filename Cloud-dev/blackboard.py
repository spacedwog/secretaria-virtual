import threading
import time

class Blackboard:
    """
    Uma classe para simular um sistema de blackboard, permitindo que múltiplos agentes
    adicionem e consultem informações de forma concorrente.
    Também inclui controle de LED.
    """

    def __init__(self):
        # Dicionário que armazena os dados da blackboard
        self.data = {}
        # Lock para controle de concorrência
        self.lock = threading.Lock()
        # Estado do LED (False = desligado, True = ligado)
        self.led_state = False

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
            print("LED ligado!")

    def turn_off_led(self):
        """Desliga o LED."""
        with self.lock:
            self.led_state = False
            print("LED desligado!")

    def get_led_state(self):
        """Retorna o estado atual do LED."""
        with self.lock:
            return self.led_state

# Exemplo de uso
if __name__ == "__main__":
    blackboard = Blackboard()

    # Adicionando entradas
    blackboard.add_entry("paciente_1", {"nome": "João", "idade": 30})
    blackboard.add_entry("paciente_2", {"nome": "Maria", "idade": 25})
    blackboard.add_entry("paciente_1", {"consulta": "2025-01-18", "medico": "Dr. Silva"})

    # Consultando entradas
    print("Dados do paciente_1:", blackboard.get_entry("paciente_1"))
    print("Dados do paciente_2:", blackboard.get_entry("paciente_2"))

    # Controle do LED
    blackboard.turn_on_led()
    time.sleep(1)
    print("Estado do LED:", "Ligado" if blackboard.get_led_state() else "Desligado")
    blackboard.turn_off_led()
    print("Estado do LED:", "Ligado" if blackboard.get_led_state() else "Desligado")

    # Removendo uma entrada
    blackboard.remove_entry("paciente_2")
    print("Dados do paciente_2 após remoção:", blackboard.get_entry("paciente_2"))