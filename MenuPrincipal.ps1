Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Funções simuladas para os menus
function Abrir-MenuPaciente {
    # Aqui você pode chamar o MenuPaciente.ps1 ou chamar a função diretamente
    & .\MenuPaciente.ps1
}

function Abrir-MenuConsultaMedica {
    & .\MenuConsultaMedica.ps1
}

function ReceitaMedica {
    & .\MenuReceitaMedica.ps1
}

# Janela principal
$form = New-Object System.Windows.Forms.Form
$form.Text = "Sistema de Secretaria Virtual"
$form.Size = New-Object System.Drawing.Size(400,350)
$form.StartPosition = "CenterScreen"

# Botões
$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Menu Paciente"
$btn1.Size = New-Object System.Drawing.Size(300,40)
$btn1.Location = New-Object System.Drawing.Point(50,30)
$btn1.Add_Click({ Abrir-MenuPaciente })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Menu Consulta Medica"
$btn2.Size = New-Object System.Drawing.Size(300,40)
$btn2.Location = New-Object System.Drawing.Point(50,80)
$btn2.Add_Click({ Abrir-MenuConsultaMedica })

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Receita Medica"
$btn3.Size = New-Object System.Drawing.Size(300,40)
$btn3.Location = New-Object System.Drawing.Point(50,130)
$btn3.Add_Click({ ReceitaMedica })

$btn4 = New-Object System.Windows.Forms.Button
$btn4.Text = "4. Sair"
$btn4.Size = New-Object System.Drawing.Size(300,40)
$btn4.Location = New-Object System.Drawing.Point(50,180)
$btn4.Add_Click({ $form.Close() })

$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btn4))

[void]$form.ShowDialog()