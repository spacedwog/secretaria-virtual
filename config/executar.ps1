# Detecta caminho absoluto corretamente, mesmo se for .exe
$basePath = Split-Path -Parent ([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)

# Caminho completo para o executável que você quer iniciar
$exePath = "$basePath\secretaria_virtual.exe"

# Verifica se o executável existe
if (-Not (Test-Path $exePath)) {
    Write-Host "[FALHA] O executavel '$exePath' nao foi encontrado." -ForegroundColor Red
    exit
}

# Inicia o processo e captura o objeto retornado
try {

    Write-Host "`n=== Inicio da Execucao ===`n"
    Write-Host "[BEGIN] Iniciando o processo '$exePath'..." -ForegroundColor Cyan
    $processo = Start-Process -FilePath $exePath -PassThru
    Write-Host "[OK] Processo iniciado com sucesso. ID do processo: $($processo.Id)" -ForegroundColor Green
}
catch {
    Write-Host "[FALHA] Erro ao iniciar o processo: $_" -ForegroundColor Red
    exit
}

# Aguarda o término do processo
Write-Host "[ESPERA] Aguardando o processo terminar..."
& .\config\homologar.ps1
$processo.WaitForExit()

# Exibe a saída final
Write-Host "[OK] O processo terminou em: $($processo.ExitTime)" -ForegroundColor Green
Write-Host "Codigo de saida: $($processo.ExitCode)" -ForegroundColor Yellow

Write-Host "`n=== Fim da Execucao ===`n"