!define PRODUCT_NAME "Secretaria Virtual"
!define EXE_NAME "secretaria_virtual.exe"
!define INSTALL_DIR "$PROGRAMFILES\Secretaria Virtual"
!define ICON_FILE "icone.ico"

OutFile "Instalador_Secretaria_Virtual.exe"
InstallDir "${INSTALL_DIR}"
SetCompressor /SOLID lzma

ShowInstDetails show
ShowUnInstDetails show

Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles

Section "Instalar ${PRODUCT_NAME}" SEC01
    ; === Criação de pastas e cópia dos arquivos ===
    CreateDirectory "$INSTDIR\config"
    CreateDirectory "$INSTDIR\logs"
    CreateDirectory "$INSTDIR\relatorios"
    CreateDirectory "$INSTDIR\logs\auditoria"
    CreateDirectory "$INSTDIR\logs\report"
    CreateDirectory "$INSTDIR\relatorios\json"
    CreateDirectory "$INSTDIR\relatorios\webpage"

    SetOutPath "$INSTDIR"
    File "${EXE_NAME}"
    File "${ICON_FILE}"
    File "ConsultaMedica.ps1"
    File "Paciente.ps1"
    File "ReceitaMedica.ps1"

    SetOutPath "$INSTDIR\config"
    File "config\Configuracao.ps1"
    File "config\auditoria.ps1"
    File "config\executar.ps1"
    File "config\homologar.ps1"

    ; === Atalho na área de trabalho ===
    CreateShortcut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "" "$INSTDIR\${ICON_FILE}"

    ; === Criar desinstalador ===
    WriteUninstaller "$INSTDIR\Uninstall.exe"

    ; === Registro para desinstalação ===
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "Felipe Rodrigues dos Santos"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "1.0.0"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "URLInfoAbout" "mailto:felipersantos1988@gmail.com"
SectionEnd

Section "Uninstall" uninstall
    Delete "$INSTDIR\${EXE_NAME}"
    Delete "$INSTDIR\${ICON_FILE}"
    Delete "$INSTDIR\MenuConsultaMedica.ps1"
    Delete "$INSTDIR\MenuPaciente.ps1"
    Delete "$INSTDIR\MenuReceitaMedica.ps1"
    Delete "$INSTDIR\Uninstall.exe"
    Delete "$DESKTOP\${PRODUCT_NAME}.lnk"

    Delete "$INSTDIR\config\Configuracao.ps1"
    Delete "$INSTDIR\config\auditoria.ps1"
    Delete "$INSTDIR\config\executar.ps1"
    Delete "$INSTDIR\config\homologar.ps1"

    RMDir /r "$INSTDIR\config"
    RMDir /r "$INSTDIR\logs"
    RMDir /r "$INSTDIR\relatorios"
    RMDir "$INSTDIR"

    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd