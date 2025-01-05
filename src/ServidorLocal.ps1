# Configuração do servidor local
$port = 8080
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Servidor HTTP iniciado em http://localhost:$port/"
Write-Host "Pressione Ctrl+C para encerrar o servidor."

while ($true) {
    try {
        # Aguarda uma conexão
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Lê o corpo da requisição (se houver)
        $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
        $body = $reader.ReadToEnd()

        # Exibe informações da requisição no console
        Write-Host "`nRequisição recebida:"
        Write-Host "URL: $($request.Url)"
        Write-Host "Método: $($request.HttpMethod)"
        Write-Host "Headers: $($request.Headers)"
        Write-Host "Corpo da requisição: $body"

        # Responde com uma mensagem de confirmação
        $responseString = "Requisição recebida com sucesso!"
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($responseString)

        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
    } catch {
        Write-Host "Erro no servidor: $_"
    }
}

# Libera recursos ao encerrar o servidor
$listener.Stop()