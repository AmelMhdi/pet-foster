export default function About() {
  return (
    <main className="info-pages-container">
      <div className="container py-5">
        <h1 className="info-page-title">À propos</h1>

        <div className="info-content">
          <section className="about-section">
            <h2 className="about-subtitle">Notre Mission</h2>
            <p className="about-text">
              Nous sommes une association dédiée à la protection des animaux abandonnés. Notre mission est de leur
              offrir une seconde chance, en leur fournissant un foyer sûr et aimant, en partenariat avec des familles
              d'accueil et des associations.
            </p>
          </section>

          <section className="about-section">
            <h2 className="about-subtitle">Notre Équipe</h2>
            <p className="about-text">
              Notre équipe est composée de passionnés qui œuvrent chaque jour pour améliorer le bien-être de nos compagnons à quatre pattes. Grâce à leur dévouement, nous avons pu aider des centaines d'animaux à trouver leur famille idéale.
            </p>
          </section>

          <section className="about-section">
            <h2 className="about-subtitle">Nos Valeurs</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3 className="value-title">Compassion</h3>
                <p>Nous traitons chaque animal avec respect et amour, en comprenant ses besoins spécifiques.</p>
              </div>
              <div className="value-card">
                <h3 className="value-title">Transparence</h3>
                <p>Nos actions sont guidées par la transparence envers nos partenaires et les familles.</p>
              </div>
              <div className="value-card">
                <h3 className="value-title">Excellence</h3>
                <p>Nous visons l'excellence dans nos services et nos soins aux animaux.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}