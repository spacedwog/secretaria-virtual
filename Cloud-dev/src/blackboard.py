# blackboard.py

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
        key = input("Chave: ")
        value = input("Valor: ")
        self.add_input(key, value)
        print(f"Entrada '{key}: {value}' adicionada com sucesso!\n")

if __name__ == "__main__":
    # Exemplo de uso da classe Blackboard
    blackboard = Blackboard()

    while True:
        blackboard.prompt_for_input()
        cont = input("Deseja adicionar mais dados? (sim/não): ").strip().lower()
        if cont != 'sim':
            break

    blackboard.display()