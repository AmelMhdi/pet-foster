import { Link } from "react-router-dom";
import { useUserStore } from "../store";

export default function Header() { 
// Définir l'état connecté ou non 
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

//  console.log('user =', user);

  
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="./paw-print.svg" alt="logo" width="30" height="24" className="d-inline-block align-text-top" />
            Pet Foster Connect
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
            aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                    Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  Associations
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/animal">
                  Animaux
                </Link>
              </li>
            </ul>
         
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">


              {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Bonjour {user.firstname}, vous êtes connecté avec l'adresse {user.email}
                  </span>
                </li>
                <li className="nav-item">
                  <button onClick={logout} className="btn btn-link nav-link">
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/creer-compte">Créer un compte</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/se-connecter">Se connecter</Link>
                </li>
              </>
            )}
            
            </ul>
          </div>
        </div>
      </nav>
    </>
  ); 
}
