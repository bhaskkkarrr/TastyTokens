import React, { useState } from "react";
import { 
  FaBell, 
  FaShoppingBag, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserCircle,
  FaCog,
  FaTrash,
  FaEllipsisV
} from "react-icons/fa";

function AdminNotification() {
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      message: "Order #12345 has been placed by Rahul Sharma",
      time: "2 minutes ago",
      isRead: false,
      priority: "high",
      orderDetails: {
        orderId: "12345",
        amount: "₹850",
        items: 4
      }
    },
    {
      id: 2,
      type: "system",
      title: "System Update",
      message: "System maintenance scheduled for tonight at 2 AM",
      time: "1 hour ago",
      isRead: true,
      priority: "medium"
    },
    {
      id: 3,
      type: "feedback",
      title: "New Customer Review",
      message: "Priya Patel left a 5-star review for their recent order",
      time: "3 hours ago",
      isRead: false,
      priority: "normal",
      rating: 5
    },
    {
      id: 4,
      type: "alert",
      title: "Low Stock Alert",
      message: "Paneer Butter Masala ingredients are running low",
      time: "5 hours ago",
      isRead: true,
      priority: "high"
    }
  ]);

  const getNotificationStyle = (type, isRead) => {
    const baseClasses = "border-l-4 p-4 rounded-r-2xl transition-all duration-300";
    const readClass = isRead ? "bg-white" : "bg-emerald-50";
    
    switch(type) {
      case "order":
        return `${baseClasses} ${readClass} border-emerald-500`;
      case "system":
        return `${baseClasses} ${readClass} border-blue-500`;
      case "feedback":
        return `${baseClasses} ${readClass} border-yellow-500`;
      case "alert":
        return `${baseClasses} ${readClass} border-red-500`;
      default:
        return `${baseClasses} ${readClass} border-gray-500`;
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = "w-6 h-6";
    switch(type) {
      case "order":
        return <FaShoppingBag className={`${iconClass} text-emerald-500`} />;
      case "system":
        return <FaCog className={`${iconClass} text-blue-500`} />;
      case "feedback":
        return <FaUserCircle className={`${iconClass} text-yellow-500`} />;
      case "alert":
        return <FaExclamationTriangle className={`${iconClass} text-red-500`} />;
      default:
        return <FaBell className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className="container-fluid p-4 sm:p-6 bg-emerald-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <FaBell className="text-emerald-600 w-6 sm:w-8 h-6 sm:h-8" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-0 ms-2 text-gray-800 font-poppins">
            Notifications
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Mark all as read
          </button>
          <button className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300">
            Settings
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unread</p>
              <h4 className="text-xl font-bold text-emerald-600">12</h4>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <FaBell className="text-emerald-600 w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">High Priority</p>
              <h4 className="text-xl font-bold text-red-600">5</h4>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FaExclamationTriangle className="text-red-600 w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today's</p>
              <h4 className="text-xl font-bold text-blue-600">24</h4>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaCheckCircle className="text-blue-600 w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <h4 className="text-xl font-bold text-gray-600">156</h4>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <FaBell className="text-gray-600 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm">
            <option value="">All Types</option>
            <option value="order">Orders</option>
            <option value="system">System</option>
            <option value="feedback">Feedback</option>
            <option value="alert">Alerts</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm">
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="normal">Normal</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm">
            <option value="">Time Range</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm">
            <option value="">Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={getNotificationStyle(notification.type, notification.isRead)}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-base font-semibold text-gray-800 mb-1">
                      {notification.title}
                    </h5>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
                      <FaEllipsisV className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {notification.type === 'order' && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Order #{notification.orderDetails.orderId}</span>
                      <span className="font-medium text-emerald-600">{notification.orderDetails.amount}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminNotification;

