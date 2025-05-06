export type IAnimals = IAnimal[];

export interface IAnimal {
    id: number;
    name: string;
    birthday: string;
    description: string;
    picture: string;
    localisation: {
      city: string;
    };
    species: {
      name: string;
    };
}
export interface Localisation {
    id: number;
    city: string;
    postcode: string;
}
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    password: string;
    email: string;
    address: string;
    RNA_number: string;
    role_id: number;
}
export interface Species {
    id: number;
    name: string;
}





