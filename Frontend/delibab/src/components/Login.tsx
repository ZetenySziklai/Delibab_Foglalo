import React, { useState } from 'react';

const Login: React.FC<{ onSwitch: () => void; onLoginSuccess?: () => void }> = ({ onSwitch, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Majd itt lesz a backend hívás
    // Teszteléshez most sikeresnek vesszük:
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="auth-container">
      <h2>Bejelentkezés</h2>
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
        <button type="submit">Belépés</button>
      </form>
      <p>
        Nincs még fiókod? <button onClick={onSwitch}>Regisztráció</button>
      </p>
    </div>
  );
};

export default Login;
