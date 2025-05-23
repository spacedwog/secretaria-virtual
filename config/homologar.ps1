$FilePath = "./compilar.ps1"
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
        Write-Host "[FALHA] Arquivo NAO encontrado: $FilePath" -ForegroundColor Red
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
        if (-Not (Test-Path $FilePath)) {
            Write-Host "[FALHA] Arquivo nao encontrado: $FilePath" -ForegroundColor Red
            return $false
        }

        $acl = Get-Acl -Path $FilePath
        $userIdentity = [System.Security.Principal.WindowsIdentity]::GetCurrent()
        $user = $userIdentity.Name
        $userGroups = $userIdentity.Groups | ForEach-Object {
            try {
                $_.Translate([System.Security.Principal.NTAccount])
            } catch {
                # Ignora grupos que não podem ser traduzidos
                $null
            }
        }

        $hasExecute = $false

        foreach ($access in $acl.Access) {
            $target = $access.IdentityReference

            # Verifica se a entrada de acesso se aplica ao usuário ou a um dos seus grupos
            $isMatch = ($target -eq $user) -or ($userGroups -contains $target)

            if ($isMatch -and $access.AccessControlType -eq "Allow") {
                if ($access.FileSystemRights.ToString().Contains("ReadAndExecute") -or
                    $access.FileSystemRights.ToString().Contains("FullControl") -or
                    $access.FileSystemRights.ToString().Contains("ExecuteFile")) {
                    $hasExecute = $true
                    break
                }
            }
        }

        if ($hasExecute) {
            Write-Host "[OK] Permissao de execucao concedida para '$user' (ou grupo relacionado) em: $FilePath" -ForegroundColor Green
            return $true
        } else {
            Write-Host "[FALHA] Permissao de execucao NAO encontrada para '$user' ou seus grupos em: $FilePath" -ForegroundColor Red
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

$exePath = "./index.exe"

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

& .\config\auditoria.ps1

Write-Host "`n=== Fim da Homologacao ===`n"