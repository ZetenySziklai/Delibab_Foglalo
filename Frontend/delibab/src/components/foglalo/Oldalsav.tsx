import React from 'react';

export const Oldalsav: React.FC = () => {
  return (
    <div className="foglalo-sidebar">
      <div className="sidebar-content">
        <h2>Délibáb Kávézó és Street Food</h2>
        <div className="info-block">
          <h3>📍 Cím</h3>
          <p>Cegléd, Szabadság tér 1</p>
        </div>
        <div className="info-block">
          <h3>🕒 Nyitvatartás</h3>
          <p>Hétfő - Vasárnap</p>
          <p>08:00 - 22:00</p>
        </div>
        <div className="info-block">
          <h3>📞 Kapcsolat</h3>
          <p><a href="tel:+36302446727">+36 30 322 9001</a></p>
          <p><a href="mailto:delibabcegled@gmail.hu">delibabcegled@gmail.com</a></p>
        </div>
        <div className="info-block meal-times-sidebar">
          <h3>🍽️ Konyha</h3>
          <p>Reggeli: 08:00 - 11:30</p>
          <p>Ebéd: 12:00 - 18:00</p>
          <p>Vacsora: 18:00 - 22:00</p>
        </div>
      </div>
    </div>
  );
};
