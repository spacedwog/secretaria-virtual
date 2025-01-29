# cloudengine.ps1
param (
    [string]$function = "",
    [string]$mensagem = "",
    [string]$return_code = "",
    [string]$type_server = ""
)

# Caminho do script Python
$pythonScript = "C:\users\felip\secretaria-virtual\Cloud-dev\blackboard.py"

# Executa o script Python e captura a saída JSON
$saida = python $pythonScript $function $mensagem $return_code $type_server

# Converte a saída JSON para um objeto PowerShell
$resultado = $saida | ConvertFrom-Json

# Exibe a saída formatada

Write-Host "type_server: $type_server"
Write-Host "Function: $function"
Write-Host "Mensagem: $mensagem"
Write-Host "Return Code: $return_code"

if($type_server -eq "typescript"){
    Write-Host "TypeScript"
}
elseif ($type_server -eq "python"){
    Write-Host "Python"
}