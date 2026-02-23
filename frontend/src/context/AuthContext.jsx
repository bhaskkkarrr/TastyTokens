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
  const [restaurant, setRestaurant] = useState(null);
  const [withoutLogin, setWithoutLogin] = useState(false);
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
    const storedRestaurant = localStorage.getItem("restaurant");
    if (storedRestaurant && storedUser && storedToken) {
      if (isTokenExpired(storedToken)) {
        logout();
        navigate("/");
      } else {
        setUser(JSON.parse(storedUser));
        setRestaurant(JSON.parse(storedRestaurant));
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
        navigate("/");
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
        const restaurant = res.restaurantDetails;
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("restaurant", JSON.stringify(restaurant));
        setUser(user);
        setToken(token);
        setRestaurant(restaurant);
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

  const withoutLoginSetup = async () => {
    setWithoutLogin(true);
    localStorage.setItem("withoutLogin", true);
    navigate("/admin");
  };
  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurant");
    console.log("User logged out");
  };

  // ✅ Automatically log out when token expires (runs every minute)
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        if (isTokenExpired(token)) {
          console.warn("Session expired automatically.");
          logout();
          navigate("/");
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
        withoutLoginSetup,
        withoutLogin,
        setWithoutLogin,
        isLoading,
        authenticated,
        user,
        token,
        restaurant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
