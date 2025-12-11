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
  const [formData, setFormData] = useState({ name: "", email: "", adres: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const images = Object.values(
    import.meta.glob("./assets/about/*.jpg", { eager: true })
  ).map(img => img.default);
 
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
    if (!formData.adres.trim()) {
      newErrors.adres = "Adres jest wymagany";
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
      setFormData({ name: "", email: "", adres: "", message: "" });
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      console.error("Błąd podczas wysyłania formularza:", error);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans w-[99.2vw]">
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
        className="bg-red-700 text-center py-0 sm:py-32 px-4 relative overflow-hidden"
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl text-white font-extrabold leading-tight max-w-3xl mx-auto">
          Ekspertyzy przeciwpożarowe dla Twojej inwestycji
        </h2>
        <p className="mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white">
        Oferujemy profesjonalne opracowania i doradztwo w zakresie bezpieczeństwa pożarowego, dostosowane do wymagań prawnych i technicznych, aby Twoja inwestycja była w pełni bezpieczna.
        </p>
      </section>
 
     {/* About */}
<section id="about" className="relative w-full overflow-hidden py-20 bg-black text-white">
  
  <div className="absolute inset-0 overflow-hidden">
    <div className="flex w-[200%] carousel-track">
      {[
        '/ppoz1.jpg',
        '/ppoz2.jpg',
        '/ppoz3.jpg',
        '/ppoz4.jpg',
        '/ppoz5.jpg',
        '/ppoz1.jpg', 
        '/ppoz2.jpg',
        '/ppoz3.jpg',
        '/ppoz4.jpg',
        '/ppoz5.jpg'
        
      ].map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="w-1/4 h-[300px] object-cover opacity-40"
        />
      ))}
    </div>
  </div>

  <div className="relative z-10 text-center px-6">
    <h3 className="text-4xl font-bold mb-6">O nas</h3>
    <p className="text-lg max-w-3xl mx-auto">
      WJW Projekt to firma specjalizująca się w opracowywaniu ekspertyz przeciwpożarowych,
      dokumentacji technicznych oraz doradztwie w zakresie bezpieczeństwa pożarowego.
    </p>
  </div>

</section>

 
<section id="services" className="bg-gray-100 py-20 px-6">
  <h3 className="text-4xl font-bold mb-12 text-center text-gray-800">Nasze Usługi</h3>
  <div className="grid gap-8 md:grid-cols-3 ">
          {[
            {
              title: "Ekspertyzy przeciwpożarowe",
              desc: "Sporządzamy kompleksowe ekspertyzy techniczne z zakresu ochrony przeciwpożarowej, obejmujące analizę warunków technicznych, identyfikację niezgodności oraz przygotowanie rozwiązań zamiennych zgodnych z obowiązującymi przepisami i normami. Każda ekspertyza jest opracowywana indywidualnie na podstawie charakterystyki obiektu.",
            },
            {
              title: "Doradztwo",
              desc: "Zapewniamy profesjonalne wsparcie na każdym etapie inwestycji – od koncepcji, przez projektowanie, aż po odbiory. Pomagamy w doborze odpowiednich rozwiązań przeciwpożarowych, interpretacji przepisów, a także w kontaktach z rzeczoznawcami oraz instytucjami nadzorującymi.",
            },
            {
              title: "Dokumentacje techniczne",
              desc: "Opracowujemy dokumentacje niezbędne podczas realizacji inwestycji, takie jak instrukcje bezpieczeństwa pożarowego, operaty przeciwpożarowe, scenariusze pożarowe, analiza zagrożenia wybuchem oraz pełna dokumentacja projektowa z zakresu ochrony przeciwpożarowej.",
            },
            {
              title: "Scenariusze pożarowe",
              desc: "Tworzymy szczegółowe scenariusze rozwoju pożaru, będące podstawą do projektowania systemów sygnalizacji pożarowej, oddymiania oraz sterowania urządzeniami przeciwpożarowymi. Nasze opracowania pozwalają na prawidłowe zaprogramowanie i weryfikację działania instalacji PPOŻ.",
            },
            {
              title: "Instrukcje bezpieczeństwa pożarowego",
              desc: "Przygotowujemy instrukcje wraz z aktualizacją planów graficznych, zgodnie z wymaganiami rozporządzeń. Dokument zawiera analizę zagrożeń, zasady ewakuacji, procedury postępowania, rozmieszczenie sprzętu oraz wytyczne dla użytkowników obiektu.",
            },
            {
              title: "Ocena zagrożenia wybuchem",
              desc: "Wykonujemy profesjonalne oceny ryzyka wybuchu dla obiektów przemysłowych i komercyjnych, obejmujące klasyfikację stref zagrożonych, dobór urządzeń Ex oraz analizę potencjalnych źródeł zapłonu. Dokumentacja jest zgodna z Dyrektywą ATEX.",
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
            <Input
              type="text"
              name="adres"
              placeholder="Adres (ulica, miasto)"
              value={formData.adres}
              onChange={handleChange}
              required
            />
            {errors.adres && <p className="text-red-600 text-sm">{errors.adres}</p>}
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold text-white mb-4">WJW Projekt</h4>
              <p className="text-gray-400">
                Profesjonalne ekspertyzy i doradztwo w zakresie bezpieczeństwa pożarowego.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Szybkie linki</h4>
              <ul className="space-y-2">
                {['home', 'about', 'services', 'contact'].map((item) => (
                  <li key={item}>
                    <a 
                      href={`#${item}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item === 'home' ? 'Strona Główna' : 
                       item === 'about' ? 'O nas' :
                       item === 'services' ? 'Usługi' : 'Kontakt'}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-400">
                <li>mail: kontakt@wjwprojekt.pl</li>
                <li>nr telefonu: +48 123 456 789</li>
                <li>adres siedziby: ul. Przykładowa 123, 00-000 Warszawa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} WJW Projekt. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
