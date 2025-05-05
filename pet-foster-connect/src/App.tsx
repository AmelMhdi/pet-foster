import './App.css'

import Header from "./components/Header";
import Footer from "./components/Footer"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnimalDetails from './components/AnimalDetails';
import AnimalsContainer from './components/AnimalsContainer';
import About from './pages/About';
import LegalMentions from './pages/LegalMentions';
import Contact from './pages/Contact';

function App() {
  return (
    <>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals" element={<AnimalsContainer />} />
          <Route path="/animals/:id" element={<AnimalDetails />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/mentions-legales" element={<LegalMentions />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      <Footer/>
    </>
  )
}

export default App
