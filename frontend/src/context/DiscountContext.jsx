import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
const BASE_API = import.meta.env.VITE_BASE_API;

export const DiscountContext = createContext();
export const DiscountProvider = ({ children }) => {
  const [discounts, setDiscounts] = useState([]);
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const createDiscount = async (data) => {
    try {
      setIsLoading(true);
      const r = await fetch(`${BASE_API}/api/discount/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const res = await r.json();
      if (res.success) {
        await getDiscounts();
      }
      return { success: true, message: res.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getDiscounts = async () => {
    try {
      setIsLoading(true);
      const r = await fetch(`${BASE_API}/api/discount/discounts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await r.json();
      if (res.success) {
        setDiscounts(res.discounts);
      }
      return res;
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      getDiscounts();
    }
  }, [token]);

  const deleteDiscount = async (id) => {
    try {
      setIsLoading(true);
      const r = await fetch(`${BASE_API}/api/discount/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await r.json();
      return { res };
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDiscount = async (id) => {
    try {
      setIsLoading(true);
      const r = await fetch(`${BASE_API}/api/discount/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await r.json();

      if (res.success) {
        await getDiscounts(); // Refresh list
      }

      return res;
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DiscountContext.Provider
      value={{
        getDiscounts,
        createDiscount,
        deleteDiscount,
        toggleDiscount,
        discounts,
        isLoading,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
};
