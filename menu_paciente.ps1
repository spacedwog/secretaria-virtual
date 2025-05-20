Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Funções simuladas
function Listar-Pacientes {
    [System.Windows.Forms.MessageBox]::Show("Listar pacientes...")
    # Aqui você pode usar Invoke-RestMethod para buscar dados
}

function Adicionar-Paciente {
    $formAdd = New-Object System.Windows.Forms.Form
    $formAdd.Text = "Adicionar Paciente"
    $formAdd.Size = New-Object System.Drawing.Size(300,350)
    $formAdd.StartPosition = "CenterScreen"

    $labels = "Nome", "Idade", "Telefone", "Email", "Endereco"
    $textboxes = @()

    for ($i = 0; $i -lt $labels.Length; $i++) {
        $lbl = New-Object System.Windows.Forms.Label
        $lbl.Text = $labels[$i]
        $lbl.Location = New-Object System.Drawing.Point(10, ($i * 40) + 10)
        $lbl.Size = New-Object System.Drawing.Size(280, 20)

        $txt = New-Object System.Windows.Forms.TextBox
        $txt.Location = New-Object System.Drawing.Point(10, ($i * 40) + 30)
        $txt.Size = New-Object System.Drawing.Size(260, 20)

        $formAdd.Controls.Add($lbl)
        $formAdd.Controls.Add($txt)
        $textboxes += $txt
    }

    $btnSave = New-Object System.Windows.Forms.Button
    $btnSave.Text = "Salvar"
    $btnSave.Size = New-Object System.Drawing.Size(260,30)
    $btnSave.Location = New-Object System.Drawing.Point(10,240)
    $btnSave.Add_Click({
        $nome = $textboxes[0].Text
        $idade = $textboxes[1].Text
        $telefone = $textboxes[2].Text
        $email = $textboxes[3].Text
        $endereco = $textboxes[4].Text

        # Aqui você pode substituir por chamada real:
        # Invoke-RestMethod -Uri "http://localhost:3000/pacientes" -Method Post -Body @{ ... }

        [System.Windows.Forms.MessageBox]::Show("Paciente '$nome' adicionado!")
        $formAdd.Close()
    })

    $formAdd.Controls.Add($btnSave)
    $formAdd.ShowDialog()
}

function Editar-Paciente {
    [System.Windows.Forms.MessageBox]::Show("Editar paciente...")
}

function Excluir-Paciente {
    [System.Windows.Forms.MessageBox]::Show("Excluir paciente...")
}

# Criação da Janela principal
$form = New-Object System.Windows.Forms.Form
$form.Text = "Menu de Pacientes"
$form.Size = New-Object System.Drawing.Size(400,300)
$form.StartPosition = "CenterScreen"

# Botões
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

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Editar Paciente"
$btn3.Size = New-Object System.Drawing.Size(300,40)
$btn3.Location = New-Object System.Drawing.Point(50,130)
$btn3.Add_Click({ Editar-Paciente })

$btn4 = New-Object System.Windows.Forms.Button
$btn4.Text = "4. Excluir Paciente"
$btn4.Size = New-Object System.Drawing.Size(300,40)
$btn4.Location = New-Object System.Drawing.Point(50,180)
$btn4.Add_Click({ Excluir-Paciente })

$btnBack = New-Object System.Windows.Forms.Button
$btnBack.Text = "Voltar"
$btnBack.Size = New-Object System.Drawing.Size(300,40)
$btnBack.Location = New-Object System.Drawing.Point(50,230)
$btnBack.Add_Click({ $form.Close() })

# Adiciona os botões ao Form
$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btn4, $btnBack))

# Exibe o menu
[void]$form.ShowDialog()