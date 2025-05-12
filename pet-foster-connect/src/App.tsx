import "./App.css";
import "./main.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnimalDetails from './components/AnimalDetails';
import AnimalsContainer from './components/AnimalsContainer';
import About from './pages/About';
import LegalMentions from './pages/LegalMentions';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UpdateProfilAssociation from './pages/UpdateProfilAssociation';
import CreateAnimal from './pages/CreateAnimal'
import Associations from './pages/Associations';
import AssociationDetails from './components/AssociationDetails'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animals" element={<AnimalsContainer />} />
        <Route path="/animals/:id" element={<AnimalDetails />} />
        <Route path="/associations" element={<Associations />} />
        <Route path="/associations/:id" element={<AssociationDetails />} />
        <Route path="/se-connecter" element={<Login />} />
        <Route path="/creer-compte" element={<Register />} />
        <Route path="/profil-association/:id" element={<Profile />} />
        <Route
          path="/modifier-profil/:id"
          element={<UpdateProfilAssociation />}
        />
        <Route path="/creer-animal/:id" element={<CreateAnimal />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/mentions-legales" element={<LegalMentions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
