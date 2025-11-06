import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


const ADMIN_USER = { login: "admin", password: "1234" };

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;
  if (login === ADMIN_USER.login && password === ADMIN_USER.password) {
    return res.json({ success: true, token: "admin-token" });
  }
  res.status(401).json({ success: false, message: "Błędne dane logowania" });
});


app.post("/api/contact", async (req, res) => {
  const { name, email, adres,  message } = req.body;
  try {
    await db.execute(
      "INSERT INTO messages (imie, mail, adres, wiadomosc) VALUES (?, ?, ?, ?)",
      [name, email, adres, message]
    );
    res.json({ success: true, message: "Wiadomość zapisana w bazie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Błąd bazy danych" });
  }
});


app.get("/api/messages", async (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== "Bearer admin-token")
    return res.status(403).json({ success: false, message: "Brak dostępu" });

  try {
    const [rows] = await db.query("SELECT * FROM messages ORDER BY data_wyslania DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: "Błąd bazy danych" });
  }
});


app.get("/api/ekspertyzy", async (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== "Bearer admin-token")
    return res.status(403).json({ success: false, message: "Brak dostępu" });

  try {
    const [rows] = await db.query(`
      SELECT e.id, m.imie, m.mail, m.adres, e.wycena, e.status, m.wiadomosc, m.data_wyslania
      FROM ekspertyzy e
      JOIN messages m ON e.message_id = m.id
      ORDER BY e.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Błąd bazy danych" });
  }
});


app.put("/api/ekspertyzy/:id", async (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== "Bearer admin-token")
    return res.status(403).json({ success: false, message: "Brak dostępu" });

  const { id } = req.params;
  const { status, wycena } = req.body;

  try {
    await db.execute(
      "UPDATE ekspertyzy SET status = ?, wycena = ? WHERE id = ?",
      [status, wycena, id]
    );
    res.json({ success: true, message: "Ekspertyza zaktualizowana" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Błąd bazy danych" });
  }
});

// 🚀 Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serwer działa na porcie ${PORT}`));
