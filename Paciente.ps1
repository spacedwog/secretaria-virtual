Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$arquivoJson = "relatorios/json/pacientes.json"

function Get_NextId {
    param (
        [string]$filePath
    )
    if (-not (Test-Path $filePath)) {
        return 1
    }
    $content = Get-Content $filePath -Raw
    if ([string]::IsNullOrWhiteSpace($content)) {
        return 1
    }
    $data = $content | ConvertFrom-Json
    if ($data -isnot [System.Collections.IEnumerable]) {
        $data = @($data)
    }
    $ids = $data | ForEach-Object { $_.ID }
    $maxId = ($ids | Measure-Object -Maximum).Maximum
    if ($maxId -match '^\d+$') {
        return ([int]$maxId) + 1
    } else {
        return 1
    }
}

function Carregar_Pacientes {
    if (-not (Test-Path $arquivoJson)) {
        return @()
    }
    $content = Get-Content $arquivoJson -Raw
    if ([string]::IsNullOrWhiteSpace($content)) {
        return @()
    }
    $pacientes = $content | ConvertFrom-Json
    if ($pacientes -isnot [System.Collections.IEnumerable]) {
        $pacientes = @($pacientes)
    }
    if ($null -eq $pacientes) {
        $pacientes = @()
    }
    return $pacientes
}

function Salvar_Pacientes($pacientes) {
    $pacientes | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 $arquivoJson
}

function Listar_Pacientes {
    $pacientes = Carregar_Pacientes

    # Janela principal
    $formList = New-Object System.Windows.Forms.Form
    $formList.Text = "Lista de Pacientes"
    $formList.Size = New-Object System.Drawing.Size(720, 460)
    $formList.StartPosition = "CenterScreen"
    $formList.Topmost = $true

    # ListView de pacientes
    $listView = New-Object System.Windows.Forms.ListView
    $listView.View = [System.Windows.Forms.View]::Details
    $listView.FullRowSelect = $true
    $listView.GridLines = $true
    $listView.MultiSelect = $false
    $listView.Size = New-Object System.Drawing.Size(690, 350)
    $listView.Location = New-Object System.Drawing.Point(10, 10)

    $listView.Columns.Add("ID", 60)        | Out-Null
    $listView.Columns.Add("Nome", 150)     | Out-Null
    $listView.Columns.Add("Idade", 60)     | Out-Null
    $listView.Columns.Add("Telefone", 120) | Out-Null
    $listView.Columns.Add("Email", 150)    | Out-Null
    $listView.Columns.Add("Endereco", 150) | Out-Null

    # Preenche os dados
    foreach ($paciente in $pacientes) {
        $item = New-Object System.Windows.Forms.ListViewItem($paciente.ID.ToString())
        $item.SubItems.Add($paciente.Nome)     | Out-Null
        $item.SubItems.Add($paciente.Idade)    | Out-Null
        $item.SubItems.Add($paciente.Telefone) | Out-Null
        $item.SubItems.Add($paciente.Email)    | Out-Null
        $item.SubItems.Add($paciente.Endereco) | Out-Null
        $listView.Items.Add($item) | Out-Null
    }

    $listView.Add_DoubleClick({
        if ($listView.SelectedItems.Count -eq 0) { return }

        $index = $listView.SelectedItems[0].Index
        $pacienteSelecionado = $pacientes[$index]
        Mostrar_Detalhes_Paciente -paciente $pacienteSelecionado
    })

    # Botão Fechar
    $btnFechar = New-Object System.Windows.Forms.Button
    $btnFechar.Text = "Fechar"
    $btnFechar.Size = New-Object System.Drawing.Size(100,30)
    $btnFechar.Location = New-Object System.Drawing.Point(10, 370)
    $btnFechar.Add_Click({ $formList.Close() })

    # Botão Excluir
    $btnExcluir = New-Object System.Windows.Forms.Button
    $btnExcluir.Text = "Excluir"
    $btnExcluir.Size = New-Object System.Drawing.Size(100,30)
    $btnExcluir.Location = New-Object System.Drawing.Point(120, 370)
    $btnExcluir.Add_Click({
        if ($listView.SelectedItems.Count -eq 0) {
            [System.Windows.Forms.MessageBox]::Show("Selecione um paciente para excluir.", "Aviso")
            return
        }
        $index = $listView.SelectedItems[0].Index
        $pacienteSelecionado = $pacientes[$index]
        $confirm = [System.Windows.Forms.MessageBox]::Show(
            "Confirma exclusão do paciente '$($pacienteSelecionado.Nome)'?",
            "Confirmação",
            [System.Windows.Forms.MessageBoxButtons]::YesNo,
            [System.Windows.Forms.MessageBoxIcon]::Question
        )
        if ($confirm -eq [System.Windows.Forms.DialogResult]::Yes) {
            $pacientes = $pacientes | Where-Object { $_.ID -ne $pacienteSelecionado.ID }
            Salvar_Pacientes $pacientes
            [System.Windows.Forms.MessageBox]::Show("Paciente excluído com sucesso.", "Sucesso")
            $formList.Close()
            Listar_Pacientes  # Recarrega a lista após exclusão
        }
    })

    $formList.Controls.AddRange(@($listView, $btnFechar, $btnExcluir))
    $formList.ShowDialog()
}

