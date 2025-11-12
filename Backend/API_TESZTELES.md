# API Tesztelési Példák

## 1. USERS (Felhasználók)

### GET - Összes felhasználó
**GET** `http://localhost:8000/api/users`

### GET - Felhasználó ID alapján
**GET** `http://localhost:8000/api/users/1`

**Válasz:**
```json
{
  "id": 1,
  "vezeteknev": "Kovács",
  "keresztnev": "János",
  "email": "kovacs.janos@example.com",
  "telefonszam": "+36 20 123 4567",
  "regisztracio_datuma": "2025-01-12T15:30:00.000Z"
}
```

### POST - Új felhasználó
**POST** `http://localhost:8000/api/users`

**Body:**
```json
{
  "vezeteknev": "Kovács",
  "keresztnev": "János",
  "email": "kovacs.janos@example.com",
  "telefonszam": "+36 20 123 4567"
}
```

### PUT - Felhasználó módosítása
**PUT** `http://localhost:8000/api/users/1`

**Body:**
```json
{
  "vezeteknev": "Nagy",
  "keresztnev": "Péter",
  "email": "nagy.peter@example.com",
  "telefonszam": "+36 30 987 6543"
}
```

### DELETE - Felhasználó törlése
**DELETE** `http://localhost:8000/api/users/1`

---

## 2. ASZTALOK (Asztalok)

### GET - Összes asztal
**GET** `http://localhost:8000/api/asztalok`

### GET - Asztal ID alapján
**GET** `http://localhost:8000/api/asztalok/1`

### POST - Új asztal
**POST** `http://localhost:8000/api/asztalok`

**Body:**
```json
{
  "helyek_szama": 4,
  "asztal_allapot_id": 1
}
```

### PUT - Asztal módosítása
**PUT** `http://localhost:8000/api/asztalok/1`

**Body:**
```json
{
  "helyek_szama": 6,
  "asztal_allapot_id": 2
}
```

### DELETE - Asztal törlése
**DELETE** `http://localhost:8000/api/asztalok/1`

### GET - Szabad asztalok
**GET** `http://localhost:8000/api/asztalok/szabad/list?datum=2025-01-15&idopont=18:00&helyekSzama=4`

**Válasz:**
```json
{
  "datum": "2025-01-15",
  "idopont": "18:00",
  "helyek_szama": "4",
  "szabad_asztalok": [...]
}
```

---

## 3. FOGLALASOK (Foglalások)

### GET - Összes foglalás
**GET** `http://localhost:8000/api/foglalasok`

### GET - Foglalás ID alapján
**GET** `http://localhost:8000/api/foglalasok/1`

### POST - Új foglalás
**POST** `http://localhost:8000/api/foglalasok`

**Body:**
```json
{
  "user_id": 1,
  "asztal_id": 1,
  "foglalas_datum": "2025-01-15 18:00:00",
  "etkezes_id": 1,
  "megjegyzes_id": null
}
```

### PUT - Foglalás módosítása
**PUT** `http://localhost:8000/api/foglalasok/1`

**Body:**
```json
{
  "foglalas_datum": "2025-01-15 19:00:00",
  "etkezes_id": 2
}
```

### DELETE - Foglalás törlése
**DELETE** `http://localhost:8000/api/foglalasok/1`

### GET - Foglalt időpontok
**GET** `http://localhost:8000/api/foglalasok/foglalt-idopontok/list?datum=2025-01-15&asztalId=1`

**Válasz:**
```json
{
  "datum": "2025-01-15",
  "asztal_id": "1",
  "foglalt_idopontok": [...]
}
```

### GET - Foglalások dátum szerint
**GET** `http://localhost:8000/api/foglalasok/datum/list?datum=2025-01-15`

### GET - Foglalások felhasználó szerint
**GET** `http://localhost:8000/api/foglalasok/user/1`

---

## 4. ALLERGENEK (Allergének)

### GET - Összes allergen
**GET** `http://localhost:8000/api/allergenek`

### GET - Allergen ID alapján
**GET** `http://localhost:8000/api/allergenek/1`

**Válasz:**
```json
{
  "id": 1,
  "nev": "Glutén"
}
```

### POST - Új allergen
**POST** `http://localhost:8000/api/allergenek`

**Body:**
```json
{
  "nev": "Laktóz"
}
```

### PUT - Allergen módosítása
**PUT** `http://localhost:8000/api/allergenek/1`

**Body:**
```json
{
  "nev": "Gluténmentes"
}
```

