import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/"); // Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Redirect if no token
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          logout(); // Token expired, logout user
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
