Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Detecta caminho absoluto corretamente, mesmo se for .exe
$basePath = Split-Path -Parent ([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)

function MenuPaciente {
    & "$basePath\MenuPaciente.ps1"
}

function MenuConsultaMedica {
    & "$basePath\MenuConsultaMedica.ps1"
}

function ReceitaMedica {
    & "$basePath\MenuReceitaMedica.ps1"
}

function Configuracao {
    & "$basePath\config\MenuConfiguracao.ps1"
}

# Interface
$form = New-Object System.Windows.Forms.Form
$form.Text = "Sistema de Secretaria Virtual"
$form.Size = New-Object System.Drawing.Size(400,350)
$form.StartPosition = "CenterScreen"

$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Menu Paciente"
$btn1.Size = New-Object System.Drawing.Size(300,40)
$btn1.Location = New-Object System.Drawing.Point(50,30)
$btn1.Add_Click({ MenuPaciente })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Menu Consulta Medica"
$btn2.Size = New-Object System.Drawing.Size(300,40)
$btn2.Location = New-Object System.Drawing.Point(50,80)
$btn2.Add_Click({ MenuConsultaMedica })

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Receita Medica"
$btn3.Size = New-Object System.Drawing.Size(300,40)
$btn3.Location = New-Object System.Drawing.Point(50,130)
$btn3.Add_Click({ ReceitaMedica })

$btn4 = New-Object System.Windows.Forms.Button
$btn4.Text = "4. Configuracoes"
$btn4.Size = New-Object System.Drawing.Size(300,40)
$btn4.Location = New-Object System.Drawing.Point(50,180)
$btn4.Add_Click({ Configuracao })

$btn5 = New-Object System.Windows.Forms.Button
$btn5.Text = "5. Sair"
$btn5.Size = New-Object System.Drawing.Size(300,40)
$btn5.Location = New-Object System.Drawing.Point(50,230)
$btn5.Add_Click({ $form.Close() })

$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btn4, $btn5))

[void]$form.ShowDialog()