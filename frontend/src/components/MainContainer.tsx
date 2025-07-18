export default function MainContainer() {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 main-container-custom fade-in text-start">
          {/* Logo et titre */}
          <div className="align-items-center justify-content-center mb-4 container-cat-icon d-flex flex-column flex-md-row">
            <img
              src="/images/cat-icon.svg"
              alt="Mascotte Pet Foster Connect"
              className="img-fluid me-3"
              style={{ maxWidth: "100px" }}
            />
          </div>
          
          <h1 className="mb-0 text-center fw-bold mt-2 mb-2 container-title">
            Qui sommes-nous ?
          </h1>

          {/* Intro */}
          <p className="lead text-center px-mobile-2">
            <strong className="brand-text">Pet Foster Connect</strong> révolutionne la protection animale <br />en
            créant des liens solides entre les associations et les familles d'accueil.
          </p>

          {/* Notre mission */}
          <section className="text-center">
            <h1 className="mb-0 text-center fw-bold mb-2 mt-2 container-title">
              Notre mission
            </h1>
            <div className="px-mobile-2">
              <p className="mb-3">Offrir une chance à chaque animal en attente d'un foyer définitif. En devenant famille d'accueil, vous transformez des vies une patte à la fois.</p>
            </div>
          </section>

          {/* Rejoindre la communauté */}
          <section className="text-center">
            <h1 className="mb-0 text-center fw-bold mb-2 mt-2 container-title">
              Rejoindre la communauté
            </h1>            
            <div className="px-mobile-2">
              <p className="mb-3">
                Parcourez les profils des animaux, <br />trouvez ceux qui ont besoin de vous et devenez acteur d'un monde plus
                bienveillant.
              </p>
              <p>
                <strong className="brand-text">Pet Foster Connect</strong> est plus qu'une application,<br />
                c'est un mouvement solidaire.
              </p>
            </div>
          </section>

          {/* Bouton d'appel à l'action */}
          <div className="text-center">
            <a href="/creer-compte" className="btn btn-primary btn-lg">
              Devenir famille d'accueil
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}