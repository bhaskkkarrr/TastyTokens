import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
const BASE_API = import.meta.env.VITE_BASE_API;
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [singleOrder, setSingleOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const socketRef = useRef(null);

  // --- AUDIO FIX ---
  const notificationSoundRef = useRef(null);
  useEffect(() => {
    notificationSoundRef.current = new Audio("/order-alert.mp3");

    // Unlock audio on first user interaction
    const unlock = () => {
      const audio = notificationSoundRef.current;
      audio.volume = 0;

      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1;
        })
        .catch(() => {});

      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };

    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
  }, []);


  // ------------------------------------------------------
  // ✅ Fetch all orders
  // ------------------------------------------------------
  const getOrders = async () => {
    try {
      setIsLoadingOrder(true);
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
    } catch (error) {
    } finally {
      setIsLoadingOrder(false);
    }
  };
  useEffect(() => {
    if (token) {
      getOrders();
    }
  }, [token]);

  // ------------------------------------------------------
  // ✅ Update status (manual from admin)
  // ------------------------------------------------------
  const updateStatus = async (id, status) => {
    try {
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
      }

      return { success: true, message: "Updated", res };
    } catch (err) {
      console.error("❌ Error updating status:", err);
      return { success: false, message: "Failed", error: err };
    }
  };

  // ------------------------------------------------------
  // SOCKET.IO REAL-TIME SETUP  (ONLY THIS BLOCK IS NEW)
  // ------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    // Create socket connection
    socketRef.current = io(BASE_API, {
      transports: ["websocket"],
      reconnection: true,
    });

    const socket = socketRef.current;

    // Get restaurant ID from token payload
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const restaurantId = parsedUser?.restaurantId;
    if (restaurantId) {
      socket.emit("joinRestaurantRoom", restaurantId);
      console.log("Joined restaurant room:", restaurantId);
    }

    // 🔥 Listen for NEW ORDER
    socket.on("newOrder", (order) => {
      console.log("REALTIME → New order:", order);

      // 1️⃣ Add to order list
      setOrders((prev) => [order, ...prev]);

      // 2️⃣ Increase badge counter
      setNewOrderCount((prev) => prev + 1);

      // 3️⃣ Play sound
      const snd = notificationSoundRef.current;
      if (snd) {
        snd.currentTime = 0;
        snd.play().catch((err) => console.log("Audio play failed:", err));
      }

      // 4️⃣ Vibrate (mobile only)
      if (navigator.vibrate) navigator.vibrate(200);

      // 6️⃣ Browser Notification
      if (Notification.permission === "granted") {
        new Notification("New Order Received", {
          body: `Order #${order.orderId} just came in!`,
          icon: "/logo.png",
        });
      }
    });

    // 🔥 Listen for ORDER UPDATED
    socket.on("orderUpdated", (order) => {
      console.log("REALTIME → Order updated:", order);

      // Update order list for admin
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));

      // 🔥 Update single order for customer page
      setSingleOrder((prev) => {
        if (!prev) return prev;
        return prev._id === order._id ? order : prev;
      });
    });

    // 🔥 Listen for ORDER DELETED
    socket.on("orderDeleted", ({ _id }) => {
      console.log("REALTIME → Order deleted:", _id);
      setOrders((prev) => prev.filter((o) => o._id !== _id));
    });

    return () => socket.disconnect();
  }, [token]);

  // ------------------------------------------------------
  // Create order
  // ------------------------------------------------------
  const createOrder = async (orderBody) => {
    try {
      const response = await fetch(`${BASE_API}/api/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });

      const data = await response.json();
      console.log("Order Response:", data);
      return { data };
    } catch (err) {
      return { success: false, message: "Order creation failed", error: err };
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ------------------------------------------------------
  // Delete order
  // ------------------------------------------------------
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

  
  // ------------------------------------------------------
  // CUSTOMER SIDE — Get order details
  // ------------------------------------------------------
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
        getOrders,
        updateStatus,
        deleteOrder,
        createOrder,
        getOrderDetails,
        setNewOrderCount,
        orders,
        isLoadingOrder,
        isPlacingOrder,
        loading,
        singleOrder,
        error,
        newOrderCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
