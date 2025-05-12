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
export interface ILocalisation {
    id: number;
    city: string;
    postcode: string;
}
export interface IUser {
    id: number;
    firstname: string;
    lastname: string;
    phone_number: string;
    password: string;
    email: string;
    address: string;
    RNA_number: string;
    role_id: number;
    localisation: {
      city: string,
      postcode: string
    };
}
export interface ISpecies {
    id: number;
    name: string;
}




