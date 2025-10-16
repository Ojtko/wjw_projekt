import { useState } from "react";
 
function Card({ children }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-shadow duration-300">
      {children}
    </div>
  );
}
 
function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-full bg-red-700 text-black font-semibold hover:bg-red-800 transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
  );
}
 
function Input(props) {
  return (
    <input
      {...props}
      className="w-full border border-gray-300 rounded-xl p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition"
    />
  );
}
 
function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full border border-gray-300 rounded-xl p-3 text-sm sm:text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition"
    />
  );
}
 
export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
 
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
 
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Imię i nazwisko są wymagane";
    if (!formData.email.trim()) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Podaj poprawny adres email";
    }
    if (!formData.message.trim()) newErrors.message = "Wiadomość jest wymagana";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Odpowiedź serwera:", data);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      console.error("Błąd podczas wysyłania formularza:", error);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans w-[100vw]">
      {/* Navbar */}
      <header className="bg-white shadow-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <h1 className="text-xl sm:text-2xl font-bold text-red-700">WJW Projekt</h1>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium text-gray-700">
          <a href="#home" className="hover:text-red-700 transition-colors">
            Strona Główna
          </a>
          <a href="#about" className="hover:text-red-700 transition-colors">
            O nas
          </a>
          <a href="#services" className="hover:text-red-700 transition-colors">
            Usługi
          </a>
          <a href="#contact" className="hover:text-red-700 transition-colors">
            Kontakt
          </a>
        </nav>
      </header>
 
      {/* Hero */}
      <section
        id="home"
        className="bg-red-700 text-center py-20 sm:py-32 px-4 relative overflow-hidden"
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl text-white font-extrabold leading-tight max-w-3xl mx-auto">
          Ekspertyzy przeciwpożarowe dla Twojej inwestycji
        </h2>
        <p className="mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white">
          Profesjonalne opracowania i doradztwo z zakresu bezpieczeństwa pożarowego.
        </p>
        <Button className="mt-10 sm:mt-16 text-black">Skontaktuj się</Button>
      </section>
 
      {/* About */}
<section id="about" className="py-20 px-6  text-center">
  <h3 className="text-4xl font-bold mb-6 text-gray-800">O nas</h3>
  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
    WJW Projekt to firma specjalizująca się w opracowywaniu ekspertyz przeciwpożarowych, dokumentacji technicznych oraz doradztwie w zakresie bezpieczeństwa pożarowego.
  </p>
</section>
 
<section id="services" className="bg-gray-100 py-20 px-6">
  <h3 className="text-4xl font-bold mb-12 text-center text-gray-800">Nasze Usługi</h3>
  <div className="grid gap-8 md:grid-cols-3 ">
          {[
            {
              title: "Ekspertyzy przeciwpożarowe",
              desc: "Dokumenty dostosowane do wymagań prawnych i technicznych.",
            },
            {
              title: "Doradztwo",
              desc: "Wsparcie w procesie projektowania i realizacji inwestycji.",
            },
            {
              title: "Dokumentacje techniczne",
              desc: "Szczegółowe opracowania zgodne z obowiązującymi normami.",
            },
          ].map((s, i) => (
            <Card key={i}>
              <h4 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-800">
                {s.title}
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>
 
      {/* Contact */}
      <section id="contact" className="py-20 px-6 w-full">
  <h3 className="text-4xl font-bold mb-8 text-center text-gray-800">Kontakt i Wycena</h3>
  
        {submitted ? (
          <p className="text-green-600 text-center text-lg font-semibold">
            Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 p-6 sm:p-10 rounded-3xl shadow-lg bg-white"
          >
            <Input
              type="text"
              name="name"
              placeholder="Imię i nazwisko"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
 
            <Input
              type="email"
              name="email"
              placeholder="Adres email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
 
            <Textarea
              name="message"
              placeholder="Treść wiadomości"
              value={formData.message}
              onChange={handleChange}
              required
            />
            {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
 
            <Button type="submit" className="w-full">
              Wyślij
            </Button>
          </form>
        )}
      </section>
 
      {/* Footer */}
      <footer className="bg-red-700 text-white text-center py-6 sm:py-8 mt-12 sm:mt-20 px-4">
        <p className="text-sm sm:text-base">
          &copy; {new Date().getFullYear()} WJW Projekt. Wszystkie prawa zastrzeżone.
        </p>
      </footer>
    </div>
  );
}
