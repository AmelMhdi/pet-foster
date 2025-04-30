export default function LegalMentions() {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Mentions légales</h1>
      <p>Voici les informations légales concernant notre site :</p>
      <ul>
        <li><strong>Nom de l'entreprise:</strong> Pet Foster Connect</li>
        <li><strong>Adresse:</strong> 12 rue des Animaux, 75000 Paris, France</li>
        <li><strong>Email:</strong> contact@petfoster.fr</li>
        <li><strong>Numéro SIRET:</strong> 123 456 789 00012</li>
      </ul>

      {/* <h2>Modifications</h2>
      <p>
        En accédant et en naviguant sur ce site, l'utilisateur est informé de ses droits et obligations et accepte pleinement de se conformer aux présentes conditions d'utilisation du site. L'éditeur du site se réserve la possibilité de modifier ces conditions. Il appartient à l'utilisateur de vérifier périodiquement le contenu des documents concernés. L'éditeur se réserve la possibilité de supprimer ou de modifier en tout ou partie le « site ».
      </p> */}

      <h2>Collecte de données et Loi Informatique et Libertés</h2>
      <p>
        Conformément à la loi n° 78-17 du 6 janvier 1978, l'utilisateur peut à tout moment accéder aux informations personnelles le concernant détenues par XXXX, demander leur modification ou leur suppression. Ainsi, selon les articles 36, 39 et 40 de la loi Informatique et Libertés, l’utilisateur peut demander que soient rectifiées, complétées, clarifiées, mises à jour ou effacées les informations le concernant qui sont inexactes, incomplètes, équivoques, périmées ou dont la collecte ou l'utilisation, la communication ou la conservation sont interdites.
      </p>
      <p>
        Si vous souhaitez exercer ce droit et obtenir communication des informations vous concernant, veuillez-vous adresser :
        <br />
        <strong>Par email :</strong> contact@petfoster.fr
      </p>
    </div>
  )
}