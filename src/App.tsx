import Navbar from "./Components/NavBar"
import Web3Provider from "./Context/Web3Provider"

function App() {

  return (
    <Web3Provider>
      <Navbar />
    </Web3Provider>
  )
}

export default App
