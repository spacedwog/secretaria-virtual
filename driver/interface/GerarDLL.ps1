$sourceFile = "InterfaceVisual.cs"

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

$code | Out-File -Encoding UTF8 $sourceFile

$cscPath = "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"
$outputDll = "InterfaceVisual.dll"

& $cscPath /target:library /out:$outputDll $sourceFile

if (Test-Path $outputDll) {
    Write-Host "DLL gerada com sucesso: $outputDll"
} else {
    Write-Host "Falha ao gerar a DLL."
}

Write-Host "`n=== Fim da Criacao da Interface Visual ===`n"