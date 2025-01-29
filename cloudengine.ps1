# cloudengine.ps1
param (
    [string]$function = "",
    [string]$mensagem = "",
    [string]$return_code = "",
    [string]$type_server = ""
)

Write-Host "Mensagem: $type_server"
Write-Host "Function: $function"
Write-Host "Mensagem: $mensagem"
Write-Host "Return Code: $return_code"

if($type_server == "typescript"){
    Write-Host "TypeScript"
}
elseif ($type_server == "python"){
    Write-Host "Python"
}