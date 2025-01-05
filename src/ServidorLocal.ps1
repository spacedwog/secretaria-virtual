# Solicita ao usuário a configuração inicial
$port = Read-Host "Digite a porta para o servidor (padrão 8080)"
if (-not $port) {
    $port = 8080
}

$prefix = Read-Host "Digite o prefixo do servidor (padrão http://localhost)"
if (-not $prefix) {
    $prefix = "http://localhost"
}

# Inicia o servidor com as configurações informadas
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("$prefix:$port/")
$listener.Start()

Write-Host "Servidor HTTP iniciado em $prefix:$port/"
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

        # Solicita input interativo do operador do servidor
        $responseString = Read-Host "Digite a resposta para o cliente"

        if (-not $responseString) {
            $responseString = "Resposta padrão do servidor."
        }

        # Envia a resposta para o cliente
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