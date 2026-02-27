import React, { useState } from 'react';
import './foglalo.css';

interface ContactForm {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  notes: string;
  terms: boolean;
}

interface FoglaloOldalProps {
  onBack: () => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  user: { id: number; email: string; vezeteknev: string; keresztnev: string } | null;
}

export const FoglaloOldal: React.FC<FoglaloOldalProps> = ({ onBack, isLoggedIn, onLoginClick, user }) => {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [contact, setContact] = useState<ContactForm>({
    lastName: user?.vezeteknev || '',
    firstName: user?.keresztnev || '',
    email: user?.email || '',
    phone: '',
    notes: '',
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  // Dátum generálás (következő 14 nap)
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
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

    // Telefonszám validáció
    if (name === 'phone') {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 11) return;
    }

    setContact(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    setIsSubmitting(true);
    setError(null);

    try {
      // 2. Foglalás létrehozása
      const foglalasData = {
        user_id: user.id,
        asztal_id: selectedTable,
        foglalas_datum: `${date} ${time}:00`,
      };

      const response = await fetch('http://localhost:8000/api/foglalasok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foglalasData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba történt a foglalás során.');
      }

      setStep(6); // Success step (now step 6)
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
                    setStep(2);
                  }}
                >
                  {new Date(day).toLocaleDateString('hu-HU', { weekday: 'short', month: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-container fade-in">
            <button className="back-btn" onClick={() => setStep(1)}>← Vissza</button>
            <h2>Hány főre szeretnél foglalni?</h2>
            <div className="guest-selector">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <button 
                  key={num} 
                  className={`guest-btn ${guests === num ? 'active' : ''}`}
                  onClick={() => { setGuests(num); setStep(3); }}
                >
                  {num}
                </button>
              ))}
              <button 
                className={`guest-btn ${guests > 8 ? 'active' : ''}`}
                onClick={() => { setGuests(9); setStep(3); }}
              >
                8+
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-container fade-in">
            <button className="back-btn" onClick={() => setStep(2)}>← Vissza</button>
            <h2>Mikor érkeztek?</h2>
            <div className="meal-times-info-small">
               <p>☕ Reggeli: 11:30-ig | 🍽️ Ebéd: 12:00-18:00 | 🍷 Vacsora: 18:00-tól</p>
            </div>
            <div className="time-grid">
              {timeSlots.map(slot => {
                const displayTime = `${slot}-${calculateEndTime(slot)}`;
                return (
                  <button 
                    key={slot} 
                    className={`time-btn ${time === slot ? 'active' : ''}`}
                    onClick={async () => { 
                      setTime(slot); 
                      setIsLoadingTables(true);
                      setError(null);
                      try {
                        const response = await fetch(`http://localhost:8000/api/asztalok/szabad/list?datum=${date}&idopont=${slot}&helyekSzama=${guests}`);
                        if (response.ok) {
                          const data = await response.json();
                          setAvailableTables(data.szabad_asztalok || []);
                          setStep(4);
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
        );
      case 4:
        return (
          <div className="step-container fade-in">
            <button className="back-btn" onClick={() => setStep(3)}>← Vissza</button>
            <h2>Válassz asztalt</h2>
            {isLoadingTables ? (
              <p>Asztalok betöltése...</p>
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
                    Asztal #{table.id} ({table.helyek_szama} fő)
                  </button>
                ))}
              </div>
            ) : (
              <p>Sajnos nincs szabad asztal ebben az időpontban.</p>
            )}
            {error && <p className="error-message">{error}</p>}
          </div>
        );
      case 5:
        return (
          <div className="step-container fade-in">
            <button className="back-btn" onClick={() => setStep(4)}>← Vissza</button>
            <h2>Elérhetőségek</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="contact-form">
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
                  pattern="^[^@\s]+@[^@\s]+\.[^@\s]{2,}$"
                  title="Kérjük, adjon meg egy érvényes email címet"
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
                  pattern="^\d{11}$"
                  title="A telefonszámnak pontosan 11 számjegyből kell állnia"
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
                <p>👤 {guests} fő</p>
                <p>📅 {date} {time}</p>
                <p>🪑 Asztal #{selectedTable}</p>
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
              <p>👤 {guests} fő</p>
              <p>📅 {date}</p>
              <p>⏰ {time}</p>
              <p>🪑 Asztal #{selectedTable}</p>
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
            <p><a href="tel:+36302446727">+36 30 244 6727</a></p>
            <p><a href="mailto:delibabcegled@gmail.hu">delibabcegled@gmail.hu</a></p>
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