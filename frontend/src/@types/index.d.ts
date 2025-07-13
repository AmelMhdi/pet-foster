export type IAnimals = IAnimal[];

export interface IAnimal {
  id: number;
  name: string;
  birthday: string;
  description: string;
  picture: string;
  localisation_id: number;
  species_id: number;
  user_id: number;

  species?: ISpecies;
  localisation?: ILocalisation;
  user?: IUser;
}

export interface INewAnimal {
  name: string;
  birthday: string;
  description: string;
  picture: string;
  localisation_id: number;
  species_id: number;
}

export interface ILocalisation {
  id: number;
  city: string;
  postcode: string;
}

export interface IUser {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address: string;
  phone_number: string;
  rma_number?: string | null;
  picture?: string | null;
  role_id: number | undefined;
  localisation_id: number;

  localisation?: ILocalisation;
}

export interface IRole {
  id: number;
  name: string;
}

export interface ISpecies {
  id: number;
  name: string;
}

export interface IAssociationDetail {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;

  animals_asso: IAnimal[];
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  firstname: string;
  expiresIn: string;
  token: string;
  email: string;
  id: number;
  role: {
    id: number;
    name: string;
  };
}

export interface IPublicUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  phone_number: string;
  rma_number?: string;

  role: {
    id: number;
    name: string;
  };

  localisation: {
    id: number;
    city: string;
    postcode: number;
  };
}

export interface IUserT {
  email: string;
  token: string;
  firstname: string;
  id: number;
  role: {
    id: number;
    name: string;
  };
  lastname?: string;
  address?: string;
  phone_number?: string;
  localisation?: {
    postcode?: string;
    city?: string;
  };
}

export interface IUserStore {
  user: IUserT | null;
  login: (user: IUserT) => void;
  logout: () => void;
  setUser: (updateUser: Partial<IUserT>) => void;
}

export interface IUserAnimal {
  user_id: number;
  id: number;
  name: string;
  birthday: string;
  description: string;
  picture: string;
  created_at: string;
  updated_at: string;
  localisation_id: number;
  species_id: number;
  species: {
    name: string;
  };
}

export interface IUserAnimalMessage {
  message: string;
  userId: number;
  firstname: string;
  name: string;
  phone: string;
  email: string;
  animal: string;
  createdAt: string;
}

export interface IUserUpdateForm {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  phone_number: string;
  localisation_id: number;
  password?: string;
  role_id: number;
}

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