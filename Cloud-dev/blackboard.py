import sys
import json
import os
from datetime import datetime

# Receber argumentos da linha de comando
function = sys.argv[1] if len(sys.argv) > 1 else ""
mensagem = sys.argv[2] if len(sys.argv) > 2 else ""
return_code = int(sys.argv[3]) if len(sys.argv) > 3 else 0
type_server = sys.argv[4] if len(sys.argv) > 4 else ""

# Caminho do arquivo JSON para armazenar os dados
json_path = os.path.expanduser("C:/Users/felip/Logs/data.json")

# Garante que o diretório existe
os.makedirs(os.path.dirname(json_path), exist_ok=True)

# Carrega dados existentes, se houver
if os.path.exists(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            data = []
else:
    data = []

# Novo registro
entry = {
    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "function": function,
    "mensagem": mensagem,
    "return_code": return_code,
    "type_server": type_server
}

# Adiciona o novo registro
data.append(entry)

# Salva novamente no arquivo
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

# Retorna o último registro como JSON (PowerShell espera isso)
print(json.dumps(entry, ensure_ascii=False))