function Adicionar_Paciente {
    Formulario_Paciente
}

function Formulario_Paciente {
    $formAdd = New-Object System.Windows.Forms.Form
    $formAdd.Text = "Adicionar Paciente"
    $formAdd.Size = New-Object System.Drawing.Size(300,350)
    $formAdd.StartPosition = "CenterScreen"

    $labels = "Nome", "Idade", "Telefone", "Email", "Endereco"
    $textboxes = @()

    for ($i = 0; $i -lt $labels.Length; $i++) {
        $lbl = New-Object System.Windows.Forms.Label
        $lbl.Text = $labels[$i]
        $lbl.Location = [System.Drawing.Point]::new(10, ($i * 40) + 10)
        $lbl.Size = [System.Drawing.Size]::new(280, 20)

        $txt = New-Object System.Windows.Forms.TextBox
        $txt.Location = [System.Drawing.Point]::new(10, ($i * 40) + 30)
        $txt.Size = [System.Drawing.Size]::new(260, 20)

        $formAdd.Controls.Add($lbl)
        $formAdd.Controls.Add($txt)
        $textboxes += $txt
    }

    $btnSave = New-Object System.Windows.Forms.Button
    $btnSave.Text = "Salvar"
    $btnSave.Size = New-Object System.Drawing.Size(260,30)
    $btnSave.Location = New-Object System.Drawing.Point(10,240)
    $btnSave.Add_Click({
        $nome = $textboxes[0].Text.Trim()
        $idade = $textboxes[1].Text.Trim()
        $telefone = $textboxes[2].Text.Trim()
        $email = $textboxes[3].Text.Trim()
        $endereco = $textboxes[4].Text.Trim()

        if ([string]::IsNullOrWhiteSpace($nome)) {
            [System.Windows.Forms.MessageBox]::Show("Nome obrigatorio.")
            return
        }

        $pacientes = Carregar_Pacientes

        # Garante que $pacientes seja sempre um array antes de adicionar
        if ($null -eq $pacientes) {
            $pacientes = @()
        } elseif ($pacientes -isnot [System.Collections.IEnumerable]) {
            $pacientes = @($pacientes)
        }

        $novoPaciente = [PSCustomObject]@{
            ID       = Get_NextId -filePath $arquivoJson
            Nome     = $nome
            Idade    = $idade
            Telefone = $telefone
            Email    = $email
            Endereco = $endereco
        }

        $pacientes += $novoPaciente
        Salvar_Pacientes $pacientes

        [System.Windows.Forms.MessageBox]::Show("Paciente salvo com sucesso!")
        $formAdd.Close()
    })

    $formAdd.Controls.Add($btnSave)
    $formAdd.ShowDialog()
}

