# cloudengine.ps1
param (
    [string]$function = "",
    [string]$mensagem = "",
    [string]$return_code = ""
)

Write-Host "Function: $function"
Write-Host "Mensagem: $mensagem"
Write-Host "Return Code: $return_code"