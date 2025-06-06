
<#
Módulo de Ouvidoria da Secretaria Virtual
Desenvolvido para registro, resposta, validação e exportação de manifestações, com suporte a envio por email.
#>

# Requerimentos: Windows.Forms, SMTP configurado

# --------------------- NOVA MANIFESTAÇÃO ---------------------
function Show-OuvidoriaForm {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $form = New-Object Windows.Forms.Form
    $form.Text = "Registrar Manifestação"
    $form.Size = New-Object Drawing.Size(400, 500)
    $form.StartPosition = "CenterScreen"

    $campos = @{}
    $labels = @("Nome", "Email", "Tipo", "Setor", "Descrição")
    $tipos = @("Elogio", "Reclamação", "Denúncia", "Sugestão", "Solicitação", "Outro")

    for ($i = 0; $i -lt $labels.Count; $i++) {
        $label = New-Object Windows.Forms.Label
        $label.Text = $labels[$i]
        $label.Location = New-Object Drawing.Point(10, 20 + ($i*60))
        $label.Size = New-Object Drawing.Size(360, 20)
        $form.Controls.Add($label)

        if ($labels[$i] -eq "Tipo") {
            $combo = New-Object Windows.Forms.ComboBox
            $combo.Location = New-Object Drawing.Point(10, 40 + ($i*60))
            $combo.Size = New-Object Drawing.Size(360, 20)
            $combo.Items.AddRange($tipos)
            $campos[$labels[$i]] = $combo
            $form.Controls.Add($combo)
        }
        elseif ($labels[$i] -eq "Descrição") {
            $textBox = New-Object Windows.Forms.TextBox
            $textBox.Multiline = $true
            $textBox.ScrollBars = "Vertical"
            $textBox.Location = New-Object Drawing.Point(10, 40 + ($i*60))
            $textBox.Size = New-Object Drawing.Size(360, 80)
            $campos[$labels[$i]] = $textBox
            $form.Controls.Add($textBox)
        }
        else {
            $textBox = New-Object Windows.Forms.TextBox
            $textBox.Location = New-Object Drawing.Point(10, 40 + ($i*60))
            $textBox.Size = New-Object Drawing.Size(360, 20)
            $campos[$labels[$i]] = $textBox
            $form.Controls.Add($textBox)
        }
    }

    $btn = New-Object Windows.Forms.Button
    $btn.Text = "Salvar"
    $btn.Location = New-Object Drawing.Point(10, 420)
    $btn.Size = New-Object Drawing.Size(360, 30)
    $btn.Add_Click({
        $manifestacao = @{
            nome      = $campos["Nome"].Text
            email     = $campos["Email"].Text
            tipo      = $campos["Tipo"].SelectedItem
            setor     = $campos["Setor"].Text
            descricao = $campos["Descrição"].Text
            data      = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            protocolo = [guid]::NewGuid().ToString()
        }

        $jsonSemHash = $manifestacao | ConvertTo-Json -Depth 5
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonSemHash)
        $sha = [System.Security.Cryptography.SHA256]::Create()
        $hash = [BitConverter]::ToString($sha.ComputeHash($bytes)) -replace "-", ""
        $manifestacao["assinatura"] = $hash

        if (!(Test-Path ".\ouvidoria")) { New-Item -ItemType Directory -Path ".\ouvidoria" | Out-Null }
        $manifestacao | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 ".\ouvidoria\$($manifestacao.protocolo).json"

        [System.Windows.Forms.MessageBox]::Show("Manifestação salva com sucesso!", "Sucesso", "OK", "Information")
        $form.Close()
    })
    $form.Controls.Add($btn)
    $form.ShowDialog()
}

# --------------------- VALIDAÇÃO ---------------------
function Validar-Manifestacao {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Security

    $file = (New-Object System.Windows.Forms.OpenFileDialog -Property @{InitialDirectory=".\ouvidoria"; Filter="JSON|*.json"})
    if ($file.ShowDialog() -eq "OK") {
        $data = Get-Content $file.FileName -Raw | ConvertFrom-Json
        $hashOriginal = $data.assinatura
        $data.PSObject.Properties.Remove("assinatura")
        $jsonSemHash = $data | ConvertTo-Json -Depth 5
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonSemHash)
        $sha = [System.Security.Cryptography.SHA256]::Create()
        $novoHash = [BitConverter]::ToString($sha.ComputeHash($bytes)) -replace "-", ""

        if ($hashOriginal -eq $novoHash) {
            [System.Windows.Forms.MessageBox]::Show("Assinatura válida!", "Verificação", "OK", "Information")
        } else {
            [System.Windows.Forms.MessageBox]::Show("Assinatura inválida!", "Erro", "OK", "Error")
        }
    }
}

# --------------------- VISUALIZAÇÃO ---------------------
function Visualizar-Manifestacoes {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Visualizar Manifestações"
    $form.Size = New-Object System.Drawing.Size(600, 500)
    $form.StartPosition = "CenterScreen"

    $listBox = New-Object System.Windows.Forms.ListBox
    $listBox.Size = New-Object System.Drawing.Size(560, 200)
    $listBox.Location = New-Object System.Drawing.Point(10, 10)

    $textBox = New-Object System.Windows.Forms.TextBox
    $textBox.Multiline = $true
    $textBox.ScrollBars = "Vertical"
    $textBox.Size = New-Object System.Drawing.Size(560, 200)
    $textBox.Location = New-Object System.Drawing.Point(10, 220)

    $form.Controls.Add($listBox)
    $form.Controls.Add($textBox)

    Get-ChildItem .\ouvidoria\*.json | ForEach-Object {
        $listBox.Items.Add($_.FullName)
    }

    $listBox.Add_SelectedIndexChanged({
        $selectedPath = $listBox.SelectedItem
        if ($selectedPath) {
            $textBox.Text = Get-Content $selectedPath -Raw
        }
    })

    $form.Topmost = $true
    $form.ShowDialog()
}

