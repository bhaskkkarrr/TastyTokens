import { createContext, useEffect, useState } from "react";
const BASE_API = import.meta.env.VITE_BASE_API;
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const MenuContext = createContext();
export const MenuProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const addCategory = async (data) => {
    data.name = formatName(data.name);
    try {
      setIsLoading(true);
      const r = await fetch(`${BASE_API}/api/category/add`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await r.json();
      console.log("Category Response", res);
      if (res.success) {
        await getAllCategories();
        return { success: true };
      } else if (!res.success && res.status === 400) {
        return {
          success: false,
          message: res.message || "Category already added",
        };
      } else if (!res.success && res.status === 501) {
        return {
          success: false,
          message: res.message || "Server error creating category",
        };
      }
    } catch (error) {
      console.log("Error in adding category", error);
      return {
        success: false,
        message: res.message || "Category creation failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      const r = await fetch(`${BASE_API}/api/category/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await r.json();
      console.log("Category responsing", res);
      if (r.ok) {
        setCategories(res.categories);
      }
    } catch (error) {
      return {
        success: false,
        message: res.message || "Getting categories failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const addMenuItem = async (data) => {
    data.name = formatName(data.name);
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("category", data.category || "");
      formData.append("foodType", data.type || "non-veg");
      formData.append("isAvailable", data.isAvailable ? "true" : "false");

      // append image file (first item)
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await fetch(`${BASE_API}/api/menu/add`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        // success
        console.log("Uploaded menu item", result.menuItem);
        return {
          success: true,
          result,
        };
      } else if (!result.success) {
        return {
          success: false,
          message: res.message,
        };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: res.message || "Adding menu item failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getAllMenuItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_API}/api/menu/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      if (res.ok && data.success) {
        setMenuItems(data.menuItems); // assuming backend returns { success: true, menuItems: [...] }
      } else {
        console.error("Failed to fetch menu items", data.message);
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const r = await fetch(`${BASE_API}/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (r.ok) {
        setMenuItems((prev) =>
          prev.filter((t) => {
            return t._id !== id;
          })
        );
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MenuContext.Provider
      value={{
        addCategory,
        getAllCategories,
        addMenuItem,
        getAllMenuItems,
        handleDelete,
        isLoading,
        categories,
        menuItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
