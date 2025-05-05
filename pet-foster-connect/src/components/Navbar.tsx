import { Link } from "react-router-dom";

import { useUserStore } from "../store";


export default function Navbar() {

    // Définir l'état connecté ou non 
      const user = useUserStore((state) => state.user);
      const logout = useUserStore((state) => state.logout);
    
  return (
    <>
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        
        {/* menu toggler for mobile  */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* collapsible navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* left nav links */}

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/">Accueil</Link>
              </li>
              <li className="nav-item mx-2">

                <Link className="nav-link" to="/associations">Associations</Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/nos-animaux">Animaux</Link>
              </li>
                                
            {user?.role?.name === "association" && (
    <li className="nav-item mx-2">
      <Link className="nav-link" to={`/profil-association/${user.id}`}>Informations association</Link>
    </li>
  )}
</ul>
          
          {/* right nav links */}
          <ul className="navbar-nav mb-2 mb-lg-0 ms-lg-4">
            {user ? (
              <>
                <li className="nav-item mx-2">
                  <span className="nav-link">
                    Bonjour {user.firstname}, vous êtes connecté avec l'adresse {user.email}
                  </span>
                </li>
                <li className="nav-item mx-2">
                  <button onClick={logout} className="btn btn-link nav-link">
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/creer-compte">Créer un compte</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/se-connecter">Se connecter</Link>
                </li>
              </>
            )}
            </ul>
       
        </div>
      </div>

    </nav>
    </>
  )
}