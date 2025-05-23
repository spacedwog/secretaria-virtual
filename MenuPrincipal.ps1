Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Criação da função auxiliar para cantos arredondados
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("Gdi32.dll", EntryPoint = "CreateRoundRectRgn")]
    public static extern IntPtr CreateRoundRectRgn(
        int nLeftRect, int nTopRect, int nRightRect, int nBottomRect,
        int nWidthEllipse, int nHeightEllipse);
}
"@

# Caminho base do executável/script
$basePath = Split-Path -Parent ([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)

function EstilizarBotao($botao) {
    $botao.FlatStyle = 'Flat'
    $botao.BackColor = [System.Drawing.Color]::FromArgb(173, 216, 230) # Azul pastel
    $botao.ForeColor = [System.Drawing.Color]::Black
    $botao.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $botao.FlatAppearance.BorderSize = 0
    $botao.Region = [System.Drawing.Region]::FromHrgn(
        [Win32]::CreateRoundRectRgn(0, 0, $botao.Width, $botao.Height, 20, 20)
    )
}

# Funções de menu
function MenuPaciente {
    $configPath = "$basePath\Paciente.ps1"
    if (Test-Path $configPath) {
        & $configPath
    } else {
        [System.Windows.Forms.MessageBox]::Show("Arquivo de pacientes não encontrado:`n$configPath", "Erro", "OK", "Error")
    }
}
function MenuConsultaMedica {
    $configPath = "$basePath\ConsultaMedica.ps1"
    if (Test-Path $configPath) {
        & $configPath
    } else {
        [System.Windows.Forms.MessageBox]::Show("Arquivo de consulta médica não encontrado:`n$configPath", "Erro", "OK", "Error")
    }
}
function ReceitaMedica {
    $configPath = "$basePath\ReceitaMedica.ps1"
    if (Test-Path $configPath) {
        & $configPath
    } else {
        [System.Windows.Forms.MessageBox]::Show("Arquivo de receita médica não encontrado:`n$configPath", "Erro", "OK", "Error")
    }
}
function Configuracao {
    $configPath = "$basePath\config\Configuracao.ps1"
    if (Test-Path $configPath) {
        & $configPath
    } else {
        [System.Windows.Forms.MessageBox]::Show("Arquivo de configuração não encontrado:`n$configPath", "Erro", "OK", "Error")
    }
}

# Interface do sistema
$form = New-Object System.Windows.Forms.Form
$form.Text = "Sistema de Secretaria Virtual"
$form.Size = New-Object System.Drawing.Size(420, 360)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(240, 248, 255) # Azul claro

# Criação e estilização dos botões
$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Menu Paciente"
$btn1.Size = New-Object System.Drawing.Size(300, 45)
$btn1.Location = New-Object System.Drawing.Point(60, 30)
$btn1.Add_Click({ MenuPaciente })
EstilizarBotao $btn1

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Menu Consulta Médica"
$btn2.Size = New-Object System.Drawing.Size(300, 45)
$btn2.Location = New-Object System.Drawing.Point(60, 85)
$btn2.Add_Click({ MenuConsultaMedica })
EstilizarBotao $btn2

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Receita Médica"
$btn3.Size = New-Object System.Drawing.Size(300, 45)
$btn3.Location = New-Object System.Drawing.Point(60, 140)
$btn3.Add_Click({ ReceitaMedica })
EstilizarBotao $btn3

$btn4 = New-Object System.Windows.Forms.Button
$btn4.Text = "4. Configurações"
$btn4.Size = New-Object System.Drawing.Size(300, 45)
$btn4.Location = New-Object System.Drawing.Point(60, 195)
$btn4.Add_Click({ Configuracao })
EstilizarBotao $btn4

$btn5 = New-Object System.Windows.Forms.Button
$btn5.Text = "5. Sair"
$btn5.Size = New-Object System.Drawing.Size(300, 45)
$btn5.Location = New-Object System.Drawing.Point(60, 250)
$btn5.Add_Click({ $form.Close() })
EstilizarBotao $btn5

# Adicionar botões ao formulário
$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btn4, $btn5))

# Exibir interface
[void]$form.ShowDialog()