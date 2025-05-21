$FilePath = "C:\Users\felip\secretaria-virtual\compilar.ps1"
# Função: Verifica se um arquivo existe
function Test-FileExists {
    param (
        [Parameter(Mandatory)]
        [string]$FilePath
    )
    if (Test-Path $FilePath) {
        Write-Host "[OK] Arquivo encontrado: $FilePath" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "[FALHA] Arquivo NÃO encontrado: $FilePath" -ForegroundColor Red
        return $false
    }
}

# Função: Verifica se um processo está rodando
function Test-ProcessRunning {
    param (
        [Parameter(Mandatory)]
        [string]$ProcessName
    )
    $proc = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "[OK] Processo '$ProcessName' esta rodando." -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "[FALHA] Processo '$ProcessName' NAO esta rodando." -ForegroundColor Red
        return $false
    }
}

# Função: Testa permissão para executar um arquivo
function Test-ExecutePermission {
    param (
        [Parameter(Mandatory)]
        [string]$FilePath
    )
    try {
        $acl = Get-Acl -Path $FilePath
        # Para simplificar, só verifica se o arquivo não está bloqueado e é executável (extensão .exe, .bat, .ps1)
        if ($FilePath -match "\.(exe|bat|ps1)$") {
            Write-Host "[OK] Permissao para executar arquivo confirmada: $FilePath" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "[AVISO] Arquivo nao tem extensão tipica executavel: $FilePath" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        Write-Host "[FALHA] Erro ao verificar permissao: $_" -ForegroundColor Red
        return $false
    }
}

# Função: Executa um comando e valida saída com expressão regular
function Test-CommandOutput {
    param (
        [Parameter(Mandatory)]
        [string]$Command,
        [Parameter(Mandatory)]
        [string]$ExpectedPattern
    )
    try {
        $output = Invoke-Expression $Command
        if ($output -match $ExpectedPattern) {
            Write-Host "[OK] Comando '$Command' retornou saida esperada." -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "[FALHA] Comando '$Command' NAO retornou saida esperada." -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "[FALHA] Erro ao executar comando: $_" -ForegroundColor Red
        return $false
    }
}

# Função: Mede o tempo para executar um script ou comando
function Test-ResponseTime {
    param (
        [Parameter(Mandatory)]
        [scriptblock]$ScriptBlock,
        [int]$MaxMilliseconds = 1000
    )
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        & $ScriptBlock
        $stopwatch.Stop()
        $elapsed = $stopwatch.ElapsedMilliseconds
        if ($elapsed -le $MaxMilliseconds) {
            Write-Host "[OK] Resposta dentro do tempo ($elapsed ms ≤ $MaxMilliseconds ms)" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "[FALHA] Resposta lenta ($elapsed ms > $MaxMilliseconds ms)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "[FALHA] Erro ao medir tempo de resposta: $_" -ForegroundColor Red
        return $false
    }
}

# --- Exemplo de execução das funções para homologação ---

Write-Host "`n=== Inicio da Homologacao ===`n"

$exePath = "C:\Users\felip\secretaria-virtual\secretaria_virtual.exe"

# 1. Testa se o executável existe
Test-FileExists -FilePath $exePath

# 2. Testa permissão para executar o arquivo
Test-ExecutePermission -FilePath $exePath

# 3. Testa se processo com mesmo nome já está rodando (sem extensão)
$processName = [System.IO.Path]::GetFileNameWithoutExtension($exePath)
Test-ProcessRunning -ProcessName $processName

# 4. Testa executar um comando simples e validar saída
Test-CommandOutput -Command "Get-Date" -ExpectedPattern "\d{4}"

# 5. Mede tempo de resposta de um comando simples
Test-ResponseTime -ScriptBlock { Get-Process | Out-Null } -MaxMilliseconds 500

Write-Host "`n=== Fim da Homologacao ===`n"