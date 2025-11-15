import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
const BASE_API = import.meta.env.VITE_BASE_API;
export const SettingContext = createContext();
export const SettingProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const { token } = useContext(AuthContext);
  const getSettings = async () => {
    try {
      const r = await fetch(`${BASE_API}/api/settings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const res = await r.json();
      setSettings(res.data || {});
      return { success: true, data: settings };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

    // ✅ UPDATE Settings
  const updateSettings = async (restaurantData, userData) => {
    try {
      const r = await fetch(`${BASE_API}/api/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restaurantData, userData }),
      });

      const res = await r.json();
      if (res.success) {
        setSettings(res.data);
      }
      return res;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    if (token) {
      getSettings();
    }
  }, [token]);
  return (
    <SettingContext.Provider value={{ getSettings,updateSettings, settings }}>
      {children}
    </SettingContext.Provider>
  );
};
