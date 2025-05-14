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
  address: string;

  localisation?: ILocalisation;
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
};