Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Web.Extensions  # Para conversão JSON

function Save_JsonData($data, $filePath) {
    $json = [System.Web.Script.Serialization.JavaScriptSerializer]::new().Serialize($data)
    Set-Content -Path $filePath -Value $json -Encoding UTF8
}

function Load_JsonData {
    param($filePath)
    if (Test-Path $filePath) {
        $jsonText = Get-Content $filePath -Raw
        return $jsonText | ConvertFrom-Json
    } else {
        return @()
    }
}

function Get_NextId {
    param (
        [string]$filePath,
        [string]$idField = "id"
    )
    $data = Load_JsonData $filePath
    if ($data.Count -eq 0) {
        return 1
    } else {
        $ids = $data | ForEach-Object { [int]($_[$idField]) }
        return ($ids | Measure-Object -Maximum).Maximum + 1
    }
}

function ListAppointments {
    $file = "appointments.json"
    $data = Load_JsonData $file

    if (-not $data -or $data.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Nenhuma consulta encontrada.", "Consultas")
        return
    }

    # Cria a janela
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Lista de Consultas"
    $form.Size = New-Object System.Drawing.Size(750, 450)
    $form.StartPosition = "CenterScreen"
    $form.Topmost = $true

    # ListView
    $listView = New-Object System.Windows.Forms.ListView
    $listView.View = [System.Windows.Forms.View]::Details
    $listView.FullRowSelect = $true
    $listView.GridLines = $true
    $listView.MultiSelect = $false
    $listView.Size = New-Object System.Drawing.Size(720, 340)
    $listView.Location = New-Object System.Drawing.Point(10, 10)

    $listView.Columns.Add("Título", 150)       | Out-Null
    $listView.Columns.Add("Paciente ID", 100)  | Out-Null
    $listView.Columns.Add("Doutor ID", 100)    | Out-Null
    $listView.Columns.Add("Data", 100)         | Out-Null
    $listView.Columns.Add("Hora", 100)         | Out-Null
    $listView.Columns.Add("Status", 150)       | Out-Null

    # Preenche com dados do arquivo JSON
    foreach ($item in $data) {
        $line = New-Object System.Windows.Forms.ListViewItem($item.titulo)
        $line.SubItems.Add($item.paciente_id) | Out-Null
        $line.SubItems.Add($item.doutor_id)   | Out-Null
        $line.SubItems.Add($item.data)        | Out-Null
        $line.SubItems.Add($item.hora)        | Out-Null
        $line.SubItems.Add($item.status)      | Out-Null
        $listView.Items.Add($line) | Out-Null
    }

    # Botão Fechar
    $btnClose = New-Object System.Windows.Forms.Button
    $btnClose.Text = "Fechar"
    $btnClose.Size = New-Object System.Drawing.Size(100, 30)
    $btnClose.Location = New-Object System.Drawing.Point(10, 360)
    $btnClose.Add_Click({ $form.Close() })

    # Adiciona ao formulário
    $form.Controls.AddRange(@($listView, $btnClose))
    $form.ShowDialog()
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
        $doctor = @{
            id            = Get_NextId -filePath "doctors.json"
            nome          = $boxes[0].Text
            telefone      = $boxes[1].Text
            email         = $boxes[2].Text
            especialidade = $boxes[3].Text
        }
        $file = "doctors.json"
        $data = Load_JsonData $file
        $data += $doctor
        Save_JsonData $data $file

        [System.Windows.Forms.MessageBox]::Show("Doutor '$($boxes[0].Text)' adicionado com sucesso!")
        $inputForm.Close()
    })
    $inputForm.Controls.Add($okButton)
    $inputForm.ShowDialog()
}

