Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$global:arquivoJson = "$PSScriptRoot\pacientes.json"

# Função para carregar pacientes
function Carregar-Pacientes {
    if (Test-Path $global:arquivoJson) {
        $dados = Get-Content $global:arquivoJson -Raw | ConvertFrom-Json
        if ($dados -is [System.Collections.IEnumerable] -and $dados -isnot [string]) {
            return @($dados)
        } else {
            return ,$dados
        }
    }
    return @()
}

# Função para salvar pacientes
function Salvar-Pacientes {
    param([array]$pacientes)

    $pacientesObj = foreach ($p in $pacientes) {
        [PSCustomObject]@{
            Nome     = $p.Nome
            Idade    = $p.Idade
            Telefone = $p.Telefone
            Email    = $p.Email
            Endereco = $p.Endereco
        }
    }

    $pacientesObj | ConvertTo-Json -Depth 3 | Set-Content $global:arquivoJson
}

# Função para abrir formulário para adicionar ou editar paciente
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
            $lista = @($pacientes)
            $lista[$Index] = $novoPaciente
            Salvar-Pacientes $lista
        } else {
            $pacientes += $novoPaciente
            Salvar-Pacientes $pacientes
        }

        [System.Windows.Forms.MessageBox]::Show("Paciente salvo com sucesso!")
        $formAdd.Close()
    })

    $formAdd.Controls.Add($btnSave)
    $formAdd.ShowDialog()
}

function Listar-Pacientes {
    $pacientes = Carregar-Pacientes
    $mensagem = if ($pacientes.Count -eq 0) {
        "Nenhum paciente encontrado."
    } else {
        ($pacientes | ForEach-Object {
            "Nome: $($_.Nome)`nIdade: $($_.Idade)`nTelefone: $($_.Telefone)`nEmail: $($_.Email)`nEndereço: $($_.Endereco)`n`n"
        }) -join "`n"
    }

    [System.Windows.Forms.MessageBox]::Show($mensagem, "Lista de Pacientes")
}

function Adicionar-Paciente {
    Abrir-Formulario-Paciente
}

function Editar-Paciente {
    $pacientes = Carregar-Pacientes
    if ($pacientes.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Nenhum paciente para editar.")
        return
    }

    $input = [System.Windows.Forms.Interaction]::InputBox("Informe o número do paciente (0 a $($pacientes.Count - 1)):", "Editar Paciente", "0")
    if ([int]::TryParse($input, [ref]$idx) -and $idx -ge 0 -and $idx -lt $pacientes.Count) {
        Abrir-Formulario-Paciente -Paciente $pacientes[$idx] -Index $idx
    } else {
        [System.Windows.Forms.MessageBox]::Show("Índice inválido.")
    }
}

function Excluir-Paciente {
    $pacientes = Carregar-Pacientes
    if ($pacientes.Count -eq 0) {
        [System.Windows.Forms.MessageBox]::Show("Nenhum paciente para excluir.")
        return
    }

    $input = [System.Windows.Forms.Interaction]::InputBox("Informe o número do paciente (0 a $($pacientes.Count - 1)):", "Excluir Paciente", "0")
    if ([int]::TryParse($input, [ref]$idx) -and $idx -ge 0 -and $idx -lt $pacientes.Count) {
        $pacientes = @($pacientes)
        $pacientes = $pacientes[0..($idx - 1)] + $pacientes[($idx + 1)..($pacientes.Count - 1)]
        Salvar-Pacientes $pacientes
        [System.Windows.Forms.MessageBox]::Show("Paciente excluído com sucesso.")
    } else {
        [System.Windows.Forms.MessageBox]::Show("Índice inválido.")
    }
}

# Tela principal
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
$btn2.Add_Click({ Adicionar-Paciente })

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
[void]$form.ShowDialog()