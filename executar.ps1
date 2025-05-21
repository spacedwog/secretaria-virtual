# Caminho completo para o executável que você quer verificar
$exePath = "C:\Users\felip\secretaria-virtual\secretaria_virtual.exe"

# Verifica se o executável existe
if (-Not (Test-Path $exePath)) {
    Write-Host "[FALHA] O executável '$exePath' não foi encontrado." -ForegroundColor Red
    exit
}

# Extrai o nome do executável (sem extensão)
$exeName = [System.IO.Path]::GetFileNameWithoutExtension($exePath)

# Tenta obter o processo pelo nome
try {
    $processos = Get-Process -Name $exeName -ErrorAction Stop
    foreach ($proc in $processos) {
        Write-Host "[OK] Processo '$exeName' encontrado. ID do processo: $($proc.Id)" -ForegroundColor Green
    }
}
catch {
    Write-Host "[FALHA] O processo '$exeName' não está em execução." -ForegroundColor Red
}