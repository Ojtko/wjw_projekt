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
  const [editingEkspertyzy, setEditingEkspertyzy] = useState({});
  const [viewingMessage, setViewingMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funkcja do pobrania aktualnych danych ekspertyzy (łączy oryginalne z edytowanymi)
  const getCurrentEkspertyza = (ekspertyza) => {
    if (!ekspertyza) return null;
    
    const editedData = editingEkspertyzy[ekspertyza.id] || {};
    return {
      ...ekspertyza,
      wycena: editedData.wycena !== undefined ? editedData.wycena : ekspertyza.wycena,
      status: editedData.status || ekspertyza.status,
      termin: editedData.termin || ekspertyza.termin
    };
  };

  const filteredEkspertyzy = (ekspertyzy || []).filter((e) => {
    if (!e) return false;
    
    const currentEkspertyza = getCurrentEkspertyza(e);
    if (!currentEkspertyza) return false;
    
    const statusMatch = filters.length === 0 || filters.includes(currentEkspertyza.status);
    const clientMatch =
      filterClient.trim() === "" ||
      (currentEkspertyza.imie || '').toLowerCase().includes(filterClient.toLowerCase());
    const addressMatch =
      filterAddress.trim() === "" ||
      (currentEkspertyza.adres || '').toLowerCase().includes(filterAddress.toLowerCase());
    
    return statusMatch && clientMatch && addressMatch;
  });

  const sortEkspertyzy = (data) => {
    if (!Array.isArray(data)) return [];
    
    try {
      let sorted = [...data];
      switch (sortOption) {
        case "termin-asc":
          sorted.sort((a, b) => {
            const aCurrent = getCurrentEkspertyza(a);
            const bCurrent = getCurrentEkspertyza(b);
            const aTermin = aCurrent?.termin ? new Date(aCurrent.termin) : new Date(0);
            const bTermin = bCurrent?.termin ? new Date(bCurrent.termin) : new Date(0);
            return aTermin - bTermin;
          });
          break;
        case "termin-desc":
          sorted.sort((a, b) => {
            const aCurrent = getCurrentEkspertyza(a);
            const bCurrent = getCurrentEkspertyza(b);
            const aTermin = aCurrent?.termin ? new Date(aCurrent.termin) : new Date(0);
            const bTermin = bCurrent?.termin ? new Date(bCurrent.termin) : new Date(0);
            return bTermin - aTermin;
          });
          break;
        case "wycena-asc":
          sorted.sort((a, b) => {
            const aCurrent = getCurrentEkspertyza(a);
            const bCurrent = getCurrentEkspertyza(b);
            const aWycena = Number(aCurrent?.wycena || 0);
            const bWycena = Number(bCurrent?.wycena || 0);
            return aWycena - bWycena;
          });
          break;
        case "wycena-desc":
          sorted.sort((a, b) => {
            const aCurrent = getCurrentEkspertyza(a);
            const bCurrent = getCurrentEkspertyza(b);
            const aWycena = Number(aCurrent?.wycena || 0);
            const bWycena = Number(bCurrent?.wycena || 0);
            return bWycena - aWycena;
          });
          break;
        default:
          return data;
      }
      return sorted.filter(item => item != null);
    } catch (err) {
      console.error('Błąd podczas sortowania:', err);
      return data || [];
    }
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
    setEditingEkspertyzy({});
  };

  const openMessageModal = (message) => {
    setViewingMessage(message);
    setIsModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsModalOpen(false);
    setViewingMessage(null);
  };

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem("token");
      
      Promise.all([
        fetch("http://localhost:5000/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then(data => Array.isArray(data) ? data : [])
          .catch(() => []),
        
        fetch("http://localhost:5000/api/ekspertyzy", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((data) => {
            const safeData = Array.isArray(data) ? data : [];
            setEkspertyzy(safeData);
            const initialEditingState = {};
            safeData.forEach(e => {
              if (e && e.id) {
                initialEditingState[e.id] = {
                  wycena: e.wycena || '',
                  status: e.status || 'oczekuje',
                  termin: e.termin || ''
                };
              }
            });
            setEditingEkspertyzy(initialEditingState);
            return safeData;
          })
          .catch(() => [])
      ]).then(([messagesData]) => {
        setMessages(messagesData);
      });
    }
  }, [loggedIn]);

  const handleEkspertyzaChange = (id, field, value) => {
    setEditingEkspertyzy(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const updateEkspertyza = async (id) => {
    const ekspertyza = editingEkspertyzy[id];
    if (!ekspertyza) return;
    
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/ekspertyzy/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ekspertyza),
      });

      if (response.ok) {
        setEkspertyzy(prev => prev.map(e => 
          e?.id === id ? { ...e, ...ekspertyza } : e
        ));

        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = 'Ekspertyza została zaktualizowana!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      } else {
        alert("Błąd podczas aktualizacji ekspertyzy");
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert("Błąd połączenia z serwerem");
    }
  };

  const getStatusColor = (status) => {
    const safeStatus = status || 'oczekuje';
    switch (safeStatus) {
      case "oczekuje":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "w trakcie":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "wykonane":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDisplayData = (ekspertyza) => {
    const current = getCurrentEkspertyza(ekspertyza);
    if (!current) return {
      wycena: '',
      status: 'oczekuje',
      termin: '',
      imie: '',
      mail: '',
      adres: ''
    };
    
    return {
      wycena: current.wycena || '',
      status: current.status || 'oczekuje',
      termin: current.termin || '',
      imie: current.imie || '',
      mail: current.mail || '',
      adres: current.adres || ''
    };
  };

  const formatMessageText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 w-[100vw]">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Panel Administratora
            </h2>
            <p className="text-gray-600 text-sm">
              Wprowadź dane logowania
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Login
              </label>
              <input
                type="text"
                placeholder="Wpisz login"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                onChange={(e) => setForm({ ...form, login: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasło
              </label>
              <input
                type="password"
                placeholder="Wpisz hasło"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Zaloguj się
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-[99.2vw]">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              Panel Administratora
            </h1>
            <p className="text-gray-600 text-sm">
              Zarządzaj wiadomościami i ekspertyzami
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium shadow-sm"
          >
            Wyloguj się
          </button>
        </div>


        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Wiadomości od klientów
            </h2>
            <span className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
              {(messages || []).length} wiadomości
            </span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Imię</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Adres</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Wiadomość</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Data wysłania</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(messages || []).map((m) => (
                    <tr key={m?.id || Math.random()} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{m?.imie || ''}</div>
                      </td>
                      <td className="py-4 px-6">
                        <a href={`mailto:${m?.mail || ''}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {m?.mail || ''}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-gray-700">{m?.adres || ''}</td>
                      <td className="py-4 px-6">
                        <div className="max-w-xs truncate" title={m?.wiadomosc || ''}>
                          {m?.wiadomosc || ''}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">
                        {m?.data_wyslania ? new Date(m.data_wyslania).toLocaleString('pl-PL') : ''}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => m && openMessageModal(m)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all text-sm font-medium"
                          disabled={!m}
                        >
                          Pełna treść
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(messages || []).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Brak wiadomości
              </div>
            )}
          </div>
        </section>


        {isModalOpen && viewingMessage && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMessageModal}
            />
            

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">

                <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Wiadomość od {viewingMessage?.imie || ''}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Wysłano: {viewingMessage?.data_wyslania ? new Date(viewingMessage.data_wyslania).toLocaleString('pl-PL') : ''}
                    </p>
                  </div>
                  <button
                    onClick={closeMessageModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl p-2"
                  >
                    &times;
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Nadawca</p>
                        <p className="font-medium text-gray-800">{viewingMessage?.imie || ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <a 
                          href={`mailto:${viewingMessage?.mail || ''}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {viewingMessage?.mail || ''}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Adres</p>
                        <p className="font-medium text-gray-800">{viewingMessage?.adres || ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Telefon</p>
                        <p className="font-medium text-gray-800">
                          {viewingMessage?.telefon || "Nie podano"}
                        </p>
                      </div>
                    </div>

     
                    <div>
                      <p className="text-sm text-gray-500 mb-3">Treść wiadomości</p>
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {formatMessageText(viewingMessage?.wiadomosc)}
                        </div>
                      </div>
                    </div>


                    {viewingMessage?.typ && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Typ zapytania</p>
                        <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {viewingMessage.typ}
                        </div>
                      </div>
                    )}
                  </div>
                </div>


                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                  <button
                    onClick={closeMessageModal}
                    className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Zamknij
                  </button>
                  <a
                    href={`mailto:${viewingMessage?.mail || ''}?subject=Odpowiedź na zapytanie&body=Dzień dobry ${viewingMessage?.imie || ''},%0D%0A%0D%0ADziękujemy za kontakt.`}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Odpowiedz
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Ekspertyzy
              </h2>
              <p className="text-gray-600 text-sm">
                Liczba ekspertyz: <span className="font-semibold">{filteredEkspertyzy.length}</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                <span>Filtrowanie</span>
                <span className="text-gray-500">
                  {filtersOpen ? "▲" : "▼"}
                </span>
              </button>

              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">
                  Sortuj według:
                </label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white w-full"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="default">Domyślnie</option>
                  <option value="termin-asc">Termin - rosnąco</option>
                  <option value="termin-desc">Termin - malejąco</option>
                  <option value="wycena-asc">Wycena - rosnąco</option>
                  <option value="wycena-desc">Wycena - malejąco</option>
                </select>
              </div>
            </div>
          </div>

          {filtersOpen && (
            <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Filtrowanie</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
                  <div className="space-y-2">
                    {["oczekuje", "w trakcie", "wykonane"].map((status) => (
                      <label key={status} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.includes(status)}
                          onChange={() => toggleFilter(status)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <span className="text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Klient</h4>
                  <input
                    type="text"
                    placeholder="Wyszukaj po imieniu..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    value={filterClient}
                    onChange={(e) => setFilterClient(e.target.value)}
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Adres / Ulica</h4>
                  <input
                    type="text"
                    placeholder="Wyszukaj po adresie..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    value={filterAddress}
                    onChange={(e) => setFilterAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Klient</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Adres</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Wycena</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Termin</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortEkspertyzy(filteredEkspertyzy).map((ekspertyza) => {
                    if (!ekspertyza) return null;
                    
                    const displayData = getDisplayData(ekspertyza);
                    return (
                      <tr key={ekspertyza.id || Math.random()} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{displayData.imie}</div>
                        </td>
                        <td className="py-4 px-6">
                          <a href={`mailto:${displayData.mail}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                            {displayData.mail}
                          </a>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{displayData.adres}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">PLN</span>
                            <input
                              type="number"
                              value={displayData.wycena}
                              onChange={(ev) => handleEkspertyzaChange(ekspertyza.id, 'wycena', ev.target.value)}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={displayData.status}
                            onChange={(ev) => handleEkspertyzaChange(ekspertyza.id, 'status', ev.target.value)}
                            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none font-medium capitalize ${getStatusColor(displayData.status)}`}
                          >
                            <option value="oczekuje">Oczekuje</option>
                            <option value="w trakcie">W trakcie</option>
                            <option value="wykonane">Wykonane</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="date"
                            value={displayData.termin ? displayData.termin.slice(0, 10) : ""}
                            onChange={(ev) => handleEkspertyzaChange(ekspertyza.id, 'termin', ev.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none w-36"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => updateEkspertyza(ekspertyza.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow"
                          >
                            Zapisz
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredEkspertyzy.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {ekspertyzy.length === 0 ? 'Brak ekspertyz' : 'Brak ekspertyz spełniających kryteria wyszukiwania'}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}