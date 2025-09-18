import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  console.log("Otrzymano wiadomość:");
  console.log("Imię:", name);
  console.log("Email:", email);
  console.log("Wiadomość:", message);


  res.json({ success: true, message: "Wiadomość odebrana" });
});

app.listen(PORT, () => {
  console.log(`Server działa na http://localhost:${PORT}`);
});
