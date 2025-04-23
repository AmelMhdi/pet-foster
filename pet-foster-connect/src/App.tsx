

import './App.css'

import Header from "./components/Header";
import Footer from "./components/Footer"
import { Routes, Route } from "react-router-dom";
import NotFound404 from "./pages/NotFound404";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from './pages/Login';
import Register from './pages/Register';
import AnimalDetails from "./components/AnimalDetails.tsx"
import MentionsLegales from './pages/Mentions-legales';
import Associations from './pages/Associations';


function App() {
  
  return (
    <>
      <Header />
     
     <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/associations" element={<Associations />} />
        <Route path="/animal" element={<AnimalDetails />} />
        <Route path="/se-connecter" element={<Login />} />
         <Route path="/creer-compte" element={<Register />} />
           <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/a-propos" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound404 />} />
                 
      </Routes>
      <Footer/>
    </>
  )
}

export default App
