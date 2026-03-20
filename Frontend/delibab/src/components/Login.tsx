import React, { useState } from 'react';

const Login: React.FC<{ onSwitch: () => void; onLoginSuccess?: (userData: any) => void }> = ({ onSwitch, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          jelszo: password,
        }),
      });
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Nem sikerült csatlakozni a szerverhez.');
        }
        if (response.status === 401) {
          throw new Error('Hibás email vagy jelszó');
        }
        const data = await response.json();
        throw new Error(data.message || 'Hiba történt a bejelentkezés során.');
      }

      const data = await response.json();

      if (onLoginSuccess) onLoginSuccess(data.user || data);
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
      <h2>Bejelentkezés</h2>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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
          {isSubmitting ? 'Belépés...' : 'Belépés'}
        </button>
      </form>
      <p>
        Nincs még fiókod? <button onClick={onSwitch}>Regisztráció</button>
      </p>
    </div>
  );
};

export default Login;
