import { Link } from "react-router-dom";
import { useUserStore } from "../store";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleNavClick = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    const isShown = navbarCollapse?.classList.contains("show");

    // Si le menu est ouvert, simule un clic sur le bouton pour le refermer
    if (isShown) {
      const toggler = document.querySelector(".navbar-toggler");
      (toggler as HTMLElement | null)?.click();
    }
  };

  return (
    <>
      <button
        className="navbar-toggler custom-toggler ms-auto"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Basculer la navigation"
      >
        <span className="custom-toggler-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-2">
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={handleNavClick}>
              Accueil
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/associations" onClick={handleNavClick}>
              Associations
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/animals" onClick={handleNavClick}>
              Animaux
            </Link>
          </li>
          {user?.role?.name === "association" && (
            <li className="nav-item">
              <Link className="nav-link" to={`/profil-association/${user.id}`} onClick={handleNavClick}>
                Profil de l'association
              </Link>
            </li>
          )}
          {user ? (
            <>
              <li className="nav-item">
                <p className="nav-link mb-0 no-hover">Bonjour, {user.firstname}.</p>
              </li>
              <li className="nav-item">
                <button onClick={logout} className="btn btn-primary logout-btn">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-btn" to="/se-connecter" onClick={handleNavClick}>
                  <button className="btn btn-light me-2">Connexion</button>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-btn" to="/creer-compte" onClick={handleNavClick}>
                  <button className="btn custom-inscription-btn btn-inscription me-2">Inscription</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}