; --------------------------------------
; Instalador da Secretaria Virtual
; Desenvolvido por Spacedwog
; --------------------------------------

!define PRODUCT_NAME "Secretaria Virtual"
!define PUBLISHER_NAME "Spacedwog"
!define EXE_NAME "index.exe"
!define INSTALL_DIR "$PROGRAMFILES\Secretaria Virtual"
!define ICON_FILE "icone.ico"
!define MUI_ICON "${ICON_FILE}"
!define MUI_UNICON "${ICON_FILE}"
!define MUI_LANGUAGE "PortugueseBR"
!define MUI_FINISHPAGE_RUN "$INSTDIR\${EXE_NAME}"
!define MUI_FINISHPAGE_RUN_TEXT "Executar Secretaria Virtual agora"

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "WinVer.nsh"
!include "x64.nsh"  ; Para detectar arquitetura (opcional)

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.md"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "${MUI_LANGUAGE}"

Var FORCE_INSTALL
Var IsAdmin

Function .onInit
  ; Verifica se está executando como administrador
  UserInfo::GetAccountType
  Pop $IsAdmin
  ${If} $IsAdmin != "Admin"
    MessageBox MB_ICONEXCLAMATION|MB_OK "Este instalador precisa ser executado como Administrador. Execute novamente com privilégios elevados."
    Abort
  ${EndIf}

  ; Verifica parâmetros de linha de comando
  StrCpy $FORCE_INSTALL "0"
  GetParameters $R0
  ${If} ${CmdLineHasParam} $R0 "/FORCE"
    StrCpy $FORCE_INSTALL "1"
    MessageBox MB_OK "Instalação forçada ativada."
  ${EndIf}

  ; Verifica instalação silenciosa
  ${If} ${CmdLineHasParam} $R0 "/S"
    ; Define modo silencioso (sem UI)
    SetSilent silent
  ${EndIf}
FunctionEnd

Function LaunchApp
  Exec "$INSTDIR\${EXE_NAME}"
FunctionEnd

Section "Instalar Secretaria Virtual" SEC01
  SetOutPath "$INSTDIR"

  ; Copiar arquivos principais
  File "${EXE_NAME}"
  File "${ICON_FILE}"
  File "ConsultaMedica.ps1"
  File "Paciente.ps1"
  File "ReceitaMedica.ps1"

  ; Criar diretórios e copiar configs e logs
  SetOutPath "$INSTDIR\config"
  CreateDirectory "$INSTDIR\config"
  File "Configuracao.ps1"
  File "auditoria.ps1"
  File "executar.ps1"
  File "homologar.ps1"

  CreateDirectory "$INSTDIR\logs\auditoria"
  CreateDirectory "$INSTDIR\logs\report"
  CreateDirectory "$INSTDIR\relatorios\json"
  CreateDirectory "$INSTDIR\relatorios\webpage"

  SetOutPath "$INSTDIR\docs"
  CreateDirectory "$INSTDIR\docs"
  File "README.md"
  File "CONTRIBUTING.md"
  File "LICENSE.md"
  File "CODE_OF_CONDUCT.md"

  SetOutPath "$INSTDIR"

  ; Criar atalhos
  CreateShortcut "$DESKTOP\${PRODUCT_NAME} - ${PUBLISHER_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "$INSTDIR\${ICON_FILE}" "" 0
  CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
  CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME} - ${PUBLISHER_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "$INSTDIR\${ICON_FILE}" "" 0
  CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\Desinstalar.lnk" "$INSTDIR\Uninstall.exe"

  ; Criar desinstalador
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Criar entradas no registro para desinstalação
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayIcon" "$INSTDIR\${EXE_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "Publisher" "${PUBLISHER_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "DisplayVersion" "1.0.0"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "URLInfoAbout" "mailto:felipersantos1988@gmail.com"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}" "InstallLocation" "$INSTDIR"

  ; Criar log de instalação
  Push $INSTDIR
  Push "${EXE_NAME}"
  Call WriteInstallLog

  ; Executar programa automaticamente após a instalação
  Call LaunchApp

  MessageBox MB_ICONINFORMATION|MB_OK "Instalação concluída com sucesso!
Acesse o Menu Iniciar ou Área de Trabalho para executar o software."
SectionEnd

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

Function WriteInstallLog
  Exch $1 ; EXE name
  Exch
  Exch $0 ; Install dir

  StrCpy $2 "$INSTDIR\install.log"
  FileOpen $3 "$2" w
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