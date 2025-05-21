# Caminho completo para o executável
$exePath = "C:\Users\felip\secretaria-virtual\secretaria_virtual.exe"

# Verifica se o executável existe
if (-Not (Test-Path $exePath)) {
    Write-Host "❌ O executavel '$exePath' nao foi encontrado." -ForegroundColor Red
    exit
}

# Procura o processo com caminho correspondente ao executável
try {
    $processos = Get-Process | Where-Object {
        $_.Path -eq $exePath
    }

    if ($processos) {
        foreach ($proc in $processos) {
            Write-Host "[OK] Processo encontrado. ID do processo: $($proc.Id)" -ForegroundColor Green
        }
    }
    else {
        Write-Host "[FALHA] O processo com caminho '$exePath' nao esta em execucao." -ForegroundColor Red
    }
}
catch {
    Write-Host "[FALHA] Erro ao buscar o processo: $_" -ForegroundColor Red
}