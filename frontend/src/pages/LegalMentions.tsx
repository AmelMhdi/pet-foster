export default function LegalMentions() {
  return (
    <main className="info-pages-container">
      <div className="container py-5">
        <h1 className="info-page-title">Mentions légales</h1>

        <div className="info-content">
          <section className="legal-section">
            <h2 className="legal-subtitle">Information sur l'entreprise</h2>
            <div className="legal-info">
              <div className="info-item">
                <span className="legal-info-label">Nom de l'entreprise </span>
                <span className="info-value">Pet Foster Connect</span>
              </div>
                <div className="info-item">
                <span className="legal-info-label">Adresse</span>
                <span className="info-value">12 rue des Animaux, 75000 Paris, France</span>
              </div>
              <div className="info-item">
                <span className="legal-info-label">Email</span>
                <span className="info-value">contact@example.com</span>
              </div>
              <div className="info-item">
                <span className="legal-info-label">Numéro SIRET</span>
                <span className="info-value">123 456 789 00012</span>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2 className="legal-subtitle">Collecte de Données et Loi Informatique et Libertés</h2>
            <p className="legal-text">
              Conformément à la loi n° 78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux
              libertés, ainsi qu'au règlement (UE) 2016/679 (RGPD), l'utilisateur dispose à tout moment d'un droit
              d'accès, de rectification, de mise à jour et de suppression des informations personnelles le concernant
              détenues par Pet Foster Connect.
            </p>
            <p className="legal-text">
              Selon les articles 39 et 40 de la loi Informatique et Libertés, toute personne justifiant de son identité
              peut obtenir communication des données à caractère personnel la concernant, et exiger que soient
              rectifiées, complétées, mises à jour ou effacées les informations qui sont inexactes, incomplètes,
              équivoques, périmées ou dont la collecte, l'utilisation, la communication ou la conservation est
              interdite.
            </p>
            <p className="legal-text">
              Si vous souhaitez exercer ce droit ou pour toute question relative à la gestion de vos données
              personnelles, veuillez-vous adresser par email à: <strong>contact@example.com</strong>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}