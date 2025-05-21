param (
    [string]$DiretorioAlvo = "C:\Users\felip\secretaria-virtual",
    [string]$RelatorioSaida = ".\relatorios\relatorio_auditoria.json",
    [string]$LogSaida = ".\relatorios\auditoria_log.txt"
)

function Get_FileHashInfo {
    param (
        [string]$Path
    )
    $hash = Get-FileHash -Algorithm SHA256 -Path $Path
    return @{
        Caminho = $Path
        NomeArquivo = [System.IO.Path]::GetFileName($Path)
        TamanhoKB = [Math]::Round((Get-Item $Path).Length / 1KB, 2)
        DataUltimaModificacao = (Get-Item $Path).LastWriteTime
        HashSHA256 = $hash.Hash
    }
}

function Registrar_Log {
    param (
        [string]$Mensagem
    )
    $linha = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Mensagem"
    Add-Content -Path $LogSaida -Value $linha
    Write-Host $linha
}

# Verificação inicial
if (-Not (Test-Path $DiretorioAlvo)) {
    Write-Host "[FALHA] Diretório não encontrado: $DiretorioAlvo" -ForegroundColor Red
    exit 1
}

Registrar_Log "🔍 Iniciando auditoria em: $DiretorioAlvo"
$arquivos = Get-ChildItem -Path $DiretorioAlvo -File -Recurse

$resultados = @()

foreach ($arquivo in $arquivos) {
    try {
        $info = Get_FileHashInfo -Path $arquivo.FullName
        $resultados += $info
        Registrar_Log "✅ Auditado: $($info.NomeArquivo) - Hash: $($info.HashSHA256.Substring(0,8))..."
    }
    catch {
        Registrar_Log "❌ Falha ao auditar '$($arquivo.FullName)': $_"
    }
}

# Exportar para JSON
$resultados | ConvertTo-Json -Depth 3 | Out-File -FilePath $RelatorioSaida -Encoding UTF8
Registrar_Log "📄 Relatório JSON salvo em: $RelatorioSaida"

# Também salva um relatório texto simples
$relatorioTexto = $resultados | ForEach-Object {
    "$($_.NomeArquivo) | $($_.TamanhoKB) KB | $($_.DataUltimaModificacao) | $($_.HashSHA256.Substring(0,8))..."
}
$relatorioTexto | Out-File -FilePath ($RelatorioSaida -replace '.json$', '.txt')
Registrar_Log "📄 Relatório TXT salvo em: $($RelatorioSaida -replace '.json$', '.txt')"

Registrar_Log "✅ Auditoria concluída."