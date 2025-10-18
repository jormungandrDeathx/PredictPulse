import { useState } from "react";
import PredictionForm from "./components/PredictionForm";
import UploadPage from "./components/UploadPage";
import ChartPage from "./components/ChartPage";
import PerformancePage from "./components/PerformancePage";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  NavLink,
} from "react-router-dom";
import icon from "../src/assets/hamburger.png"
function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Router>
        <header className="flex justify-between p-5 bg-gradient-to-r from-blue-800 to to-green-800 text-white mx-auto items-center shadow-2xl shadow-gray-700 fixed top-0 left-0 right-0 z-50">
          <h1 className="text-2xl font-bold">PredictPulse</h1>
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
            className="invert md:hidden"
          >
            <img src={icon} alt="Menu" />
          </button>
          <nav className="hidden  md:flex gap-x-4">
            <NavLink
              to=""
              className={({ isActive }) =>
                isActive
                  ? "text-white border-b-2 border-white transition" 
                  : "text-gray-400 hover:text-white transition"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-b-2 border-white transition"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              
            </NavLink>

            <NavLink
              to="/upload"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-b-2 border-white transition"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              Upload
            </NavLink>

            <NavLink
              to="/predict"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-b-2 border-white transition"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              Prediction
            </NavLink>

            <NavLink
              to="/performance"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-b-2 border-white transition"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              Performance
            </NavLink>

            <NavLink
              to="/chart"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-b-2 border-white transition"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              Chart
            </NavLink>
          </nav>
          {menuOpen && (
            <div className="absolute top-full right-0  w-[25%] bg-gray-400 text-white flex flex-col items-center md:hidden z-[9999] shadow-lg shadow-black rounded-b">
              <Link
                to=""
                className="py-3 border-b border-gray-300 w-full text-center hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="upload"
                className="py-3 border-b border-gray-300 w-full text-center hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Upload
              </Link>
              <Link
                to="predict"
                className="py-3 border-b border-gray-300 w-full text-center hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Prediction
              </Link>
              <Link
                to="performance"
                className="py-3 border-b border-gray-300 w-full text-center hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Perfomance
              </Link>
              <Link
                to="chart"
                className="py-3 border-b border-gray-300 w-full text-center hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Chart
              </Link>
            </div>
          )}
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="predict" element={<PredictionForm />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="chart" element={<ChartPage />} />
          <Route path="performance" element={<PerformancePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
