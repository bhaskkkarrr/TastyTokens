import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoStar } from "react-icons/io5";

export default function MenuItemCard({ item, onEdit, onDelete, toggleAvailability }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 top-0 p-2 flex flex-wrap gap-2">
          {item.isBestSeller && (
            <span className="flex bg-amber-500 text-white px-2 justify-center items-center py-1 rounded-full text-xs font-medium">
              <IoStar className="me-1" />
              Best Seller
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 flex flex-wrap gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.isVeg ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {item.isVeg ? "Pure Veg" : "Non-Veg"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h5 className="text-lg font-semibold text-gray-900 truncate">{item.name || "NA"}</h5>
          <span className="text-lg font-bold text-emerald-600">₹{item.basePrice}</span>
        </div>

        <div className="flex flex-wrap justify-content-center items-center mt-4 border-t border-gray-100 pt-3 gap-2">
          {/* Availability Toggle */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => toggleAvailability(item._id, !item.isAvailable)}
          >
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                item.isAvailable ? "bg-emerald-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.isAvailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
            <span className={`text-sm font-medium ${item.isAvailable ? "text-emerald-600" : "text-gray-400"}`}>
              {item.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Edit/Delete */}
          <div className="flex gap-2">
            <button
              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-5 transition-all"
              onClick={() => onEdit(item)}
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-5 transition-all"
              onClick={() => onDelete(item._id)}
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
