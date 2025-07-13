export default function MainContainer() {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 main-container-custom fade-in text-start">
          
          {/* Logo centré */}
          <div className="text-center mb-4">
            <img
              src="/images/cat-icon.svg"
              alt="Mascotte Pet Foster Connect"
              className="img-fluid"
              style={{ maxWidth: '100px' }}
            />
          </div>

          {/* Intro */}
          <p className="lead text-center">
            <strong className="main-container-pfc">Pet Foster Connect</strong> révolutionne la protection animale en créant des liens solides entre les associations et les familles d'accueil.
          </p>

          {/* Notre mission */}
          <section className="mt-5">
            <h3 className="fs-4 mb-2">Notre mission</h3>
            <p>
              Offrir une chance à chaque animal en attente d’un foyer définitif.
              <br />
              En devenant famille d’accueil, vous transformez des vies — une patte à la fois.
            </p>
          </section>

          {/* Rejoindre la communauté */}
          <section className="mt-4">
            <h3 className="fs-4 mb-2">Rejoignez notre communauté</h3>
            <p>
              Parcourez les profils des animaux, trouvez ceux qui ont besoin de vous
              <br />
              et devenez acteur d’un monde plus bienveillant.
            </p>
            <p>
              <strong className="main-container-pfc">Pet Foster Connect</strong>, c’est plus qu'une application : c'est un mouvement solidaire.
            </p>
          </section>

          {/* Bouton d'appel à l'action */}
          <div className="text-center mt-5">
            <a href="/creer-compte" className="btn btn-primary btn-lg px-4 ">
              Devenir famille d’accueil
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}