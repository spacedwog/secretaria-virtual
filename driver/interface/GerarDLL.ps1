$sourceFile = "driver/interface/InterfaceVisual.cs"
$outputDll = "driver/interface/InterfaceVisual.dll"
$cscPath = "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"

# Garante que o diretório exista
$dir = Split-Path $sourceFile
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "`n=== Gerando Interface Visual ===`n"

$code = @"
using System;

namespace InterfaceVisual
{
    public class Saudacao
    {
        public static string DizerOla(string nome)
        {
            return "Olá, " + nome + "!";
        }
    }
}
"@

# Salva o arquivo .cs
$code | Out-File -Encoding UTF8 $sourceFile

# Compila o código
& $cscPath /target:library /out:$outputDll $sourceFile

if (Test-Path $outputDll) {
    Write-Host "DLL gerada com sucesso: $outputDll"
} else {
    Write-Host "Falha ao gerar a DLL."
}

Write-Host "`n=== Fim da Criacao da Interface Visual ===`n"