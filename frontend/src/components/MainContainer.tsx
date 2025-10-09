export default function MainContainer() {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 fade-in container-text">
          <div className="card-body text-center p-4">
            <h2 className="container-title">Qui sommes-nous ?</h2>
            <p className="lead px-3">
              <strong className="brand-text">Pet Foster Connect</strong> révolutionne la protection animale en créant des liens solides entre les associations et les familles d'accueil.
            </p>
          </div>

          <div className="text-center my-4">
            <span style={{ fontSize: "2rem" }}>🐾</span>
          </div>
          
          <div className="flex">
            <div className="col-12 mb-2">
                <div className="card-body text-center p-4">
                  <h2 className="container-title">Notre mission</h2>
                  <p className="mb-0">
                    Offrir une chance à chaque animal en attente d'un foyer définitif. En devenant famille d'accueil, vous transformez des vies une patte à la fois.
                  </p>
                </div>
            </div>
          </div>

          <div className="text-center my-4">
            <span style={{ fontSize: "2rem" }}>🐾</span>
          </div>

          <div className="col-12 mb-2">
              <div className="card-body text-center p-4">
                <h2 className="container-title">Rejoindre la communauté</h2>
                <p className="mb-2">
                  Parcourez les profils des animaux, trouvez ceux qui ont besoin de vous et devenez acteur d'un monde
                  plus bienveillant.
                </p>
                <p className="mb-0">
                  <strong className="brand-text">Pet Foster Connect</strong> est plus qu'une application, c'est un
                  mouvement solidaire.
                </p>
              </div>
          </div>

          <div className="text-center my-4">
            <span style={{ fontSize: "2rem" }}>🐾</span>
          </div>

          <div className="text-center">
            <div className="p-4 mb-2">
              <h2 className="container-title">Prêt à faire la différence ?</h2>
              <p className="mb-4">Rejoignez notre communauté de familles d'accueil bienveillantes</p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <a 
                  href="/creer-compte" 
                  className="btn btn-primary btn-lg px-5 py-3"
                >
                  Devenir famille d'accueil
                </a>
                <a 
                  href="/animaux" 
                  className="btn btn-primary btn-lg px-5 py-3"
                >
                  Voir les animaux à adopter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}