import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
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

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     navigate("/"); // Redirect if no token
  //     return;
  //   }

  //   axios
  //     .get("http://localhost:5000/api/auth/profile", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       setUser(res?.data);
  //       navigate("/dashboard");
  //     })
  //     .catch((err) => {
  //       if (err.response?.status === 401) {
  //         logout(); // Token expired, logout user
  //       }
  //     })
  //     .finally(() => setLoading(false));
  // }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Allow access to public pages ("/" and "/register")
    if (!token) {
      if (location.pathname !== "/" && location.pathname !== "/register") {
        navigate("/");
      }
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res?.data);
        if (location.pathname === "/" || location.pathname === "/register") {
          navigate("/dashboard"); // Redirect only from login page
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          logout(); // Handle token expiration
        }
      })
      .finally(() => setLoading(false));
  }, [location.pathname]); // Re-run when route changes

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
