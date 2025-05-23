using System;
using System.Windows.Forms;

namespace InterfaceVirtual
{
    public class Saudacao
    {
        public static void MostrarJanela(string nome)
        {
            Form formulario = new Form();
            formulario.Text = "Interface Virtual";
            formulario.Width = 300;
            formulario.Height = 200;

            Label label = new Label();
            label.Text = "OlÃ¡, " + nome + "!";
            label.Dock = DockStyle.Fill;
            label.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            label.Font = new System.Drawing.Font("Arial", 14);

            formulario.Controls.Add(label);
            Application.EnableVisualStyles();
            Application.Run(formulario);
        }
    }
}
