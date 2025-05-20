Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Função auxiliar para gerar UUID
function Generate-UUID {
    return [guid]::NewGuid().ToString()
}

# Função auxiliar para salvar dados em JSON
function Save-JsonData {
    param (
        [string]$FilePath,
        [object]$NewData
    )
    $existingData = @()
    if (Test-Path $FilePath) {
        try {
            $existingData = Get-Content $FilePath -Raw | ConvertFrom-Json
        } catch {
            $existingData = @()
        }
    }
    if ($existingData -eq $null) {
        $existingData = @()
    }
    $existingData += $NewData
    $existingData | ConvertTo-Json -Depth 5 | Set-Content $FilePath
}

# Função para adicionar paciente
function AddPatient {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Adicionar Paciente"
    $form.Size = New-Object System.Drawing.Size(320, 300)
    $form.StartPosition = "CenterScreen"

    $labels = "Nome", "Telefone", "Email", "Endereço", "Data de Nascimento"
    $boxes = @()

    for ($i = 0; $i -lt $labels.Length; $i++) {
        $label = New-Object System.Windows.Forms.Label
        $label.Text = "$($labels[$i]):"
        $label.Location = [System.Drawing.Point]::new(10, 20 + ($i * 35))
        $label.Size = New-Object System.Drawing.Size(120, 20)
        $form.Controls.Add($label)

        $textBox = New-Object System.Windows.Forms.TextBox
        $textBox.Location = [System.Drawing.Point]::new(140, 20 + ($i * 35))
        $textBox.Size = New-Object System.Drawing.Size(150, 20)
        $form.Controls.Add($textBox)

        $boxes += $textBox
    }

    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = "Salvar"
    $btn.Location = New-Object System.Drawing.Point(100, 220)
    $btn.Add_Click({
        $patient = [PSCustomObject]@{
            id                = Generate-UUID
            nome              = $boxes[0].Text
            telefone          = $boxes[1].Text
            email             = $boxes[2].Text
            endereco          = $boxes[3].Text
            data_nascimento   = $boxes[4].Text
        }

        Save-JsonData -FilePath "pacientes.json" -NewData $patient
        [System.Windows.Forms.MessageBox]::Show("Paciente '$($patient.nome)' adicionado com sucesso!")
        $form.Close()
    })

    $form.Controls.Add($btn)
    $form.ShowDialog()
}

# Função para listar pacientes
function ListPatients {
    if (Test-Path "pacientes.json") {
        $data = Get-Content "pacientes.json" -Raw | ConvertFrom-Json
        $message = ""
        foreach ($p in $data) {
            $message += "ID: $($p.id)`nNome: $($p.nome)`nTelefone: $($p.telefone)`n---`n"
        }
        [System.Windows.Forms.MessageBox]::Show($message, "Pacientes Cadastrados")
    } else {
        [System.Windows.Forms.MessageBox]::Show("Nenhum paciente cadastrado ainda.")
    }
}

# Função para exibir o menu de paciente
function ShowPatientMenu {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Menu de Paciente"
    $form.Size = New-Object System.Drawing.Size(350, 250)
    $form.StartPosition = "CenterScreen"

    $btnAdd = New-Object System.Windows.Forms.Button
    $btnAdd.Text = "Adicionar Paciente"
    $btnAdd.Size = New-Object System.Drawing.Size(180, 30)
    $btnAdd.Location = New-Object System.Drawing.Point(80, 30)
    $btnAdd.Add_Click({ AddPatient })

    $btnList = New-Object System.Windows.Forms.Button
    $btnList.Text = "Listar Pacientes"
    $btnList.Size = New-Object System.Drawing.Size(180, 30)
    $btnList.Location = New-Object System.Drawing.Point(80, 70)
    $btnList.Add_Click({ ListPatients })

    $btnBack = New-Object System.Windows.Forms.Button
    $btnBack.Text = "Voltar"
    $btnBack.Size = New-Object System.Drawing.Size(180, 30)
    $btnBack.Location = New-Object System.Drawing.Point(80, 110)
    $btnBack.Add_Click({ $form.Close() })

    $form.Controls.AddRange(@($btnAdd, $btnList, $btnBack))
    $form.ShowDialog()
}