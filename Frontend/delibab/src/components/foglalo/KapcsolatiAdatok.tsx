import React from 'react';
import type { ContactForm } from './tipusok';

interface KapcsolatiAdatokProps {
  setStep: (step: number) => void;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  contact: ContactForm;
  handleContactChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  date: string;
  time: string;
  isSubmitting: boolean;
}

export const KapcsolatiAdatok: React.FC<KapcsolatiAdatokProps> = ({
  setStep,
  error,
  handleSubmit,
  contact,
  handleContactChange,
  date,
  time,
  isSubmitting,
}) => {
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
              readOnly
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
              readOnly
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
            readOnly
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
            readOnly
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
};
