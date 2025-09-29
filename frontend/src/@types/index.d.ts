// --- ANIMALS ---
export type IAnimals = IAnimal[];

export interface IAnimal {
  id: number;
  name: string;
  date_of_birth: string; // ISO string format
  description: string;
  picture: string;
  species_id: number;
  user_id: number;

  species?: ISpecies;
  user?: IUser;
}

export interface INewAnimal {
  name: string;
  date_of_birth: string; // format YYYY-MM-DD attendu
  description: string;
  picture?: string;
  species_id: number;
  user_id: number;
}

// --- USER ---
export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  street_number: string;
  address: string;
  city: string;
  zip_code: string;
  rna_number?: string | null;
  picture?: string | null;
  role_id: number | undefined;
}

export interface IUserUpdateForm {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  street_number: string;
  address: string;
  city: string;
  zip_code: string;
  phone_number: string;
  password?: string;
  role_id: number;
}

// Public user info (no sensitive data)
export interface IPublicUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  rna_number?: string | null;

  role: {
    id: number;
    name: string;
  }

  street_number: string;
  address: string;
  city: string;
  zip_code: string;
}

export interface IAssociation extends IPublicUser {
  animals: IAnimal[];
}

// --- AUTH ---
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  token: string;
  expiresIn: string;

  role: {
    id: number;
    name: string;
  };

  street_number: string;
  address: string;
  city: string;
  zip_code: string;
}

export interface IUserT {
  email: string;
  token: string;
  first_name: string;
  last_name: string;
  id: number;
  role: {
    id: number;
    name: string;
  };
  phone_number?: string;
  street_number?: string;
  address?: string;
  city?: string;
  zip_code?: string;
}

export interface IUserStore {
  user: IUserT | null;
  login: (user: IUserT) => void;
  logout: () => void;
  setUser: (updateUser: Partial<IUserT>) => void;
}

// --- ROLES ---
export interface IRole {
  id: number;
  name: string;
}

// --- SPECIES ---
export interface ISpecies {
  id: number;
  name: string;
}

// --- APPLICATIONS (messages) ---
export interface IApplication {
  id: number;
  user_id: number;
  animal_id: number;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;

  user?: IUser;
  animal?: IAnimal;
}

export interface IUserAnimalMessage {
  message: string;
  userId: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  animal: string;
  createdAt: string;
}

// --- FORM INPUTS ---
export interface SelectProps {
  label: string;
  name: string;
  value: string | number;
  options: (string | number)[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}