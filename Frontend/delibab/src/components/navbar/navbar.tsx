import React, { useState } from 'react';
import './navbar.css';

interface NavbarProps {
  onFoglalasClick?: () => void;
  onLoginClick?: () => void;
  onHomeClick?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  user?: { vezeteknev: string; keresztnev: string; telefonszam: string } | null;
}

const Navbar: React.FC<NavbarProps> = ({ onFoglalasClick, onLoginClick, onHomeClick, onLogout, isLoggedIn, user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = (callback?: () => void) => {
        setIsMenuOpen(false);
        callback?.();
    };

    return (
        <nav>
            {isLoggedIn && user ? (
                <div className="user-profile">
                    <div className="user-avatar">{user.keresztnev[0].toUpperCase()}</div>
                    <div className="user-details">
                        <span className="welcome-msg">Szia,</span>
                        <span className="user-name">{user.keresztnev}!</span>
                        <button 
                            className="logout-link" 
                            onClick={() => {
                                handleLinkClick(onLogout);
                            }}
                        >
                            Kijelentkezés
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    className="login-icon-btn" 
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(onLoginClick);
                    }}
                    aria-label="Bejelentkezés"
                >
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="user-icon"
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>
            )}
            <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
                <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
            <div className={`navigacio ${isMenuOpen ? 'mobile-open' : ''}`}>
                <p>
                  <img src="/kepek/delibab_ikon.png" alt="etterem_icon" className="ikon" />
                </p>
                
                <a href="#menu" onClick={(e) => handleLinkClick(onHomeClick)}>Menü</a>
                <a href="#gasztronomia" onClick={(e) => handleLinkClick(onHomeClick)}>Gasztronómia</a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(onFoglalasClick);
                  }}
                >
                  Foglalás
                </a>
                <a href="#kapcsolat" onClick={(e) => handleLinkClick(onHomeClick)}>Kapcsolat</a>
            </div>
            {isMenuOpen && <div className="nav-overlay" onClick={toggleMenu}></div>}
        </nav>
    );
}



export default Navbar;