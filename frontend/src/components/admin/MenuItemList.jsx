import React from "react";
import MenuItemCard from "./MenuItemCard";
export default function MenuItemList({
  menuItems,
  categories,
  onEdit,
  onDelete,
  toggleAvailability,
  selectedCategory,
}) {
  // Build category + items list
  const grouped = categories.map((cat) => ({
    ...cat,
    items: menuItems.filter((item) => item.category?._id === cat._id),
  }));

  // ✅ Filter logic
  const visibleCategories = grouped.filter((cat) => {
    if (selectedCategory === "all") {
      return cat.items.length > 0; // ✅ only categories that have items
    }

    return cat._id === selectedCategory; // ✅ only selected category
  });

  return (
    <>
      {visibleCategories.map((cat) => (
        <div key={cat._id} className="mb-10">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>

            <h2 className="px-6 text-2xl md:text-3xl font-bold text-gray-700 tracking-wide">
              {cat.name}
            </h2>

            <span className="text-gray-400 text-sm">
              ({cat.items.length} {cat.items.length === 1 ? "item" : "items"})
            </span>

            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
          </div>

          {/* ✅ No items available */}
          {cat.items.length === 0 && (
            <div className="text-center text-gray-500 py-10 text-lg font-medium">
              No food item available
            </div>
          )}

          {/* Items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {cat.items.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                toggleAvailability={toggleAvailability}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
