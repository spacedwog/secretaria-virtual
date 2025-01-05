# Configura o listener HTTP
Add-Type -TypeDefinition @"
using System.Net;
using System.Text;
public class SimpleHttpServer {
    private HttpListener listener;
    public SimpleHttpServer(string uriPrefix) {
        listener = new HttpListener();
        listener.Prefixes.Add(uriPrefix);
        listener.Start();
    }
    public void Run() {
        while (true) {
            var context = listener.GetContext();
            var request = context.Request;
            var response = context.Response;

            if (request.HttpMethod -eq "POST") {
                # Lê o corpo da requisição
                $body = New-Object IO.StreamReader($request.InputStream, [Text.Encoding]::UTF8);
                $data = $body.ReadToEnd();
                $body.Close();
                Write-Host "Dados recebidos: $data";

                # Responde ao cliente
                $response.ContentType = "application/json";
                $response.StatusCode = 200;
                $responseString = '{"status": "success", "message": "Dados recebidos com sucesso!"}';
                $buffer = [Text.Encoding]::UTF8.GetBytes($responseString);
                $response.OutputStream.Write($buffer, 0, $buffer.Length);
                $response.OutputStream.Close();
            }
        }
    }
}
"@

# Inicia o servidor em localhost:8080
$server = New-Object SimpleHttpServer("http://localhost:8080/");
Write-Host "Servidor iniciado em http://localhost:8080/"
$server.Run()