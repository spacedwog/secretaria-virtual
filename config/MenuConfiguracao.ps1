Add-Type -AssemblyName System.Windows.Forms

function MenuConfiguracaoAuditoria {
    [System.Windows.Forms.Application]::EnableVisualStyles()

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Configuracao do Relatorio de Auditoria"
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
            DiretorioAlvo   = $textboxes[0].Text.Trim()
            RelatorioSaida  = $textboxes[1].Text.Trim()
            LogSaida        = $textboxes[2].Text.Trim()
        }
    } else {
        Write-Host "[CANCELADO] Configuracao cancelada pelo usuario." -ForegroundColor Yellow
        exit
    }
}

# === EXECUÇÃO ===
$config = MenuConfiguracaoAuditoria

# Constrói caminhos absolutos
$diretorio = $config.DiretorioAlvo
$relatorioCompleto = Join-Path $diretorio $config.RelatorioSaida
$logCompleto = Join-Path $diretorio $config.LogSaida

Write-Host "`n[INFO] Executando script de auditoria com os parametros fornecidos..." -ForegroundColor Cyan

# Executa o script externo passando parâmetros corretamente
powershell -ExecutionPolicy Bypass -File ".\config\auditoria.ps1" `
    -DiretorioAlvo "$diretorio" `
    -RelatorioSaida "$relatorioCompleto" `
    -LogSaida "$logCompleto"