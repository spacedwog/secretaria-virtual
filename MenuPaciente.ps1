Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$arquivoJson = ".\pacientes.json"

function Get-NextId {
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

function Carregar-Pacientes {
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

function Salvar-Pacientes($pacientes) {
    $pacientes | ConvertTo-Json -Depth 10 | Out-File -Encoding UTF8 $arquivoJson
}

function Listar-Pacientes {
    $pacientes = Carregar-Pacientes

    $formList = New-Object System.Windows.Forms.Form
    $formList.Text = "Lista de Pacientes"
    $formList.Size = New-Object System.Drawing.Size(700, 450)
    $formList.StartPosition = "CenterScreen"

    $listView = New-Object System.Windows.Forms.ListView
    $listView.View = [System.Windows.Forms.View]::Details
    $listView.FullRowSelect = $true
    $listView.GridLines = $true
    $listView.MultiSelect = $false
    $listView.Size = New-Object System.Drawing.Size(680, 350)
    $listView.Location = New-Object System.Drawing.Point(10, 10)

    $listView.Columns.Add("ID", 100) | Out-Null
    $listView.Columns.Add("Nome", 150) | Out-Null
    $listView.Columns.Add("Idade", 50) | Out-Null
    $listView.Columns.Add("Telefone", 120) | Out-Null
    $listView.Columns.Add("Email", 150) | Out-Null
    $listView.Columns.Add("Endereco", 200) | Out-Null

    foreach ($paciente in $pacientes) {
        $item = New-Object System.Windows.Forms.ListViewItem($paciente.ID.ToString())
        $item.SubItems.Add($paciente.Nome)     | Out-Null
        $item.SubItems.Add($paciente.Idade)    | Out-Null
        $item.SubItems.Add($paciente.Telefone) | Out-Null
        $item.SubItems.Add($paciente.Email)    | Out-Null
        $item.SubItems.Add($paciente.Endereco) | Out-Null
        $listView.Items.Add($item) | Out-Null
    }

    $btnClose = New-Object System.Windows.Forms.Button
    $btnClose.Text = "Fechar"
    $btnClose.Size = New-Object System.Drawing.Size(100,30)
    $btnClose.Location = New-Object System.Drawing.Point(10, 370)
    $btnClose.Add_Click({ $formList.Close() })

    $btnExcluir = New-Object System.Windows.Forms.Button
    $btnExcluir.Text = "Excluir"
    $btnExcluir.Size = New-Object System.Drawing.Size(100,30)
    $btnExcluir.Location = New-Object System.Drawing.Point(120, 370)
    $btnExcluir.Add_Click({
        if ($listView.SelectedItems.Count -eq 0) {
            [System.Windows.Forms.MessageBox]::Show("Selecione um paciente para excluir.")
            return
        }
        $index = $listView.SelectedItems[0].Index
        $pacienteSelecionado = $pacientes[$index]
        $confirm = [System.Windows.Forms.MessageBox]::Show("Confirma exclusão do paciente '$($pacienteSelecionado.Nome)'?", "Confirmação", [System.Windows.Forms.MessageBoxButtons]::YesNo)
        if ($confirm -eq [System.Windows.Forms.DialogResult]::Yes) {
            $pacientes = $pacientes | Where-Object { $_.ID -ne $pacienteSelecionado.ID }
            Salvar-Pacientes $pacientes
            [System.Windows.Forms.MessageBox]::Show("Paciente excluído com sucesso.")
            $formList.Close()
            Listar-Pacientes
        }
    })

    $formList.Controls.AddRange(@($listView, $btnClose, $btnExcluir))
    $formList.ShowDialog()
}

function Adicionar-Paciente {
    Abrir-Formulario-Paciente
}

function Abrir-Formulario-Paciente {
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
            [System.Windows.Forms.MessageBox]::Show("Nome obrigatório.")
            return
        }

        $pacientes = Carregar-Pacientes

        # Garante que $pacientes seja sempre um array antes de adicionar
        if ($pacientes -eq $null) {
            $pacientes = @()
        } elseif ($pacientes -isnot [System.Collections.IEnumerable]) {
            $pacientes = @($pacientes)
        }

        $novoPaciente = [PSCustomObject]@{
            ID       = Get-NextId -filePath $arquivoJson
            Nome     = $nome
            Idade    = $idade
            Telefone = $telefone
            Email    = $email
            Endereco = $endereco
        }

        $pacientes += $novoPaciente
        Salvar-Pacientes $pacientes

        [System.Windows.Forms.MessageBox]::Show("Paciente salvo com sucesso!")
        $formAdd.Close()
    })

    $formAdd.Controls.Add($btnSave)
    $formAdd.ShowDialog()
}

function Excluir-Paciente {
    [System.Windows.Forms.MessageBox]::Show("Use o botão 'Excluir' na lista de pacientes para remover.")
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
$btn1.Add_Click({ Listar-Pacientes })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Adicionar Paciente"
$btn2.Size = New-Object System.Drawing.Size(300,40)
$btn2.Location = New-Object System.Drawing.Point(50,80)
$btn2.Add_Click({ Adicionar-Paciente })

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