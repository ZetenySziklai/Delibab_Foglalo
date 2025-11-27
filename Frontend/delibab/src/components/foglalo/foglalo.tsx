import React, { useState } from 'react';
import './foglalo.css';

interface FoglalasForm {
  name: string;
  phone: string;
  date: string;
  people: string;
  notes: string;
}

interface FoglaloOldalProps {
}

export const FoglaloOldal: React.FC<FoglaloOldalProps> = () => {
  const [formData, setFormData] = useState<FoglalasForm>({
    name: '',
    phone: '',
    date: '',
    people: '1',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Köszönjük, a foglalási kérés rögzítve!');
    setFormData({
      name: '',
      phone: '',
      date: '',
      people: '1',
      notes: '',
    });
  };

  return (
    <div className="foglalo-container">
      <header className="foglalo-header">
        <h1>Foglalás — Délibáb Kávézó</h1>
      </header>
      <main className="foglalo-main">
        <h2>Foglalási űrlap (példa)</h2>
        <p>Töltsd ki az alábbi mezőket, és mi felvesszük veled a kapcsolatot.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Név</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Telefonszám</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="date">Dátum és idő</label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label htmlFor="people">Férőhelyek száma</label>
          <select
            id="people"
            name="people"
            value={formData.people}
            onChange={handleChange}
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5+</option>
          </select>

          <label htmlFor="notes">Megjegyzés</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          ></textarea>

          <button type="submit">Foglalás küldése</button>
        </form>
      </main>
    </div>
  );
};
