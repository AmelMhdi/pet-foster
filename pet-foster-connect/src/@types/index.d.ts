export type IAnimals = IAnimal[];

export interface IAnimal {
    id: number;
    name: string;
    date_of_birth: number;
    description: string;
    picture: string;
    localisation_id: number;
    user_id: number;
    species_id:number;
}
export interface Localisation {
    id: number;
    city: string;
    postcode: number;
}
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: number;
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





