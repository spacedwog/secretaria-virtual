# cloudengine.ps1
param (
    [string]$function = "",
    [string]$mensagem = "",
    [int]$return_code = 0,
    [string]$type_server = ""
)

# Define um diretório acessível para logs
$logDir = "C:\Users\felip\Logs"
$logPath = "$logDir\cloudengine.log"

# Cria diretório de Logs, se não existir
if(!(Test-Path $logDir)){
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

# Junta a saída caso seja um array de strings
$saida = $saida -join "`n"

# Remove espaços extras antes e depois
$saida = $saida.Trim()

# Verifica se houve erro ao chamar o Python
if ($saida -is [System.Management.Automation.ErrorRecord]) {
    Log-Mensagem "Erro ao executar Python: $($saida.Exception.Message)"
    Write-Output "Erro ao executar o script Python. Verifique os logs."
    exit 1
}

Write-Output "Saída do Python: $saida"

# Verifica se a saída começa com '{' e termina com '}' (indicando JSON válido)
if ($saida -match "^\{.*\}$") {

    try{

        $resultado = $saida | ConvertFrom-Json

        Write-Host "pythonScript: $pythonScript"
        Write-Host "type_server: $type_server"
        Write-Host "Function: $function"
        Write-Host "Mensagem: $mensagem"
        Write-Host "Return Code: $return_code"
        
        Log-Mensagem "pythonScript: $pythonScript"
        Log-Mensagem "Function: $function"
        Log-Mensagem "Mensagem: $mensagem"
        Log-Mensagem "Type Server: $type_server"
        Log-Mensagem "Return Code: $return_code"
    
        exit 0
    }
    catch{
        Write-Output "Erro ao converter JSON: $_"
    }

} else {
    Write-Output "Erro: Saída do Python não é JSON válido. Conteúdo: $saida"
    Log-Mensagem "Erro: Saída do Python não é JSON válido. Conteúdo: $saida"
    exit 4
}

Log-Mensagem "Script concluído!"