export default function MainContainer() {
  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 main-container-custom text-center fade-in">
          <img
            src="../../public/images/cat-icon.svg"
            alt="Mascotte Pet Foster Connect"
            className="mb-4"
            style={{ maxWidth: '120px', height: 'auto' }}
          />

          <p>
            <span className="main-container-pfc"><strong>Pet Foster Connect</strong> </span>révolutionne la protection animale en créant des liens solides entre les associations et les familles d'accueil.
          </p>

          <h3 className="fs-4">Notre mission</h3>
          <p>
            Offrir une chance à chaque animal en attente d’un foyer définitif.
            <br />
            En devenant famille d’accueil, vous transformez des vies — une patte à la fois.
          </p>

          <h3 className="fs-4">Rejoignez notre communauté</h3>
          <p>
            Parcourez les profils des animaux, trouvez ceux qui ont besoin de vous
            <br />
            et devenez acteur d’un monde plus bienveillant.
            <br />
          </p>
          <p>
            <span className="main-container-pfc"><strong>Pet Foster Connect</strong></span>, c’est plus qu'une application : c'est un mouvement solidaire.
          </p>
        </div>
      </div>
    </main>
  );
}