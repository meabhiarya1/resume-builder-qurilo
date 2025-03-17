import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Login from "./Comp/Login/Login";
import Register from "./Comp/Register/Register";
import Dashboard from "./Comp/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
