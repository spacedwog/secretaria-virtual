# Caminho do arquivo-fonte
$sourceFile = "driver/interface/InterfaceVirtual.cs"
# Caminho de saída da DLL
$outputDll = "driver/interface/InterfaceVirtual.dll"
# Caminho do compilador C#
$cscPath = "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"

# Garante que o diretório exista
$dir = Split-Path $sourceFile
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "`n=== Gerando Interface Virtual ===`n"

# Código C# da interface virtual
$code = @"
using System;

namespace InterfaceVirtual
{
    public class Saudacao
    {
        public static string DizerOla(string nome)
        {
            return "Ola, " + nome + "!";
        }
    }
}
"@

# Salva o código em arquivo
$code | Out-File -Encoding UTF8 $sourceFile

# Caminho absoluto do código-fonte
$sourcePath = Resolve-Path $sourceFile

# Compila o código
& $cscPath /target:library /out:$outputDll $sourcePath

# Verifica se a DLL foi criada
if (Test-Path $outputDll) {
    Write-Host "[OK] DLL gerada com sucesso: $outputDll"
} else {
    Write-Host "[FALHA] Falha ao gerar a DLL."
}

Write-Host "`n=== Fim da Criacao da Interface Virtual ===`n"