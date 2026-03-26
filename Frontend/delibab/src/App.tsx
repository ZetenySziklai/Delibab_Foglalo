import './App.css'
import { useState, useEffect } from 'react'
import Navbar from './components/navbar/navbar'
import Kartya from './components/kartya/kartya'
import { FoglaloOldal } from './components/foglalo/foglalo';
import Login from './components/Login';
import Register from './components/Register';
import Modal from './components/Modal';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'foglalo' | 'login' | 'register'>('home')
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true')
  const [user, setUser] = useState<{ id: number; email: string; vezeteknev: string; keresztnev: string; telefonszam: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/status', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const userData = data.user || data;
          if (userData && (userData.id || userData.email || userData.keresztnev)) {
            setIsLoggedIn(true);
            setUser(userData);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error('Invalid user data');
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
        // If the check fails (e.g. server down), we might want to keep the local state 
        // OR clear it. Usually safer to clear if it's a 401/403, but here we just log.
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (isLoadingAuth && !isLoggedIn) {
    return <div className="loading-screen">Betöltés...</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      setCurrentPage('home');
    }
  }

  const handleFoglalasClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      setCurrentPage('foglalo');
    }
  }

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    setCurrentPage('login');
  }

  if (currentPage === 'foglalo') {
    return <FoglaloOldal onBack={() => setCurrentPage('home')} isLoggedIn={isLoggedIn} onLoginClick={() => setCurrentPage('login')} user={user} />
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'login':
        return (
          <section className="auth-page">
            <Login 
              onSwitch={() => setCurrentPage('register')} 
              onLoginSuccess={(userData) => { 
                setIsLoggedIn(true); 
                setUser(userData);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(userData));
                setCurrentPage('home'); 
              }} 
            />
            <button className="btn back-btn" onClick={() => setCurrentPage('home')}>Vissza a főoldalra</button>
          </section>
        );
      case 'register':
        return (
          <section className="auth-page">
            <Register onSwitch={() => setCurrentPage('login')} />
            <button className="btn back-btn" onClick={() => setCurrentPage('home')}>Vissza a főoldalra</button>
          </section>
        );
      default:
        return (
          <>
            <Kartya
              id="menu"
              title="Menü"
              text={
                "Egy hely, ahol a városi lendület és a laza kávézóhangulat találkozik. Friss, ízekben gazdag ételek, különleges kávék és barátságos légkör vár mindenkit. Délibáb, ahol minden falat és korty egy kis kikapcsolódás."
              }
              buttons={[{ href: '/kepek/delibab_etlap.pdf', label: 'Étlap', external: true, className: 'btn' }]}
            />

            <Kartya
              id="gasztronomia"
              title="Gasztronómia"
              text={
                'Merüljön el a Délibáb laza, mégis modern világában, ahol a frissen főzött kávékülönlegességek illata és a legfinomabb utcai ételek ízvilága alkot tökéletes harmóniát! Kóstolja meg zamatos hamburgereinket vagy ropogós wrapjeinket, majd koronázza meg az élményt egy mennyei desszerttel. Nálunk minden falatot és kortyot szenvedéllyel, kiváló minőségi alapanyagokból készítünk. Legyen szó pörgős reggeliről, egy gyors ebédről, délutáni lazításról vagy esti baráti összejövetelről, barátságos enteriőrünk és kellemes teraszunk mindig nyitva áll.'
              }
            />

            <Kartya
              id="kapcsolat"
              title="KAPCSOLAT"
              buttons={[
                { href: '#', label: 'Foglalás', external: false, className: 'btn', onClick: handleFoglalasClick },
                {
                  href: 'https://www.google.com/maps/place/D%C3%A9lib%C3%A1b+k%C3%A1v%C3%A9z%C3%B3+%C3%A9s+Street+Food/@47.171818,19.7966277,16z/data=!4m6!3m5!1s0x474170f67aa0a9f5:0x4576a795714e678c!8m2!3d47.1710083!4d19.7974191!16s%2Fg%2F1v0ljk2r?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D',
                  label: 'Navigáció',
                  external: true,
                  className: 'btn',
                },
              ]}
            >
              <p>
                A Délibáb Kávézó és Street Food Cegléd szívében található, ahol a város nyüzsgése és a finom ízek találkoznak. Látogasson el hozzánk, élvezze a friss kávékat és a különleges street food ételeket!
              </p>

              <div className="contact-info">
                <p>
                  <strong>Név:</strong> Délibáb Kávézó és Street Food
                </p>
                <p>
                  <strong>Telefon:</strong> +36 30 322 9001
                </p>
                <p>
                  <strong>Cím:</strong> Cegléd, Szabadság tér 1.
                </p>
                <p>
                  <strong>Email:</strong> delibabcegled@gmail.com
                </p>
              </div>
            </Kartya>
          </>
        );
    }
  }

  return (
    <div className="app-layout">
      <Navbar 
        onFoglalasClick={handleFoglalasClick} 
        onLoginClick={() => setCurrentPage('login')}
        onHomeClick={() => setCurrentPage('home')}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        user={user}
      />

      <main>

        {renderContent()}
      </main>

      <Modal 
        isOpen={isModalOpen}
        title="Bejelentkezés szükséges"
        message="A foglalás véglegesítéséhez kérjük, jelentkezz be a fiókodba!"
        onConfirm={handleModalConfirm}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default App
