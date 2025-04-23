export default function Register() {
    return (
        <div className="container mt-5">
            <h1>Inscription</h1>
            <div>
                <form action="/register" method="POST">
                    <label className="form-label h4" htmlFor="firstname">Prénom</label>
                    <input 
                        className="form-control mb-4" 
                        type="text" 
                        id="firstname" 
                        name="firstname" 
                        placeholder="Prénom" 
                        required 
                        autoComplete="given-name"
                    />

                    <label className="form-label h4" htmlFor="lastname">Nom</label>
                    <input 
                        className="form-control mb-4" 
                        type="text" 
                        id="lastname" 
                        name="lastname" 
                        placeholder="Nom" 
                        required 
                        autoComplete="family-name"
                    />

                    <label className="form-label h4" htmlFor="email">Email</label>
                    <input 
                        className="form-control mb-4" 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="email@domain.com" 
                        required 
                        autoComplete="email"
                    />

                    <label className="form-label h4" htmlFor="password">Mot de passe</label>
                    <input 
                        className="form-control" 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="*********" 
                        required 
                        autoComplete="new-password"
                    />

                    <label className="form-label h4" htmlFor="confirm">Confirmation du mot de passe</label>
                    <input 
                        className="form-control" 
                        type="password" 
                        id="confirm" 
                        name="confirm" 
                        placeholder="*********" 
                        required 
                        autoComplete="new-password"
                    />
                    
                    <input 
                        className="btn btn-primary d-block my-4 mx-auto" 
                        type="submit" 
                        value="S'inscrire" 
                    />
                </form>
            </div>
        </div>
    );
}
