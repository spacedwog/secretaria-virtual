Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Registrar-Receita {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Registrar Receita Medica"
    $form.Size = New-Object System.Drawing.Size(350, 400)
    $form.StartPosition = "CenterScreen"

    $labels = @("ID Paciente", "ID Doutor", "Data (AAAA-MM-DD)", "Medicamento", "Dosagem", "Instruções")
    $inputs = @()

    for ($i = 0; $i -lt $labels.Length; $i++) {
        $label = New-Object System.Windows.Forms.Label
        $label.Text = "$($labels[$i]):"
        $label.Location = [System.Drawing.Point]::new(10, 20 + ($i * 50))
        $label.Size = New-Object System.Drawing.Size(120, 20)

        $textBox = New-Object System.Windows.Forms.TextBox
        $textBox.Location = [System.Drawing.Point]::new(140, 20 + ($i * 50))
        $textBox.Size = New-Object System.Drawing.Size(180, 25)

        $form.Controls.AddRange(@($label, $textBox))
        $inputs += $textBox
    }

    $btnSave = New-Object System.Windows.Forms.Button
    $btnSave.Text = "Registrar"
    $btnSave.Size = New-Object System.Drawing.Size(300, 35)
    $btnSave.Location = New-Object System.Drawing.Point(20, 320)
    $btnSave.Add_Click({
        # Aqui você adicionaria a lógica para salvar a receita, por enquanto só mensagem
        [System.Windows.Forms.MessageBox]::Show("Receita registrada com sucesso!")
        $form.Close()
    })

    $form.Controls.Add($btnSave)
    $form.ShowDialog()
}

function Imprimir-Receita {
    $formPrint = New-Object System.Windows.Forms.Form
    $formPrint.Text = "Imprimir Receita Medica"
    $formPrint.Size = New-Object System.Drawing.Size(300, 150)
    $formPrint.StartPosition = "CenterScreen"

    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = "Digite o ID da Receita para impressão:"
    $lbl.Location = New-Object System.Drawing.Point(10, 20)
    $lbl.Size = New-Object System.Drawing.Size(280, 20)

    $txtID = New-Object System.Windows.Forms.TextBox
    $txtID.Location = New-Object System.Drawing.Point(10, 50)
    $txtID.Size = New-Object System.Drawing.Size(260, 25)

    $btnPrint = New-Object System.Windows.Forms.Button
    $btnPrint.Text = "Imprimir"
    $btnPrint.Location = New-Object System.Drawing.Point(80, 90)
    $btnPrint.Size = New-Object System.Drawing.Size(120, 30)
    $btnPrint.Add_Click({
        # Substituir pela lógica real de impressão
        [System.Windows.Forms.MessageBox]::Show("Receita ID $($txtID.Text) enviada para impressão.")
        $formPrint.Close()
    })

    $formPrint.Controls.AddRange(@($lbl, $txtID, $btnPrint))
    $formPrint.ShowDialog()
}

# Janela principal do Menu Receita Médica
$formMain = New-Object System.Windows.Forms.Form
$formMain.Text = "Menu Receita Medica"
$formMain.Size = New-Object System.Drawing.Size(350, 220)
$formMain.StartPosition = "CenterScreen"

$btnReg = New-Object System.Windows.Forms.Button
$btnReg.Text = "1. Registrar Receita Medica"
$btnReg.Size = New-Object System.Drawing.Size(300, 40)
$btnReg.Location = New-Object System.Drawing.Point(20, 30)
$btnReg.Add_Click({ Registrar-Receita })

$btnPrint = New-Object System.Windows.Forms.Button
$btnPrint.Text = "2. Imprimir Receita Medica"
$btnPrint.Size = New-Object System.Drawing.Size(300, 40)
$btnPrint.Location = New-Object System.Drawing.Point(20, 90)
$btnPrint.Add_Click({ Imprimir-Receita })

$btnBack = New-Object System.Windows.Forms.Button
$btnBack.Text = "Voltar"
$btnBack.Size = New-Object System.Drawing.Size(300, 40)
$btnBack.Location = New-Object System.Drawing.Point(20, 150)
$btnBack.Add_Click({ $formMain.Close() })

$formMain.Controls.AddRange(@($btnReg, $btnPrint, $btnBack))

[void]$formMain.ShowDialog()