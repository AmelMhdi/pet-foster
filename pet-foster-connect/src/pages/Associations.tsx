//  Pour lier cette page il faut l'indiquer à app.tsx (lien et nom du composant) et mettre le lien dans le fichier qui envoie vers la page About, ici c'est Sidebar

export default function Associations() {
    return (
        <div>
            <h1>À propos de nous</h1>
            <p>Nous sommes juste une application React, mais nous avons de grandes ambitions.</p>
        </div>
    );
}