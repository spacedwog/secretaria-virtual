[System.Threading.Thread]::CurrentThread.CurrentCulture = 'pt-BR'
[System.Threading.Thread]::CurrentThread.CurrentUICulture = 'pt-BR'

Invoke-PS2EXE `
  -InputFile "MenuPrincipal.ps1" `
  -OutputFile "secretaria_virtual.exe" `
  -Title "Secretaria Virtual" `
  -Description "IA - Software para uma secretaria virtual com Nuvem." `
  -Company "Spacedwog" `
  -Product "Sistema Medico Virtual" `
  -Version "1.0.0.0" `
  -Copyright "© 2025 Felipe Rodrigues dos Santos (felipersantos1988@gmail.com). Todos os direitos reservados." `
  -noConsole `
  -IconFile "icone.ico" `
  -Verbose