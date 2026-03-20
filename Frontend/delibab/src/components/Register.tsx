import React, { useState } from 'react';

const Register: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          vezeteknev: lastName,
          keresztnev: firstName,
          email: email,
          telefonszam: phone,
          jelszo: password,
        }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Nem sikerült csatlakozni a szerverhez.');
        }
        const errorData = await response.json();
        console.log('Backend hiba:', errorData);
        throw new Error(errorData.msg || errorData.message || 'Hiba történt a regisztráció során.');
      }

      alert('Sikeres regisztráció! Most már bejelentkezhet.');
      onSwitch();
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

  return (
    <div className="auth-container">
      <h2>Regisztráció</h2>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Vezetéknév:</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Keresztnév:</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="pelda@email.hu"
          />
        </div>
        <div className="form-group">
          <label>Telefonszám:</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="06301234567"
          />
        </div>
        <div className="form-group">
          <label>Jelszó:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
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
