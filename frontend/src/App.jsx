import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Login from "./Comp/Login/Login";
import Register from "./Comp/Register/Register";
import UserDashboard from "./Comp/Dashboard/UserDashboard";
import AdminDashboard from "./Comp/Dashboard/AdminDashboard";
import Notfound from "./Comp/Notfound/Notfound";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ImageTextExtractor from "./Comp/ImageTextExtractor/ImageTextExtractor";

function App() {
  return (
    <Router>
      <AuthProvider>
        <RoutesComponent />
      </AuthProvider>
    </Router>
  );
}

function RoutesComponent() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />
        }
      />
      <Route path="/upload" element={<ImageTextExtractor />} />
      <Route path="*" element={<Notfound />} />
      
    </Routes>
  );
}

export default App;
