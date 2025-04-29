import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Header() { 
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="./paw-print.svg" alt="Logo" height="40" className="me-2" />
          Pet Foster Connect
        </Link>
        <Navbar />
        </div>
      </nav>
    </>
  ); 
}
