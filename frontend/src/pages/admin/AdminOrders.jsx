import React, { useContext, useEffect, useState } from "react";
import {
  FaClipboardList,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaUtensils,
  FaMoneyBillWave,
} from "react-icons/fa";
import { OrderContext } from "../../context/OrderContext";

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { getOrders, orders, updateStatus, deleteOrder } =
    useContext(OrderContext);
  // Status badge styles
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-600";
      case "preparing":
        return "bg-yellow-100 text-yellow-600";
      case "completed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const result = await updateStatus(id, status);
    console.log(result);
  };

  const handleDeleteOrder = async (id) => {
    const r = await deleteOrder(id);
    console.log(r);
  };
  // 1) Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.tableName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = filterStatus === "" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // 2) Sort filtered orders (completed last)
  const sortedFilteredOrders = [...filteredOrders].sort((a, b) => {
    const statusOrder = {
      new: 1,
      pending: 1,
      preparing: 2,
      completed: 3,
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // ✅ Calculate real-time stats from orders state
  const newOrders = orders.filter(
    (o) => o.status === "new" || o.status === "pending"
  ).length;
  const preparingOrders = orders.filter((o) => o.status === "preparing").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container-fluid py-2 px-0 p-sm-3">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 mb-4 gap-2">
        <div className="flex items-center">
          <FaClipboardList className="text-emerald-600 w-6 sm:w-8 h-6 sm:h-8" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-0 ms-2 text-gray-800 font-poppins">
            Orders Management
          </h2>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 whitespace-nowrap">
                Today's Orders:
              </span>
              <span className="text-emerald-600 font-semibold">24</span>
              <span className="text-green-500 text-xs">(+12.5%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-sm-4 px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              {/* Label + Icon Row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-2">
                  <p className="m-0 ">New Orders</p>
                  <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                    <FaClipboardList className="text-emerald-600 w-5 h-5" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-600">
                {newOrders}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-sm-4 px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              {/* Label + Icon Row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-2">
                  <p className="m-0 ">Preparing</p>
                  <div className="bg-yellow-100 p-2 rounded-full flex items-center justify-center">
                    <FaUtensils className="text-yellow-600 w-5 h-5" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-600">
                {preparingOrders}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-sm-4 px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              {/* Label + Icon Row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-2">
                  <p className="m-0 ">Completed</p>
                  <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                    <FaCheck className="text-emerald-600 w-5 h-5" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-600">
                {completedOrders}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-sm-4 px-4 py-2  shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              {/* Label + Icon Row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-2">
                  <p className="m-0 ">Total Revenue</p>
                  <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                    <FaMoneyBillWave className="text-emerald-600 w-5 h-5" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-600">
                ₹{totalRevenue}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl p-sm-4 p-3  mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="">Filter by Status</option>
                <option value="pending">New</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedFilteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="row">
              <div className="col-12 col-md-3">
                <div className="mb-3 mb-md-0">
                  <div className="flex justify-between md:block">
                    <h5 className="text-lg font-semibold text-gray-800 mb-1">
                      {order.orderId}
                    </h5>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{order.time}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.tableName}
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-5">
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-800">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="font-semibold text-emerald-600">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="flex flex-wrap gap-2 justify-end mt-3 mt-md-0">
                  <button
                    onClick={() => handleUpdateStatus(order._id, "preparing")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium 
                    ${
                      order.status === "pending"
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    disabled={order.status !== "pending"}
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order._id, "completed")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium 
                      
                    ${
                      order.status === "preparing"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    disabled={order.status !== "preparing"}
                  >
                    Mark Complete
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;
