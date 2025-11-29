import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import ConfirmModal from "../ConfirmationModal";

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
  toggleAvailability,
}) {
  const isDiscounted =
    item.discountedPrice &&
    item.discountedPrice !== item.basePrice &&
    item.discountedPrice < item.basePrice;

  const discountPercent = isDiscounted
    ? Math.round(
        ((item.basePrice - item.discountedPrice) / item.basePrice) * 100
      )
    : 0;

  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300">
      <ConfirmModal
        message={confirmMessage}
        onCancel={() => {
          setConfirmMessage("");
          setConfirmAction(null);
        }}
        onConfirm={() => {
          confirmAction();
          setConfirmMessage("");
          setConfirmAction(null);
        }}
      />
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Best Seller Badge */}
        {item.isBestSeller && (
          <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs p-1 rounded-full flex items-center gap-1 shadow">
            <IoStar size={20} />
          </div>
        )}

        {/* Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {discountPercent}% OFF
          </div>
        )}

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

      {/* Content Section */}
      <div className="px-3 py-2">
        {/* Title + Price */}
        <div className="flex justify-between items-start mb-2">
          <div className="text-lg font-semibold text-gray-900 leading-tight">
            {item.name}
          </div>

          {/* Price Display */}
          <div className="text-right">
            {isDiscounted ? (
              <>
                <div className="text-xl font-bold text-green-600">
                  ₹{item.discountedPrice}
                </div>
                <div className="text-sm text-gray-400 line-through">
                  ₹{item.basePrice}
                </div>
              </>
            ) : (
              <div className="text-xl font-bold text-gray-900">
                ₹{item.basePrice}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-600 mb-3 line-clamp-1">
          {item.description || "No description"}
        </div>

        {/* Availability Toggle + Actions */}
        <div className="flex flex-col justify-between items-center border-t pt-3">
          {/* Availability Toggle */}
          <div
            onClick={() => toggleAvailability(item._id, !item.isAvailable)}
            className="flex items-center pb-2 gap-2 cursor-pointer"
          >
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.isAvailable ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.isAvailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
            <span
              className={`text-sm font-medium ${
                item.isAvailable ? "text-green-600" : "text-gray-500"
              }`}
            >
              {item.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Edit + Delete Buttons */}
          <div className="flex gap-2">
            <button
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-4"
              onClick={() => onEdit(item)}
            >
              <FaEdit size={15} />
            </button>
            <button
              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-4"
              onClick={() => {
                setConfirmMessage("Are you sure you want to delete this item?");
                setConfirmAction(() => () => onDelete(item._id));
              }}
            >
              <FaTrash size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
