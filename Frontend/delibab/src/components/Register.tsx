import React, { useState } from 'react';

const Register: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email validáció: valami@valami.valami
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Kérjük, adjon meg egy érvényes email címet (példa: nev@domain.hu)!');
      return;
    }

    // Telefonszám validáció: pontosan 11 számjegy
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      setError('A telefonszámnak pontosan 11 számjegyből kell állnia (példa: 06301234567)!');
      return;
    }

    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vezeteknev: lastName,
          keresztnev: firstName,
          email: email,
          telefonszam: phone,
          jelszo: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hiba történt a regisztráció során.');
      }

      alert('Sikeres regisztráció! Most már bejelentkezhet.');
      onSwitch();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Váratlan hiba történt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Regisztráció</h2>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Vezetéknév:</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Keresztnév:</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="pelda@email.hu"
            required 
          />
        </div>
        <div className="form-group">
          <label>Telefonszám:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="06301234567"
            required 
          />
        </div>
        <div className="form-group">
          <label>Jelszó:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Jelszó megerősítése:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Regisztráció...' : 'Regisztráció'}
        </button>
      </form>
      <p>
        Már van fiókod? <button onClick={onSwitch}>Bejelentkezés</button>
      </p>
    </div>
  );
};

export default Register;
