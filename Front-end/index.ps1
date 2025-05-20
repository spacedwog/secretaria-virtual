Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Criação do Formulário principal
$form = New-Object System.Windows.Forms.Form
$form.Text = "Sistema de Secretaria Virtual"
$form.Size = New-Object System.Drawing.Size(400,350)
$form.StartPosition = "CenterScreen"

# Funções simuladas para os menus
function Abrir-MenuPaciente {
    [System.Windows.Forms.MessageBox]::Show("Abrindo Menu Paciente...")
}

function Abrir-MenuConsultaMedica {
    [System.Windows.Forms.MessageBox]::Show("Abrindo Menu Consulta Médica...")
}

function Registrar-ReceitaMedica {
    [System.Windows.Forms.MessageBox]::Show("Registrando Receita Médica...")
}

function Imprimir-ReceitaMedica {
    [System.Windows.Forms.MessageBox]::Show("Imprimindo Receita Médica...")
}

# Botões
$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Menu Paciente"
$btn1.Size = New-Object System.Drawing.Size(300,40)
$btn1.Location = New-Object System.Drawing.Point(50,30)
$btn1.Add_Click({ Abrir-MenuPaciente })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Menu Consulta Médica"
$btn2.Size = New-Object System.Drawing.Size(300,40)
$btn2.Location = New-Object System.Drawing.Point(50,80)
$btn2.Add_Click({ Abrir-MenuConsultaMedica })

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Receita Médica"
$btn3.Size = New-Object System.Drawing.Size(300,40)
$btn3.Location = New-Object System.Drawing.Point(50,130)
$btn3.Add_Click({ Registrar-ReceitaMedica })

$btn4 = New-Object System.Windows.Forms.Button
$btn4.Text = "4. Imprimir Receita Médica"
$btn4.Size = New-Object System.Drawing.Size(300,40)
$btn4.Location = New-Object System.Drawing.Point(50,180)
$btn4.Add_Click({ Imprimir-ReceitaMedica })

$btn5 = New-Object System.Windows.Forms.Button
$btn5.Text = "5. Sair"
$btn5.Size = New-Object System.Drawing.Size(300,40)
$btn5.Location = New-Object System.Drawing.Point(50,230)
$btn5.Add_Click({ $form.Close() })

# Adiciona os botões ao formulário
$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btn4, $btn5))

# Exibe a janela
[void]$form.ShowDialog()