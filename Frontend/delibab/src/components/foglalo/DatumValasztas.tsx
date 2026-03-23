import React from 'react';

interface DatumValasztasProps {
  onBack: () => void;
  date: string;
  setDate: (date: string) => void;
  setStep: (step: number) => void;
  isLoadingTimes: boolean;
}

export const DatumValasztas: React.FC<DatumValasztasProps> = ({
  onBack,
  date,
  setDate,
  setStep,
  isLoadingTimes,
}) => {
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
};
