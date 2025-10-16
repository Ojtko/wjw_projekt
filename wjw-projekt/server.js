import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",           
  password: "",          
  database: "baza"  
});

db.connect((err) => {
  if (err) {
    console.error("Błąd połączenia z bazą danych:", err);
  } else {
    console.log("Połączono z bazą danych MySQL");
  }
});


app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Brak wymaganych danych." });
  }

  const sql = `
    INSERT INTO messages (imie, mail, wiadomosc, data_wyslania)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("Błąd podczas zapisu do bazy:", err);
      return res.status(500).json({ success: false, message: "Błąd serwera." });
    }

    console.log("Nowa wiadomość zapisana w bazie:", { name, email, message });
    res.json({ success: true, message: "Wiadomość została zapisana w bazie danych." });
  });
});

app.listen(PORT, () => {
  console.log(`Server działa na http://localhost:${PORT}`);
});
