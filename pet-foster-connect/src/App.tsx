import './App.css'

import Header from "./components/Header";
import Footer from "./components/Footer"
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnimalDetails from './components/AnimalDetails';
import AnimalsContainer from './components/AnimalsContainer';

function App() {
  return (
    <>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animals" element={<AnimalsContainer />} />
          <Route path="/animals/:id" element={<AnimalDetails />} />
        </Routes>
      <Footer/>
    </>
  )
}

export default App
