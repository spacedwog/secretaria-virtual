# Caminhos
$scriptPath = "MenuPrincipal.ps1"
$outputExe = "secretaria_virtual.exe"
$iconPath = "icone.ico"

# Configuração do executável
Invoke-PS2EXE `
  -InputFile $scriptPath `
  -OutputFile $outputExe `
  -Title "Secretaria Virtual" `
  -Description "IA - Software para uma secretaria virtual com Nuvem." `
  -Company "Spacedwog" `
  -Product "Sistema de Secretaria Virtual" `
  -Version "1.0.0.0" `
  -Copyright "Copyright (c) 2025 Felipe Rodrigues dos Santos (felipersantos1988@gmail.com). Licenciado sob MIT License." `
  -NoConsole `
  -IconFile $iconPath `
  -Verbose

# Verifica se signtool está instalado
$signTool = (Get-Command "signtool.exe" -ErrorAction SilentlyContinue).Source
if (-not $signTool) {
    Write-Error "signtool.exe não encontrado. Instale o Windows SDK para utilizar assinatura digital."
    exit 1
}

# Certificado autoassinado (caso não exista)
$subjectName = "CN=Felipe Rodrigues"
$cert = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Subject -eq $subjectName }

if (-not $cert) {
    Write-Host "Criando certificado autoassinado..."
    $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject $subjectName -CertStoreLocation "Cert:\CurrentUser\My"
} else {
    Write-Host "Certificado já existente."
}

# Assinar o executável
Write-Host "Assinando o arquivo..."
& $signTool sign `
    /n "Felipe Rodrigues" `
    /fd SHA256 `
    /tr http://timestamp.digicert.com `
    /td SHA256 `
    "$outputExe"

# Verificar assinatura
Write-Host "Verificando assinatura..."
& $signTool verify /pa /v "$outputExe"