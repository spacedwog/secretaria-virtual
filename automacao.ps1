param (
    [string]$nome = "Usuário",
    [int]$idade = 18,
    [string]$acao = "listar_processos"
)

# Diretório de Logs
$logPath = "C:\Logs\Automacao.log"
if (!(Test-Path $logPath)) {
    New-Item -ItemType File -Path $logPath -Force | Out-Null
}

function Log-Mensagem {
    param ($mensagem)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $mensagem" | Out-File -Append -FilePath $logPath
}

Log-Mensagem "Iniciando script PowerShell."

# Caminho do script Python
$pythonScript = "C:\users\felip\secretaria-virtual\Cloud-dev\blackboard.py"

# Executa Python e captura saída
$saida = python $pythonScript $nome $idade 2>&1
$saida = $saida.Trim()

Log-Mensagem "Saída do Python: $saida"

# Verifica JSON válido
if ($saida -match "^{.*}$") {
    $resultado = $saida | ConvertFrom-Json
    Log-Mensagem "Processado JSON: $($resultado.mensagem)"
} else {
    Log-Mensagem "Erro: Saída do Python inválida."
    exit 1
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
        Remove-Item -Path "C:\Logs\*.log" -Force -ErrorAction SilentlyContinue
    }

    default {
        Log-Mensagem "Ação inválida: $acao"
    }
}

Log-Mensagem "Script concluído!"