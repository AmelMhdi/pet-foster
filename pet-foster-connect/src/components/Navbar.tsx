import { Link } from "react-router-dom";

export default function Navbar() {
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

    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
      
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
                <Link className="nav-link" to="/animals">Animaux</Link>
              </li>
            </ul>

          {/* right nav links */}
          <div className="d-flex">
            <button className="btn btn-light me-2">Connexion</button>
            <button className="btn custom-inscription-btn">Inscription</button>
          </div>

        </div>
      </div>

    </nav>
    </>
  )
}