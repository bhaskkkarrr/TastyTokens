import React, { useState } from "react";
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

function AdminOrders() {
  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      tableName: "Table 5",
      items: [
        { name: "Paneer Butter Masala", quantity: 2, price: 299 },
        { name: "Butter Naan", quantity: 3, price: 40 },
      ],
      total: 718,
      status: "preparing",
      time: "10:30 AM",
      customerName: "Rahul Sharma",
      paymentStatus: "paid",
      orderType: "dine-in",
    },
    {
      id: "ORD002",
      tableName: "Table 8",
      items: [
        { name: "Dal Makhani", quantity: 1, price: 249 },
        { name: "Jeera Rice", quantity: 1, price: 149 },
      ],
      total: 398,
      status: "completed",
      time: "10:15 AM",
      customerName: "Priya Patel",
      paymentStatus: "paid",
      orderType: "dine-in",
    },
    {
      id: "ORD003",
      tableName: "Table 2",
      items: [
        { name: "Kadai Paneer", quantity: 1, price: 279 },
        { name: "Garlic Naan", quantity: 2, price: 50 },
      ],
      total: 379,
      status: "new",
      time: "10:45 AM",
      customerName: "Amit Kumar",
      paymentStatus: "pending",
      orderType: "dine-in",
    },
  ]);

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
                5
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
                3
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
                12
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
                ₹15,420
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
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <select className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none">
                <option value="">Filter by Status</option>
                <option value="new">New</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
              </select>
              <select className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none">
                <option value="">Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="row">
              <div className="col-12 col-md-3">
                <div className="mb-3 mb-md-0">
                  <div className="flex justify-between md:block">
                    <h5 className="text-lg font-semibold text-gray-800 mb-1">
                      {order.id}
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium 
                    ${
                      order.status === "new"
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    disabled={order.status !== "new"}
                  >
                    Accept Order
                  </button>
                  <button
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
                  <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                    View Details
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
