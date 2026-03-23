export interface ContactForm {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  notes: string;
  terms: boolean;
  adults: number;
  children: number;
}

export interface Idopont {
  id: number;
  kezdet: number;
  veg: number;
}

export interface User {
  id: number;
  email: string;
  vezeteknev: string;
  keresztnev: string;
  telefonszam: string;
}

export interface FoglaloOldalProps {
  onBack: () => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  user: User | null;
}
