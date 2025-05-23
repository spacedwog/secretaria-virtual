# Nome do arquivo de código-fonte C#
$sourceFile = "InterfaceGrafica.cs"

# Código-fonte C# para uma biblioteca simples
$code = @"
using System;

namespace InterfaceGrafica
{
    public class Saudacao
    {
        public static string DizerOla(string nome)
        {
            return $"Olá, {nome}!";
        }
    }
}
"@

# Salva o código-fonte no arquivo
$code | Out-File -Encoding UTF8 $sourceFile

# Caminho do compilador C# (csc.exe) - ajuste se necessário
$cscPath = "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"

# Nome do arquivo DLL de saída
$outputDll = "MinhaBiblioteca.dll"

# Comando para compilar o arquivo em DLL
& $cscPath /target:library /out:$outputDll $sourceFile

if (Test-Path $outputDll) {
    Write-Host "DLL gerada com sucesso: $outputDll"
} else {
    Write-Host "Falha ao gerar a DLL."
}