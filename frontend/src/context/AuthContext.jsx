import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  // ✅ Utility to check if JWT is expired
  const isTokenExpired = (token) => {
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= exp * 1000) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Invalid token:", err);
      return true;
    }
  };

  // ✅ Restore session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      if (isTokenExpired(storedToken)) {
        console.alert("Token expired — logging out.");
        logout();
        navigate("/login");
      } else {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setAuthenticated(true);
      }
    }
  }, []);

  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const signUpUser = async (data) => {
    setIsLoading(true);
    data.restaurantName = formatName(data.restaurantName);
    data.ownerName = formatName(data.ownerName);
    data.address = formatName(data.address);
    try {
      const response = await fetch(`${BASE_API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (response.ok) {
        navigate("/login");
        return { success: true };
      } else {
        return { success: false, message: res.message || "Sign Up failed" };
      }
    } catch (error) {
      console.error("Network error:", error);
      return { success: false, message: "Something went wrong!" };
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (data) => {
    setIsLoading(true);
    try {
      const r = await fetch(`${BASE_API}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const res = await r.json();

      if (r.ok) {
        const token = res.token;
        const user = res.user;

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        setToken(token);
        setAuthenticated(true);

        if (user.role === "customer") navigate("/");
        else if (user.role === "admin") navigate("/admin");
        else if (user.role === "superadmin") navigate("/super-admin");

        return { success: true };
      } else {
        return { success: false, message: res.message || "Login failed" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Something went wrong!" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    console.log("User logged out");
  };

  // ✅ Automatically log out when token expires (runs every minute)
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        if (isTokenExpired(token)) {
          console.warn("Session expired automatically.");
          logout();
          navigate("/login");
        }
      }, 60 * 1000); // check every 1 minute
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        signUpUser,
        logout,
        isLoading,
        authenticated,
        user,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