### DELETE - Allergen törlése
**DELETE** `http://localhost:8000/api/allergenek/1`

---

## 5. ALLERGENINFO (Allergen információk)

### GET - Összes allergen info
**GET** `http://localhost:8000/api/allergeninfok`

### GET - Allergen info ID alapján
**GET** `http://localhost:8000/api/allergeninfok/1`

### POST - Új allergen info
**POST** `http://localhost:8000/api/allergeninfok`

**Body:**
```json
{
  "allergen_id": 1,
  "foglalas_id": 1
}
```

### PUT - Allergen info módosítása
**PUT** `http://localhost:8000/api/allergeninfok/1`

**Body:**
```json
{
  "allergen_id": 2
}
```

### DELETE - Allergen info törlése
**DELETE** `http://localhost:8000/api/allergeninfok/1`

### GET - Allergen infók foglalás szerint
**GET** `http://localhost:8000/api/allergeninfok/foglalas/1`

### DELETE - Összes allergen info törlése foglaláshoz
**DELETE** `http://localhost:8000/api/allergeninfok/foglalas/1`

---

## 6. MEGJEGYZESEK (Megjegyzések)

### GET - Összes megjegyzés
**GET** `http://localhost:8000/api/megjegyzesek`

### GET - Megjegyzés ID alapján
**GET** `http://localhost:8000/api/megjegyzesek/1`

**Válasz:**
```json
{
  "id": 1,
  "szoveg": "Kérjük, az ablak melletti asztalt"
}
```

### POST - Új megjegyzés
**POST** `http://localhost:8000/api/megjegyzesek`

**Body:**
```json
{
  "szoveg": "Kérjük, az ablak melletti asztalt"
}
```

### PUT - Megjegyzés módosítása
**PUT** `http://localhost:8000/api/megjegyzesek/1`

**Body:**
```json
{
  "szoveg": "Frissített megjegyzés szövege"
}
```

### DELETE - Megjegyzés törlése
**DELETE** `http://localhost:8000/api/megjegyzesek/1`

---

## 7. ASZTAL ALLAPOTOK

### GET - Összes asztal állapot
**GET** `http://localhost:8000/api/asztal-allapotok`

**Válasz:**
```json
[
  {
    "id": 1,
    "nev": "Szabad"
  },
  {
    "id": 2,
    "nev": "Foglalt"
  }
]
```

### GET - Asztal állapot ID alapján
**GET** `http://localhost:8000/api/asztal-allapotok/1`

### POST - Új asztal állapot
**POST** `http://localhost:8000/api/asztal-allapotok`

**Body:**
```json
{
  "nev": "Szabad"
}
```

### PUT - Asztal állapot módosítása
**PUT** `http://localhost:8000/api/asztal-allapotok/1`

**Body:**
```json
{
  "nev": "Foglalt"
}
```

### DELETE - Asztal állapot törlése
**DELETE** `http://localhost:8000/api/asztal-allapotok/1`

---

## 8. ETKEZES TIPUSOK

### GET - Összes étkezés típus
**GET** `http://localhost:8000/api/etkezes-tipusok`

**Válasz:**
```json
[
  {
    "id": 1,
    "nev": "Ebéd"
  },
  {
    "id": 2,
    "nev": "Vacsora"
  }
]
```

### GET - Étkezés típus ID alapján
**GET** `http://localhost:8000/api/etkezes-tipusok/1`

### POST - Új étkezés típus
**POST** `http://localhost:8000/api/etkezes-tipusok`

**Body:**
```json
{
  "nev": "Ebéd"
}
```

### PUT - Étkezés típus módosítása
**PUT** `http://localhost:8000/api/etkezes-tipusok/1`

**Body:**
```json
{
  "nev": "Vacsora"
}
```

### DELETE - Étkezés típus törlése
**DELETE** `http://localhost:8000/api/etkezes-tipusok/1`

---

## Fontos megjegyzések:

1. **Előfeltételek:** Mielőtt foglalást hoznál létre, szükséged lesz:
   - Egy létező `user_id` (először hozz létre felhasználót)
   - Egy létező `asztal_id` (először hozz létre asztalt)
   - Egy létező `etkezes_id` (lekérdezheted az étkezés típusokból)

2. **Dátum formátum:** A foglalásoknál használd az `YYYY-MM-DD HH:MM:SS` formátumot

3. **Query paraméterek:** A query paramétereket az URL-ben add meg, pl: `?datum=2025-01-15&idopont=18:00`

4. **Base URL:** Minden endpoint a `http://localhost:8000/api` alatt érhető el

