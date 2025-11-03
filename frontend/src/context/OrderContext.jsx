import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
const BASE_API = import.meta.env.VITE_BASE_API;

export const OrderContext = createContext();
export const OrderProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const getOrders = async () => {
    const r = await fetch(`${BASE_API}/api/order/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await r.json();
    setOrders(res.orders);
    console.log("Order Response", res);
  };

  useEffect(() => {
    if (token) {
      getOrders();
    }
  }, [token]);

  return (
    <OrderContext.Provider value={{ getOrders, orders }}>
      {children}
    </OrderContext.Provider>
  );
};
