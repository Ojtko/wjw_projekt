import { useState } from "react";
 
function Card({ children }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
      {children}
    </div>
  );
}
 
function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-6 py-3 rounded-full bg-red-700 text-white font-semibold hover:bg-red-800 transition-colors duration-300"
    >
      {children}
    </button>
  );
}
 
function Input(props) {
  return (
    <input
      {...props}
      className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition"
    />
  );
}
 
function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full border border-gray-300 rounded-xl p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition"
    />
  );
}
 
export default function App() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
 
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
 
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Błąd przy wysyłaniu formularza:", error);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-md p-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-red-700">WJW Projekt</h1>
        <nav className="space-x-6 font-medium text-gray-700">
          <a href="#home" className="hover:text-red-700 transition-colors">Strona Główna</a>
          <a href="#about" className="hover:text-red-700 transition-colors">O nas</a>
          <a href="#services" className="hover:text-red-700 transition-colors">Usługi</a>
          <a href="#contact" className="hover:text-red-700 transition-colors">Kontakt</a>
        </nav>
      </header>
 
      {/* Hero */}
      <section id="home" className="bg-red-700 text-center py-32 px-4 relative overflow-hidden">
        <h2 className="text-5xl md:text-6xl text-white font-extrabold leading-tight max-w-3xl mx-auto">
          Ekspertyzy przeciwpożarowe dla Twojej inwestycji
        </h2>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-white">
          Profesjonalne opracowania i doradztwo z zakresu bezpieczeństwa pożarowego.
        </p>
        <Button className="mt-20 text-gray-800">Skontaktuj się</Button>
      </section>
 
      {/* About */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h3 className="text-4xl font-bold mb-6 text-gray-800">O nas</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          WJW Projekt to firma specjalizująca się w opracowywaniu ekspertyz przeciwpożarowych, dokumentacji technicznych oraz doradztwie w zakresie bezpieczeństwa pożarowego.
        </p>
      </section>
 
      {/* Services */}
      <section id="services" className="bg-gray-100 py-20 px-6">
        <h3 className="text-4xl font-bold mb-12 text-center text-gray-800">Nasze Usługi</h3>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            { title: "Ekspertyzy przeciwpożarowe", desc: "Dokumenty dostosowane do wymagań prawnych i technicznych." },
            { title: "Doradztwo", desc: "Wsparcie w procesie projektowania i realizacji inwestycji." },
            { title: "Dokumentacje techniczne", desc: "Szczegółowe opracowania zgodne z obowiązującymi normami." },
          ].map((s, i) => (
            <Card key={i}>
              <h4 className="text-2xl font-semibold mb-3 text-gray-800">{s.title}</h4>
              <p className="text-gray-600">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>
 
      {/* Contact */}
      <section id="contact" className="py-20 px-6 max-w-3xl mx-auto">
        <h3 className="text-4xl font-bold mb-8 text-center text-gray-800">Kontakt i Wycena</h3>
        {submitted ? (
          <p className="text-green-600 text-center text-lg font-semibold">
            Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 rounded-3xl shadow-lg">
            <Input type="text" name="name" placeholder="Imię i nazwisko" value={formData.name} onChange={handleChange} required />
            <Input type="email" name="email" placeholder="Adres email" value={formData.email} onChange={handleChange} required />
            <Textarea name="message" placeholder="Treść wiadomości" value={formData.message} onChange={handleChange} required />
            <Button type="submit" className="w-full">Wyślij</Button>
          </form>
        )}
      </section>
 
      {/* Footer */}
      <footer className="bg-red-700 text-white text-center py-8 mt-20">
        <p>&copy; {new Date().getFullYear()} WJW Projekt. Wszystkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}