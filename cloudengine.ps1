# cloudengine.ps1
param (
    [string]$function = "",
    [string]$mensagem = "",
    [int]$return_code = 0,
    [string]$type_server = ""
)

# Caminho do script Python
$pythonScript = "C:\users\felip\secretaria-virtual\Cloud-dev\blackboard.py"

# Executa o script Python e captura a saída JSON
$saida = $saida.Trim()
$saida = python $pythonScript $function $mensagem $return_code $type_server

Write-Output "Saída bruta do Python: $saida"

if ($saida -match "^{.*}$") {

    $resultado = $saida | ConvertFrom-Json

    Write-Host "pythonScript: $pythonScript"
    Write-Host "type_server: $type_server"
    Write-Host "Function: $function"
    Write-Host "Mensagem: $mensagem"
    Write-Host "Return Code: $return_code"

} else {
    Write-Output "Erro: Saída do Python não é JSON válido. Conteúdo: $saida"
}