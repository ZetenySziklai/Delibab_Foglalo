import './App.css'
import Navbar from './components/navbar/navbar'
import Kartya from './components/kartya/kartya'

function App() {
  return (
    <>
      <Navbar />

      <Kartya
        id="menu"
        title="Menü"
        text={
          "Egy hely, ahol a városi lendület és a laza kávézóhangulat találkozik. Friss, ízekben gazdag ételek, különleges kávék és barátságos légkör vár mindenkit. Délibáb, ahol minden falat és korty egy kis kikapcsolódás."
        }
        buttons={[{ href: 'https://www.facebook.com/delibabkavezo/?locale=hu_HU', label: 'Étlap', external: true, className: 'btn' }]}
      />

      <Kartya
        id="gasztronomia"
        title="Gasztronómia"
        text={
          'Egy hely, ahol a kávé illata és a street food ízei találkoznak. Merüljön el a Délibáb hangulatában, ahol a friss, illatos kávékülönlegességek és a street food fogások laza, modern világát egyesítjük! Kóstolja meg zamatos hamburgereinket, ropogós wrapjeinket, frissensült street food kedvenceinket, és élvezze mellé a legfinomabb kávék és desszertek varázsát! A Délibábban minden falat és korty egy kis élmény, amelyet minőségi alapanyagokkal és szenvedéllyel készítünk. Legyen szó reggeli kávéról, gyors ebédről, délutáni sütizésről vagy esti baráti összejövetelről, a Délibáb Kávézó és Street Food mindig tökéletes választás – barátságos, pezsgő és otthonos egyszerre. A modern enteriőr és a kellemes terasz légköre találkozóhelyet teremt mindenkinek, aki szereti a jó ízeket, a laza hangulatot és a közös pillanatokat. A Délibáb több mint egy kávézó: egy hely, ahol a város szíve és az ízek harmóniája találkozik.'
        }
      />

      <Kartya
        id="kapcsolat"
        title="KAPCSOLAT"
        buttons={[
          { href: './foglalooldal.html', label: 'Foglalás', external: true, className: 'btn' },
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
            <strong>Telefon:</strong> +36 30 244 6727
          </p>
          <p>
            <strong>Cím:</strong> Cegléd, Szabadság tér 1
          </p>
          <p>
            <strong>Email:</strong> delibabcegled@gmail.hu
          </p>
        </div>
      </Kartya>
    </>
  )
}

export default App














// const [count, setCount] = useState(0)
// <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>