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
   user: {
    id: number;
    email: string;
    firstname: string;
    // etc.
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