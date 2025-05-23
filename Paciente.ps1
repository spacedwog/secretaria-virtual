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

    # Clique duplo para ver detalhes
    $listView.Add_DoubleClick({
        if ($listView.SelectedItems.Count -gt 0) {
            $index = $listView.SelectedItems[0].Index
            $pacienteSelecionado = $pacientes[$index]
            Mostrar_Detalhes_Paciente -pacienteId $pacienteSelecionado.ID -pacienteNome $pacienteSelecionado.Nome
        }
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
        [int]$pacienteId,
        [string]$pacienteNome
    )

    # Cria o formulário para exibir os detalhes do paciente
    $formDetalhes = New-Object System.Windows.Forms.Form
    $formDetalhes.Text = "Detalhes do Paciente: $pacienteNome"
    $formDetalhes.Size = New-Object System.Drawing.Size(500, 650)
    $formDetalhes.StartPosition = "CenterScreen"

    # Caixa de texto para mostrar as informações
    $textbox = New-Object System.Windows.Forms.TextBox
    $textbox.Multiline = $true
    $textbox.ScrollBars = "Vertical"
    $textbox.ReadOnly = $true
    $textbox.Size = New-Object System.Drawing.Size(460, 570)
    $textbox.Location = New-Object System.Drawing.Point(10, 10)

    # Botão para fechar o formulário
    $btnFechar = New-Object System.Windows.Forms.Button
    $btnFechar.Text = "Fechar"
    $btnFechar.Size = New-Object System.Drawing.Size(460, 30)
    $btnFechar.Location = New-Object System.Drawing.Point(10, 590)
    $btnFechar.Add_Click({ $formDetalhes.Close() })

    $detalhesCompletos = ""

    # Mapeamento dos doutores
    $doctoresPath = "relatorios/json/doctors.json"
    $doutoresMap = @{}
    if (Test-Path $doctoresPath) {
        $doutoresData = Get-Content $doctoresPath -Raw | ConvertFrom-Json
        if ($doutoresData -isnot [System.Collections.IEnumerable]) {
            $doutoresData = @($doutoresData)
        }
        foreach ($d in $doutoresData) {
            $doutoresMap[$d.id] = "$($d.nome) ($($d.especialidade))"
        }
    }

    # Dados do paciente
    $pacientesPath = "relatorios/json/pacientes.json"
    if (Test-Path $pacientesPath) {
        $pacientesData = Get-Content $pacientesPath -Raw | ConvertFrom-Json
        if ($pacientesData -isnot [System.Collections.IEnumerable]) {
            $pacientesData = @($pacientesData)
        }

        $pacienteInfo = $pacientesData | Where-Object { $_.id -eq $pacienteId -or $_.ID -eq $pacienteId -or $_.Id -eq $pacienteId }
        if ($pacienteInfo) {
            $detalhesCompletos += "INFORMACOES DO PACIENTE:`r`n"
            $detalhesCompletos += "Nome: $($pacienteInfo.Nome)`r`n"
            $detalhesCompletos += "Idade: $($pacienteInfo.Idade)`r`n"
            $detalhesCompletos += "Telefone: $($pacienteInfo.Telefone)`r`n"
            $detalhesCompletos += "Email: $($pacienteInfo.Email)`r`n"
            $detalhesCompletos += "Endereco: $($pacienteInfo.Endereco)`r`n"
            $detalhesCompletos += "`r`n"
        }
    }

    # Visitas
    $visitasPath = "relatorios/json/visits.json"
    if (Test-Path $visitasPath) {
        $visitasData = Get-Content $visitasPath -Raw | ConvertFrom-Json
        if ($visitasData -isnot [System.Collections.IEnumerable]) {
            $visitasData = @($visitasData)
        }

        $visitasPaciente = $visitasData | Where-Object { $_.paciente_id -eq $pacienteId }
        if ($visitasPaciente.Count -gt 0) {
            $detalhesCompletos += "[OK] VISITAS:`r`n"
            foreach ($v in $visitasPaciente) {
                $dataHora = Get-Date $v.timestamp -Format "dd/MM/yyyy HH:mm"
                $doutorNome = $doutoresMap[$v.doutor_id]
                $detalhesCompletos += "- ID: $($v.id), Doutor: $doutorNome, Data: $dataHora`r`n"
            }
        } else {
            $detalhesCompletos += "[OK] VISITAS: Nenhuma registrada.`r`n"
        }
        $detalhesCompletos += "`r`n"
    }

    # Agendamentos
    $agendamentosPath = "relatorios/json/appointments.json"
    if (Test-Path $agendamentosPath) {
        $agendamentosData = Get-Content $agendamentosPath -Raw | ConvertFrom-Json
        if ($agendamentosData -isnot [System.Collections.IEnumerable]) {
            $agendamentosData = @($agendamentosData)
        }

        $agendamentosPaciente = $agendamentosData | Where-Object { $_.paciente_id -eq $pacienteId }
        if ($agendamentosPaciente.Count -gt 0) {
            $detalhesCompletos += "[OK] AGENDAMENTOS:`r`n"
            foreach ($a in $agendamentosPaciente) {
                $doutorNome = $doutoresMap[$a.doutor_id]
                $detalhesCompletos += "- ID: $($a.id), Titulo: $($a.titulo), Motivo: $($a.motivo), Data: $($a.data) as $($a.hora), Status: $($a.status), Doutor: $doutorNome`r`n"
            }
        } else {
            $detalhesCompletos += "[OK] AGENDAMENTOS: Nenhum agendamento encontrado.`r`n"
        }
        $detalhesCompletos += "`r`n"
    }

    # Prescrições
    $prescricoesPath = "relatorios/json/prescriptions.json"
    if (Test-Path $prescricoesPath) {
        $prescricoesData = Get-Content $prescricoesPath -Raw | ConvertFrom-Json
        if ($prescricoesData -isnot [System.Collections.IEnumerable]) {
            $prescricoesData = @($prescricoesData)
        }

        $prescricoesPaciente = $prescricoesData | Where-Object { $_.paciente_id -eq $pacienteId }
        if ($prescricoesPaciente.Count -gt 0) {
            $detalhesCompletos += "[OK] PRESCRICOES:`r`n"
            foreach ($p in $prescricoesPaciente) {
                $doutorNome = $doutoresMap[$p.doutor_id]
                $detalhesCompletos += "- ID: $($p.id), Medicamento: $($p.medicamento), Dosagem: $($p.dosagem), Instrucoes: $($p.instrucoes), Data: $($p.data), Doutor: $doutorNome`r`n"
            }
        } else {
            $detalhesCompletos += "[OK] PRESCRICOES: Nenhuma prescricao encontrada.`r`n"
        }
    }

    # Define o texto no textbox e adiciona controles ao formulário
    $textbox.Text = $detalhesCompletos
    $formDetalhes.Controls.AddRange(@($textbox, $btnFechar))

    # Exibe o formulário
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