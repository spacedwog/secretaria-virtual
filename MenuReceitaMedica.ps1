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
        # Validações básicas
        if ([string]::IsNullOrWhiteSpace($inputs[0].Text) -or
            [string]::IsNullOrWhiteSpace($inputs[1].Text) -or
            [string]::IsNullOrWhiteSpace($inputs[2].Text) -or
            [string]::IsNullOrWhiteSpace($inputs[3].Text)) {
            [System.Windows.Forms.MessageBox]::Show("Preencha os campos obrigatórios: ID Paciente, ID Doutor, Data e Medicamento.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        $file = "prescriptions.json"
        $data = Load-JsonData $file

        $receita = @{
            id           = Get-NextId -filePath $file
            paciente_id  = [int]$inputs[0].Text
            doutor_id    = [int]$inputs[1].Text
            data         = $inputs[2].Text
            medicamento  = $inputs[3].Text
            dosagem      = $inputs[4].Text
            instrucoes   = $inputs[5].Text
        }

        $data += $receita
        Save-JsonData -data $data -filePath $file

        [System.Windows.Forms.MessageBox]::Show("Receita registrada com sucesso!")
        $form.Close()
    })

    $form.Controls.Add($btnSave)
    $form.ShowDialog()
}

function Imprimir-Receita {
    $formPrint = New-Object System.Windows.Forms.Form
    $formPrint.Text = "Imprimir Receita Medica"
    $formPrint.Size = New-Object System.Drawing.Size(350, 250)
    $formPrint.StartPosition = "CenterScreen"

    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = "Digite o ID da Receita para impressão:"
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
            [System.Windows.Forms.MessageBox]::Show("Informe um ID válido (número).", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        $data = Load-JsonData "prescriptions.json"
        $receita = $data | Where-Object { $_.id -eq [int]$idBusca }

        if ($null -eq $receita) {
            [System.Windows.Forms.MessageBox]::Show("Receita não encontrada.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        $info = @"
Receita ID: $($receita.id)
Paciente ID: $($receita.paciente_id)
Doutor ID: $($receita.doutor_id)
Data: $($receita.data)
Medicamento: $($receita.medicamento)
Dosagem: $($receita.dosagem)
Instruções: $($receita.instrucoes)
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