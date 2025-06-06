; --------------------------------------
; Instalador da Secretaria Virtual
; Desenvolvido por Spacedwog
; --------------------------------------

!define PRODUCT_NAME        "Secretaria Virtual"
!define PUBLISHER_NAME      "Spacedwog"
!define EXE_NAME            "index.exe"
!define INSTALL_DIR         "$PROGRAMFILES\${PRODUCT_NAME}"
!define ICON_FILE           "icone.ico"
!define MUI_ICON            "${ICON_FILE}"
!define MUI_UNICON          "${ICON_FILE}"
!define MUI_LANGUAGE        "PortugueseBR"
!define MUI_FINISHPAGE_RUN  "$INSTDIR\${EXE_NAME}"
!define MUI_FINISHPAGE_RUN_TEXT "Executar Secretaria Virtual agora"

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "WinVer.nsh"

OutFile "Instalador.exe"
InstallDir "${INSTALL_DIR}"
Name "${PRODUCT_NAME}"
Caption "${PRODUCT_NAME}"
BrandingText "Desenvolvido por ${PUBLISHER_NAME}"
SetCompressor /SOLID lzma

Var FORCE_INSTALL

; --- Páginas da Instalação ---
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "docs\README.md"
!insertmacro MUI_PAGE_LICENSE "docs\LICENSE.md"
!insertmacro MUI_PAGE_LICENSE "docs\CONTRIBUTING.md"
!insertmacro MUI_PAGE_LICENSE "docs\CODE_OF_CONDUCT.md"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; --- Páginas da Desinstalação ---
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; --- Idioma ---
!insertmacro MUI_LANGUAGE "${MUI_LANGUAGE}"

; --- Texto personalizado para página de licença ---
!define MUI_LICENSEPAGE_TEXT_TOP "Leia atentamente os documentos de contribuição e conduta antes de continuar."

; --- Função de inicialização ---
Function .onInit
    Push $R0
    Call GetParameters
    Pop $R0
    StrCpy $FORCE_INSTALL "0"
    StrCmp $R0 "/FORCE" 0 +3
        StrCpy $FORCE_INSTALL "1"
        MessageBox MB_OK "Instalação forçada ativada."
    Pop $R0
FunctionEnd

; --- Função para obter parâmetros da linha de comando ---
Function GetParameters
    Exch $R0
    Push $R1
    Push $R2
    StrCpy $R1 $CMDLINE 1
    StrCpy $R2 1
    StrCmp $R1 '"' 0 +3
        StrCpy $R1 $CMDLINE 2
        StrCpy $R2 2
    StrCpy $R0 $CMDLINE "" $R2
    Pop $R2
    Pop $R1
    Exch $R0
FunctionEnd

; --- Função para executar o app após instalação ---
Function LaunchApp
    Exec "$INSTDIR\${EXE_NAME}"
FunctionEnd

; --- Seção principal de instalação ---
Section "Instalar ${PRODUCT_NAME}" SEC01
    SetOutPath "$INSTDIR"

    ; Arquivos principais
    File "index.exe"
    File "${ICON_FILE}"
    File "ConsultaMedica.ps1"
    File "Paciente.ps1"
    File "ReceitaMedica.ps1"

    ; Configuração
    SetOutPath "$INSTDIR\config"
    CreateDirectory "$INSTDIR\config"
    File "config\Configuracao.ps1"
    File "config\auditoria.ps1"
    File "config\executar.ps1"
    File "config\homologar.ps1"

    ; Logs e relatórios
    CreateDirectory "$INSTDIR\logs\auditoria"
    CreateDirectory "$INSTDIR\logs\report"
    CreateDirectory "$INSTDIR\relatorios\json"
    CreateDirectory "$INSTDIR\relatorios\webpage"

    ; Documentação
    SetOutPath "$INSTDIR\docs"
    CreateDirectory "$INSTDIR\docs"
    File "docs\README.md"
    File "docs\CONTRIBUTING.md"
    File "docs\LICENSE.md"
    File "docs\CODE_OF_CONDUCT.md"

    ; Atalhos
    SetOutPath "$INSTDIR"
    CreateShortcut "$DESKTOP\${PRODUCT_NAME} - ${PUBLISHER_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "$INSTDIR\${ICON_FILE}"
    CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
    CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME} - ${PUBLISHER_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "$INSTDIR\${ICON_FILE}"
    CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\Desinstalar.lnk" "$INSTDIR\Uninstall.exe"

    ; Registro para desinstalação
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${PUBLISHER_NAME}"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "1.0.0"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "URLInfoAbout" "mailto:felipersantos1988@gmail.com"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "InstallLocation" "$INSTDIR"

    ; Log da instalação
    Push $INSTDIR
    Push ${EXE_NAME}
    Call LaunchApp
    Call WriteInstallLog

    MessageBox MB_ICONINFORMATION "Instalação concluída com sucesso!$\nAcesse o Menu Iniciar ou Área de Trabalho para executar o software."
SectionEnd

; --- Seção de desinstalação ---
Section "Uninstall"
    Delete "$INSTDIR\${EXE_NAME}"
    Delete "$INSTDIR\${ICON_FILE}"
    Delete "$INSTDIR\ConsultaMedica.ps1"
    Delete "$INSTDIR\Paciente.ps1"
    Delete "$INSTDIR\ReceitaMedica.ps1"
    Delete "$DESKTOP\${PRODUCT_NAME} - ${PUBLISHER_NAME}.lnk"
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME} - ${PUBLISHER_NAME}.lnk"
    Delete "$SMPROGRAMS\${PRODUCT_NAME}\Desinstalar.lnk"
    RMDir "$SMPROGRAMS\${PRODUCT_NAME}"
    Delete "$INSTDIR\config\*.ps1"
    RMDir /r "$INSTDIR\config"
    RMDir /r "$INSTDIR\logs"
    RMDir /r "$INSTDIR\relatorios"
    RMDir /r "$INSTDIR\docs"
    Delete "$INSTDIR\Uninstall.exe"
    RMDir "$INSTDIR"
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd

; --- Função para log da instalação ---
Function WriteInstallLog
    Exch $1 ; EXE_NAME
    Exch
    Exch $0 ; INSTDIR
    StrCpy $2 "$INSTDIR\install.log"
    FileOpen $3 $2 w
    FileWrite $3 "Instalação concluída em $0 com o executável $1$\r$\n"
    FileClose $3
FunctionEnd

; Macro para detectar se uma string contém um parâmetro
!macro CmdLineHasParam CMDLINE PARAM
  ClearErrors
  StrCpy $R9 "${CMDLINE}"
  StrCpy $R8 "${PARAM}"
  StrStr $R9 $R8 $R0
  ${If} ${Errors}
    ; não encontrado
    StrCpy $0 0
  ${Else}
    StrCpy $0 1
  ${EndIf}
!macroend