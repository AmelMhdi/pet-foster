export default function MainContainer() {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 fade-in container-text">
          {/* main hero section */}
          <div className="text-center p-4 mb-5 border-bottom border-2">
            <h2 className="main-heading serif-heading">Qui sommes-nous ?</h2>
            <h3 className="secondary-heading sans-serif-subheading">Révolutionner la protection animale</h3>
            <p className="description-text">
              <strong className="brand-text">Pet Foster Connect</strong> crée des liens solides entre les associations et les familles d'accueil, transformant des vies une patte à la fois.
            </p>
          </div>

          {/* mission section */}
          <div className="my-5 py-4 border-bottom border-2">
            <div className="text-center">
              <span style={{ fontSize: "2rem" }}>🐾</span>
            </div>
            
            <div className="card-body text-center p-4 mt-4">
              <h2 className="section-heading serif-heading">Notre mission</h2>
              <p className="section-description">
                Offrir une chance à chaque animal en attente d'un foyer définitif. En devenant famille d'accueil, vous transformez des vies et créez des souvenirs inoubliables.
              </p>
            </div>
          </div>

          {/* community section */}
          <div className="my-5 py-4 border-bottom border-2">
            <div className="text-center">
              <span style={{ fontSize: "2rem" }}>🐾</span>
            </div>

            <div className="card-body text-center p-4 mt-4">
              <h2 className="section-heading serif-heading">Rejoindre la communauté</h2>
              <p className="section-description">
                Parcourez les profils des animaux, trouvez ceux qui ont besoin de vous et devenez acteur d'un monde plus bienveillant.
              </p>
              <p className="section-description mt-3">
                <strong className="brand-text">Pet Foster Connect</strong> est plus qu'une application, c'est un
                mouvement solidaire.
              </p>
            </div>
          </div>

          {/* cta section */}
          <div className="my-5 py-4">
            <div className="text-center">
              <span style={{ fontSize: "2rem" }}>🐾</span>
            </div>
            
            <div className="card-body text-center p-5 mt-4 cta-section">
              <h2 className="section-heading serif-heading">Prêt à faire la différence ?</h2>
              <p className="cta-description">Rejoignez notre communauté de familles d'accueil bienveillantes</p>
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
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
                  Voir les animaux
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}