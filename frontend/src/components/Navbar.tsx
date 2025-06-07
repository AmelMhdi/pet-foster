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
        aria-label="Ouvrir le menu"
      >
        <span className="custom-toggler-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/" onClick={handleNavClick}>
              Accueil
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/associations" onClick={handleNavClick}>
              Associations
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/animals" onClick={handleNavClick}>
              Animaux
            </Link>
          </li>
          {user?.role?.name === "association" && (
            <li className="nav-item mx-2">
              <Link className="nav-link" to={`/profil-association/${user.id}`} onClick={handleNavClick}>
                Page de l'association
              </Link>
            </li>
          )}
          {user ? (
            <>
              <li className="nav-item mx-2">
                <p className="nav-link mb-0 no-hover">Bonjour, {user.firstname}.</p>
              </li>
              <li className="nav-item mx-2">
                <button onClick={logout} className="btn btn-primary logout-btn">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item mx-2 m-2">
                <Link className="nav-btn" to="/se-connecter" onClick={handleNavClick}>
                  <button className="btn btn-light me-2">Connexion</button>
                </Link>
              </li>
              <li className="nav-item mx-2">
                <Link className="nav-btn" to="/creer-compte" onClick={handleNavClick}>
                  <button className="btn custom-inscription-btn me-2">Inscription</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}