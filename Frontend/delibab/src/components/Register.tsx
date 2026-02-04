import React, { useState } from 'react';

const Register: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('A jelszavak nem egyeznek!');
      return;
    }
    console.log('Register attempt:', { lastName, firstName, email, phone, password });
    // Majd itt lesz a backend hívás
  };

  return (
    <div className="auth-container">
      <h2>Regisztráció</h2>
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
            required 
          />
        </div>
        <div className="form-group">
          <label>Telefonszám:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
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
        <button type="submit">Regisztráció</button>
      </form>
      <p>
        Már van fiókod? <button onClick={onSwitch}>Bejelentkezés</button>
      </p>
    </div>
  );
};

export default Register;
