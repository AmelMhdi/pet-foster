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

    return (
    <div className="container my-4">
      {/* Section animaux */}
      
      <section id="animaux" className="mb-5">
  <h3 className="mb-4">Animaux proposés :</h3>

  {animals.length === 0 ? (
    <p className="text-muted">Aucun animal pour le moment.</p>
  ) : (
    <div className="row g-4">
      {animals.map((animal) => (
        <div key={animal.id} className="col-md-4">
          <div className="card shadow-sm h-100">
            {animal.picture && (
              <img
                src={animal.picture}
                alt={animal.name}
                className="card-img-top object-fit-cover"
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{animal.name}</h5>
              <p className="card-text fw-bold">Espèce : {animal.species.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
        
        <section id="messages" className="mb-5">
  <h2 className="mb-4">Messages reçus</h2>
  {messages.length === 0 ? (
    <p className="text-muted">Aucun message pour le moment.</p>
  ) : (
    <div className="row g-3">
                {messages.map((message) => (
      //  pour creer une clé unique on associe famille et animal choisi
  <div
    key={`${message.userId}-${message.animal}`}
    className="col-md-6"
  >
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title fs-3">
          De {message.prenom} {message.nom} :
        </h5>
        <p className="card-text fs-5">{message.message}</p>
        <p className="card-text">
          <span className="fs-6">Reçu récemment</span>
        </p>
      </div>
    </div>
  </div>
))}
    </div>
  )}
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

        


        </div>
    )
}
