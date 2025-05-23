# Caminhos
$scriptPath = "MenuPrincipal.ps1"
$outputExe = "secretaria_virtual.exe"
$iconPath = "icone.ico"
$mtTool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\mt.exe"
$signTool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe"

# Informações do certificado
$subjectName = "CN=Spacedwog"
$email = "felipersantos1988@gmail.com"
$certThumbprint = "53901640F943B6D0C913399A290D00F923AD0472"

[System.Threading.Thread]::CurrentThread.CurrentCulture = 'pt-BR'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'pt-BR'

# Compilar o script para EXE
Invoke-PS2EXE `
  -InputFile $scriptPath `
  -OutputFile $outputExe `
  -Title "Secretaria Virtual" `
  -Description "IA - Software para uma secretaria virtual com Nuvem." `
  -Company "Spacedwog" `
  -Product "Sistema de Secretaria Virtual" `
  -Version "1.0.0.0" `
  -Copyright "Copyright (c) 2025 Felipe Rodrigues dos Santos ($email). Licenciado sob MIT License." `
  -NoConsole `
  -IconFile $iconPath `
  -Verbose

# Validar existência do mt.exe
if (-not (Test-Path $mtTool)) {
    Write-Error "mt.exe não encontrado. Instale o Windows SDK."
    exit 1
}

# Criar manifesto para execução como administrador
$manifestPath = "$env:TEMP\admin.manifest.xml"
@"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
    <description>Spacedwog - Secretaria Virtual(IA - SOFTWARE)</description>
    <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
        <security>
            <requestedPrivileges>
                <requestedExecutionLevel level="requireAdministrator" uiAccess="false"/>
            </requestedPrivileges>
        </security>
    </trustInfo>
</assembly>
"@ | Set-Content -Encoding UTF8 -Path $manifestPath

# Embutir o manifesto
Write-Host "Adicionando manifesto ao EXE..."
& "$mtTool" -manifest "$manifestPath" -outputresource:"$outputExe;#1"

# Verifica se signtool está disponível
if (-not (Test-Path $signTool)) {
    Write-Error "signtool.exe nao encontrado. Instale o Windows SDK para utilizar assinatura digital."
    exit 1
}

# Procurar certificado
if ($certThumbprint) {
    $cert = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Thumbprint -eq $certThumbprint }
} else {
    $cert = Get-ChildItem Cert:\CurrentUser\My | Where-Object {
        $_.Subject -eq $subjectName -and $_.EnhancedKeyUsageList.FriendlyName -contains "Assinatura de Codigo"
    }
}

# Criar certificado se não existir
if (-not $cert) {
    Write-Host "Criando certificado autoassinado com e-mail..."
    $cert = New-SelfSignedCertificate `
        -Type CodeSigningCert `
        -Subject $subjectName `
        -CertStoreLocation "Cert:\CurrentUser\My" `
        -KeyUsage DigitalSignature `
        -TextExtension @("2.5.29.17={text}email=$email&otherName=1.3.6.1.5.5.7.8.5;UTF8:$email")
    $certThumbprint = $cert.Thumbprint
} else {
    Write-Host "Certificado existente encontrado."
    $certThumbprint = $cert.Thumbprint
}

# Exportar certificado público
Export-Certificate -Cert $cert -FilePath "$env:TEMP\cert.cer" | Out-Null
Write-Host "Certificado exportado para: $env:TEMP\cert.cer"

# Assinar o EXE
Write-Host "`n=== Inicio da Instalacao ===`n"
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

# Resultado
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] EXE compilado, assinado e com manifesto de administrador embutido: $outputExe" -ForegroundColor Green
    Write-Host "`n=== Fim da Instalacao ===`n"
    & .\config\executar.ps1
} else {
    Write-Error "[FALHA] Falha ao assinar/verificar o executável."
}