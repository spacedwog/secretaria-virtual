# Caminhos
$scriptPath = "MenuPrincipal.ps1"
$outputExe = "secretaria_virtual.exe"
$iconPath = "icone.ico"

# SHA1 do certificado desejado
$certThumbprint = "53901640F943B6D0C913399A290D00F923AD0472"

# Compilar o script para EXE
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
$signTool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe"
if (-not (Test-Path $signTool)) {
    Write-Error "signtool.exe não encontrado. Instale o Windows SDK para utilizar assinatura digital."
    exit 1
}

# Verifica se o certificado com o SHA1 existe
$cert = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Thumbprint -eq $certThumbprint }

if (-not $cert) {
    Write-Host "Certificado com thumbprint $certThumbprint não encontrado. Criando novo..."
    $cert = New-SelfSignedCertificate `
        -Type CodeSigningCert `
        -Subject "CN=Felipe Rodrigues" `
        -CertStoreLocation "Cert:\CurrentUser\My"
    $certThumbprint = $cert.Thumbprint
} else {
    Write-Host "Certificado encontrado: $($cert.Subject)"
}

# Assinar o executável com o certificado específico
Write-Host "Assinando o arquivo..."
& $signTool sign `
    /fd SHA256 `
    /tr http://timestamp.digicert.com `
    /td SHA256 `
    /sha1 "$certThumbprint" `
    "$outputExe"

# Verificar assinatura
Write-Host "Verificando assinatura..."
& $signTool verify /pa /v "$outputExe"