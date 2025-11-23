import React from "react";
import {
  FaBell,
  FaShoppingBag,
  FaEllipsisV,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext } from "react";
import { MdDelete } from "react-icons/md";
import { CiRead } from "react-icons/ci";

export default function notifications() {
  const { notifications, unread, markAsRead, markAllRead, deleteSingle } =
    useContext(NotificationContext);
  console.log(notifications);

  const getNotificationStyle = (isRead) => {
    return `border-l-4 p-3 rounded-r-2xl transition-all duration-300 ${
      isRead
        ? "bg-white border-emerald-300"
        : "bg-emerald-50 border-emerald-600"
    }`;
  };

  return (
    <div className="container-fluid py-2 px-0 p-sm-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-1 mt-2">
        <div className="flex items-center">
          <FaShoppingBag className="text-emerald-600 w-7 h-7" />
          <h2 className="text-2xl font-semibold ms-2 text-gray-800 font-poppins">
            Order Notifications
          </h2>
        </div>

        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-4 hover:bg-emerald-700 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Orders</p>
          <h4 className="text-2xl font-bold text-emerald-600">
            {notifications.length}
          </h4>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Unread</p>
          <h4 className="text-2xl font-bold text-red-500">{unread}</h4>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No order notifications yet.
          </p>
        )}

        {notifications.map((n) => (
          <div key={n._id} className={getNotificationStyle(n.read)}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <FaShoppingBag className="w-6 h-6 text-emerald-600" />
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-base font-semibold text-gray-800 mb-1">
                      {n.title}
                    </h5>
                    <p className="text-sm text-gray-600 mb-2">{n.body}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="p-1 bg-emerald-100 rounded-4 hover:bg-emerald-200"
                      >
                        <CiRead className="text-emerald-700 w-5 h-5 text-xs " />
                      </button>
                    )}

                    <div
                      className="bg-red-100 p-1 rounded-5 hover:bg-red-200"
                      onClick={() => deleteSingle(n._id)}
                    >
                      <MdDelete className="text-red-600 w-5 h-5 text-xs " />
                    </div>
                  </div>
                </div>

                {/* Order Meta */}
                {n.meta && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Order #{n.meta.orderId}
                      </span>
                      <span className="font-medium text-emerald-600">
                        ₹{n.meta.price}
                      </span>
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
