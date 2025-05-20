Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Load-JsonData {
    param([string]$filePath)
    if (Test-Path $filePath) {
        $json = Get-Content $filePath -Raw
        if ($json.Trim() -eq '') { return @() }
        return $json | ConvertFrom-Json
    } else {
        return @()
    }
}

function Save-JsonData {
    param(
        [Parameter(Mandatory)]
        [Object]$data,
        [Parameter(Mandatory)]
        [string]$filePath
    )
    $data | ConvertTo-Json -Depth 5 | Set-Content -Path $filePath -Encoding UTF8
}

function Get-NextId {
    param([string]$filePath)
    $items = Load-JsonData $filePath
    if ($items.Count -eq 0) { return 1 }
    return (($items | Measure-Object -Property id -Maximum).Maximum + 1)
}

function Registrar-Receita {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Registrar Receita Medica"
    $form.Size = New-Object System.Drawing.Size(380, 430)
    $form.StartPosition = "CenterScreen"

    # Carregar dados JSON
    $pacientes = Load-JsonData "pacientes.json"
    $doutores = Load-JsonData "doctors.json"

    # Label e ComboBox para Paciente
    $lblPaciente = New-Object System.Windows.Forms.Label
    $lblPaciente.Text = "Paciente:"
    $lblPaciente.Location = [System.Drawing.Point]::new(10, 20)
    $lblPaciente.Size = New-Object System.Drawing.Size(120, 20)

    $cbPaciente = New-Object System.Windows.Forms.ComboBox
    $cbPaciente.Location = [System.Drawing.Point]::new(140, 20)
    $cbPaciente.Size = New-Object System.Drawing.Size(200, 25)
    $cbPaciente.DropDownStyle = "DropDownList"
    $pacientes | ForEach-Object { $cbPaciente.Items.Add("($($_.id)) - $($_.nome)") }

    # Label e ComboBox para Doutor
    $lblDoutor = New-Object System.Windows.Forms.Label
    $lblDoutor.Text = "Doutor:"
    $lblDoutor.Location = [System.Drawing.Point]::new(10, 70)
    $lblDoutor.Size = New-Object System.Drawing.Size(120, 20)

    $cbDoutor = New-Object System.Windows.Forms.ComboBox
    $cbDoutor.Location = [System.Drawing.Point]::new(140, 70)
    $cbDoutor.Size = New-Object System.Drawing.Size(200, 25)
    $cbDoutor.DropDownStyle = "DropDownList"
    $doutores | ForEach-Object { $cbDoutor.Items.Add("($($_.id)) - $($_.nome)") }

    # Campos de texto restantes
    $labels = @("Data (AAAA-MM-DD)", "Medicamento", "Dosagem", "Instrucoes")
    $inputs = @()
    for ($i = 0; $i -lt $labels.Length; $i++) {
        $label = New-Object System.Windows.Forms.Label
        $label.Text = "$($labels[$i]):"
        $label.Location = [System.Drawing.Point]::new(10, 120 + ($i * 50))
        $label.Size = New-Object System.Drawing.Size(120, 20)

        $textBox = New-Object System.Windows.Forms.TextBox
        $textBox.Location = [System.Drawing.Point]::new(140, 120 + ($i * 50))
        $textBox.Size = New-Object System.Drawing.Size(200, 25)

        $form.Controls.AddRange(@($label, $textBox))
        $inputs += $textBox
    }

    # Botão Registrar
    $btnSave = New-Object System.Windows.Forms.Button
    $btnSave.Text = "Registrar"
    $btnSave.Size = New-Object System.Drawing.Size(330, 35)
    $btnSave.Location = New-Object System.Drawing.Point(20, 330)
    $btnSave.Add_Click({
        if ($cbPaciente.SelectedIndex -lt 0 -or $cbDoutor.SelectedIndex -lt 0 -or
            [string]::IsNullOrWhiteSpace($inputs[0].Text) -or
            [string]::IsNullOrWhiteSpace($inputs[1].Text)) {
            [System.Windows.Forms.MessageBox]::Show("Preencha os campos obrigatorios.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        $file = "prescriptions.json"
        $data = Load-JsonData $file

        # Extrair ID selecionado
        $idPaciente = [int]($cbPaciente.SelectedItem -split '[()]')[1]
        $idDoutor = [int]($cbDoutor.SelectedItem -split '[()]')[1]

        $receita = @{
            id           = Get-NextId -filePath $file
            paciente_id  = $idPaciente
            doutor_id    = $idDoutor
            data         = $inputs[0].Text
            medicamento  = $inputs[1].Text
            dosagem      = $inputs[2].Text
            instrucoes   = $inputs[3].Text
        }

        $data += $receita
        Save-JsonData -data $data -filePath $file

        [System.Windows.Forms.MessageBox]::Show("Receita registrada com sucesso!")
        $form.Close()
    })

    $form.Controls.AddRange(@($lblPaciente, $cbPaciente, $lblDoutor, $cbDoutor, $btnSave))
    $form.ShowDialog()
}

function Imprimir-Receita {
    $formPrint = New-Object System.Windows.Forms.Form
    $formPrint.Text = "Imprimir Receita Medica"
    $formPrint.Size = New-Object System.Drawing.Size(350, 250)
    $formPrint.StartPosition = "CenterScreen"

    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = "Digite o ID da Receita para impressao:"
    $lbl.Location = New-Object System.Drawing.Point(10, 20)
    $lbl.Size = New-Object System.Drawing.Size(320, 20)

    $txtID = New-Object System.Windows.Forms.TextBox
    $txtID.Location = New-Object System.Drawing.Point(10, 50)
    $txtID.Size = New-Object System.Drawing.Size(320, 25)

    $btnPrint = New-Object System.Windows.Forms.Button
    $btnPrint.Text = "Imprimir"
    $btnPrint.Location = New-Object System.Drawing.Point(110, 90)
    $btnPrint.Size = New-Object System.Drawing.Size(120, 30)

    $btnPrint.Add_Click({
        $idBusca = $txtID.Text.Trim()
        if (-not [int]::TryParse($idBusca, [ref]$null)) {
            [System.Windows.Forms.MessageBox]::Show("Informe um ID valido (número).", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        $receitas = Load-JsonData "prescriptions.json"
        $pacientes = Load-JsonData "pacientes.json"
        $doutores = Load-JsonData "doutores.json"

        $receita = $receitas | Where-Object { $_.id -eq [int]$idBusca }

        if ($null -eq $receita) {
            [System.Windows.Forms.MessageBox]::Show("Receita nao encontrada.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        # Buscar nomes
        $pacienteNome = ($pacientes | Where-Object { $_.id -eq $receita.paciente_id }).nome
        if (-not $pacienteNome) { $pacienteNome = "Desconhecido" }

        $doutorNome = ($doutores | Where-Object { $_.id -eq $receita.doutor_id }).nome
        if (-not $doutorNome) { $doutorNome = "Desconhecido" }

        $info = @"
RECEITA MÉDICA

ID Receita:     $($receita.id)
Paciente:       $pacienteNome (ID: $($receita.paciente_id))
Doutor:         $doutorNome (ID: $($receita.doutor_id))
Data:           $($receita.data)

Medicamento:    $($receita.medicamento)
Dosagem:        $($receita.dosagem)

Instrucoes:
$($receita.instrucoes)
"@

        [System.Windows.Forms.MessageBox]::Show($info, "Detalhes da Receita", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
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