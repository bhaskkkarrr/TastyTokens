import React, { useContext, useState, useEffect } from "react";
import {
  FaClipboardList,
  FaSearch,
  FaCheck,
  FaUtensils,
  FaMoneyBillWave,
  FaTrash,
} from "react-icons/fa";
import { OrderContext } from "../../context/OrderContext";
import OrdersList from "../../components/admin/OrdersList";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { getOrders, orders, updateStatus, deleteOrder } =
    useContext(OrderContext);

  useEffect(() => {
    getOrders();
  }, []);

  // ✅ Badge colors for real statuses
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-600";
      case "PREPARING":
        return "bg-yellow-100 text-yellow-600";
      case "COMPLETED":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ Format createdAt
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.table || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = filterStatus === "" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ✅ Sort by status order
  const sortedFilteredOrders = [...filteredOrders].sort((a, b) => {
    const statusOrder = {
      PENDING: 1,
      PREPARING: 2,
      COMPLETED: 3,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // ✅ Stats
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const preparingOrders = orders.filter((o) => o.status === "PREPARING").length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.pricing?.grandTotal || 0),
    0
  );

  // ✅ Handlers
  const handleUpdateStatus = async (id, newStatus) => {
    await updateStatus(id, newStatus);
  };

  const handleDeleteOrder = async (id) => {
    await deleteOrder(id);
  };

  return (
    <div className="container-fluid py-3 px-0 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center">
          <FaClipboardList className="text-emerald-600 w-7 h-7" />
          <h2 className="text-2xl font-semibold text-gray-800 ms-2">
            Orders Management
          </h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Pending</span>
            <FaClipboardList className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{pendingOrders}</h3>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Preparing</span>
            <FaUtensils className="text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-yellow-600">
            {preparingOrders}
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Completed</span>
            <FaCheck className="text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-green-600">
            {completedOrders}
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Revenue</span>
            <FaMoneyBillWave className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">
            ₹{totalRevenue}
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer, or item"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PREPARING">Preparing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <OrdersList
          orders={sortedFilteredOrders}
          variant="detailed"
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteOrder}
        />
      </div>
    </div>
  );
}
