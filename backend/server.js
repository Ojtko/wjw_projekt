import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint do obsługi formularza
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  console.log("Otrzymano wiadomość:");
  console.log("Imię:", name);
  console.log("Email:", email);
  console.log("Wiadomość:", message);

  // Można tu dodać wysyłkę maila np. nodemailer
  res.json({ success: true, message: "Wiadomość odebrana" });
});

app.listen(PORT, () => {
  console.log(`✅ Server działa na http://localhost:${PORT}`);
});
