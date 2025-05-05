import { useUserStore } from "../store";
import { useEffect, useState } from "react";

import { IUserAnimal } from "../types";
import { getAnimalsByAssociationFromApi } from "../services/associationsApi"
import { Navigate } from "react-router-dom";


export default function Profile() {

  
const user = useUserStore((state) => state.user);

     // Test de récupération des informations
  const associationId = user?.id;
  const associationName = user?.firstname; 
    
 const [animals, setAnimals] = useState<IUserAnimal[]>([])

     useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const newanimals = await getAnimalsByAssociationFromApi(user.id);
        console.log("Animaux reçus :", newanimals);
        setAnimals(newanimals);
      } catch (error) {
        console.error("Erreur lors du chargement", error);
      }
    };

    loadData();
  }, [user]);
  
  // sinon erreur de typescript  Argument of type 'number' is not assignable to parameter of type 'string' pour  const newanimals = await getAnimalsByAssociationFromApi(user.id);
  if (!user) {
  return <Navigate to="/" replace />;
}

    return(
        <>
            <h1>Bienvenue, c'est un essai {associationName} (ID: {associationId})</h1>
            <section id="animaux">
                <h1>Liste des Animaux par Espèce</h1>
                <div className="espece">
                    {animals.map((animal) => (
                        <div key={animal.id}>
                            <div>Nom : {animal.name}</div>
                            <div>Espèce : {animal.species.name}</div>
                        </div>))}
                </div>
            </section>            

           
                
         
            
        


        </>
    )
}
