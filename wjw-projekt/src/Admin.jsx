import { useState, useEffect } from "react";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ login: "", password: "" });
  const [messages, setMessages] = useState([]);
  const [ekspertyzy, setEkspertyzy] = useState([]);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filterClient, setFilterClient] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [sortOption, setSortOption] = useState("default");


  

  const filteredEkspertyzy = ekspertyzy.filter((e) => {
    const statusMatch = filters.length === 0 || filters.includes(e.status);
  
    const clientMatch =
      filterClient.trim() === "" ||
      e.imie.toLowerCase().includes(filterClient.toLowerCase());
  
    const addressMatch =
      filterAddress.trim() === "" ||
      e.adres.toLowerCase().includes(filterAddress.toLowerCase());
  
    return statusMatch && clientMatch && addressMatch;
  });
  
  const sortEkspertyzy = (data) => {
    let sorted = [...data];
  
    switch (sortOption) {
      case "termin-asc":
        sorted.sort((a, b) => new Date(a.termin) - new Date(b.termin));
        break;
  
      case "termin-desc":
        sorted.sort((a, b) => new Date(b.termin) - new Date(a.termin));
        break;
  
      case "wycena-asc":
        sorted.sort((a, b) => Number(a.wycena) - Number(b.wycena));
        break;
  
      case "wycena-desc":
        sorted.sort((a, b) => Number(b.wycena) - Number(a.wycena));
        break;
  
      default:
        return data;
    }
  
    return sorted;
  };
  

  const toggleFilter = (value) => {
    setFilters((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };
  
  
  
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        setError("");
      } else setError("Błędne dane logowania");
    } catch {
      setError("Błąd połączenia z serwerem");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };
  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(setMessages);

      fetch("http://localhost:5000/api/ekspertyzy", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(setEkspertyzy);
    }
  }, [loggedIn]);

  const updateEkspertyza = async (id, status, wycena, termin) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/ekspertyzy/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, wycena, termin}),
    });
    alert("Zaktualizowano ekspertyzę!");
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 w-[100vw]">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-center text-red-700 mb-6">
            Panel administratora
          </h2>
          <input
            type="text"
            placeholder="Login"
            className="border p-2 w-full rounded-lg mb-3"
            onChange={(e) => setForm({ ...form, login: e.target.value })}
          />
          <input
            type="password"
            placeholder="Hasło"
            className="border p-2 w-full rounded-lg mb-3"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-red-600 text-center mb-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-700 text-black py-2 rounded-lg hover:bg-red-800"
          >
            Zaloguj
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-[100vw]">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-700">
          Panel Administratora
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-700 text-black px-4 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Wyloguj
        </button>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Wiadomości</h2>
        <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b font-semibold">
                <th>Imię</th>
                <th>Email</th>
                <th>Adres</th>
                <th>Wiadomość</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="border-b">
                  <td>{m.imie}</td>
                  <td>{m.mail}</td>
                  <td>{m.adres}</td>
                  <td>{m.wiadomosc}</td>
                  <td>{new Date(m.data_wyslania).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


  <section>
  {/* GÓRNY PANEL – FILTRY LEWO, SORTOWANIE PRAWO */}
<div className="flex justify-between items-center mb-4">

{/* PRZYCISK FILTROWANIA */}
<button
  onClick={() => setFiltersOpen(!filtersOpen)}
  className="bg-gray-200 px-4 py-2 rounded-lg border hover:bg-gray-300"
>
  {filtersOpen ? "Ukryj filtry ▲" : "Pokaż filtry ▼"}
</button>

{/* SORTOWANIE */}
<div className="flex items-center gap-2">
  <label className="font-semibold">Sortuj:</label>

  <select
    className="border rounded p-2"
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
  >
    <option value="default">Domyślne</option>
    <option value="termin-asc">Termin ↑</option>
    <option value="termin-desc">Termin ↓</option>
    <option value="wycena-asc">Wycena ↑</option>
    <option value="wycena-desc">Wycena ↓</option>
  </select>
</div>

</div>


{/* PANEL ROZWIJANY — FILTRY */}
{filtersOpen && (
<div className="mt-4 mb-6 p-4 bg-white rounded-xl shadow-md border">

  <h3 className="font-semibold mb-2">Status:</h3>

  <div className="flex gap-4 mb-4">
    <label className="flex items-center gap-1">
      <input
        type="checkbox"
        checked={filters.includes("oczekuje")}
        onChange={() => toggleFilter("oczekuje")}
      />
      oczekuje
    </label>

    <label className="flex items-center gap-1">
      <input
        type="checkbox"
        checked={filters.includes("w trakcie")}
        onChange={() => toggleFilter("w trakcie")}
      />
      w trakcie
    </label>

    <label className="flex items-center gap-1">
      <input
        type="checkbox"
        checked={filters.includes("wykonane")}
        onChange={() => toggleFilter("wykonane")}
      />
      wykonane
    </label>
  </div>

  <h3 className="font-semibold mb-2">Klient:</h3>
  <input
    type="text"
    placeholder="Wpisz imię klienta..."
    className="border p-2 w-full rounded-lg mb-4"
    value={filterClient}
    onChange={(e) => setFilterClient(e.target.value)}
  />

  <h3 className="font-semibold mb-2">Adres / Ulica:</h3>
  <input
    type="text"
    placeholder="Wpisz ulicę..."
    className="border p-2 w-full rounded-lg"
    value={filterAddress}
    onChange={(e) => setFilterAddress(e.target.value)}
  />

</div>
)}



  <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">

    <table className="w-full text-left">
      <thead>
        <tr className="border-b font-semibold">
          <th>Klient</th>
          <th>Email</th>
          <th>Adres</th>
          <th>Wycena</th>
          <th>Status</th>
          <th>Termin</th>
          <th>Akcja</th>
        </tr>
      </thead>

      <tbody>
        {sortEkspertyzy(filteredEkspertyzy).map((e) => (
          <tr key={e.id} className="border-b">
            <td>{e.imie}</td>
            <td>{e.mail}</td>
            <td>{e.adres}</td>

            <td>
              <input
                type="number"
                defaultValue={e.wycena}
                onChange={(ev) => (e.wycena = ev.target.value)}
                className="border rounded p-1 w-24"
              />
            </td>

            <td>
              <select
                defaultValue={e.status}
                onChange={(ev) => (e.status = ev.target.value)}
                className="border rounded p-1"
              >
                <option value="oczekuje">oczekuje</option>
                <option value="w trakcie">w trakcie</option>
                <option value="wykonane">wykonane</option>
              </select>
            </td>

            <td>
            <input
              type="date"
              defaultValue={e.termin ? e.termin.slice(0, 10) : ""}
              onChange={(ev) => (e.termin = ev.target.value)}
              className="border rounded p-1 w-32"
            />
            </td>

            <td>
              <button
                onClick={() => updateEkspertyza(e.id, e.status, e.wycena, e.termin)}
                className="bg-red-600 text-black px-3 py-1 rounded-lg hover:bg-red-700"
              >
                Zapisz
              </button>
            </td>
          </tr>
        ))}
      </tbody>

    </table>
  </div>
</section>

    </div>
  );
}
