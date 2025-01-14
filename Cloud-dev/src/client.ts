import axios from "axios";

const getMessage = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8001/hello");
    console.log(response.data.message);
  } catch (error) {
    console.error("Error fetching message:", error);
  }
};

getMessage();