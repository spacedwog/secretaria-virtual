!include "MUI2.nsh"

; Definições
!define PRODUCT_NAME "Secretaria Virtual"
!define PUBLISHER_NAME "Spacedwog"
!define EXE_NAME "index.exe"
!define INSTALL_DIR "$PROGRAMFILES\${PRODUCT_NAME}"
!define ICON_FILE "icone.ico"
!define MUI_ICON "${ICON_FILE}"
!define MUI_UNICON "${ICON_FILE}"
!define MUI_LANGUAGE "PortugueseBR"
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchApp"
!define MUI_FINISHPAGE_RUN_TEXT "Executar Secretaria Virtual agora"

; Nome do instalador
OutFile "Instalador.exe"
InstallDir "${INSTALL_DIR}"
SetCompressor /SOLID lzma

; Interface do Instalador
Name "${PRODUCT_NAME}"
Caption "${PRODUCT_NAME}"
BrandingText "Desenvolvido por ${PUBLISHER_NAME}"

; Páginas
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Idioma
!insertmacro MUI_LANGUAGE "PortugueseBR"

; Função para executar o app após instalação
Function LaunchApp
    Exec "$INSTDIR\${EXE_NAME}"
FunctionEnd

; Instalação
Section "Instalar ${PRODUCT_NAME}" SEC01
    SetOutPath "$INSTDIR"
    File "${EXE_NAME}"
    File "${ICON_FILE}"
    File "ConsultaMedica.ps1"
    File "Paciente.ps1"
    File "ReceitaMedica.ps1"

    SetOutPath "$INSTDIR\config"
    CreateDirectory "$INSTDIR\config"
    File "Configuracao.ps1"
    File "auditoria.ps1"
    File "executar.ps1"
    File "homologar.ps1"

    CreateDirectory "$INSTDIR\logs"
    CreateDirectory "$INSTDIR\logs\auditoria"
    CreateDirectory "$INSTDIR\logs\report"

    CreateDirectory "$INSTDIR\relatorios"
    CreateDirectory "$INSTDIR\relatorios\json"
    CreateDirectory "$INSTDIR\relatorios\webpage"

    CreateShortcut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "$INSTDIR\${ICON_FILE}"

    WriteUninstaller "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\\Uninstall\${PRODUCT_NAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\\Uninstall\${PRODUCT_NAME}" "Publisher" "Felipe Rodrigues dos Santos"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "1.0.0"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\\Uninstall\${PRODUCT_NAME}" "URLInfoAbout" "mailto:felipersantos1988@gmail.com"
SectionEnd

; Desinstalação
Section "Uninstall"
    Delete "$INSTDIR\${EXE_NAME}"
    Delete "$INSTDIR\${ICON_FILE}"
    Delete "$INSTDIR\ConsultaMedica.ps1"
    Delete "$INSTDIR\Paciente.ps1"
    Delete "$INSTDIR\ReceitaMedica.ps1"
    Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
    Delete "$INSTDIR\Uninstall.exe"

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