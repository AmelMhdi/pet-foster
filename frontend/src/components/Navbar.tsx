import { Link } from "react-router-dom";
import { useUserStore } from "../store";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleNavClick = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    const isShown = navbarCollapse?.classList.contains("show");

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

      <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarNav">
        <ul className="navbar-nav w-100 flex-column flex-lg-row align-items-start align-items-lg-center justify-content-lg-end gap-2">
          <li className="nav-item">
            <Link className="nav-link px-3" to="/" onClick={handleNavClick}>
              Accueil
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link px-3" to="/associations" onClick={handleNavClick}>
              Associations
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link px-3" to="/animals" onClick={handleNavClick}>
              Animaux
            </Link>
          </li>

          {user?.role?.name === "association" && (
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/profil-association/${user.id}`}
                onClick={handleNavClick}
              >
                Profil de l'association
              </Link>
            </li>
          )}

          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link mb-0 no-hover cursor-pointer">Bonjour, {user.first_name}.</span>
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
                  <button className="btn btn-light">Connexion</button>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-btn" to="/creer-compte" onClick={handleNavClick}>
                  <button className="btn btn-primary btn-lg
                  ">Inscription</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}
