!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "WinVer.nsh"

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

OutFile "Instalador.exe"
InstallDir "${INSTALL_DIR}"
RequestExecutionLevel admin
SetCompressor /SOLID lzma

Name "${PRODUCT_NAME}"
Caption "${PRODUCT_NAME}"
BrandingText "Desenvolvido por ${PUBLISHER_NAME}"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "PortugueseBR"

Function LaunchApp
    Exec "$INSTDIR\${EXE_NAME}"
FunctionEnd

Section "Instalar ${PRODUCT_NAME}" SEC01
    SetOutPath "$INSTDIR"
    File "${EXE_NAME}"
    File "${ICON_FILE}"
    File "ConsultaMedica.ps1"
    File "Paciente.ps1"
    File "ReceitaMedica.ps1"

    SetOutPath "$INSTDIR\config"
    CreateDirectory "$INSTDIR\config"
    File "config\Configuracao.ps1"
    File "config\auditoria.ps1"
    File "config\executar.ps1"
    File "config\homologar.ps1"

    CreateDirectory "$INSTDIR\logs\auditoria"
    CreateDirectory "$INSTDIR\logs\report"

    CreateDirectory "$INSTDIR\relatorios\json"
    CreateDirectory "$INSTDIR\relatorios\webpage"

        ; Instalação do driver via devcon.exe
    SetOutPath "$INSTDIR\driver"
    CreateDirectory "$INSTDIR\driver"
    File "driver\devcon.exe"
    File "driver\seu_driver.inf"

        ; Instalação do driver com devcon
    SetOutPath "$INSTDIR\driver"
    CreateDirectory "$INSTDIR\driver"
    File "driver\seu_driver.inf"
    File "driver\null.sys"
    File "driver\devcon.exe"

    DetailPrint "Instalando driver virtual..."
    nsExec::ExecToLog '"$INSTDIR\driver\devcon.exe" install "$INSTDIR\driver\seu_driver.inf" ROOT\MyVirtualDevice'
    Pop $0
    ${If} $0 != 0
        MessageBox MB_ICONEXCLAMATION "A instalacao do driver falhou. Codigo de erro: $0"
    ${EndIf}

    SetOutPath "$INSTDIR"

    ; Atalho Desktop
    CreateShortcut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "" "$INSTDIR\${ICON_FILE}"

    ; Atalho Menu Iniciar
    CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
    CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "" "$INSTDIR\${ICON_FILE}"
    CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\Desinstalar.lnk" "$INSTDIR\Uninstall.exe"

    ; Registro de desinstalação
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${PUBLISHER_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "1.0.0"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "URLInfoAbout" "mailto:felipersantos1988@gmail.com"

    MessageBox MB_ICONINFORMATION|MB_OK "Instalacao concluida com sucesso!$\r$\nAcesse o Menu Iniciar ou Area de Trabalho para executar o software."
SectionEnd

Section "Uninstall"
    ; Remoção do driver
    ExecWait '"$INSTDIR\driver\devcon.exe" remove ROOT\SeuDispositivoID'
    Delete "$INSTDIR\driver\devcon.exe"
    Delete "$INSTDIR\driver\seu_driver.inf"
    Delete "$INSTDIR\driver\seu_driver.sys"
    Delete "$INSTDIR\driver\seu_driver.cat"
    RMDir "$INSTDIR\driver"
    Delete "$INSTDIR\Uninstall.exe"

    Delete "$INSTDIR\${EXE_NAME}"
    Delete "$INSTDIR\${ICON_FILE}"
    Delete "$INSTDIR\ConsultaMedica.ps1"
    Delete "$INSTDIR\Paciente.ps1"
    Delete "$INSTDIR\ReceitaMedica.ps1"
    Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\Desinstalar.lnk"
    RMDir "$SMPROGRAMS\${PRODUCT_NAME}"

    Delete "$INSTDIR\config\*.ps1"
    RMDir /r "$INSTDIR\config"
    RMDir /r "$INSTDIR\logs"
    RMDir /r "$INSTDIR\relatorios"
    RMDir "$INSTDIR"

    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd