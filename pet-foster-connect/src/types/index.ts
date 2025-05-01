export interface IRole
{
   id: number;
  name: string;
}

export interface ILocalisation
{
   id: number;
  city: string;
    postcode: number;
}

export interface IUser {
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

export interface IloginRequest {
    email: string;
    password: string;
};


export interface ILoginResponse {
   firstname: string;  
   expiresIn: string;       
  token: string;    
  email: string 
};

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
  token: string  // 
    firstname: string;
}


export interface IUserStore {
  user: IUserT | null;
   login: ( email: string, token: string, firstname:string) => void; 
  logout: () => void;
  hydrate: () => void;
}
