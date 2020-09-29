export interface AuthState {
  isAuthenticated: boolean;
  id: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  admin: boolean;
}

export interface Address {
  id: string;
  name: string;
  surname: string;
  phone1: string;
  phone2: string;
  address: string;
  city: string;
  CP: string;
  country: string;
  default: boolean;
}
