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
      const response = await fetch(`http://localhost:8000/api/users/email/${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Felhasználó nem található ezzel az email címmel.');
        }
        throw new Error('Hiba történt a bejelentkezés során.');
      }

      const users = await response.json();
      const user = Array.isArray(users) ? users[0] : users;

      if (user && user.jelszo === password) {
        if (onLoginSuccess) onLoginSuccess(user);
      } else {
        throw new Error('Hibás jelszó!');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Váratlan hiba történt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Bejelentkezés</h2>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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
