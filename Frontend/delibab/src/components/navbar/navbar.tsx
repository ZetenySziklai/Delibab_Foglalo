import React from 'react';
import './navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav>
            <div className="navigacio">
                <p><img src="/kepek/delibab_ikon.png" alt="etterem_icon" className="ikon" /></p>
                <a href="#menu">Menü</a>
                <a href="#gasztronomia">Gasztronómia</a>
                <a href="./foglalooldal.html" target="_blank" rel="noreferrer">Foglalás</a>
                <a href="#kapcsolat">Kapcsolat</a>
            </div>
        </nav>
    );
}

export default Navbar;