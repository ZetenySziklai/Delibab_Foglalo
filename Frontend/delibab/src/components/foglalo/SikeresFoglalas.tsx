import React from 'react';
import type { ContactForm } from './tipusok';

interface SikeresFoglalasProps {
  contact: ContactForm;
  date: string;
  time: string;
}

export const SikeresFoglalas: React.FC<SikeresFoglalasProps> = ({
  contact,
  date,
  time,
}) => {
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
};
