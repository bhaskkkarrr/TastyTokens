import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
const BASE_API = import.meta.env.VITE_BASE_API;

export const TableContext = createContext();
export const TableProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const { token } = useContext(AuthContext);
  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const createTableAndQr = async (data) => {
    data.name = formatName(data.name);
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_API}/api/table/create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        await getAllTables();
        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || "Error creating table",
        };
      }
    } catch (err) {
      console.error("Server error", err);
      return {
        success: false,
        message: result.message || "Table creation failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTables = async () => {
    try {
      setIsLoading(true);
      const r = await fetch(`${BASE_API}/api/table/tables`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await r.json();
      console.log("Tables fetched:", res);
      setTables(res.tables);
    } catch (error) {
      console.log("Error", error);
      return {
        success: false,
        message: res.message || "Table categories failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getAllTables();
    }
  }, [token]);

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);

      const r = await fetch(`${BASE_API}/api/table/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await r.json();

      if (r.ok && res.success) {
        setTables((prev) => prev.filter((t) => t._id !== id));
        return { success: true, message: "Table deleted successfully" };
      } else {
        return {
          success: false,
          message: res.message || "Failed to delete table",
        };
      }
    } catch (error) {
      return { success: false, message: error.message || "Unexpected error" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (qr) => {
    try {
      console.log(qr);
      const response = await fetch(qr.qrImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${qr.name || "table"}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  };

  return (
    <TableContext.Provider
      value={{
        createTableAndQr,
        getAllTables,
        handleDelete,
        handleDownload,
        tables,
        isLoading,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
