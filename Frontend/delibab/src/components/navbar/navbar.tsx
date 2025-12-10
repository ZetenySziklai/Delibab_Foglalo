import React from 'react';
import './navbar.css';

interface NavbarProps {
  onFoglalasClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFoglalasClick }) => {
    return (
        <nav>
            <div className="navigacio">
                <p><img src="/kepek/delibab_ikon.png" alt="etterem_icon" className="ikon" /></p>
                <a href="#menu">Menü</a>
                <a href="#gasztronomia">Gasztronómia</a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onFoglalasClick?.();
                  }}
                >
                  Foglalás
                </a>
                <a href="#kapcsolat">Kapcsolat</a>
            </div>
        </nav>
    );
}

export default Navbar;