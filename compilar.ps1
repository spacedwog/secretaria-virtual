# Caminhos
$scriptPath = "MenuPrincipal.ps1"
$outputExe = "secretaria_virtual.exe"
$iconPath = "icone.ico"

# Finaliza processo anterior se necessário
Stop-Process -Name "secretaria_virtual" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Compilação do PowerShell para EXE
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

# Caminho para o SignTool
$signTool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe"

# Verifica existência do SignTool
if (-Not (Test-Path $signTool)) {
    Write-Error "signtool.exe nao encontrado. Instale o Windows SDK para utilizar assinatura digital."
    exit 1
}

$certPath = (Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Subject -eq "CN=Felipe Rodrigues" }).Thumbprint
$cert = Get-Item "Cert:\CurrentUser\My\$certPath"
Export-Certificate -Cert $cert -FilePath "$env:TEMP\cert.cer"
Import-Certificate -FilePath "$env:TEMP\cert.cer" -CertStoreLocation "Cert:\CurrentUser\Root"

# Certificado autoassinado (se não existir)
$subjectName = "CN=Felipe Rodrigues"
$cert = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Subject -eq $subjectName }

if (-not $cert) {
    Write-Host "Criando certificado autoassinado..."
    $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject $subjectName -CertStoreLocation "Cert:\CurrentUser\My"
} else {
    Write-Host "Certificado existente."
}

# Assina o executável
Write-Host "`nAssinando o arquivo..."
& $signTool sign `
    /n "Felipe Rodrigues" `
    /fd SHA256 `
    /tr http://timestamp.digicert.com `
    /td SHA256 `
    "$outputExe"

# Verifica assinatura
Write-Host "`nVerificando assinatura..."
& $signTool verify /pa /v "$outputExe"