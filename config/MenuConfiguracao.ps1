Add-Type -AssemblyName System.Windows.Forms

function MenuConfiguracaoAuditoria {
    [System.Windows.Forms.Application]::EnableVisualStyles()

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Configuração do Relatorio de Auditoria"
    $form.Size = [System.Drawing.Size]::new(600, 220)
    $form.StartPosition = "CenterScreen"

    $labels = @(
        "Diretorio Alvo:",
        "Relatorio JSON:",
        "Log de Auditoria:"
    )
    $defaultValues = @(
        "C:\Users\felip\secretaria-virtual",
        "relatorios\json\relatorio_auditoria.json",
        "relatorios\log\auditoria_log.txt"
    )

    $textboxes = @()

    for ($i = 0; $i -lt $labels.Count; $i++) {
        $label = New-Object System.Windows.Forms.Label
        $label.Text = $labels[$i]
        $label.Location = [System.Drawing.Point]::new(10, 20 + ($i * 40))
        $label.Size = [System.Drawing.Size]::new(150, 20)
        $form.Controls.Add($label)

        $textbox = New-Object System.Windows.Forms.TextBox
        $textbox.Text = $defaultValues[$i]
        $textbox.Location = [System.Drawing.Point]::new(170, 20 + ($i * 40))
        $textbox.Size = [System.Drawing.Size]::new(400, 20)
        $form.Controls.Add($textbox)
        $textboxes += $textbox
    }

    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Text = "Salvar e Executar"
    $okButton.Location = [System.Drawing.Point]::new(370, 150)
    $okButton.Add_Click({
        $form.DialogResult = [System.Windows.Forms.DialogResult]::OK
        $form.Close()
    })
    $form.Controls.Add($okButton)

    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Text = "Cancelar"
    $cancelButton.Location = [System.Drawing.Point]::new(470, 150)
    $cancelButton.Add_Click({
        $form.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
        $form.Close()
    })
    $form.Controls.Add($cancelButton)

    $result = $form.ShowDialog()

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        return @{
            DiretorioAlvo   = $textboxes[0].Text
            RelatorioSaida  = $textboxes[1].Text
            LogSaida        = $textboxes[2].Text
        }
    } else {
        Write-Host "[CANCELADO] Configuracao cancelada pelo usuario." -ForegroundColor Yellow
        exit
    }
}

# === EXECUÇÃO ===
$config = MenuConfiguracaoAuditoria

# Variáveis de ambiente
$env:CONFIG_DIRETORIO = $config.DiretorioAlvo
$env:CONFIG_RELATORIO = $config.RelatorioSaida
$env:CONFIG_LOG = $config.LogSaida

# Executa o script auditoria com variáveis corretamente entre aspas
Write-Host "`n[INFO] Gerando relatório de auditoria..." -ForegroundColor Cyan

$scriptAuditoria = @"
`$DiretorioAlvo = `"$env:CONFIG_DIRETORIO`"
`$RelatorioSaida = `"$env:CONFIG_RELATORIO`"
`$LogSaida = `"$env:CONFIG_LOG`"
. .\config\auditoria.ps1
"@

powershell -ExecutionPolicy Bypass -Command $scriptAuditoria