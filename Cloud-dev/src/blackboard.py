# blackboard.py
import requests
import json

class Blackboard:
    def __init__(self):
        self.data = {}

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
        key = input("Medicine Type: ")
        value = input("Medicine Code: ")
        self.add_input(key, value)
        print(f"Entrada '{key}: {value}' adicionada com sucesso!\n")

    def send_data_to_server(self):
        """Envio de dados para o servidor TypeScript via POST."""
        url = 'http://localhost:3001/receive-data'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=json.dumps(self.data), headers=headers)
        
        if response.status_code == 200:
            print("Dados enviados para o servidor com sucesso!")
        else:
            print(f"Falha no envio: {response.status_code}")

if __name__ == "__main__":
    # Exemplo de uso da classe Blackboard
    blackboard = Blackboard()

    while True:
        blackboard.prompt_for_input()
        cont = input("Deseja adicionar mais dados? (sim/não): ").strip().lower()
        if cont != 'sim':
            break

    blackboard.display()
    
    # Envia os dados para o servidor
    blackboard.send_data_to_server()