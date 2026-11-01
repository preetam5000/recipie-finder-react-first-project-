import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { Route, Routes } from "react-router"
import Notfound from "./pages/Notfound"
import Recipedetail from "./pages/Recipedetail"

function App() {
  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<Recipedetail />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  )
}

export default App
