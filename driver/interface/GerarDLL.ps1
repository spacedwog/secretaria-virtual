$sourceFile = "InterfaceGrafica.cs"

Write-Host "`n=== Gerando Interface Grafica ===`n"

$code = @"
using System;

namespace InterfaceGrafica
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
$outputDll = "driver/interface/InterfaceGrafica.dll"

& $cscPath /target:library /out:$outputDll $sourceFile

if (Test-Path $outputDll) {
    Write-Host "DLL gerada com sucesso: $outputDll"
} else {
    Write-Host "Falha ao gerar a DLL."
}

Write-Host "`n=== Fim da Criacao da Interface Grafica ===`n"