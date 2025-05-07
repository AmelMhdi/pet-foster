export interface IRole {
  id: number;
  name: string;
}

export interface ILocalisation {
  id: number;
  city: string;
  postcode: number;
}

// Structure un User, id en ? car sert pour creation (id) et mise à jour (pas d'id), on pourrrait créer 2 interfaces
export interface IUser {
  id?:number,
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address: string;
  phone_number: string;
  rma_number?: string | null;  
  role_id: number;   
  localisation_id: number; 
}

export interface ILoginRequest {
    email: string;
    password: string;
};

// Structure la réponse API qu'on retrouve dans la fonction logi du back dans res.json (). Format vient de UserController fonction login
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
};

// Affiche les infos si User connecté
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

export interface IUserT{
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
  // login: (email: string, token: string, id: number, firstname: string, role: { id: number; name: string }) => void; 
  login: (user: IUserT) => void;
  logout: () => void;
  hydrate: () => void;
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

// pour mettre à jour les informations de l'association
export interface IUserUpdateForm {
  id?: number; 
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  phone_number: string;
  localisation_id: number;
  password?: string;
  role_id:number
}

// creer un animal
export interface ISpecies {
  id: number;
  name: string;
}

// creer un animal
export interface INewAnimal {
  name: string;
  birthday: string; 
  description: string;
  picture: string;
  localisation_id: number;
  species_id: number;
  user_id: number
}