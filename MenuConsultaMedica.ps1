Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Generate-UUID {
    return [guid]::NewGuid().ToString()
}

function Save-JsonData {
    param (
        [string]$FilePath,
        [object]$NewData
    )

    if (Test-Path $FilePath) {
        $existingData = Get-Content $FilePath -Raw | ConvertFrom-Json
    } else {
        $existingData = @()
    }

    $updatedData = $existingData + $NewData
    $updatedData | ConvertTo-Json -Depth 5 | Set-Content $FilePath
}

function AddDoctor {
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
        $doctor = [PSCustomObject]@{
            id            = Generate-UUID
            nome          = $boxes[0].Text
            telefone      = $boxes[1].Text
            email         = $boxes[2].Text
            especialidade = $boxes[3].Text
        }

        Save-JsonData -FilePath "doctors.json" -NewData $doctor
        [System.Windows.Forms.MessageBox]::Show("Doutor '$($doctor.nome)' adicionado com sucesso!")
        $inputForm.Close()
    })
    $inputForm.Controls.Add($okButton)
    $inputForm.ShowDialog()
}

function ScheduleAppointment {
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
        $appointment = [PSCustomObject]@{
            id           = Generate-UUID
            paciente_id  = $inputs[0].Text
            doutor_id    = $inputs[1].Text
            titulo       = $inputs[2].Text
            data         = $inputs[3].Text
            hora         = $inputs[4].Text
            motivo       = $inputs[5].Text
            status       = $inputs[6].Text
        }

        Save-JsonData -FilePath "appointments.json" -NewData $appointment
        [System.Windows.Forms.MessageBox]::Show("Consulta agendada com sucesso!")
        $form2.Close()
    })

    $form2.Controls.Add($submitBtn)
    $form2.ShowDialog()
}

function RegisterVisit {
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
        $prescription = [PSCustomObject]@{
            id            = Generate-UUID
            paciente_id   = $txt1.Text
            doutor_id     = $txt2.Text
            medicamentos  = "Medicamento padrão"
            observacoes   = "Sem observações"
            data          = (Get-Date).ToString("yyyy-MM-dd HH:mm")
        }

        Save-JsonData -FilePath "prescriptions.json" -NewData $prescription
        [System.Windows.Forms.MessageBox]::Show("Visita registrada com sucesso!")
        $idForm.Close()
    })

    $idForm.Controls.AddRange(@($lbl1, $txt1, $lbl2, $txt2, $btn))
    $idForm.ShowDialog()
}

function ListAppointments {
    if (Test-Path "appointments.json") {
        $data = Get-Content "appointments.json" -Raw | ConvertFrom-Json
        $message = ""
        foreach ($item in $data) {
            $message += "ID: $($item.id)`nPaciente: $($item.paciente_id)`nDoutor: $($item.doutor_id)`nData: $($item.data)`n---`n"
        }
        [System.Windows.Forms.MessageBox]::Show($message, "Consultas Agendadas")
    } else {
        [System.Windows.Forms.MessageBox]::Show("Nenhuma consulta encontrada.")
    }
}