# --------------------- EXPORTAÇÃO ---------------------
function Exportar-Manifestacao {
    Add-Type -AssemblyName System.Windows.Forms
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.InitialDirectory = ".\ouvidoria"
    $dialog.Filter = "JSON|*.json"

    if ($dialog.ShowDialog() -eq "OK") {
        $data = Get-Content $dialog.FileName -Raw | ConvertFrom-Json
        $base = [IO.Path]::GetFileNameWithoutExtension($dialog.FileName)
        $html = @"
<html><head><meta charset='UTF-8'><title>Manifestação</title></head><body>
<h2>Manifestação - $($data.tipo)</h2>
<p><strong>Nome:</strong> $($data.nome)</p>
<p><strong>Email:</strong> $($data.email)</p>
<p><strong>Descrição:</strong><br/>$($data.descricao)</p>
<p><strong>Setor:</strong> $($data.setor)</p>
<p><strong>Data:</strong> $($data.data)</p>
<p><strong>Assinatura:</strong><br/><code>$($data.assinatura)</code></p>
</body></html>
"@
        $html | Out-File -Encoding UTF8 ".\ouvidoria\$base.html"
        ($data | ConvertTo-Xml -As String -Depth 5) | Out-File -Encoding UTF8 ".\ouvidoria\$base.xml"
        [System.Windows.Forms.MessageBox]::Show("Exportado com sucesso!", "Exportar", "OK", "Information")
    }
}

# --------------------- RESPOSTA ---------------------
function Responder-Manifestacao {
    Add-Type -AssemblyName System.Windows.Forms
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.InitialDirectory = ".\ouvidoria"
    $dialog.Filter = "JSON|*.json"

    if ($dialog.ShowDialog() -eq "OK") {
        $manifestacao = Get-Content $dialog.FileName -Raw | ConvertFrom-Json
        $form = New-Object Windows.Forms.Form
        $form.Text = "Responder Manifestação - Protocolo: $($manifestacao.protocolo)"
        $form.Size = New-Object Drawing.Size(500, 400)

        $label = New-Object Windows.Forms.Label
        $label.Text = "Resposta ao cidadão:"
        $label.Location = New-Object Drawing.Point(10, 10)
        $label.Size = New-Object Drawing.Size(300, 20)
        $form.Controls.Add($label)

        $txt = New-Object Windows.Forms.TextBox
        $txt.Multiline = $true
        $txt.ScrollBars = "Vertical"
        $txt.Location = New-Object Drawing.Point(10, 40)
        $txt.Size = New-Object Drawing.Size(460, 250)
        $form.Controls.Add($txt)

        $btn = New-Object Windows.Forms.Button
        $btn.Text = "Salvar Resposta"
        $btn.Location = New-Object Drawing.Point(10, 300)
        $btn.Size = New-Object Drawing.Size(460, 30)
        $btn.Add_Click({
            $manifestacao.resposta = @{ texto = $txt.Text; data = (Get-Date).ToString("s") }
            $manifestacao | ConvertTo-Json -Depth 5 | Out-File -Encoding UTF8 $dialog.FileName
            [Windows.Forms.MessageBox]::Show("Resposta salva.", "Sucesso")
            $form.Close()
        })
        $form.Controls.Add($btn)
        $form.ShowDialog()
    }
}

# --------------------- EMAIL ---------------------
function Enviar-Manifestacao-PorEmail {
    Add-Type -AssemblyName System.Windows.Forms
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.InitialDirectory = ".\ouvidoria"
    $dialog.Filter = "JSON|*.json"

    if ($dialog.ShowDialog() -eq "OK") {
        $m = Get-Content $dialog.FileName -Raw | ConvertFrom-Json
        $smtpServer = "smtp.seuservidor.com"
        $smtpUser = "secretaria@seusite.com"
        $smtpPass = "SENHA_AQUI"
        $from = $smtpUser
        $to = $m.email
        $subj = "Resposta à sua manifestação - Protocolo $($m.protocolo)"
        $body = "Prezado(a) $($m.nome),`nSua manifestação foi respondida:`n$($m.resposta.texto)`nObrigado."

        Send-MailMessage -From $from -To $to -Subject $subj -Body $body -SmtpServer $smtpServer -Port 587 -UseSsl `
            -Credential (New-Object PSCredential($smtpUser, (ConvertTo-SecureString $smtpPass -AsPlainText -Force)))
        [System.Windows.Forms.MessageBox]::Show("Email enviado!", "Sucesso")
    }
}

# --------------------- MENU ---------------------
function Menu-Ouvidoria {
    do {
        Clear-Host
        Write-Host "===== MENU OUVIDORIA =====" -ForegroundColor Cyan
        Write-Host "1. Registrar manifestação"
        Write-Host "2. Visualizar manifestações"
        Write-Host "3. Exportar para HTML/XML"
        Write-Host "4. Responder manifestação"
        Write-Host "5. Enviar por e-mail"
        Write-Host "0. Voltar ao menu principal"
        $opt = Read-Host "Escolha uma opção"
        
        switch ($opt) {
            "1" { Registrar-Manifestacao }
            "2" { Visualizar-Manifestacoes }
            "3" { Exportar-Manifestacoes }
            "4" { Responder-Manifestacao }
            "5" { Enviar-ManifestacaoEmail }
            "0" { Write-Host "Voltando..." }
            default { Write-Host "Opção inválida." -ForegroundColor Red }
        }

        Pause
    } while ($opt -ne "0")
}

# Executar menu ao carregar
Menu-Ouvidoria