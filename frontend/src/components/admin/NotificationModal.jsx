import React from "react";
import { X } from "lucide-react";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext } from "react";

export default function NotificationModal({ open, onClose }) {
  const { notifications, markAsRead, markAllRead } =
    useContext(NotificationContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-24 z-50">
      <div className="bg-white w-96 rounded-2xl shadow-xl animate-slideUp p-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto mt-3 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 rounded-xl border ${
                  n.read ? "bg-gray-50" : "bg-emerald-50 border-emerald-100"
                }`}
                onClick={() => markAsRead(n._id)}
              >
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-gray-600">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t mt-3 pt-3 flex justify-between">
          <button
            onClick={markAllRead}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <style>
        {`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}
      </style>
    </div>
  );
}
