import React, { useState } from "react";
import {
  FaUsers,
  FaSearch,
  FaStar,
  FaShoppingBag,
  FaPhoneAlt,
  FaEnvelope,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

function AdminCustomers() {
  // Sample customers data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.s@example.com",
      phone: "+91 98765 43210",
      joinedDate: "2025-08-15",
      totalOrders: 25,
      totalSpent: 12500,
      lastOrder: "2025-10-09",
      avgRating: 4.8,
      status: "active",
      image:
        "https://ui-avatars.com/api/?name=Rahul+Sharma&background=10B981&color=fff",
    },
    {
      id: 2,
      name: "Priya Patel",
      phone: "+91 87654 32109",
      joinedDate: "2025-09-01",
      totalOrders: 18,
      totalSpent: 8900,
      lastOrder: "2025-10-10",
      image:
        "https://ui-avatars.com/api/?name=Priya+Patel&background=10B981&color=fff",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.k@example.com",
      phone: "+91 76543 21098",
      joinedDate: "2025-07-20",
      totalOrders: 32,
      totalSpent: 15800,
      lastOrder: "2025-10-08",
      avgRating: 4.9,
      status: "active",
      image:
        "https://ui-avatars.com/api/?name=Amit+Kumar&background=10B981&color=fff",
    },
  ]);

  return (
    <div className="container-fluid p-4 sm:p-6 bg-emerald-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <FaUsers className="text-emerald-600 w-6 sm:w-8 h-6 sm:h-8" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-0 ms-2 text-gray-800 font-poppins">
            Customer Management
          </h2>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Customers</p>
              <h4 className="text-xl font-bold text-emerald-600">850</h4>
              <span className="text-xs text-green-500">+12 this month</span>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <FaUsers className="text-emerald-600 w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Customers</p>
              <h4 className="text-xl font-bold text-emerald-600">685</h4>
              <span className="text-xs text-green-500">80.5% of total</span>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <FaShoppingBag className="text-emerald-600 w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
              <h4 className="text-xl font-bold text-emerald-600">₹495</h4>
              <span className="text-xs text-green-500">+₹45 vs last month</span>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <FaSortAmountDown className="text-emerald-600 w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Rating</p>
              <h4 className="text-xl font-bold text-emerald-600">4.8</h4>
              <span className="text-xs text-green-500">+0.2 vs last month</span>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <FaStar className="text-emerald-600 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none">
                <option value="">Filter by Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none">
                <option value="">Sort By</option>
                <option value="recent">Most Recent</option>
                <option value="orders">Most Orders</option>
                <option value="spent">Highest Spent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h5 className="text-lg font-semibold text-gray-800 mb-1">
                      {customer.name}
                    </h5>
                    <div className="flex flex-wrap gap-2 ">
                      <div className="text-sm font-semibold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                        <FaPhoneAlt className="hidden sm:inline w-4 h-4" />
                        <span className="">
                          {customer.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Joined</span>
                    <span className="text-sm font-medium text-emerald-600">
                      {customer.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {customer.totalOrders}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    ₹{customer.totalSpent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCustomers;
