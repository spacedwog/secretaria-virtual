param (
    [string]$function = "",
    [string]$mensagem = "",
    [int]$return_code = 0,
    [string]$type_server = ""
)

# Define um diretório acessível para logs e dados
$logDir   = "C:\Users\felip\Logs"
$logPath  = Join-Path $logDir "cloudengine.log"
$dataPath = Join-Path $logDir "data.json"

# Cria diretório, se não existir
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# Função para registrar logs
function Log-Mensagem {
    param ($mensagem)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $mensagem" | Out-File -Append -FilePath $logPath -Encoding utf8
}

Log-Mensagem "Iniciando script PowerShell."

# Caminho do script Python
$pythonScript = "C:\users\felip\secretaria-virtual\Cloud-dev\blackboard.py"

# Executa o script Python e captura a saída JSON
$saida = python $pythonScript $function $mensagem $return_code $type_server 2>&1
$saida = ($saida -join "`n").Trim()

if ($saida -is [System.Management.Automation.ErrorRecord]) {
    Log-Mensagem "Erro ao executar Python: $($saida.Exception.Message)"
    Write-Output "Erro ao executar o script Python. Verifique os logs."
    exit 1
}

Write-Output "Saída do Python: $saida"

# Verifica se a saída é um JSON válido
if ($saida -match "^\{.*\}$") {
    try {
        $resultado = $saida | ConvertFrom-Json

        # Log básico
        Log-Mensagem "Function: $function"
        Log-Mensagem "Mensagem: $mensagem"
        Log-Mensagem "Type Server: $type_server"
        Log-Mensagem "Return Code: $return_code"

        # Registro a ser salvo no JSON
        $registro = [PSCustomObject]@{
            Timestamp    = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
            Function     = $function
            Mensagem     = $mensagem
            ReturnCode   = $return_code
            TypeServer   = $type_server
            PythonResult = $resultado
        }

        # Lê JSON existente (se houver), senão cria novo array
        if (Test-Path $dataPath) {
            try {
                $jsonExistente = Get-Content $dataPath -Raw | ConvertFrom-Json
                if ($jsonExistente -isnot [System.Collections.IEnumerable]) {
                    $jsonExistente = @($jsonExistente)
                }
            }
            catch {
                Log-Mensagem "Erro ao ler arquivo data.json, será sobrescrito."
                $jsonExistente = @()
            }
        } else {
            $jsonExistente = @()
        }

        # Adiciona novo registro e grava o arquivo
        $jsonExistente += $registro
        $jsonExistente | ConvertTo-Json -Depth 10 | Out-File -FilePath $dataPath -Encoding utf8

        Log-Mensagem "Registro salvo em $dataPath"
        Write-Output "Registro JSON gravado com sucesso."

        exit 0
    }
    catch {
        Log-Mensagem "Erro ao processar JSON: $_"
        Write-Output "Erro ao converter JSON: $_"
        exit 2
    }
} else {
    Log-Mensagem "Erro: Saída do Python não é JSON válido. Conteúdo: $saida"
    Write-Output "Erro: Saída do Python não é JSON válido. Conteúdo: $saida"
    exit 4
}

Log-Mensagem "Script concluído!"