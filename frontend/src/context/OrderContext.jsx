import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const BASE_API = import.meta.env.VITE_BASE_API;
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [singleOrder, setSingleOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

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

  // ADMIN SIDE CONTEXT
  // CREATE ORDER
  const createOrder = async (orderBody) => {
    try {
      setLoadingOrder(true);
      setOrderError(null);

      const res = await fetch(`${BASE_API}/api/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      setOrderError(err.message || "Failed to create order");
      return { success: false };
    } finally {
      setLoadingOrder(false);
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

  // CUSTOMER SIDE CONTEXT
  // GET ORDER DETAILS
  const getOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_API}/api/order/${orderId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch order");
      }

      setSingleOrder(data.order);
      localStorage.setItem("order", JSON.stringify(data.order));
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrders,
        updateStatus,
        deleteOrder,
        createOrder,
        getOrderDetails,
        loading,
        singleOrder,
        error,
        loadingOrder,
        orderError,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
