param (
    [string]$nome = "Usuário",
    [string]$email = "@gmail.com",
    [string]$funcao = "dev",
    [string]$acao = "listar_processos"
)

# Caminho do script Python
$pythonScript = "C:\users\felip\secretaria-virtual\Cloud-dev\blackboard.py"

# Executa o script Python e captura a saída
$saida = python $pythonScript $nome $email $funcao
$saida = $saida.Trim()

Write-Output "Saída do Python: $saida"

# Verifica se a saída é um JSON válido
if ($saida -match "^{.*}$") {
    $resultado = $saida | ConvertFrom-Json
    Write-Output "Mensagem: $($resultado.mensagem)"
    Write-Output "Email informado: $($resultado.email)"
    Write-Output "Funcao informado: $($resultado.funcao)"
} else {
    Write-Output "Erro: Saída do Python não é JSON válido."
    exit 1
}

# Comandos administrativos no servidor
switch ($acao) {
    "listar_processos" {
        Write-Output "📌 Listando processos ativos..."
        Get-Process | Select-Object ProcessName, Id, CPU
    }

    "reiniciar_servico" {
        $servico = "Spooler"  # Nome do serviço a reiniciar (exemplo: Spooler)
        Write-Output "🔄 Reiniciando serviço: $servico"
        Restart-Service -Name $servico -Force
    }

    "criar_usuario" {
        $usuario = "NovoUsuario"
        $senha = ConvertTo-SecureString "SenhaSegura123!" -AsPlainText -Force
        Write-Output "👤 Criando usuário: $usuario"
        New-LocalUser -Name $usuario -Password $senha -FullName "Novo Usuário" -Description "Usuário criado via script"
    }

    "reiniciar_servidor" {
        Write-Output "⚠️ Reiniciando o servidor em 10 segundos..."
        Start-Sleep -Seconds 10
        Restart-Computer -Force
    }

    default {
        Write-Output "❌ Ação inválida. Opções: listar_processos, reiniciar_servico, criar_usuario, reiniciar_servidor."
    }
}

Write-Output "✅ Script concluído!"