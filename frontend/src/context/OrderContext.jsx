import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const BASE_API = import.meta.env.VITE_BASE_API;
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const socketRef = useRef(null);

  // ✅ Fetch old orders on page load
  const getOrders = async () => {
    if (!token) return;

    const r = await fetch(`${BASE_API}/api/order/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await r.json();
    console.log("✅ Orders fetched:", res.orders);
    setOrders(res.orders || []);
  };

  // ✅ Initialize socket ONCE
  useEffect(() => {
    socketRef.current = io(BASE_API, {
      transports: ["websocket"],
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // ✅ Join restaurant room + fetch orders immediately
  useEffect(() => {
    if (token && socketRef.current) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const restaurantId = payload.id;

      // ✅ join room
      socketRef.current.emit("joinRestaurantRoom", restaurantId);

      // ✅ fetch ALL old orders right when admin opens page
      getOrders();
    }
  }, [token]);

  // ✅ Listen for NEW ORDER live updates
  useEffect(() => {
    if (!socketRef.current) return;

    // ✅ When new order is placed
    socketRef.current.on("newOrder", (order) => {
      console.log("🔥 NEW order received:", order);
      setOrders((prev) => [order, ...prev]);
    });

    // ✅ ✅ When order status is updated (STEP 5)
    socketRef.current.on("orderStatusUpdated", (updatedOrder) => {
      console.log("🔥 Status updated:", updatedOrder);

      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => {
      socketRef.current.off("newOrder");
      socketRef.current.off("orderStatusUpdated");
    };
  }, []);

  const updateStatus = async (id, status) => {
    const r = await fetch(`${BASE_API}/api/order/update-status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const res = await r.json();
    if (res.success) {
      getOrders();
    }
    return { success: true, message: "Updated", res };
  };

  return (
    <OrderContext.Provider value={{ getOrders, orders, updateStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
