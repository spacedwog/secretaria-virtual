Add-Type -AssemblyName System.Windows.Forms

# === AUXILIARES ===
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("Gdi32.dll", EntryPoint = "CreateRoundRectRgn")]
    public static extern IntPtr CreateRoundRectRgn(
        int nLeftRect, int nTopRect, int nRightRect, int nBottomRect,
        int nWidthEllipse, int nHeightEllipse);
}
"@

$basePath = Split-Path -Parent ([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)

function EstilizarBotao($botao) {
    $botao.FlatStyle = 'Flat'
    $botao.BackColor = [System.Drawing.Color]::FromArgb(173, 216, 230)
    $botao.ForeColor = [System.Drawing.Color]::Black
    $botao.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $botao.FlatAppearance.BorderSize = 0
    $botao.Region = [System.Drawing.Region]::FromHrgn(
        [Win32]::CreateRoundRectRgn(0, 0, $botao.Width, $botao.Height, 20, 20)
    )
}

function RegistrarAuditoria {
    param (
        [string]$mensagem,
        [string]$logPath
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $linha = "$timestamp - $mensagem"

    try {
        Add-Content -Path $logPath -Value $linha
    } catch {
        Write-Host "[ERRO] Falha ao registrar auditoria: $_" -ForegroundColor Red
    }
}

function AssinarLogDigitalmente {
    param (
        [string]$logPath,
        [string]$hashOutput
    )

    try {
        $hash = Get-FileHash -Path $logPath -Algorithm SHA256
        $assinatura = "SHA256: $($hash.Hash)"
        Set-Content -Path $hashOutput -Value $assinatura
        Write-Host "[INFO] Assinatura digital registrada em: $hashOutput" -ForegroundColor Green
        RegistrarAuditoria -mensagem "Assinatura digital do log gerada." -logPath $logPath
    } catch {
        Write-Host "[ERRO] Falha ao gerar assinatura digital: $_" -ForegroundColor Red
    }
}

function MonitorarAlteracoes {
    param (
        [string]$pasta,
        [string]$logPath
    )

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $pasta
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true
    $watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite'

    Register-ObjectEvent $watcher "Changed" -Action {
        $evento = $Event.SourceEventArgs
        RegistrarAuditoria -mensagem "Arquivo alterado: $($evento.FullPath)" -logPath $logPath
    }

    Register-ObjectEvent $watcher "Created" -Action {
        $evento = $Event.SourceEventArgs
        RegistrarAuditoria -mensagem "Arquivo criado: $($evento.FullPath)" -logPath $logPath
    }

    Register-ObjectEvent $watcher "Deleted" -Action {
        $evento = $Event.SourceEventArgs
        RegistrarAuditoria -mensagem "Arquivo deletado: $($evento.FullPath)" -logPath $logPath
    }

    Write-Host "[INFO] Monitoramento de alterações iniciado em: $pasta" -ForegroundColor Green
}

function MenuConfiguracaoAuditoria {
    [System.Windows.Forms.Application]::EnableVisualStyles()

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Configuracao do Relatorio de Auditoria"
    $form.Size = [System.Drawing.Size]::new(600, 220)
    $form.StartPosition = "CenterScreen"

    $labels = @("Diretorio Alvo:", "Relatorio JSON:", "Log de Auditoria:")
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
    $okButton.Text = "Auditoria"
    $okButton.Location = [System.Drawing.Point]::new(370, 150)
    $okButton.Add_Click({
        $form.DialogResult = [System.Windows.Forms.DialogResult]::OK
        $form.Close()
    })
    EstilizarBotao $okButton
    $form.Controls.Add($okButton)

    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Text = "Cancelar"
    $cancelButton.Location = [System.Drawing.Point]::new(470, 150)
    $cancelButton.Add_Click({
        $form.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
        $form.Close()
    })
    EstilizarBotao $cancelButton
    $form.Controls.Add($cancelButton)

    $result = $form.ShowDialog()

    $logTemp = Join-Path $basePath "logs\auditoria\auditoria_log.txt"
    if (-not (Test-Path (Split-Path $logTemp))) {
        New-Item -ItemType Directory -Path (Split-Path $logTemp) -Force | Out-Null
    }

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        RegistrarAuditoria -mensagem "Configuração confirmada pelo usuário." -logPath $logTemp
        return @{
            DiretorioAlvo   = $textboxes[0].Text.Trim()
            RelatorioSaida  = $textboxes[1].Text.Trim()
            LogSaida        = $textboxes[2].Text.Trim()
        }
    } else {
        RegistrarAuditoria -mensagem "Usuário cancelou a configuração." -logPath $logTemp
        Write-Host "[CANCELADO] Configuracao cancelada pelo usuario." -ForegroundColor Yellow
        exit
    }
}

# === EXECUÇÃO ===
$config = MenuConfiguracaoAuditoria

$diretorio = $config.DiretorioAlvo
$relatorioCompleto = Join-Path $diretorio $config.RelatorioSaida
$logCompleto = Join-Path $diretorio $config.LogSaida
$assinaturaPath = "assinatura.txt"

Write-Host "`n[RESUMO DA CONFIGURACAO]" -ForegroundColor Green
Write-Host "Diretorio Alvo   : $diretorio" -ForegroundColor Cyan
Write-Host "Relatorio JSON   : $relatorioCompleto" -ForegroundColor Cyan
Write-Host "Log de Auditoria : $logCompleto" -ForegroundColor Cyan

$configPath = Join-Path $diretorio "configuracao_auditoria.json"
if (-not (Test-Path (Split-Path $configPath))) {
    New-Item -ItemType Directory -Path (Split-Path $configPath) -Force | Out-Null
}
$config | ConvertTo-Json -Depth 3 | Out-File $configPath -Encoding UTF8
RegistrarAuditoria -mensagem "Configuração salva em JSON: $configPath" -logPath $logCompleto

Write-Host "`n[INFO] Executando script de auditoria..." -ForegroundColor Cyan
powershell -ExecutionPolicy Bypass -File ".\config\auditoria.ps1" `
    -DiretorioAlvo "$diretorio" `
    -RelatorioSaida "$relatorioCompleto" `
    -LogSaida "$logCompleto"

RegistrarAuditoria -mensagem "Script de auditoria executado." -logPath $logCompleto

# Iniciar monitoramento em tempo real
MonitorarAlteracoes -pasta $diretorio -logPath $logCompleto

# Gerar assinatura digital do log
AssinarLogDigitalmente -logPath $logCompleto -hashOutput $assinaturaPath