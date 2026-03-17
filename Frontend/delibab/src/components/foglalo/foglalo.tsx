import React, { useState } from 'react';
import './foglalo.css';

interface ContactForm {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  notes: string;
  terms: boolean;
  adults: number;
  children: number;
}

interface FoglaloOldalProps {
  onBack: () => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  user: { id: number; email: string; vezeteknev: string; keresztnev: string; telefonszam: string } | null;
}

export const FoglaloOldal: React.FC<FoglaloOldalProps> = ({ onBack, isLoggedIn, onLoginClick, user }) => {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [contact, setContact] = useState<ContactForm>({
    lastName: user?.vezeteknev || '',
    firstName: user?.keresztnev || '',
    email: user?.email || '',
    phone: user?.telefonszam || '',
    notes: '',
    terms: false,
    adults: 1,
    children: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // Dátum generálás (holnaptól kezdve 30 nap)
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  // Időpont generálás
  const timeSlots = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00'
  ];

  const getMealType = (timeStr: string) => {
    const hour = parseInt(timeStr.split(':')[0], 10);
    const minutes = parseInt(timeStr.split(':')[1], 10);
    const totalMinutes = hour * 60 + minutes;

    if (totalMinutes < 12 * 60) return 'Reggeli'; // 11:30-ig tartó sáv még reggeli
    if (totalMinutes < 18 * 60) return 'Ebéd';
    return 'Vacsora';
  };

  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours + 1, minutes);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setContact(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) || 0 : value)
      };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("A foglaláshoz be kell jelentkezni!");
      return;
    }
    if (!selectedTable) {
      setError("Kérjük válasszon egy asztalt!");
      return;
    }

    const table = availableTables.find(t => t.id === selectedTable);
    const totalGuests = contact.adults + contact.children;

    if (table && totalGuests > table.helyek_szama) {
      setError(`Az asztal maximum ${table.helyek_szama} fős! Kérjük csökkentse a létszámot.`);
      return;
    }

    if (totalGuests < 1) {
      setError("Legalább egy főre kell foglalni!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {      
      // Amikorra foglalt → FoglalasiAdatok.foglalas_datum
      const [hour, minute] = time.split(':').map(Number);
      const correctedHour = (hour).toString().padStart(2, '0');
      const reservationDateTime = `${date} ${correctedHour}:${minute.toString().padStart(2, '0')}:00`;

      console.log(reservationDateTime);

      // Most (létrehozás pillanata) → Foglalas.foglalas_datum
      const now = new Date();
      const nowFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours() + 1).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;


      const endDate = new Date(reservationDateTime);
      endDate.setHours(endDate.getHours() + 1);

      const idopontResponse = await fetch("http://localhost:8000/api/idopontok",
      {
        method: "POST",

        body: JSON.stringify(
        {
           kezdet: hour + (minute / 30 == 1 ? 0.5 : 0),
           veg: Number(endDate.getHours()) + (endDate.getMinutes() / 30 == 1 ? 0.5 : 0),
        }),

        headers:
        {
          "Content-Type": "application/json",
        },
      });

      const idopontId = (await idopontResponse.json()).id;

      if (!idopontResponse.ok) {
        const errorData = await idopontResponse.json();
        console.error('Időpont mentési hiba:', errorData);
      }

      const foglalasData = {
        user_id: user.id,
        asztal_id: selectedTable,
        foglalas_datum: nowFormatted,
        IdopontId: idopontId,
      };

      const response = await fetch('http://localhost:8000/api/foglalasok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foglalasData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Hiba történt a foglalás során.');
      }

      const result = await response.json();
      const foglalasId = result.id;



      const startDate = new Date(reservationDateTime);
      startDate.setHours(startDate.getHours() + 1);

      const fogAdatokResponse = await fetch('http://localhost:8000/api/foglalasi-adatok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FoglalasId: foglalasId,
          felnott: contact.adults,
          gyerek: contact.children,
          megjegyzes: contact.notes,
          foglalas_datum: startDate,
        }),
      });

      if (!fogAdatokResponse.ok) {
        const errorData = await fogAdatokResponse.json();
        console.error('Foglalási adatok mentési hiba:', errorData);
      }

     

      setStep(6);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Váratlan hiba történt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="step-container fade-in">
            <button className="back-btn" onClick={onBack}>← Vissza</button>
            <h2>Melyik napon?</h2>
            <div className="date-grid">
              {getNextDays().map(day => (
                <button
                  key={day}
                  className={`date-btn ${date === day ? 'active' : ''}`}
                  disabled={isLoadingTimes}
                  onClick={() => {
                    setDate(day);
                    setStep(3);
                  }}
                >
                  {new Date(day).toLocaleDateString('hu-HU', { weekday: 'short', month: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-container fade-in">
            <button className="back-btn" onClick={() => setStep(1)}>← Vissza</button>
           
            <div className="time-selection-section">
              <h2>Mikor érkeztek?</h2>
              <div className="meal-times-info-small">
                <p>☕ Reggeli: 11:30-ig | 🍽️ Ebéd: 12:00-18:00 | 🍷 Vacsora: 18:00-tól</p>
              </div>
              <div className="time-grid">
                {timeSlots.map(slot => {
                  const displayTime = `${slot}-${calculateEndTime(slot)}`;
                 
                  // Ellenőrizzük, hogy az időpont a múltban van-e (csak a mai napra)
                  const isPast = () => {
                    const today = new Date().toISOString().split('T')[0];
                    if (date !== today) return false;

                    const now = new Date();
                    const [slotHour, slotMinute] = slot.split(':').map(Number);
                    const slotDate = new Date();
                    slotDate.setHours(slotHour, slotMinute, 0, 0);

                    return slotDate < now;
                  };

                  const isDisabled = isPast();

                  return (
                    <button
                      key={slot}
                      className={`time-btn ${time === slot ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                      disabled={isDisabled}
                      onClick={async () => {
                        setTime(slot);
                        setIsLoadingTables(true);
                        setError(null);
                        setSelectedTable(null); // Reset table selection when time changes
                        try {
                          const response = await fetch(`http://localhost:8000/api/asztalok/szabad/list?datum=${date}&idopont=${slot}:00&helyekSzama=${guests}`, {
                            credentials: 'include',
                          });
                         
                          if (response.ok) {
                            const data = await response.json();
                            setAvailableTables(data.szabad_asztalok || []);
                          } else {
                            throw new Error("Nem sikerült lekérdezni a szabad asztalokat.");
                          }
                        } catch (err: any) {
                          setError(err.message);
                        } finally {
                          setIsLoadingTables(false);
                        }
                      }}
                    >
                      {displayTime}
                    </button>
                  );
                })}
              </div>
            </div>

            {time && (
              <div className="table-selection-section" style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
                <h2>Válassz asztalt</h2>
                {isLoadingTables ? (
                  <p className="text-center">Asztalok betöltése...</p>
                ) : availableTables.length > 0 ? (
                  <div className="table-grid">
                    {availableTables.map(table => (
                      <button
                        key={table.id}
                        className={`table-btn ${selectedTable === table.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedTable(table.id);
                          setStep(5);
                        }}
                      >
                        Asztal ({table.helyek_szama} fő)
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center">Sajnos nincs szabad asztal ebben az időpontban.</p>
                )}
              </div>
            )}
            {error && <p className="error-message">{error}</p>}
          </div>
        );
      case 5:
        return (
          <div className="step-container fade-in">
            <button className="back-btn" onClick={() => setStep(3)}>← Vissza</button>
            <h2>Elérhetőségek</h2>
           
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group half">
                    <label>Felnőtt *</label>
                    <input
                    type="number"
                    name="adults"
                    value={contact.adults}
                    onChange={handleContactChange}
                    min="0"
                    required
                    />
                </div>
                <div className="form-group half">
                    <label>Gyermek *</label>
                    <input
                    type="number"
                    name="children"
                    value={contact.children}
                    onChange={handleContactChange}
                    min="0"
                    required
                    />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                    <label>Vezetéknév *</label>
                    <input
                    type="text"
                    name="lastName"
                    value={contact.lastName}
                    onChange={handleContactChange}
                    required
                    />
                </div>
                <div className="form-group half">
                    <label>Keresztnév *</label>
                    <input
                    type="text"
                    name="firstName"
                    value={contact.firstName}
                    onChange={handleContactChange}
                    required
                    />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefonszám *</label>
                <input
                  type="tel"
                  name="phone"
                  value={contact.phone}
                  onChange={handleContactChange}
                  required
                  placeholder="06301234567"
                />
              </div>
              <div className="form-group">
                <label>Megjegyzés</label>
                <textarea
                  name="notes"
                  value={contact.notes}
                  onChange={handleContactChange}
                  rows={3}
                />
              </div>
             
              <div className="summary-preview">
                <p><strong>Foglalás részletei:</strong></p>
                <p>👤 {contact.adults} felnőtt, {contact.children} gyerek</p>
                <p>📅 {date} {time}</p>
                <p>📞 {contact.phone}</p>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  checked={contact.terms}
                  onChange={handleContactChange}
                  required
                />
                <label htmlFor="terms">Elolvastam és elfogadom az Adatvédelmi szabályzatot</label>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Küldés...' : 'Foglalás véglegesítése'}
              </button>
            </form>
          </div>
        );
      case 6:
        return (
          <div className="step-container fade-in success-step">
            <div className="success-icon">✓</div>
            <h2>Köszönjük!</h2>
            <p>Megkaptuk foglalási igényét.</p>
            <p>Hamarosan e-mailben értesítjük a megerősítésről.</p>
            <div className="final-summary">
              <p><strong>Délibáb Kávézó és Street Food</strong></p>
              <p>👤 {contact.adults} felnőtt, {contact.children} gyerek</p>
              <p>📅 {date}</p>
              <p>⏰ {time}</p>
              <p>📞 {contact.phone}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="foglalo-wrapper">
      <button onClick={onBack} className="main-back-btn">
        ← Vissza a főoldalra
      </button>
      <div className="foglalo-sidebar">
        <div className="sidebar-content">
          <h2>Délibáb Kávézó és Street Food</h2>
          <div className="info-block">
            <h3>📍 Cím</h3>
            <p>Cegléd, Szabadság tér 1</p>
          </div>
          <div className="info-block">
            <h3>🕒 Nyitvatartás</h3>
            <p>Hétfő - Vasárnap</p>
            <p>08:00 - 22:00</p>
          </div>
          <div className="info-block">
            <h3>📞 Kapcsolat</h3>
            <p><a href="tel:+36302446727">+36 30 322 9001</a></p>
            <p><a href="mailto:delibabcegled@gmail.hu">delibabcegled@gmail.com</a></p>
          </div>
          <div className="info-block meal-times-sidebar">
             <h3>🍽️ Konyha</h3>
             <p>Reggeli: 08:00 - 11:30</p>
             <p>Ebéd: 12:00 - 18:00</p>
             <p>Vacsora: 18:00 - 22:00</p>
          </div>
        </div>
      </div>
     
      <div className="foglalo-main-content">
        {renderStep()}
      </div>
    </div>
  );
};