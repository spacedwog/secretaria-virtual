import axios from "axios";

// Função para enviar dados ao servidor
async function sendData() {
  const url = "http://localhost:8080/";
  const data = {
    name: "John Doe",
    email: "john.doe@example.com",
    age: 30,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Resposta do servidor:", response.data);
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
  }
}

sendData();