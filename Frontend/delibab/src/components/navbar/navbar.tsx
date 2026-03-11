import React, { useState } from 'react';
import './navbar.css';

interface NavbarProps {
  onFoglalasClick?: () => void;
  onLoginClick?: () => void;
  onHomeClick?: () => void;
  isLoggedIn?: boolean;
  user?: { vezeteknev: string; keresztnev: string; telefonszam: string } | null;
}

const Navbar: React.FC<NavbarProps> = ({ onFoglalasClick, onLoginClick, onHomeClick, isLoggedIn, user }) => {
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
                {isLoggedIn ? (
                  <span className="user-name">Szia, {user?.keresztnev}!</span>
                ) : (
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(onLoginClick);
                    }}
                  >
                    Belépés
                  </a>
                )}
            </div>
            {isMenuOpen && <div className="nav-overlay" onClick={toggleMenu}></div>}
        </nav>
    );
}



export default Navbar;