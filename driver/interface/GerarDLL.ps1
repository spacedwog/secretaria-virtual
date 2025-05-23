# Caminho do código-fonte e saída da DLL
$sourceFile = "driver/interface/InterfaceVirtual.cs"
$outputDll = "driver/interface/InterfaceVirtual.dll"
$cscPath = "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"

# Garante que o diretório exista
$dir = Split-Path $sourceFile
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "`n=== Gerando DLL com Interface Gráfica (WinForms) ===`n"

# Código C# com GUI WinForms
$code = @"
using System;
using System.Windows.Forms;

namespace InterfaceVirtual
{
    public class Saudacao
    {
        public static void MostrarJanela(string nome)
        {
            Form formulario = new Form();
            formulario.Text = "Interface Virtual";
            formulario.Width = 300;
            formulario.Height = 200;

            Label label = new Label();
            label.Text = "Olá, " + nome + "!";
            label.Dock = DockStyle.Fill;
            label.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            label.Font = new System.Drawing.Font("Arial", 14);

            formulario.Controls.Add(label);
            Application.EnableVisualStyles();
            Application.Run(formulario);
        }
    }
}
"@

# Salva o código
$code | Out-File -Encoding UTF8 $sourceFile

# Converte caminho
$sourcePath = Resolve-Path $sourceFile

# Compila como DLL com referência ao System.Windows.Forms
& $cscPath /target:library /out:$outputDll /reference:System.Windows.Forms.dll,System.Drawing.dll $sourcePath

# Verifica resultado
if (Test-Path $outputDll) {
    Write-Host "[OK] DLL gerada com sucesso: $outputDll"
} else {
    Write-Host "[FALHA] Falha ao gerar a DLL."
}

Write-Host "`n=== Fim da Criacao da Interface Virtual ===`n"