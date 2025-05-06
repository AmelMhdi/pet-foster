import { Link } from "react-router-dom";
import { useUserStore } from "../store";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <>
      {/* menu toggler for mobile  */}
      <button 
        className="navbar-toggler custom-toggler ms-auto" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* collapsible navbar */}
      <div className="collapse navbar-collapse justify-content-between" id="navbarNav">

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
          {/* affichage conditionnel pour les associations */}
          {user?.role?.name === "association" && (
            <>
              <li className="nav-item mx-2">
                <Link 
                  className="nav-link" 
                  to={`/profil-association/${user.id}`}
                >
                  Informations association
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* right nav links */}
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex justify-content-center">
          {user ? (
            <>
              <li className="nav-item mx-2">
                <span className="nav-link no-hover">
                  Bonjour, {user.firstname}, vous êtes connecté.e avec l'adresse {user.email}.
                </span>
              </li>
              <li className="nav-item mx-2">
                <button onClick={logout} className="btn-primary logout-btn">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-center">
                <li className="nav-item mx-2">
                  <Link className="nav-btn" to="/se-connecter">
                  <button className="btn btn-light me-2">Connexion</button> 
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-btn" to="/creer-compte">
                    <button className="btn custom-inscription-btn">
                      Inscription
                    </button>
                  </Link>
                </li>
              </div>
            </>
          )}
        </ul>
      </div>
    </>
  )
}