function RegisterVisit {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $idForm = New-Object System.Windows.Forms.Form
    $idForm.Text = "Registrar Visita"
    $idForm.Size = New-Object System.Drawing.Size(350, 220)
    $idForm.StartPosition = "CenterScreen"

    # Labels e Comboboxes
    $lblPaciente = New-Object System.Windows.Forms.Label
    $lblPaciente.Text = "Paciente:"
    $lblPaciente.Location = New-Object System.Drawing.Point(10, 20)
    $lblPaciente.Size = New-Object System.Drawing.Size(80, 20)

    $cmbPaciente = New-Object System.Windows.Forms.ComboBox
    $cmbPaciente.Location = New-Object System.Drawing.Point(100, 20)
    $cmbPaciente.Size = New-Object System.Drawing.Size(220, 20)
    $cmbPaciente.DropDownStyle = 'DropDownList'

    $lblDoutor = New-Object System.Windows.Forms.Label
    $lblDoutor.Text = "Doutor:"
    $lblDoutor.Location = New-Object System.Drawing.Point(10, 60)
    $lblDoutor.Size = New-Object System.Drawing.Size(80, 20)

    $cmbDoutor = New-Object System.Windows.Forms.ComboBox
    $cmbDoutor.Location = New-Object System.Drawing.Point(100, 60)
    $cmbDoutor.Size = New-Object System.Drawing.Size(220, 20)
    $cmbDoutor.DropDownStyle = 'DropDownList'

    $btnRegistrar = New-Object System.Windows.Forms.Button
    $btnRegistrar.Text = "Registrar"
    $btnRegistrar.Location = New-Object System.Drawing.Point(120, 110)
    $btnRegistrar.Size = New-Object System.Drawing.Size(100, 30)

    # Carregar dados JSON
    $pacientes = Load_JsonData "pacientes.json"
    $doutores = Load_JsonData "doctors.json"

    Write-Host "Pacientes carregados:"
    $pacientes | ForEach-Object { Write-Host "ID: $($_.id), Nome: $($_.nome)" }

    # Preencher combobox pacientes
    foreach ($p in $pacientes) {
        $cmbPaciente.Items.Add("$($p.id) - $($p.nome)")
    }

    # Preencher combobox doutores
    foreach ($d in $doutores) {
        $cmbDoutor.Items.Add("$($d.id) - $($d.nome)")
    }

    if ($cmbPaciente.Items.Count -gt 0) { $cmbPaciente.SelectedIndex = 0 }
    if ($cmbDoutor.Items.Count -gt 0) { $cmbDoutor.SelectedIndex = 0 }

    $btnRegistrar.Add_Click({
        if ($cmbPaciente.SelectedIndex -lt 0) {
            [System.Windows.Forms.MessageBox]::Show("Selecione um paciente.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }
        if ($cmbDoutor.SelectedIndex -lt 0) {
            [System.Windows.Forms.MessageBox]::Show("Selecione um doutor.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }
        $paciente_id = ($cmbPaciente.SelectedItem -split ' - ')[0]
        $doutor_id = ($cmbDoutor.SelectedItem -split ' - ')[0]

        $visita = @{
            id          = Get_NextId -filePath "visits.json"
            paciente_id = [int]$paciente_id
            doutor_id   = [int]$doutor_id
            timestamp   = (Get-Date).ToString("s")
        }

        $file = "visits.json"
        $data = Load_JsonData $file
        $data += $visita
        Save_JsonData $data $file

        [System.Windows.Forms.MessageBox]::Show("Visita registrada com sucesso!")
        $idForm.Close()
    })

    $idForm.Controls.AddRange(@($lblPaciente, $cmbPaciente, $lblDoutor, $cmbDoutor, $btnRegistrar))
    $idForm.ShowDialog()
}

function ScheduleAppointment {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $form2 = New-Object System.Windows.Forms.Form
    $form2.Text = "Agendar Consulta"
    $form2.Size = New-Object System.Drawing.Size(350, 400)
    $form2.StartPosition = "CenterScreen"

    # Label e ComboBox para Paciente
    $lblPaciente = New-Object System.Windows.Forms.Label
    $lblPaciente.Text = "Paciente:"
    $lblPaciente.Location = New-Object System.Drawing.Point(10, 20)
    $lblPaciente.Size = New-Object System.Drawing.Size(120, 20)

    $cmbPaciente = New-Object System.Windows.Forms.ComboBox
    $cmbPaciente.Location = New-Object System.Drawing.Point(140, 20)
    $cmbPaciente.Size = New-Object System.Drawing.Size(170, 20)
    $cmbPaciente.DropDownStyle = 'DropDownList'

    # Label e ComboBox para Doutor
    $lblDoutor = New-Object System.Windows.Forms.Label
    $lblDoutor.Text = "Doutor:"
    $lblDoutor.Location = New-Object System.Drawing.Point(10, 60)
    $lblDoutor.Size = New-Object System.Drawing.Size(120, 20)

    $cmbDoutor = New-Object System.Windows.Forms.ComboBox
    $cmbDoutor.Location = New-Object System.Drawing.Point(140, 60)
    $cmbDoutor.Size = New-Object System.Drawing.Size(170, 20)
    $cmbDoutor.DropDownStyle = 'DropDownList'

    # Campos restantes (Título, Data, Hora, Motivo, Status)
    $fields = "Titulo", "Data (AAAA-MM-DD)", "Hora (HH:MM)", "Motivo", "Status"
    $inputs = @()

    for ($i = 0; $i -lt $fields.Length; $i++) {
        $label = New-Object System.Windows.Forms.Label
        $label.Text = "$($fields[$i]):"
        $label.Location = New-Object System.Drawing.Point(10, (100 + ($i * 35)))
        $label.Size = New-Object System.Drawing.Size(120, 20)

        $textBox = New-Object System.Windows.Forms.TextBox
        $textBox.Location = New-Object System.Drawing.Point(140, (100 + ($i * 35)))
        $textBox.Size = New-Object System.Drawing.Size(170, 20)

        $form2.Controls.AddRange(@($label, $textBox))
        $inputs += $textBox
    }

    # Botão Agendar
    $submitBtn = New-Object System.Windows.Forms.Button
    $submitBtn.Text = "Agendar"
    $submitBtn.Location = New-Object System.Drawing.Point(120, 280)
    $submitBtn.Size = New-Object System.Drawing.Size(100, 30)

    # Carregar dados pacientes e doutores para popular os comboboxes
    $pacientes = Load_JsonData "pacientes.json"
    $doutores = Load_JsonData "doctors.json"

    foreach ($p in $pacientes) {
        $cmbPaciente.Items.Add("$($p.id) - $($p.nome)")
    }
    foreach ($d in $doutores) {
        $cmbDoutor.Items.Add("$($d.id) - $($d.nome)")
    }

    if ($cmbPaciente.Items.Count -gt 0) { $cmbPaciente.SelectedIndex = 0 }
    if ($cmbDoutor.Items.Count -gt 0) { $cmbDoutor.SelectedIndex = 0 }

    # Evento clique do botão agendar
    $submitBtn.Add_Click({
        if ($cmbPaciente.SelectedIndex -lt 0) {
            [System.Windows.Forms.MessageBox]::Show("Selecione um paciente.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }
        if ($cmbDoutor.SelectedIndex -lt 0) {
            [System.Windows.Forms.MessageBox]::Show("Selecione um doutor.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        # Extrair IDs selecionados
        $paciente_id = ($cmbPaciente.SelectedItem -split ' - ')[0]
        $doutor_id = ($cmbDoutor.SelectedItem -split ' - ')[0]

        # Validar campos obrigatórios básicos (exemplo: título, data, hora)
        if ([string]::IsNullOrWhiteSpace($inputs[0].Text) -or
            [string]::IsNullOrWhiteSpace($inputs[1].Text) -or
            [string]::IsNullOrWhiteSpace($inputs[2].Text)) {
            [System.Windows.Forms.MessageBox]::Show("Preencha os campos Titulo, Data e Hora.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        $appointment = @{
            id          = Get_NextId -filePath "appointments.json"
            paciente_id = [int]$paciente_id
            doutor_id   = [int]$doutor_id
            titulo      = $inputs[0].Text
            data        = $inputs[1].Text
            hora        = $inputs[2].Text
            motivo      = $inputs[3].Text
            status      = $inputs[4].Text
        }

        $file = "appointments.json"
        $data = Load_JsonData $file
        $data += $appointment
        Save_JsonData $data $file

        [System.Windows.Forms.MessageBox]::Show("Consulta agendada com sucesso!")
        $form2.Close()
    })

    $form2.Controls.AddRange(@($lblPaciente, $cmbPaciente, $lblDoutor, $cmbDoutor, $submitBtn))
    $form2.ShowDialog()
}

# Janela principal
$form = New-Object System.Windows.Forms.Form
$form.Text = "Painel de Consulta Medica"
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