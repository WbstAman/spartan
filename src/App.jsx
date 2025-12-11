import { Toaster } from "react-hot-toast";
import './App.css';
import MainRoute from './navigation/MainRoute';
import ScreenSize from './utils/ScreenSize';


function App() {

  return (
    <>
      <ScreenSize />
      <MainRoute />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App
