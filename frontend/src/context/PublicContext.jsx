import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const BASE_API = import.meta.env.VITE_BASE_API;

export const PublicContext = createContext();
export const PublicProvider = ({ children }) => {
  const { restaurantId, tableId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const getResMenu = async () => {
    try {
      setIsLoading(true);
      const r = await fetch(
        `${BASE_API}/api/public/r/${restaurantId}/t/${tableId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await r.json();
      console.log("Menu data", res);
      setData(res);
    } catch (error) {
      setError("roots", { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getResMenu();
  }, [restaurantId]);

  return (
    <PublicContext.Provider value={{ getResMenu, isLoading, data, error }}>
      {children}
    </PublicContext.Provider>
  );
};
