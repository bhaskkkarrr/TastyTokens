import { createContext, useEffect, useState } from "react";
const BASE_API = import.meta.env.VITE_BASE_API;
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const MenuContext = createContext();
export const MenuProvider = ({ children }) => {
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [isCatLoading, setIsCatLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const addCategory = async (data) => {
    console.log(data);
    data.name = formatName(data.name);
    try {
      setIsCatLoading(true);
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
      } else if (!res.success && r.status === 400) {
        return {
          success: false,
          message: res.message || "Category already added",
        };
      } else if (!res.success && r.status === 501) {
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
      setIsCatLoading(false);
    }
  };

  const getAllCategories = async () => {
    try {
      setIsCatLoading(true);
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
      setIsCatLoading(false);
    }
  };

  const addMenuItem = async (data) => {
    data.name = formatName(data.name);
    try {
      setIsMenuLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("category", data.category || "");
      formData.append("foodType", data.foodType || "non-veg");
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
      setIsMenuLoading(false);
    }
  };

  const getAllMenuItems = async () => {
    try {
      setIsMenuLoading(true);
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
      setIsMenuLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsMenuLoading(true);
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
      setIsMenuLoading(false);
    }
  };

  const updateMenuItem = async (id, data) => {
    try {
      setIsMenuLoading(true);
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "image" && data[key] && data[key][0]) {
          formData.append("image", data[key][0]);
        } else if (Array.isArray(data[key])) {
          data[key].forEach((item) => formData.append(key, item));
        } else if (typeof data[key] === "boolean") {
          formData.append(key, data[key] ? "true" : "false");
        } else {
          formData.append(key, data[key]);
        }
      });

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
        await getAllMenuItems(); // refresh frontend
      }

      return result;
    } catch (error) {
      console.error("Error updating item:", error);
      return { success: false, message: error.message };
    } finally {
      setIsMenuLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setIsCatLoading(true);
      const r = await fetch(`${BASE_API}/api/category/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (r.ok) {
        setCategories((prev) =>
          prev.filter((t) => {
            return t._id !== id;
          })
        );
        return { success: true, message: "Deleted" };
      }
    } catch (error) {
      return { success: false, message: error };
    } finally {
      setIsCatLoading(false);
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
        updateMenuItem,
        handleDeleteCategory,
        isCatLoading,
        isMenuLoading,
        categories,
        menuItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
