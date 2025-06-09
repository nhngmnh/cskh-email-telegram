import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

export default function App() {
  const {token} = useContext(AppContext)
  return token ? (
    <div className="bg-white">
      <ToastContainer />
      <Navbar/>
      <div className="flex flex-col md:flex-row items-right">
        <Sidebar/>
        <Routes>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>
    <ToastContainer />
      <Login/>
    </>
  )
}