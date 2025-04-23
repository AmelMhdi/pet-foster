export default function Login() {
    return (
        <div className="container mt-5">
        <div>
            <form action="/login" method="POST">
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
                    autoComplete="current-password"
                />

                <input 
                    className="btn btn-primary d-block my-4 mx-auto" 
                    type="submit" 
                    value="Se connecter" 
                />
                </form>
                </div>
        </div>
    );
}
