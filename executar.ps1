Add-Type -AssemblyName System.Windows.Forms

# Caminho completo para o executável que você quer iniciar
$exePath = "C:\Users\felip\secretaria-virtual\secretaria_virtual.exe"

# Verifica se o executável existe
if (-Not (Test-Path $exePath)) {
    Write-Host "❌ O executavel '$exePath' não foi encontrado." -ForegroundColor Red
    exit
}

# Inicia o processo e captura o objeto retornado
try {
    Write-Host "[BEGIN] Iniciando o processo '$exePath'..." -ForegroundColor Cyan
    $processo = Start-Process -FilePath $exePath -PassThru
    Write-Host "[OK] Processo iniciado com sucesso. ID do processo: $($processo.Id)" -ForegroundColor Green
}
catch {
    Write-Host "[FALHA] Erro ao iniciar o processo: $_" -ForegroundColor Red
    exit
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "Aguardando processo..."
$form.Size = New-Object System.Drawing.Size(300,100)
$form.StartPosition = "CenterScreen"

# Exibe o form em uma thread diferente para não travar o script
$null = [System.Threading.Thread]::New([System.Threading.ThreadStart]{
    [System.Windows.Forms.Application]::Run($form)
}).Start()

# Aguarda o término do processo
Write-Host "[ESPERA] Aguardando o processo terminar..."
$processo.WaitForExit()

# Fecha o formulário na thread da UI
$form.Invoke([Action]{
    $form.Close()
})

# Exibe a saída final
Write-Host "[OK] O processo terminou em: $($processo.ExitTime)" -ForegroundColor Green
Write-Host "Código de saída: $($processo.ExitCode)" -ForegroundColor Yellow