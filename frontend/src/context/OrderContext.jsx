import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const BASE_API = import.meta.env.VITE_BASE_API;
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const socketRef = useRef(null);

  // ✅ Fetch all orders
  const getOrders = async () => {
    if (!token) return;

    const r = await fetch(`${BASE_API}/api/order/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await r.json();
    console.log("✅ Orders fetched:", res.orders);
    setOrders(res.orders || []);
  };

  // ✅ Initialize socket once
  useEffect(() => {
    socketRef.current = io(BASE_API, { transports: ["websocket"] });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // ✅ Join restaurant room & load orders
  useEffect(() => {
    if (token && socketRef.current) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const restaurantId = payload.id;

      socketRef.current.emit("joinRestaurantRoom", restaurantId);
      getOrders();
    }
  }, [token]);

  // ✅ Listen for live socket events
  useEffect(() => {
    if (!socketRef.current) return;

    // 🔹 New order created
    socketRef.current.on("newOrder", (order) => {
      console.log("🔥 New order received:", order);
      setOrders((prev) => [order, ...prev]);
    });

    // 🔹 Order status updated
    socketRef.current.on("orderUpdated", (updatedOrder) => {
      console.log("🔥 Order updated via socket:", updatedOrder);
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => {
      socketRef.current.off("newOrder");
      socketRef.current.off("orderUpdated");
    };
  }, []);

  // ✅ Update order status manually (with optimistic UI)
  const updateStatus = async (id, status) => {
    try {
      // Optimistically update local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, status: status, updating: true } : o
        )
      );

      const r = await fetch(`${BASE_API}/api/order/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const res = await r.json();
      console.log("✅ Status update response:", res);

      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === res.order._id ? res.order : o))
        );
      } else {
        console.warn("⚠️ Failed to update order status");
      }

      return { success: true, message: "Updated", res };
    } catch (err) {
      console.error("❌ Error updating status:", err);
      return { success: false, message: "Failed", error: err };
    }
  };

  // ✅ Delete order
  const deleteOrder = async (id) => {
    const r = await fetch(`${BASE_API}/api/order/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await r.json();
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o._id !== id));
    }
    return { res };
  };

  return (
    <OrderContext.Provider
      value={{ orders, getOrders, updateStatus, deleteOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};
