import React from 'react';
import './navbar.css';

interface NavbarProps {
  onFoglalasClick?: () => void;
  onLoginClick?: () => void;
  onHomeClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFoglalasClick, onLoginClick, onHomeClick }) => {
    return (
        <nav>
            <div className="navigacio">
                <p>
                  <img src="/kepek/delibab_ikon.png" alt="etterem_icon" className="ikon" />
                </p>
                <a href="#menu" onClick={(e) => { if(onHomeClick) { onHomeClick(); } }}>Menü</a>
                <a href="#gasztronomia" onClick={(e) => { if(onHomeClick) { onHomeClick(); } }}>Gasztronómia</a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onFoglalasClick?.();
                  }}
                >
                  Foglalás
                </a>
                <a href="#kapcsolat" onClick={(e) => { if(onHomeClick) { onHomeClick(); } }}>Kapcsolat</a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onLoginClick?.();
                  }}
                >
                  Belépés
                </a>
            </div>
        </nav>
    );
}



export default Navbar;