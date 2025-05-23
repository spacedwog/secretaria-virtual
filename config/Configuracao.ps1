Add-Type -AssemblyName System.Windows.Forms

# Detecta caminho absoluto corretamente, mesmo se for .exe
$basePath = Split-Path -Parent ([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)

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
        "$basePath",
        "logs\report\relatorio_auditoria.json",
        "logs\auditoria\auditoria_log.txt"
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

# Exibe um resumo das configurações
Write-Host "`n[RESUMO DA CONFIGURACAO]" -ForegroundColor Green
Write-Host "Diretorio Alvo   : $diretorio" -ForegroundColor Cyan
Write-Host "Relatorio JSON   : $relatorioCompleto" -ForegroundColor Cyan
Write-Host "Log de Auditoria : $logCompleto" -ForegroundColor Cyan

# Persiste as configurações em um arquivo JSON
$configPath = Join-Path $diretorio "configuracao_auditoria.json"
try {
    $config | ConvertTo-Json -Depth 3 | Out-File $configPath -Encoding UTF8
    Write-Host "[INFO] Configuracao salva em: $configPath" -ForegroundColor Green
} catch {
    Write-Host "[ERRO] Falha ao salvar configuracao em JSON." -ForegroundColor Red
}

Write-Host "`n[INFO] Executando script de auditoria com os parametros fornecidos..." -ForegroundColor Cyan

# Executa o script externo passando parâmetros corretamente
powershell -ExecutionPolicy Bypass -File ".\config\auditoria.ps1" `
    -DiretorioAlvo "$diretorio" `
    -RelatorioSaida "$relatorioCompleto" `
    -LogSaida "$logCompleto"