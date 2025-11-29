import { createContext, useState, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
const BASE_API = import.meta.env.VITE_BASE_API;

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const socketRef = useRef(null);

  // ----------------------------------------------
  // Fetch notifications
  // ----------------------------------------------
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      if (!user?.restaurantId) return;
      const r = await fetch(`${BASE_API}/api/notification/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await r.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnread(data.notifications.filter((n) => !n.read).length);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  // ----------------------------------------------
  // Socket: real-time notifications
  // ----------------------------------------------
  useEffect(() => {
    if (!token) return;

    socketRef.current = io(BASE_API, {
      transports: ["websocket"],
      reconnection: true,
    });

    const socket = socketRef.current;

    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const restaurantId = parsedUser?.restaurantId?._id;

    if (restaurantId) {
      socket.emit("joinRestaurantRoom", restaurantId);
    }

    // 🔥 NEW NOTIFICATION
    socket.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnread((prev) => prev + 1);
    });

    // 🔥 UPDATED READ STATUS
    socket.on("notificationRead", (notif) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? notif : n))
      );
    });
    return () => socket.disconnect();
  }, [token]);

  // ----------------------------------------------
  // Mark SINGLE notification as read
  // ----------------------------------------------
  const markAsRead = async (id) => {
    await fetch(`${BASE_API}/api/notification/read/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );

    setUnread((prev) => Math.max(prev - 1, 0));
  };

  // ----------------------------------------------
  // Mark ALL read
  // ----------------------------------------------
  const markAllRead = async () => {
    await fetch(`${BASE_API}/api/notification/readAll/${user.restaurantId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };
  const deleteSingle = async (id) => {
    try {
      const r = await fetch(`${BASE_API}/api/notification/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await r.json();

      if (res.success) {
        // FIX: MongoDB uses _id, not id
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }

      return { res };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unread,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllRead,
        deleteSingle,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
