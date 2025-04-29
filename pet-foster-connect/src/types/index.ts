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
