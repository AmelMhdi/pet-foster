import './App.css'



import Header from "./components/Header";
import Footer from "./components/Footer"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';

 import Profile from './pages/Profile';
import UpdateProfilAssociation from './pages/UpdateProfilAssociation';


function App() {
    
  return (
    <>
      <Header />
      


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/se-connecter" element={<Login />} />
        <Route path="/creer-compte" element={<Register />} />
        <Route path="/profil-association/:id" element={<Profile />} />
                <Route path="/modifier-profil/:id" element={<UpdateProfilAssociation />} />

        </Routes>
      <Footer/>
    </>
  )
}

export default App
