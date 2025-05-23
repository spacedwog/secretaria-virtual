$sourceFile = "driver/interface/InterfaceVirtual.cs"
$outputDll = "driver/interface/InterfaceVirtual.dll"
$cscPath = "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"

# Garante que o diretório exista
$dir = Split-Path $sourceFile
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "`n=== Gerando Interface Virtual ===`n"

$code = @"
using System;

namespace InterfaceVirtual
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

# Converte para caminhos absolutos
$sourcePath = Resolve-Path $sourceFile
$outputPath = Resolve-Path $outputDll -ErrorAction SilentlyContinue

# Compila usando caminho absoluto
& $cscPath /target:library /out:$outputDll $sourcePath

if (Test-Path $outputDll) {
    Write-Host "DLL gerada com sucesso: $outputDll`nOutput Path: $outputPath"
} else {
    Write-Host "Falha ao gerar a DLL."
}

Write-Host "`n=== Fim da Criacao da Interface Virtual ===`n"