export default function MainContainer() {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 main-container-custom fade-in">
          <div className="text-center mb-5" id="main-about-us-section">
            <div className="mb-4">
              <img
                src="/images/cat-icon.svg"
                alt="Mascotte Pet Foster Connect"
                className="img-fluid"
                style={{ maxWidth: "120px" }}
              />
            </div>
            <h1 className="fw-bold mb-4 container-title">Qui sommes-nous ?</h1>
            <p className="lead px-3">
              <strong className="brand-text">Pet Foster Connect</strong> révolutionne la protection animale en créant des liens solides entre les associations et les familles d'accueil.
            </p>
          </div>
          
          <div className="flex">
            <div className="col-12 mb-4">
                <div className="card-body text-center p-4">
                  <h3 className="h4 fw-bold mb-3 container-title">Notre mission</h3>
                  <p className="mb-0">
                    Offrir une chance à chaque animal en attente d'un foyer définitif. En devenant famille d'accueil, vous transformez des vies une patte à la fois.
                  </p>
                </div>
            </div>
          </div>

          <div className="col-12 mb-4">
              <div className="card-body text-center p-4">
                <h3 className="h4 fw-bold mb-3 container-title">Rejoindre la communauté</h3>
                <p className="mb-3">
                  Parcourez les profils des animaux, trouvez ceux qui ont besoin de vous et devenez acteur d'un monde
                  plus bienveillant.
                </p>
                <p className="mb-0">
                  <strong className="brand-text">Pet Foster Connect</strong> est plus qu'une application, c'est un
                  mouvement solidaire.
                </p>
              </div>
          </div>

          <div className="text-center">
            <div className="p-4 mb-4">
              <h3 className="h4 fw-bold mb-3">Prêt à faire la différence ?</h3>
              <p className="mb-4">Rejoignez notre communauté de familles d'accueil bienveillantes</p>
              <a href="/creer-compte" className="btn btn-primary btn-lg px-5 py-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="me-2"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="currentColor"
                  />
                </svg>
                Devenir famille d'accueil
              </a>
            </div>
          </div>

          {/* <section className="text-center">
            <h1 className="mb-0 text-center fw-bold mb-2 mt-2 container-title">Notre mission</h1>
            <div className="px-mobile-2">
              <p className="mb-3">Offrir une chance à chaque animal en attente d'un foyer définitif. En devenant famille d'accueil, vous transformez des vies une patte à la fois.</p>
            </div>
          </section> */}

          {/* Rejoindre la communauté */}
          {/* <section className="text-center">
            <h1 className="mb-0 text-center fw-bold mb-2 mt-2 container-title">Rejoindre la communauté</h1>            
            <div className="px-mobile-2">
              <p className="mb-3">
                Parcourez les profils des animaux, <br />
                trouvez ceux qui ont besoin de vous et devenez acteur d'un monde plus bienveillant.
              </p>
              <p>
                <strong className="brand-text">Pet Foster Connect</strong> est plus qu'une application,
                <br />
                c'est un mouvement solidaire.
              </p>
            </div>
          </section> */}

          {/* Bouton d'appel à l'action */}
          {/* <div className="text-center">
            <a href="/creer-compte" className="btn btn-primary btn-lg">
              Devenir famille d'accueil
            </a>
          </div> */}
        </div>
      </div>
    </main>
  )
}