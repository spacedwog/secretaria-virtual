Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Relatorio-Pacientes {
    [System.Windows.Forms.MessageBox]::Show("Gerando relatório de Pacientes (simulado).")
}

function Relatorio-Consultas {
    [System.Windows.Forms.MessageBox]::Show("Gerando relatório de Consultas Médicas (simulado).")
}

function Relatorio-Receitas {
    [System.Windows.Forms.MessageBox]::Show("Gerando relatório de Receitas Médicas (simulado).")
}

# Janela principal do Menu de Relatórios
$form = New-Object System.Windows.Forms.Form
$form.Text = "Menu de Relatórios"
$form.Size = New-Object System.Drawing.Size(350, 250)
$form.StartPosition = "CenterScreen"

$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Relatório de Pacientes"
$btn1.Size = New-Object System.Drawing.Size(300, 40)
$btn1.Location = New-Object System.Drawing.Point(20, 20)
$btn1.Add_Click({ Relatorio-Pacientes })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Relatório de Consultas"
$btn2.Size = New-Object System.Drawing.Size(300, 40)
$btn2.Location = New-Object System.Drawing.Point(20, 70)
$btn2.Add_Click({ Relatorio-Consultas })

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Relatório de Receitas"
$btn3.Size = New-Object System.Drawing.Size(300, 40)
$btn3.Location = New-Object System.Drawing.Point(20, 120)
$btn3.Add_Click({ Relatorio-Receitas })

$btnBack = New-Object System.Windows.Forms.Button
$btnBack.Text = "Voltar"
$btnBack.Size = New-Object System.Drawing.Size(300, 40)
$btnBack.Location = New-Object System.Drawing.Point(20, 170)
$btnBack.Add_Click({ $form.Close() })

$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btnBack))

[void]$form.ShowDialog()