; Script NSIS para instalar Secretaria Virtual
!define PRODUCT_NAME "Secretaria Virtual"
!define EXE_NAME "secretaria_virtual.exe"
!define INSTALL_DIR "$PROGRAMFILES\${PRODUCT_NAME}"
!define ICON_FILE "icone.ico"

SetCompressor /SOLID lzma
RequestExecutionLevel admin

OutFile "Instalador_Secretaria_Virtual.exe"
InstallDir "${INSTALL_DIR}"
ShowInstDetails show
ShowUnInstDetails show

; Página de boas-vindas, licença e diretório
Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles

Section "Instalar ${PRODUCT_NAME}" SEC01
    SetOutPath "$INSTDIR"

    ; Copia os arquivos necessários
    File "${EXE_NAME}"
    File /r "config\*"
    File "${ICON_FILE}"

    ; Atalho na Área de Trabalho
    CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${EXE_NAME}" "" "$INSTDIR\${ICON_FILE}" 0

    ; Registra para desinstalação
    WriteUninstaller "$INSTDIR\Uninstall.exe"
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
    Delete "$INSTDIR\Uninstall.exe"
    Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
    Delete "$INSTDIR\config\executar.ps1"
    RMDir /r "$INSTDIR\config"
    RMDir "$INSTDIR"

    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
SectionEnd