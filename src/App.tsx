import { Route, Routes } from "react-router-dom"
import Navbar from "./Components/NavBar"
import Web3Provider from "./Context/Web3Provider"
import { routes } from "./pages/routes"
import { Suspense } from "react"
import Sidebar from "./Components/SideBar"

const PageLoader = () => (
  <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 text-slate-500 animate-fade-in">
    <div className="h-8 w-8 rounded-full border-[3px] border-brand-200 border-t-brand-600 motion-safe:animate-spin" />
    <span className="text-sm font-medium">Loading...</span>
  </div>
)

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
                <Suspense fallback={<PageLoader />}>
                  <main className="min-h-screen pt-[4.5rem] pb-24 sm:pb-8 sm:pl-60">
                    <div className="animate-fade-up">
                      <route.component />
                    </div>
                  </main>
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