function Mostrar_Detalhes_Paciente {
    param (
        [Parameter(Mandatory=$true)][object]$paciente
    )

    # Carrega dados externos
    $visitas = @()
    $consultas = @()
    $agendamentos = @()

    if (Test-Path "relatorios/json/visits.json") {
        $visitas = Get-Content "relatorios/json/visits.json" -Raw | ConvertFrom-Json
    }
    if (Test-Path "relatorios/json/prescriptions.json") {
        $consultas = Get-Content "relatorios/json/prescriptions.json" -Raw | ConvertFrom-Json
    }
    if (Test-Path "relatorios/json/appointments.json") {
        $agendamentos = Get-Content "relatorios/json/appointments.json" -Raw | ConvertFrom-Json
    }

    $visitasDoPaciente = $visitas | Where-Object { $_.PacienteID -eq $paciente.ID }
    $consultasDoPaciente = $consultas | Where-Object { $_.PacienteID -eq $paciente.ID }
    $agendamentosDoPaciente = $agendamentos | Where-Object { $_.PacienteID -eq $paciente.ID }

    # Criar formulário de detalhes
    $formDetalhes = New-Object System.Windows.Forms.Form
    $formDetalhes.Text = "Detalhes do Paciente: $($paciente.Nome)"
    $formDetalhes.Size = New-Object System.Drawing.Size(500, 500)
    $formDetalhes.StartPosition = "CenterScreen"

    $textBox = New-Object System.Windows.Forms.TextBox
    $textBox.Multiline = $true
    $textBox.ScrollBars = "Vertical"
    $textBox.ReadOnly = $true
    $textBox.Size = New-Object System.Drawing.Size(460, 400)
    $textBox.Location = New-Object System.Drawing.Point(10,10)

    $detalhes = "ID: $($paciente.ID)`r`nNome: $($paciente.Nome)`r`nIdade: $($paciente.Idade)`r`nTelefone: $($paciente.Telefone)`r`nEmail: $($paciente.Email)`r`nEndereco: $($paciente.Endereco)`r`n"
    $detalhes += "`r`n--- VISITAS ---`r`n"
    $detalhes += ($visitasDoPaciente | ForEach-Object { "Data: $($_.Data), Motivo: $($_.Motivo)" }) -join "`r`n"
    
    $detalhes += "`r`n`r`n--- CONSULTAS ---`r`n"
    $detalhes += ($consultasDoPaciente | ForEach-Object { "Data: $($_.Data), Doutor: $($_.Doutor), Diagnóstico: $($_.Diagnostico)" }) -join "`r`n"

    $detalhes += "`r`n`r`n--- AGENDAMENTOS ---`r`n"
    $detalhes += ($agendamentosDoPaciente | ForEach-Object { "Data: $($_.Data), Especialidade: $($_.Especialidade)" }) -join "`r`n"

    $textBox.Text = $detalhes

    $btnFechar = New-Object System.Windows.Forms.Button
    $btnFechar.Text = "Fechar"
    $btnFechar.Size = New-Object System.Drawing.Size(100, 30)
    $btnFechar.Location = New-Object System.Drawing.Point(370, 420)
    $btnFechar.Add_Click({ $formDetalhes.Close() })

    $formDetalhes.Controls.AddRange(@($textBox, $btnFechar))
    $formDetalhes.ShowDialog()
}

function Excluir_Paciente {
    [System.Windows.Forms.MessageBox]::Show("Use o botao 'Excluir' na lista de pacientes para remover.")
}

# Janela principal do menu paciente
$form = New-Object System.Windows.Forms.Form
$form.Text = "Menu de Pacientes"
$form.Size = New-Object System.Drawing.Size(400,250)
$form.StartPosition = "CenterScreen"

$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Listar Pacientes"
$btn1.Size = New-Object System.Drawing.Size(300,40)
$btn1.Location = New-Object System.Drawing.Point(50,30)
$btn1.Add_Click({ Listar_Pacientes })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Adicionar Paciente"
$btn2.Size = New-Object System.Drawing.Size(300,40)
$btn2.Location = New-Object System.Drawing.Point(50,80)
$btn2.Add_Click({ Adicionar_Paciente })

$btn4 = New-Object System.Windows.Forms.Button
$btn4.Text = "3. Excluir Paciente"
$btn4.Size = New-Object System.Drawing.Size(300,40)
$btn4.Location = New-Object System.Drawing.Point(50,130)
$btn4.Add_Click({ 
    [System.Windows.Forms.MessageBox]::Show("Para excluir, use o botão 'Excluir' na lista de pacientes.")
})

$btnBack = New-Object System.Windows.Forms.Button
$btnBack.Text = "Voltar"
$btnBack.Size = New-Object System.Drawing.Size(300,40)
$btnBack.Location = New-Object System.Drawing.Point(50,180)
$btnBack.Add_Click({ $form.Close() })

$form.Controls.AddRange(@($btn1, $btn2, $btn4, $btnBack))

[void]$form.ShowDialog()