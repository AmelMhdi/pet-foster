import AnimalsContainer from "../components/AnimalsContainer";
import HeroSection from "../components/HeroSection";
import MainContainer from "../components/MainContainer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MainContainer />
      <AnimalsContainer limit={3} random/>
    </>
  )
}