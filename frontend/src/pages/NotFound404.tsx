import { Link } from "react-router-dom";

export default function NotFound404() {
  return (
    <main className="container mt-5 fade-in" role="main">
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="p-4 not-found-content">
            <h1 className="not-found-title mb-4">Oups !</h1>
            <h2 className="not-found-subtitle">Curly est certain que vous vous êtes égaré...</h2>
            <p className="not-found-description mb-4">La page que vous cherchez est introuvable.</p>
            <div className="d-flex mb-5">
              <Link to="/" className="btn btn-primary fs-5 px-5 py-3">
                Retour à l'accueil
              </Link>
            </div>
            <p className="not-found-note">
              PS : Si vous voulez faire un don de carottes pour notre âne préféré, l’adresse est dans la page contact.
            </p>
          </div>
        </div>

        <div className="col-md-6 mb-4 text-center">
          <img
            src="/images/curly.webp"
            alt="Un âne sur un chemin près d'une forêt"
            className="img-fluid rounded shadow"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  );
}