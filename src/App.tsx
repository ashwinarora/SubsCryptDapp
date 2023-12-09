import { Route, Routes } from "react-router-dom"
import Navbar from "./Components/NavBar"
import Web3Provider from "./Context/Web3Provider"
import { routes } from "./pages/routes"
import { Suspense } from "react"
import Sidebar from "./Components/SideBar"

function App() {

  return (
    <Web3Provider>
      <Navbar />
      <Sidebar />
      <Routes>
        {
          routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <div className="mt-[4.5rem] ml-56">
                    <route.component />
                  </div>
                </Suspense>
              }
            />
          ))
        }
      </Routes>
    </Web3Provider>
  )
}

export default App
