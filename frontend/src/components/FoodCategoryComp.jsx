import React, { useState } from "react";
import { FaEdit, FaTrash, FaUtensils } from "react-icons/fa";

// Mock Loader component
const Loader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

const FaPlus = ({ className }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

export default function FoodCategoriesSection() {
  const [showCatAddModel, setShowCatAddModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data
  const categories = [
    { _id: "1", name: "Pizza", isActive: true },
    { _id: "2", name: "Burgers", isActive: true },
    { _id: "3", name: "Pasta", isActive: false },
    { _id: "4", name: "Salads", isActive: true },
    { _id: "5", name: "Desserts", isActive: true },
    { _id: "6", name: "Beverages", isActive: true },
  ];

  const handleDeleteCategory = (id) => {
    console.log("Delete category:", id);
  };

  const handleEditCategory = (id) => {
    console.log("Edit category:", id);
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl  sm:p-5 shadow-lg border border-gray-100">
        {/* Categories Scroll Container */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-3 min-w-max pb-3">
              {/* All Items Button */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white scale-105 shadow-md"
                    : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <span className="text-lg">🍽️</span>
                <span>All Items</span>
              </button>

              {isLoading ? (
                <Loader />
              ) : (
                categories?.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat._id)}
                    className={`z-50 group relative flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      cat.isActive
                        ? selectedCategory === cat._id
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md scale-105"
                          : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm hover:shadow-md hover:scale-102"
                        : "bg-gradient-to-r from-red-50 to-red-100 text-red-700 opacity-75 hover:opacity-100 shadow-sm"
                    }`}
                  >
                    <span>{cat.name}</span>

                    {/* Status Badge */}
                    {!cat.isActive && (
                      <span className=" absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        Inactive
                      </span>
                    )}

                    {/* Action Buttons - Show on hover */}
                    <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(cat._id);
                        }}
                        className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95"
                        title="Edit category"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat._id);
                        }}
                        className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95"
                        title="Delete category"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Category Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold text-emerald-600">
              {categories.filter((c) => c.isActive).length}
            </span>{" "}
            active categories
            {categories.filter((c) => !c.isActive).length > 0 && (
              <span className="ml-2">
                •{" "}
                <span className="font-semibold z-50 text-red-600">
                  {categories.filter((c) => !c.isActive).length}
                </span>{" "}
                inactive
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
