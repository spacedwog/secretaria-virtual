Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$arquivoJson = "pacientes.json"

function Carregar-Pacientes {
    if (Test-Path $arquivoJson) {
        return Get-Content $arquivoJson | ConvertFrom-Json
    }
    return @()
}

function Salvar-Pacientes($pacientes) {
    $pacientes | ConvertTo-Json -Depth 3 | Set-Content $arquivoJson
}

function Abrir-Formulario-Paciente {
    param(
        [PSCustomObject]$Paciente,
        [int]$Index = -1
    )

    $formAdd = New-Object System.Windows.Forms.Form
    $formAdd.Text = if ($Index -ge 0) { "Editar Paciente" } else { "Adicionar Paciente" }
    $formAdd.Size = New-Object System.Drawing.Size(300, 350)
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

        if ($Paciente) {
            $valor = switch ($i) {
                0 { $Paciente.Nome }
                1 { $Paciente.Idade }
                2 { $Paciente.Telefone }
                3 { $Paciente.Email }
                4 { $Paciente.Endereco }
            }
            $txt.Text = $valor
        }

        $formAdd.Controls.Add($lbl)
        $formAdd.Controls.Add($txt)
        $textboxes += $txt
    }

    $btnSave = New-Object System.Windows.Forms.Button
    $btnSave.Text = if ($Index -ge 0) { "Atualizar" } else { "Salvar" }
    $btnSave.Size = New-Object System.Drawing.Size(260, 30)
    $btnSave.Location = New-Object System.Drawing.Point(10, 240)
    $btnSave.Add_Click({
        $novoPaciente = [PSCustomObject]@{
            Nome     = $textboxes[0].Text
            Idade    = $textboxes[1].Text
            Telefone = $textboxes[2].Text
            Email    = $textboxes[3].Text
            Endereco = $textboxes[4].Text
        }

        $pacientes = Carregar-Pacientes
        if ($Index -ge 0) {
            $pacientes[$Index] = $novoPaciente
        } else {
            $pacientes += $novoPaciente
        }

        Salvar-Pacientes $pacientes
        [System.Windows.Forms.MessageBox]::Show("Paciente salvo com sucesso!")
        $formAdd.Close()
    })

    $formAdd.Controls.Add($btnSave)
    $formAdd.ShowDialog()
}

function Listar-Pacientes {
    $pacientes = Carregar-Pacientes
    if ($pacientes.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Nenhum paciente cadastrado.")
        return
    }

    $formList = New-Object System.Windows.Forms.Form
    $formList.Text = "Pacientes Cadastrados"
    $formList.Size = New-Object System.Drawing.Size(500, 300)
    $formList.StartPosition = "CenterScreen"

    $listbox = New-Object System.Windows.Forms.ListBox
    $listbox.Size = New-Object System.Drawing.Size(470, 200)
    $listbox.Location = New-Object System.Drawing.Point(10, 10)

    $pacientes | ForEach-Object {
        $listbox.Items.Add("Nome: $($_.Nome) | Idade: $($_.Idade) | Tel: $($_.Telefone)")
    }

    $formList.Controls.Add($listbox)
    $formList.ShowDialog()
}

function Editar-Paciente {
    $pacientes = Carregar-Pacientes
    if ($pacientes.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Nenhum paciente disponível para edição.")
        return
    }

    $index = [System.Windows.Forms.MessageBox]::Show("Deseja editar o primeiro paciente da lista?", "Editar", "YesNo")
    if ($index -eq "Yes") {
        Abrir-Formulario-Paciente -Paciente $pacientes[0] -Index 0
    }
}

function Excluir-Paciente {
    $pacientes = Carregar-Pacientes
    if ($pacientes.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Nenhum paciente para excluir.")
        return
    }

    $index = [System.Windows.Forms.MessageBox]::Show("Deseja excluir o primeiro paciente da lista?", "Excluir", "YesNo")
    if ($index -eq "Yes") {
        $pacientes = $pacientes | Select-Object -Skip 1
        Salvar-Pacientes $pacientes
        [System.Windows.Forms.MessageBox]::Show("Paciente excluído com sucesso.")
    }
}

# Janela principal
$form = New-Object System.Windows.Forms.Form
$form.Text = "Menu de Pacientes"
$form.Size = New-Object System.Drawing.Size(400, 300)
$form.StartPosition = "CenterScreen"

$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Listar Pacientes"
$btn1.Size = New-Object System.Drawing.Size(300, 40)
$btn1.Location = New-Object System.Drawing.Point(50, 30)
$btn1.Add_Click({ Listar-Pacientes })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Adicionar Paciente"
$btn2.Size = New-Object System.Drawing.Size(300, 40)
$btn2.Location = New-Object System.Drawing.Point(50, 80)
$btn2.Add_Click({ Abrir-Formulario-Paciente })

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Editar Paciente"
$btn3.Size = New-Object System.Drawing.Size(300, 40)
$btn3.Location = New-Object System.Drawing.Point(50, 130)
$btn3.Add_Click({ Editar-Paciente })

$btn4 = New-Object System.Windows.Forms.Button
$btn4.Text = "4. Excluir Paciente"
$btn4.Size = New-Object System.Drawing.Size(300, 40)
$btn4.Location = New-Object System.Drawing.Point(50, 180)
$btn4.Add_Click({ Excluir-Paciente })

$btnBack = New-Object System.Windows.Forms.Button
$btnBack.Text = "Voltar"
$btnBack.Size = New-Object System.Drawing.Size(300, 40)
$btnBack.Location = New-Object System.Drawing.Point(50, 230)
$btnBack.Add_Click({ $form.Close() })

$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btn4, $btnBack))
$form.ShowDialog()