import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/"); 
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/"); 
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (location.pathname !== "/" && location.pathname !== "/register") {
        navigate("/");
      }
      return;
    }

    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res?.data);
        if (location.pathname === "/" || location.pathname === "/register") {
          navigate("/dashboard"); 
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          logout(); 
        }
      })
      .finally(() => setLoading(false));
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
