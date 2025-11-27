import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

const BASE_API = import.meta.env.VITE_BASE_API;
export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  // ✅ Capitalize first letter
  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

  // ----------------------------------------------------------------------
  // ✅ ADD MENU ITEM
  // ----------------------------------------------------------------------
  const addMenuItem = async (data) => {
    try {
      setIsMenuLoading(true);

      data.name = formatName(data.name);

      const res = await fetch(`${BASE_API}/api/menu/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data, // ✅ Already FormData from component
      });

      const result = await res.json();

      if (result.success) {
        console.log("Uploaded menu item", result.menuItem);
        return { success: true, result };
      }

      return {
        success: false,
        message: result.message || "Failed to add menu item",
      };
    } catch (err) {
      console.error("Add menu item error:", err);
      return { success: false, message: err.message };
    } finally {
      setIsMenuLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // ✅ GET ALL MENU ITEMS
  // ----------------------------------------------------------------------
  const getAllMenuItems = async () => {
    try {
      setIsMenuLoading(true);

      const res = await fetch(`${BASE_API}/api/menu/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Menu Items:", data);

      if (data.success) {
        setMenuItems(data.menuItems);
      } else {
        console.error("Failed to fetch menu items", data.message);
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
    } finally {
      setIsMenuLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // ✅ DELETE MENU ITEM
  // ----------------------------------------------------------------------
  const handleDelete = async (id) => {
    try {
      setIsMenuLoading(true);

      const r = await fetch(`${BASE_API}/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await r.json();

      if (res.success) {
        setMenuItems((prev) => prev.filter((item) => item._id !== id));
        return { success: true };
      }

      return { success: false, message: res.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsMenuLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // ✅ UPDATE MENU ITEM
  // ----------------------------------------------------------------------
  const updateMenuItem = async (id, formData) => {
    try {
      setIsMenuLoading(true);

      const res = await fetch(`${BASE_API}/api/menu/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      console.log("Update Result:", result);

      if (result.success) {
        await getAllMenuItems();
      }

      return result;
    } catch (error) {
      console.error("Error updating item:", error);
      return { success: false, message: error.message };
    } finally {
      setIsMenuLoading(false);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        // menu items
        addMenuItem,
        getAllMenuItems,
        updateMenuItem,
        handleDelete,

        // states
        isMenuLoading,
        menuItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
