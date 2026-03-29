import React from 'react';
import type { Idopont } from './tipusok';

interface IdopontEsAsztalValasztasProps {
  setStep: (step: number) => void;
  dbTimeSlots: Idopont[];
  date: string;
  time: string;
  setTime: (time: string) => void;
  setSelectedIdopont: (idopont: Idopont | null) => void;
  setIsLoadingTables: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTable: (tableId: number | null) => void;
  guests: number;
  isLoadingTables: boolean;
  availableTables: any[];
  setAvailableTables: (tables: any[]) => void;
  selectedTable: number | null;
  error: string | null;
  timeSlotAvailability?: Record<string, boolean>;
}

export const IdopontEsAsztalValasztas: React.FC<IdopontEsAsztalValasztasProps> = ({
  setStep,
  dbTimeSlots,
  date,
  time,
  setTime,
  setSelectedIdopont,
  setIsLoadingTables,
  setError,
  setSelectedTable,
  guests,
  isLoadingTables,
  availableTables,
  setAvailableTables,
  selectedTable,
  error,
  timeSlotAvailability = {},
}) => {
  const formatTimeFromDouble = (num: number) => {
    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="step-container fade-in">
      <button className="back-btn" onClick={() => setStep(1)}>← Vissza</button>

      <div className="time-selection-section">
        <h2>Mikor érkeztek?</h2>
        <div className="meal-times-info-small">
          <p>☕ Reggeli: 11:30-ig | 🍽️ Ebéd: 12:00-18:00 | 🍷 Vacsora: 18:00-tól</p>
        </div>
        <div className="time-grid">
          {dbTimeSlots.length > 0 ? (
            [...dbTimeSlots]
              .sort((a, b) => a.kezdet - b.kezdet)
              .map(slot => {
                const startTimeStr = formatTimeFromDouble(slot.kezdet);
                const endTimeStr = formatTimeFromDouble(slot.veg);
                const displayTime = `${startTimeStr}-${endTimeStr}`;

                // Ellenőrizzük, hogy az időpont a múltban van-e (csak a mai napra)
                const isPast = () => {
                  const today = new Date().toISOString().split('T')[0];
                  if (date !== today) return false;

                  const now = new Date();
                  const slotDate = new Date();
                  const hours = Math.floor(slot.kezdet);
                  const minutes = Math.round((slot.kezdet - hours) * 60);
                  slotDate.setHours(hours, minutes, 0, 0);

                  return slotDate < now;
                };

                const isDisabled = isPast();
                const isFull = timeSlotAvailability[startTimeStr] === false;

                return (
                  <button
                    key={slot.id}
                    className={`time-btn ${time === startTimeStr ? 'active' : ''} ${isDisabled ? 'disabled' : ''} ${isFull ? 'full' : ''}`}
                    disabled={isDisabled || isFull}
                    onClick={async () => {
                      setTime(startTimeStr);
                      setSelectedIdopont(slot);
                      setIsLoadingTables(true);
                      setError(null);
                      setSelectedTable(null); // Reset table selection when time changes
                      try {
                        const response = await fetch(`http://localhost:8000/api/asztalok/szabad/list?datum=${date}&idopont=${startTimeStr}:00&helyekSzama=${guests}`, {
                          credentials: 'include',
                        });

                        if (response.ok) {
                          const data = await response.json();
                          let szabadAsztalok: any[] = data.szabad_asztalok || [];

                          // Lekérjük az összes foglalást + foglalási adatot, szűrünk dátum + IdopontId + asztal_id alapján
                          try {
                            const [foglalasResponse, adatokResponse] = await Promise.all([
                              fetch(`http://localhost:8000/api/foglalasok`, { credentials: 'include' }),
                              fetch(`http://localhost:8000/api/foglalasi-adatok`, { credentials: 'include' }),
                            ]);
                            if (foglalasResponse.ok && adatokResponse.ok) {
                              const foglalasok = await foglalasResponse.json();
                              const foglalasiAdatok = await adatokResponse.json();

                              const foglaltAsztalIds = new Set(
                                foglalasok
                                  .filter((f: any) => {
                                    if (f.IdopontId !== slot.id) return false;
                                    const adat = foglalasiAdatok.find((a: any) => a.FoglalasId === f.id);
                                    if (!adat) return false;
                                    const foglaltNap = new Date(adat.foglalas_datum).toISOString().split('T')[0];
                                    return foglaltNap === date;
                                  })
                                  .map((f: any) => f.asztal_id)
                              );

                              szabadAsztalok = szabadAsztalok.filter((t: any) => !foglaltAsztalIds.has(t.id));
                            }
                          } catch {
                            // Ha a lekérés nem sikerül, maradjon az eredeti lista
                          }

                          setAvailableTables(szabadAsztalok);
                        } else {
                          if (response.status === 500) {
                            throw new Error('Nem sikerült csatlakozni a szerverhez.');
                          }
                          throw new Error("Nem sikerült lekérdezni a szabad asztalokat.");
                        }
                      } catch (err: any) {
                        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                          setError('Nem sikerült csatlakozni a szerverhez.');
                        } else {
                          setError(err.message || 'Váratlan hiba történt.');
                        }
                      } finally {
                        setIsLoadingTables(false);
                      }
                    }}
                  >
                    {displayTime}
                  </button>
                );
              })
          ) : (
            <p className="no-timeslots-msg">Jelenleg nincsenek foglalható időpontok.</p>
          )}
        </div>
      </div>

      {time && (
        <div className="table-selection-section" style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <h2>Válassz asztalt</h2>
          {isLoadingTables ? (
            <p className="text-center">Asztalok betöltése...</p>
          ) : availableTables.length > 0 ? (
            <div className="table-grid">
              {[...availableTables]
                .sort((a, b) => a.helyek_szama - b.helyek_szama || a.id - b.id)
                .map(table => (
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
};