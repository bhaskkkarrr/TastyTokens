import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
const BASE_API = import.meta.env.VITE_BASE_API;

export const CategoryContext = createContext();
export const CategoryProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [isCatLoading, setIsCatLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // ✅ Capitalize first letter
  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

  // ----------------------------------------------------------------------
  // ✅ ADD CATEGORY
  // ----------------------------------------------------------------------
  const addCategory = async (data) => {
    try {
      setIsCatLoading(true);

      data.name = formatName(data.name);

      const r = await fetch(`${BASE_API}/api/category/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const res = await r.json();
      console.log("Category Response", res);

      if (res.success) {
        await getAllCategories();
        return { success: true };
      }

      return {
        success: false,
        message: res.message || "Unable to add category",
      };
    } catch (error) {
      console.log("Error in adding category", error);
      return { success: false, message: error.message };
    } finally {
      setIsCatLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // ✅ GET ALL CATEGORIES
  // ----------------------------------------------------------------------
  const getAllCategories = async () => {
    try {
      setIsCatLoading(true);

      const r = await fetch(`${BASE_API}/api/category/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await r.json();
      console.log("Categories:", res);

      if (res.success) {
        setCategories(res.categories);
      }
    } catch (error) {
      console.error("Error getting categories:", error);
    } finally {
      setIsCatLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // ✅ DELETE CATEGORY
  // ----------------------------------------------------------------------
  const handleDeleteCategory = async (id) => {
    try {
      setIsCatLoading(true);

      const r = await fetch(`${BASE_API}/api/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await r.json();

      if (res.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        return { success: true };
      }

      return { success: false, message: res.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsCatLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // ✅ UPDATE CATEGORY
  // ----------------------------------------------------------------------
  const updateCategory = async (id, data) => {
    console.log("Updating category:", id, data);
    try {
      setIsCatLoading(true);
      const r = await fetch(`${BASE_API}/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const res = await r.json();
      if (res.success) {
        await getAllCategories();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsCatLoading(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        // category
        addCategory,
        getAllCategories,
        handleDeleteCategory,
        updateCategory,

        // states
        isCatLoading,
        categories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
