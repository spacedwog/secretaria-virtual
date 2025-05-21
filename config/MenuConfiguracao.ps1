Add-Type -AssemblyName System.Windows.Forms

function MenuConfiguracao {
    [System.Windows.Forms.Application]::EnableVisualStyles()

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Menu de Configuracao"
    $form.Size = [System.Drawing.Size]::new(600, 300)
    $form.StartPosition = "CenterScreen"

    $labels = @(
        "Diretorio Alvo:",
        "Relatorio JSON:",
        "Log de Auditoria:",
        "Caminho do Executável:"
    )
    $defaultValues = @(
        "C:\Users\felip\secretaria-virtual",
        "relatorios\json\relatorio_auditoria.json",
        "relatorios\log\auditoria_log.txt",
        "C:\Users\felip\secretaria-virtual\secretaria_virtual.exe"
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
    $okButton.Location = [System.Drawing.Point]::new(370, 200)
    $okButton.Add_Click({
        $form.DialogResult = [System.Windows.Forms.DialogResult]::OK
        $form.Close()
    })
    $form.Controls.Add($okButton)

    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Text = "Cancelar"
    $cancelButton.Location = [System.Drawing.Point]::new(470, 200)
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
            Executavel      = $textboxes[3].Text
        }
    } else {
        Write-Host "[CANCELADO] Configuracao cancelada pelo usuario." -ForegroundColor Yellow
        exit
    }
}

# === EXECUÇÃO ===
$config = MenuConfiguracao

# Passa os parâmetros aos scripts principais
$env:CONFIG_DIRETORIO = $config.DiretorioAlvo
$env:CONFIG_RELATORIO = $config.RelatorioSaida
$env:CONFIG_LOG = $config.LogSaida
$env:CONFIG_EXE = $config.Executavel

# Executa os scripts principais com os parâmetros escolhidos
Write-Host "`n[INFO] Executando scripts com configuracoes personalizadas..." -ForegroundColor Cyan

# AUDITORIA
powershell -ExecutionPolicy Bypass -Command @"
`$DiretorioAlvo = `"$env:CONFIG_DIRETORIO`"
`$RelatorioSaida = `"$env:CONFIG_RELATORIO`"
`$LogSaida = `"$env:CONFIG_LOG`"
. .\config\auditoria.ps1
"@

# EXECUTAR
powershell -ExecutionPolicy Bypass -File .\config\executar.ps1 --% "$env:CONFIG_EXE"

# HOMOLOGAR
powershell -ExecutionPolicy Bypass -File .\config\homologar.ps1