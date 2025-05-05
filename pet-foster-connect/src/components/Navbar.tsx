import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      {/* menu toggler for mobile  */}
      <button 
        className="navbar-toggler ms-auto" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* collapsible navbar */}
      <div className="collapse navbar-collapse" id="navbarNav">

        {/* left nav links */}
        <ul className="navbar-nav me-auto mt-2 mb-2 mb-lg-0">
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/associations">Associations</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/animals">Animaux</Link>
            </li>
          </ul>

        {/* right nav links */}
        <div className="d-flex justify-content-center">
          <button className="btn btn-light me-2">Connexion</button>
          <button className="btn custom-inscription-btn">Inscription</button>
        </div>

      </div>
    </>
  )
}