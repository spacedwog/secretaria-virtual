# cloudengine.ps1
param (
    [string]$function = "",
    [string]$mensagem = "",
    [string]$return_code = ""
)

Write-Host "$function"
Write-Host "$mensagem"
Write-Host "$return_code"