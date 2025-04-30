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
  rma_number?: string;  
  role_id: number;   
  localisation_id: number; 
}

export interface IAnimal {
  id: number;
  name: string;
  birthday?: string;
  description?: string;
  picture?: string;
  species: {
    id: number;
    name: string;
  };
  localisation: {
    id: number;
    city: string;
    postcode: number;
  };
}

export type IAnimals = IAnimal