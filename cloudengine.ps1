# cloudengine.ps1
param (
    [string]$function = "",
    [string]$mensagem = "",
    [int]$return_code = 0,
    [string]$type_server = "",
    [string]$acao = "listar_processos"
)

# Define um diretório acessível para logs
$logDir = "C:\Users\felip\Logs"
$logPath = "$logDir\Automacao.log"

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
$saida = python $pythonScript $function $mensagem $return_code $type_server
$saida = $saida.Trim()

# Verifica se houve erro ao chamar o Python
if ($saida -is [System.Management.Automation.ErrorRecord]) {
    Log-Mensagem "Erro ao executar Python: $($saida.Exception.Message)"
    Write-Output "Erro ao executar o script Python. Verifique os logs."
    exit 1
}

Write-Output "Saída do Python: $saida"

# Verifica JSON válido
if ($saida -match "^{.*}$") {

    $resultado = $saida | ConvertFrom-Json

    Write-Host "pythonScript: $pythonScript"
    Write-Host "type_server: $type_server"
    Write-Host "Function: $function"
    Write-Host "Mensagem: $mensagem"
    Write-Host "Return Code: $return_code"
    exit 0

} else {
    Write-Output "Erro: Saída do Python não é JSON válido. Conteúdo: $saida"
    exit 2
}

# Execução de Tarefas Administrativas
switch ($acao) {
    "listar_processos" {
        Log-Mensagem "Listando processos..."
        Get-Process | Select-Object ProcessName, Id, CPU
    }

    "reiniciar_servico" {
        $servico = "Spooler"
        Log-Mensagem "Reiniciando serviço: $servico"
        Restart-Service -Name $servico -Force
    }

    "criar_usuario" {
        $usuario = "NovoUsuario"
        $senha = ConvertTo-SecureString "SenhaSegura123!" -AsPlainText -Force
        Log-Mensagem "Criando usuário: $usuario"
        New-LocalUser -Name $usuario -Password $senha -FullName "Usuário Automático"
    }

    "agendar_backup" {
        $taskName = "BackupDiario"
        $scriptPath = "C:\caminho\para\backup.ps1"

        Log-Mensagem "Criando tarefa agendada para backup."

        schtasks /Create /SC DAILY /TN $taskName /TR "powershell.exe -ExecutionPolicy Bypass -File $scriptPath" /ST 02:00 /RU SYSTEM
    }

    "limpar_logs" {
        Log-Mensagem "Limpando logs antigos..."
        Remove-Item -Path "$logDir\*.log" -Force -ErrorAction SilentlyContinue
    }

    default {
        Log-Mensagem "Ação inválida: $acao"
    }
}

Log-Mensagem "Script concluído!"
