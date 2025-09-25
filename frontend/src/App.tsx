import React, { Suspense } from "react";
import "./main.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import AnimalsContainer from "./components/AnimalsContainer";
const AnimalDetails = React.lazy(() => import("./components/AnimalDetails"));
const About = React.lazy(() => import("./pages/About"));
const LegalMentions = React.lazy(() => import("./pages/LegalMentions"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Profile = React.lazy(() => import("./pages/Profile"));
const UpdateProfilAssociation = React.lazy(() => import("./pages/UpdateProfilAssociation"));
const CreateAnimal = React.lazy(() => import("./pages/CreateAnimal"));
const Associations = React.lazy(() => import("./pages/Associations"));
const AssociationDetails = React.lazy(() => import("./components/AssociationDetails"));
const UpdateAnimal = React.lazy(() => import("./pages/UpdateAnimal"));
const NotFound404 = React.lazy(() => import("./pages/NotFound404"));

function App() {
  return (
    <>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <div className="container-global">
          <Header />
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/animals" element={<AnimalsContainer />} />
            <Route path="/animals/:id" element={<AnimalDetails />} />
            <Route path="/associations" element={<Associations />} />
            <Route path="/associations/:id" element={<AssociationDetails />} />
            <Route path="/se-connecter" element={<Login />} />
            <Route path="/creer-compte" element={<Register />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/mentions-legales" element={<LegalMentions />} />
            <Route path="/contact" element={<Contact />} />

            {/* Pages protégées */}
            <Route path="/profil-association/:id" element={<Profile />} />
            <Route
              path="/modifier-profil/:id"
              element={<UpdateProfilAssociation />}
            />
            <Route path="/creer-animal/:id" element={<CreateAnimal />} />
            <Route path="/modifier-animal/:id" element={<UpdateAnimal />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </div>
      </Suspense>
    </>
  );
}

export default App;