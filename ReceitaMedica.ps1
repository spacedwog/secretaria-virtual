Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Criação da função auxiliar para cantos arredondados
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("Gdi32.dll", EntryPoint = "CreateRoundRectRgn")]
    public static extern IntPtr CreateRoundRectRgn(
        int nLeftRect, int nTopRect, int nRightRect, int nBottomRect,
        int nWidthEllipse, int nHeightEllipse);
}
"@

function Load_JsonData {
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
    $items = @(Load_JsonData $filePath)

    # Filtra apenas objetos com id numérico válido
    $validItems = $items | Where-Object { ($_ -ne $null) -and ($_ | Get-Member -Name "id") -and ([int]::TryParse($_.id.ToString(), [ref]$null)) }

    if ($validItems.Count -eq 0) { return 1 }

    return ($validItems | Measure-Object -Property id -Maximum).Maximum + 1
}

function EstilizarBotao($botao) {
    $botao.FlatStyle = 'Flat'
    $botao.BackColor = [System.Drawing.Color]::FromArgb(173, 216, 230) # Azul pastel
    $botao.ForeColor = [System.Drawing.Color]::Black
    $botao.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $botao.FlatAppearance.BorderSize = 0
    $botao.Region = [System.Drawing.Region]::FromHrgn(
        [Win32]::CreateRoundRectRgn(0, 0, $botao.Width, $botao.Height, 20, 20)
    )
}

function Registrar_Receita {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Registrar Receita Medica"
    $form.Size = New-Object System.Drawing.Size(380, 430)
    $form.StartPosition = "CenterScreen"

    # Carregar dados JSON
    $pacientes = Load_JsonData "relatorios/json/pacientes.json"
    $doutores = Load_JsonData "relatorios/json/doctors.json"

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

    # Campos de texto: Data, Medicamento, Dosagem, Instrucoes
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

        # Extrair o ID numérico dos ComboBoxes
        $pacienteId = [int]($cbPaciente.SelectedItem -split '[()]')[1]
        $doutorId = [int]($cbDoutor.SelectedItem -split '[()]')[1]

        $file = "relatorios/json/prescriptions.json"
        $data = @(Load_JsonData $file)  # Garante que seja array

        $receita = [PSCustomObject]@{
            id           = Get-NextId -filePath $file
            paciente_id  = $pacienteId
            doutor_id    = $doutorId
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
    
    EstilizarBotao $btnSave

    $form.Controls.AddRange(@($lblPaciente, $cbPaciente, $lblDoutor, $cbDoutor, $btnSave))
    $form.ShowDialog()
}

function Imprimir_Receita {
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

        $receitas = Load_JsonData "relatorios/json/prescriptions.json"
        $pacientes = Load_JsonData "relatorios/json/pacientes.json"
        $doutores = Load_JsonData "relatorios/json/doctors.json"

        $receita = $receitas | Where-Object { $_.id -eq [int]$idBusca }

        if ($null -eq $receita) {
            [System.Windows.Forms.MessageBox]::Show("Receita nao encontrada.", "Erro", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
            return
        }

        $pacienteNome = ($pacientes | Where-Object { $_.id -eq $receita.paciente_id }).nome
        if (-not $pacienteNome) { $pacienteNome = "Desconhecido" }

        $doutorNome = ($doutores | Where-Object { $_.id -eq $receita.doutor_id }).nome
        if (-not $doutorNome) { $doutorNome = "Desconhecido" }

        $htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Receita Medica - ID $($receita.id)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2E86C1; }
        .section { margin-bottom: 15px; }
        .label { font-weight: bold; }
        .instructions { white-space: pre-wrap; border: 1px solid #ccc; padding: 10px; }
    </style>
</head>
<body>
    <h1>Receita Medica</h1>
    <div class='section'><span class='label'>ID Receita:</span> $($receita.id)</div>
    <div class='section'><span class='label'>Paciente:</span> $pacienteNome (ID: $($receita.paciente_id))</div>
    <div class='section'><span class='label'>Doutor:</span> $doutorNome (ID: $($receita.doutor_id))</div>
    <div class='section'><span class='label'>Data:</span> $($receita.data)</div>
    <div class='section'><span class='label'>Medicamento:</span> $($receita.medicamento)</div>
    <div class='section'><span class='label'>Dosagem:</span> $($receita.dosagem)</div>
    <div class='section'>
        <span class='label'>Instrucoes:</span><br>
        <div class='instructions'>$($receita.instrucoes)</div>
    </div>
</body>
</html>
"@

        $filePath = "relatorios/webpage/Receita_$($receita.id).html"
        $htmlContent | Out-File -FilePath $filePath -Encoding UTF8
        Start-Process $filePath

        [System.Windows.Forms.MessageBox]::Show("Relatorio HTML gerado com sucesso: $filePath", "Sucesso", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)

        $formPrint.Close()
    })
    
    EstilizarBotao $btnPrint

    $formPrint.Controls.AddRange(@($lbl, $txtID, $btnPrint))
    $formPrint.ShowDialog()
}

# Janela principal do Menu Receita Médica
$formMain = New-Object System.Windows.Forms.Form
$formMain.Text = "Menu Receita Medica"
$formMain.Size = New-Object System.Drawing.Size(350, 360)
$formMain.StartPosition = "CenterScreen"
$formMain.BackColor = [System.Drawing.Color]::FromArgb(240, 248, 255) # Azul claro

$btnReg = New-Object System.Windows.Forms.Button
$btnReg.Text = "1. Registrar Receita Medica"
$btnReg.Size = New-Object System.Drawing.Size(300, 40)
$btnReg.Location = New-Object System.Drawing.Point(20, 30)
$btnReg.Add_Click({ Registrar_Receita })

$btnPrint = New-Object System.Windows.Forms.Button
$btnPrint.Text = "2. Imprimir Receita Medica"
$btnPrint.Size = New-Object System.Drawing.Size(300, 40)
$btnPrint.Location = New-Object System.Drawing.Point(20, 90)
$btnPrint.Add_Click({ Imprimir_Receita })

$btnBack = New-Object System.Windows.Forms.Button
$btnBack.Text = "Voltar"
$btnBack.Size = New-Object System.Drawing.Size(300, 40)
$btnBack.Location = New-Object System.Drawing.Point(20, 150)
$btnBack.Add_Click({ $formMain.Close() })

EstilizarBotao $btnReg
EstilizarBotao $btnPrint
EstilizarBotao $btnBack

$formMain.Controls.AddRange(@($btnReg, $btnPrint, $btnBack))

[void]$formMain.ShowDialog()