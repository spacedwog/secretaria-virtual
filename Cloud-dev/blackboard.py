import requests

class BlackboardConnector:
    """
    Classe para conectar e interagir com o Blackboard v1.0.
    """
    def __init__(self, base_url, api_key=None):
        """
        Inicializa a conexão com o Blackboard.
        
        :param base_url: URL base do Blackboard v1.0.
        :param api_key: Chave de API para autenticação, se necessária.
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
        }
        if api_key:
            self.headers["Authorization"] = f"Bearer {api_key}"

    def get(self, endpoint):
        """
        Realiza uma requisição GET ao Blackboard.
        
        :param endpoint: Endpoint específico para a requisição.
        :return: Resposta da API no formato JSON ou mensagem de erro.
        """
        try:
            response = requests.get(f"{self.base_url}/{endpoint}", headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}

    def post(self, endpoint, data):
        """
        Realiza uma requisição POST ao Blackboard.
        
        :param endpoint: Endpoint específico para a requisição.
        :param data: Dados para enviar no corpo da requisição.
        :return: Resposta da API no formato JSON ou mensagem de erro.
        """
        try:
            response = requests.post(f"{self.base_url}/{endpoint}", json=data, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}

    def put(self, endpoint, data):
        """
        Realiza uma requisição PUT ao Blackboard.
        
        :param endpoint: Endpoint específico para a requisição.
        :param data: Dados para atualizar no corpo da requisição.
        :return: Resposta da API no formato JSON ou mensagem de erro.
        """
        try:
            response = requests.put(f"{self.base_url}/{endpoint}", json=data, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}

    def delete(self, endpoint):
        """
        Realiza uma requisição DELETE ao Blackboard.
        
        :param endpoint: Endpoint específico para a requisição.
        :return: Resposta da API no formato JSON ou mensagem de erro.
        """
        try:
            response = requests.delete(f"{self.base_url}/{endpoint}", headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}