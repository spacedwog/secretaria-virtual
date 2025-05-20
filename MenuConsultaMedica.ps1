Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Ensure-DataDirectory {
    $dataDir = ".\data"
    if (-not (Test-Path $dataDir)) {
        New-Item -ItemType Directory -Path $dataDir | Out-Null
    }
}

function Save-JsonData {
    param (
        [string]$filePath,
        [object]$newItem
    )
    $list = @()
    if (Test-Path $filePath) {
        $existing = Get-Content $filePath | ConvertFrom-Json
        if ($existing) { $list = @($existing) }
    }
    $list += $newItem
    $list | ConvertTo-Json -Depth 5 | Set-Content $filePath -Encoding UTF8
}

function ListAppointments {
    [System.Windows.Forms.MessageBox]::Show("Listando consultas médicas (implementar lógica real).")
}

function AddDoctor {
    Ensure-DataDirectory

    $inputForm = New-Object System.Windows.Forms.Form
    $inputForm.Text = "Adicionar Doutor"
    $inputForm.Size = New-Object System.Drawing.Size(300, 250)
    $inputForm.StartPosition = "CenterScreen"

    $labels = "Nome", "Telefone", "Email", "Especialidade"
    $boxes = @()

    for ($i = 0; $i -lt $labels.Length; $i++) {
        $label = New-Object System.Windows.Forms.Label
        $label.Text = "$($labels[$i]):"
        $label.Location = [System.Drawing.Point]::new(10, 20 + ($i * 30))
        $label.Size = New-Object System.Drawing.Size(100, 20)
        $inputForm.Controls.Add($label)

        $textBox = New-Object System.Windows.Forms.TextBox
        $textBox.Location = [System.Drawing.Point]::new(110, 20 + ($i * 30))
        $textBox.Size = New-Object System.Drawing.Size(150, 20)
        $inputForm.Controls.Add($textBox)

        $boxes += $textBox
    }

    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Text = "Salvar"
    $okButton.Location = New-Object System.Drawing.Point(90, 150)
    $okButton.Add_Click({
        $doctor = @{
            Nome         = $boxes[0].Text
            Telefone     = $boxes[1].Text
            Email        = $boxes[2].Text
            Especialidade = $boxes[3].Text
        }
        Save-JsonData -filePath ".\data\doctors.json" -newItem $doctor
        [System.Windows.Forms.MessageBox]::Show("Doutor '$($doctor.Nome)' adicionado com sucesso!")
        $inputForm.Close()
    })
    $inputForm.Controls.Add($okButton)
    $inputForm.ShowDialog()
}

function RegisterVisit {
    Ensure-DataDirectory

    $idForm = New-Object System.Windows.Forms.Form
    $idForm.Text = "Registrar Visita"
    $idForm.Size = New-Object System.Drawing.Size(280, 180)
    $idForm.StartPosition = "CenterScreen"

    $lbl1 = New-Object System.Windows.Forms.Label
    $lbl1.Text = "ID Paciente:"
    $lbl1.Location = New-Object System.Drawing.Point(10, 20)
    $txt1 = New-Object System.Windows.Forms.TextBox
    $txt1.Location = New-Object System.Drawing.Point(100, 20)

    $lbl2 = New-Object System.Windows.Forms.Label
    $lbl2.Text = "ID Doutor:"
    $lbl2.Location = New-Object System.Drawing.Point(10, 60)
    $txt2 = New-Object System.Windows.Forms.TextBox
    $txt2.Location = New-Object System.Drawing.Point(100, 60)

    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = "Registrar"
    $btn.Location = New-Object System.Drawing.Point(80, 100)
    $btn.Add_Click({
        $visit = @{
            PacienteID = $txt1.Text
            DoutorID   = $txt2.Text
            Timestamp  = (Get-Date).ToString("s")
        }
        Save-JsonData -filePath ".\data\visits.json" -newItem $visit
        [System.Windows.Forms.MessageBox]::Show("Visita registrada com sucesso!")
        $idForm.Close()
    })

    $idForm.Controls.AddRange(@($lbl1, $txt1, $lbl2, $txt2, $btn))
    $idForm.ShowDialog()
}

function ScheduleAppointment {
    Ensure-DataDirectory

    $form2 = New-Object System.Windows.Forms.Form
    $form2.Text = "Agendar Consulta"
    $form2.Size = New-Object System.Drawing.Size(350, 400)
    $form2.StartPosition = "CenterScreen"

    $fields = "ID Paciente", "ID Doutor", "Titulo", "Data (AAAA-MM-DD)", "Hora (HH:MM)", "Motivo", "Status"
    $inputs = @()

    for ($i = 0; $i -lt $fields.Length; $i++) {
        $label = New-Object System.Windows.Forms.Label
        $label.Text = "$($fields[$i]):"
        $label.Location = [System.Drawing.Point]::new(10, (20 + ($i * 35)))
        $label.Size = New-Object System.Drawing.Size(120, 20)

        $textBox = New-Object System.Windows.Forms.TextBox
        $textBox.Location = [System.Drawing.Point]::new(140, (20 + ($i * 35)))
        $textBox.Size = New-Object System.Drawing.Size(170, 20)

        $form2.Controls.AddRange(@($label, $textBox))
        $inputs += $textBox
    }

    $submitBtn = New-Object System.Windows.Forms.Button
    $submitBtn.Text = "Agendar"
    $submitBtn.Location = New-Object System.Drawing.Point(120, 280)
    $submitBtn.Add_Click({
        $appointment = @{
            PacienteID = $inputs[0].Text
            DoutorID   = $inputs[1].Text
            Titulo     = $inputs[2].Text
            Data       = $inputs[3].Text
            Hora       = $inputs[4].Text
            Motivo     = $inputs[5].Text
            Status     = $inputs[6].Text
        }
        Save-JsonData -filePath ".\data\appointments.json" -newItem $appointment
        [System.Windows.Forms.MessageBox]::Show("Consulta agendada com sucesso!")
        $form2.Close()
    })

    $form2.Controls.Add($submitBtn)
    $form2.ShowDialog()
}

# Janela principal
$form = New-Object System.Windows.Forms.Form
$form.Text = "Painel de Consulta Médica"
$form.Size = New-Object System.Drawing.Size(400, 300)
$form.StartPosition = "CenterScreen"

$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Listar Consultas"
$btn1.Size = New-Object System.Drawing.Size(150, 30)
$btn1.Location = New-Object System.Drawing.Point(120, 20)
$btn1.Add_Click({ ListAppointments })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Adicionar Doutor"
$btn2.Size = New-Object System.Drawing.Size(150, 30)
$btn2.Location = New-Object System.Drawing.Point(120, 60)
$btn2.Add_Click({ AddDoctor })

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Registrar Visita"
$btn3.Size = New-Object System.Drawing.Size(150, 30)
$btn3.Location = New-Object System.Drawing.Point(120, 100)
$btn3.Add_Click({ RegisterVisit })

$btn4 = New-Object System.Windows.Forms.Button
$btn4.Text = "4. Agendar Consulta"
$btn4.Size = New-Object System.Drawing.Size(150, 30)
$btn4.Location = New-Object System.Drawing.Point(120, 140)
$btn4.Add_Click({ ScheduleAppointment })

$btnExit = New-Object System.Windows.Forms.Button
$btnExit.Text = "Voltar"
$btnExit.Size = New-Object System.Drawing.Size(150, 30)
$btnExit.Location = New-Object System.Drawing.Point(120, 180)
$btnExit.Add_Click({ $form.Close() })

$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btn4, $btnExit))

[void]$form.ShowDialog()