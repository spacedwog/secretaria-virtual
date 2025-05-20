Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Carregar DLL iTextSharp
$dllPath = ".\itextsharp.dll"  # ajuste o caminho se necessário
Add-Type -Path $dllPath

function ExportarRelatorioPDF {
    param(
        [string]$filePath,
        [string]$titulo,
        [string[]]$conteudo
    )
    
    $doc = New-Object iTextSharp.text.Document
    $writer = [iTextSharp.text.pdf.PdfWriter]::GetInstance($doc, [System.IO.File]::Create($filePath))
    $doc.Open()

    $fontTitle = [iTextSharp.text.FontFactory]::GetFont("Arial", 16, [iTextSharp.text.Font]::BOLD)
    $titleParagraph = New-Object iTextSharp.text.Paragraph($titulo, $fontTitle)
    $titleParagraph.Alignment = [iTextSharp.text.Element]::ALIGN_CENTER
    $doc.Add($titleParagraph)

    $fontContent = [iTextSharp.text.FontFactory]::GetFont("Arial", 12)
    foreach ($line in $conteudo) {
        $p = New-Object iTextSharp.text.Paragraph($line, $fontContent)
        $p.SpacingBefore = 10
        $doc.Add($p)
    }

    $doc.Close()
    $writer.Close()
}

function Relatorio-Pacientes {
    $relatorioConteudo = @(
        "Paciente 1: João Silva, 35 anos, joao@email.com",
        "Paciente 2: Maria Oliveira, 28 anos, maria@email.com",
        "Paciente 3: Carlos Souza, 42 anos, carlos@email.com"
    )

    $fileName = "$env:USERPROFILE\Desktop\RelatorioPacientes.pdf"
    ExportarRelatorioPDF -filePath $fileName -titulo "Relatório de Pacientes" -conteudo $relatorioConteudo

    [System.Windows.Forms.MessageBox]::Show("Relatório de Pacientes exportado para:`n$fileName")
}

function Relatorio-Consultas {
    $jsonPath = ".\consultas.json"
    if (-not (Test-Path $jsonPath)) {
        [System.Windows.Forms.MessageBox]::Show("Arquivo consultas.json nao encontrado.")
        return
    }
    $consultas = Get-Content $jsonPath | ConvertFrom-Json
    $conteudo = @()
    foreach ($c in $consultas) {
        $linha = "ID: $($c.id), Paciente: $($c.paciente), Doutor: $($c.doutor), Data: $($c.data) $($c.hora), Motivo: $($c.motivo), Status: $($c.status)"
        $conteudo += $linha
    }

    $fileName = "$env:USERPROFILE\Desktop\RelatorioConsultas.pdf"
    ExportarRelatorioPDF -filePath $fileName -titulo "Relatorio de Consultas Medicas" -conteudo $conteudo

    [System.Windows.Forms.MessageBox]::Show("Relatorio de Consultas exportado para:`n$fileName")
}

function Relatorio-Receitas {
    $jsonPath = ".\receitas.json"
    if (-not (Test-Path $jsonPath)) {
        [System.Windows.Forms.MessageBox]::Show("Arquivo receitas.json nao encontrado.")
        return
    }
    $receitas = Get-Content $jsonPath | ConvertFrom-Json
    $conteudo = @()
    foreach ($r in $receitas) {
        $meds = $r.medicamentos -join ", "
        $linha = "ID: $($r.id), Paciente: $($r.paciente), Doutor: $($r.doutor), Medicamentos: $meds, Data: $($r.data)"
        $conteudo += $linha
    }

    $fileName = "$env:USERPROFILE\Desktop\RelatorioReceitas.pdf"
    ExportarRelatorioPDF -filePath $fileName -titulo "Relatorio de Receitas e" -conteudo $conteudo

    [System.Windows.Forms.MessageBox]::Show("Relatorio de Receitas exportado para:`n$fileName")
}

# Janela principal do Menu de Relatórios
$form = New-Object System.Windows.Forms.Form
$form.Text = "Menu de Relatorios"
$form.Size = New-Object System.Drawing.Size(350, 250)
$form.StartPosition = "CenterScreen"

$btn1 = New-Object System.Windows.Forms.Button
$btn1.Text = "1. Relatorio de Pacientes"
$btn1.Size = New-Object System.Drawing.Size(300, 40)
$btn1.Location = New-Object System.Drawing.Point(20, 20)
$btn1.Add_Click({ Relatorio-Pacientes })

$btn2 = New-Object System.Windows.Forms.Button
$btn2.Text = "2. Relatorio de Consultas"
$btn2.Size = New-Object System.Drawing.Size(300, 40)
$btn2.Location = New-Object System.Drawing.Point(20, 70)
$btn2.Add_Click({ Relatorio-Consultas })

$btn3 = New-Object System.Windows.Forms.Button
$btn3.Text = "3. Relatorio de Receitas"
$btn3.Size = New-Object System.Drawing.Size(300, 40)
$btn3.Location = New-Object System.Drawing.Point(20, 120)
$btn3.Add_Click({ Relatorio-Receitas })

$btnBack = New-Object System.Windows.Forms.Button
$btnBack.Text = "Voltar"
$btnBack.Size = New-Object System.Drawing.Size(300, 40)
$btnBack.Location = New-Object System.Drawing.Point(20, 170)
$btnBack.Add_Click({ $form.Close() })

$form.Controls.AddRange(@($btn1, $btn2, $btn3, $btnBack))

[void]$form.ShowDialog()