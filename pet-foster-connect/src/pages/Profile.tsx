import { useUserStore } from "../store";


export default function Profile() {

  
const user = useUserStore((state) => state.user);

    // Test de récupération des informations
  const associationId = user?.id;
  const associationName = user?.firstname; // ou un autre champ pertinent
    

    return(
        <>
            <h1>Bienvenue, {associationName} (ID: {associationId})</h1>
            


        </>
    )
}

