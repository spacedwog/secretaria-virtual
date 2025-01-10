import threading

class Blackboard:
    def __init__(self):
        self.data = {}
        self.lock = threading.Lock()

    def write(self, key, value):
        """Escreve dados no blackboard."""
        with self.lock:
            self.data[key] = value
            print(f"[Blackboard] Escrito: {key} = {value}")

    def read(self, key):
        """Lê dados do blackboard."""
        with self.lock:
            value = self.data.get(key, None)
            print(f"[Blackboard] Lido: {key} = {value}")
            return value

    def delete(self, key):
        """Remove dados do blackboard."""
        with self.lock:
            if key in self.data:
                del self.data[key]
                print(f"[Blackboard] Removido: {key}")

# Exemplo de uso
def sensor_module(blackboard):
    """Simula um módulo de sensor que escreve dados no blackboard."""
    blackboard.write("sensor_data", {"temperature": 22.5, "humidity": 45})

def decision_module(blackboard):
    """Simula um módulo de decisão que lê dados do blackboard."""
    data = blackboard.read("sensor_data")
    if data:
        print(f"[Decision Module] Processando dados: {data}")

def actuator_module(blackboard):
    """Simula um módulo de atuador que age baseado nos dados do blackboard."""
    data = blackboard.read("sensor_data")
    if data and data["temperature"] > 25:
        print("[Actuator Module] Ligando o ventilador...")
    else:
        print("[Actuator Module] Temperatura estável.")

if __name__ == "__main__":
    blackboard = Blackboard()

    # Simula execução dos módulos
    sensor_module(blackboard)
    decision_module(blackboard)
    actuator_module(blackboard)

