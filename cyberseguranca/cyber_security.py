import serial
import time

# Configuração da porta serial (substitua 'COM3' pela porta correta no seu sistema)
arduino = serial.Serial(port='COM3', baudrate=9600, timeout=.1)

def send_command(command):
    """
    Envia um comando para o Arduino.
    :param command: '1' para ligar o LED, '0' para desligar
    """
    arduino.write(command.encode())
    time.sleep(0.1)  # Pequena pausa para garantir que o comando seja enviado

def main():
    print("Controle de LED iniciado! Comandos:")
    print("'1' - Ligar o LED")
    print("'0' - Desligar o LED")
    print("'q' - Sair do programa")
    
    while True:
        command = input("Digite o comando: ").strip()
        if command in ['1', '0']:
            send_command(command)
        elif command == 'q':
            print("Saindo...")
            break
        else:
            print("Comando inválido!")

if __name__ == '__main__':
    main()