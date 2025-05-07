import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnimalsByAssociationFromApi } from "../services/associationsApi"
import { Navigate } from "react-router-dom";
import { IUserAnimal,IUserAnimalMessage  } from "../@types/user-index";
import { getUserMessagesApi } from "../services/associationsApi";

// import { IAnimal } from "../@types";


export default function Profile() {
  
const user = useUserStore((state) => state.user);

  const [animals, setAnimals] = useState<IUserAnimal[]>([])
  
  const [messages, setMessages] = useState<IUserAnimalMessage[]>([])
    useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const newAnimals = await getAnimalsByAssociationFromApi(user.id);
        console.log("Animaux reçus :", newAnimals);
        setAnimals(newAnimals);
      } catch (error) {
        console.error("Erreur lors du chargement", error);
      }
    };
    loadData();
  }, [user]);
  
    useEffect(() => {
      const loadData = async () => {
        if (!user ) return;
        try {
          const newMessages = await getUserMessagesApi(user.id);
          console.log("Messages reçus:", newMessages);
          setMessages(newMessages);
        } catch (error) {
          console.error("Erreur lors du chargement", error);
        }
      };
      loadData();
    }, [user]);

  if (!user) {
  return <Navigate to="/" replace />;
}

    return(
        <>
                  <section id="animaux">
          <h2>Animaux que vous proposez à l'adoption : </h2>
          <ul>
                
                    {animals.map((animal) => (
                        <li key={animal.id}>
                            le {animal.species.name} {animal.name} 
                        </li>))}
            
            </ul>
        </section>         
        
        <section id="messages">
              <h2>Messages Reçus</h2>
              <ul>
            {messages.map((message) => (
              <li key={`${message.userId}`}>
                Message de {message.prenom } {message.nom} : {message.message}le date.
              </li>))}
             
              </ul>
            </section>



      
               <section className="navbar navbar-expand-lg">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2">
                <Link className="nav-link" to={`/modifier-profil/${user.id}`} >Modifiez votre profil</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to={`/creer-animal/${user.id}`}>   Créer un animal  </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/nos-animaux">Animaux</Link>
              </li>
                      </ul>
   
        </section>

        


        </>
    )
}
