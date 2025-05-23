// InterfaceVirtual.cpp
#include <windows.h>

extern "C" __declspec(dllexport) void ShowInterface() {
    MessageBox(NULL, "Interface gráfica simulada com sucesso!", "InterfaceVirtual", MB_OK | MB_ICONINFORMATION);
}