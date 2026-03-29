import React, { useState, useEffect } from 'react';
import './foglalo.css';
import type { ContactForm, Idopont, FoglaloOldalProps } from './tipusok';
import { Oldalsav } from './Oldalsav';
import { DatumValasztas } from './DatumValasztas';
import { IdopontEsAsztalValasztas } from './IdopontEsAsztalValasztas';
import { KapcsolatiAdatok } from './KapcsolatiAdatok';
import { SikeresFoglalas } from './SikeresFoglalas';

export const FoglaloOldal: React.FC<FoglaloOldalProps> = ({ onBack, isLoggedIn, onLoginClick, user }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedIdopont, setSelectedIdopont] = useState<Idopont | null>(null);
  const [dbTimeSlots, setDbTimeSlots] = useState<Idopont[]>([]);
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
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);
  const [timeSlotAvailability, setTimeSlotAvailability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchIdopontok = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/idopontok');
        if (response.ok) {
          const data = await response.json();
          setDbTimeSlots(data);
        } else {
          setError("Nem sikerült lekérdezni az időpontokat.");
        }
      } catch (err) {
        console.error('Hiba az időpontok lekérésekor:', err);
        setError("Hiba történt az időpontok betöltésekor.");
      } finally {
        setIsLoadingTimes(false);
      }
    };
    fetchIdopontok();
  }, []);

  const formatTimeFromDouble = (num: number) => {
    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchAllAvailability = async () => {
      if (!date || dbTimeSlots.length === 0) return;

      // Lekérjük a foglalásokat és foglalási adatokat a dátum+IdopontId alapú szűréshez
      let osszesFoglalas: any[] = [];
      let osszesFoglalasiAdatok: any[] = [];
      try {
        const [foglalasRes, adatokRes] = await Promise.all([
          fetch(`http://localhost:8000/api/foglalasok`, { credentials: 'include' }),
          fetch(`http://localhost:8000/api/foglalasi-adatok`, { credentials: 'include' }),
        ]);
        if (foglalasRes.ok) osszesFoglalas = await foglalasRes.json();
        if (adatokRes.ok) osszesFoglalasiAdatok = await adatokRes.json();
      } catch {}

      const availability: Record<string, boolean> = {};

      const checkPromises = dbTimeSlots.map(async (slot) => {
        const startTimeStr = formatTimeFromDouble(slot.kezdet);
        try {
          const response = await fetch(`http://localhost:8000/api/asztalok/szabad/list?datum=${date}&idopont=${startTimeStr}:00&helyekSzama=${contact.adults + contact.children}`, {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            let szabadAsztalok = data.szabad_asztalok || [];

            // Kiszűrjük az adott napon + adott időponton már foglalt asztalokat
            const foglaltIds = new Set(
              osszesFoglalas
                .filter((f: any) => {
                  if (f.IdopontId !== slot.id) return false;
                  const adat = osszesFoglalasiAdatok.find((a: any) => a.FoglalasId === f.id);
                  if (!adat) return false;
                  const foglaltNap = new Date(adat.foglalas_datum).toISOString().split('T')[0];
                  return foglaltNap === date;
                })
                .map((f: any) => f.asztal_id)
            );
            szabadAsztalok = szabadAsztalok.filter((t: any) => !foglaltIds.has(t.id));

            availability[startTimeStr] = szabadAsztalok.length > 0;
          } else {
            availability[startTimeStr] = false;
          }
        } catch (err) {
          console.error(`Hiba az elérhetőség lekérésekor (${startTimeStr}):`, err);
          availability[startTimeStr] = false;
        }
      });

      await Promise.all(checkPromises);
      setTimeSlotAvailability(availability);
    };

    fetchAllAvailability();
  }, [date, dbTimeSlots, contact.adults, contact.children]);

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
      // Ellenőrzés: az asztal még szabad-e közvetlenül a foglalás előtt (dátum + IdopontId + asztal_id alapján)
      try {
        const [checkFoglalas, checkAdatok] = await Promise.all([
          fetch(`http://localhost:8000/api/foglalasok`, { credentials: 'include' }),
          fetch(`http://localhost:8000/api/foglalasi-adatok`, { credentials: 'include' }),
        ]);
        if (checkFoglalas.ok && checkAdatok.ok) {
          const foglalasok = await checkFoglalas.json();
          const foglalasiAdatok = await checkAdatok.json();
          const mar_foglalt = foglalasok.some((f: any) => {
            if (f.IdopontId !== selectedIdopont?.id || f.asztal_id !== selectedTable) return false;
            const adat = foglalasiAdatok.find((a: any) => a.FoglalasId === f.id);
            if (!adat) return false;
            const foglaltNap = new Date(adat.foglalas_datum).toISOString().split('T')[0];
            return foglaltNap === date;
          });
          if (mar_foglalt) {
            setError("Ez az asztal már nem szabad ebben az időpontban. Kérjük válasszon másikat.");
            setSelectedTable(null);
            setStep(3);
            setIsSubmitting(false);
            return;
          }
        }
      } catch {}

      const reservationDateTime = `${date} ${time}:00`;
      const now = new Date();
      now.setHours(now.getHours() + 2);
      const nowFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const foglalasData = {
        user_id: user.id,
        asztal_id: selectedTable,
        foglalas_datum: nowFormatted,
        IdopontId: selectedIdopont?.id,
      };

      const response = await fetch('http://localhost:8000/api/foglalasok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foglalasData),
      });

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Nem sikerült csatlakozni a szerverhez.');
        }
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Hiba történt a foglalás során.');
      }

      const result = await response.json();
      const foglalasId = result.id;

      const startDate = new Date(reservationDateTime);
      startDate.setHours(startDate.getHours() + 2);

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

      const tableInfo = availableTables.find(t => t.id === selectedTable);
      const tableLabel = tableInfo
        ? `${tableInfo.id}. számú asztal`
        : `${selectedTable}. számú asztal`;

      await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${contact.lastName} ${contact.firstName}`,
          message: `Sikeres asztal foglalás\n\nDátum: ${date}\nIdőpont: ${time}\nAsztal: ${tableLabel}\nFelnőtt: ${contact.adults}, Gyerek: ${contact.children}\nTelefon: ${contact.phone}${contact.notes ? `\nMegjegyzés: ${contact.notes}` : ''}`,
        }),
        credentials: "include",
      }).catch(err => console.error('Email küldési hiba:', err));

      setStep(6);
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Nem sikerült csatlakozni a szerverhez.');
      } else {
        setError(err.message || 'Váratlan hiba történt.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <DatumValasztas
            onBack={onBack}
            date={date}
            setDate={(newDate) => {
              setDate(newDate);
              setTime('');
              setSelectedIdopont(null);
              setSelectedTable(null);
              setAvailableTables([]);
              setError(null);
            }}
            setStep={setStep}
            isLoadingTimes={isLoadingTimes}
          />
        );
      case 3:
        return (
          <IdopontEsAsztalValasztas
            setStep={setStep}
            dbTimeSlots={dbTimeSlots}
            date={date}
            time={time}
            setTime={setTime}
            setSelectedIdopont={setSelectedIdopont}
            setIsLoadingTables={setIsLoadingTables}
            setError={setError}
            setSelectedTable={setSelectedTable}
            guests={contact.adults + contact.children}
            isLoadingTables={isLoadingTables}
            availableTables={availableTables}
            setAvailableTables={setAvailableTables}
            selectedTable={selectedTable}
            error={error}
            timeSlotAvailability={timeSlotAvailability}
          />
        );
      case 5:
        return (
          <KapcsolatiAdatok
            setStep={setStep}
            error={error}
            handleSubmit={handleSubmit}
            contact={contact}
            handleContactChange={handleContactChange}
            date={date}
            time={time}
            isSubmitting={isSubmitting}
          />
        );
      case 6:
        return (
          <SikeresFoglalas
            contact={contact}
            date={date}
            time={time}
          />
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
      <Oldalsav />
      <div className="foglalo-main-content">
        {renderStep()}
      </div>
    </div>
  );
};