import AnimalsContainer from "../components/AnimalsContainer";
import MainContainer from "../components/MainContainer";

export default function Home() {
  return (
    <>
      <MainContainer />
      <AnimalsContainer limit={3} random pagination={false}/>
    </>
  )
}