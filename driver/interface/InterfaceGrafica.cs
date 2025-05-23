using System;
using System.Windows.Forms;

namespace InterfaceGrafica
{
    public class Janela
    {
        public void Abrir()
        {
            Form form = new Form()
            {
                Text = "Minha Interface Gráfica",
                Width = 400,
                Height = 300
            };
            Application.Run(form);
        }
    }
}