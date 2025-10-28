import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { PublicContext } from "../../context/PublicContext";
import { FaUtensils } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import "../../index.css"; // Ensure custom animations are included

export default function CustomerMenu() {
  const { getResMenu, isLoading, data, error } = useContext(PublicContext);
  // const { addItem } = useContext(CartContext);
  // const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 mt-10">{error}</div>;

  const { restaurant, table, menu } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24">
      {/* ===== HEADER ===== */}
      <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-emerald-700">
            <FaUtensils className="text-2xl" />
            <h1 className="text-2xl font-bold tracking-wide">
              {restaurant?.restaurantName}
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Dining at <span className="font-semibold">{table?.name}</span>
          </p>
        </div>
      </header>

      {/* ===== MENU SECTION ===== */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 mt-6 space-y-12">
        {menu.map((category) => (
          <section key={category._id} className="animate-fadeIn">
            {/* Category Header */}
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {category.name}
              </h2>
              <div className="flex-1 h-px bg-gray-200 ml-4"></div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {category.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-44 w-full bg-gray-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}

                    {/* Bestseller Badge */}
                    {item.isBestSeller && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                        ⭐ Bestseller
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-emerald-700 font-medium text-base">
                        ₹{item.price}
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {item.foodType && (
                        <div className="mt-3">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              item.foodType === "veg"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {item.foodType === "veg" ? "Pure Veg" : "Non-Veg"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Add Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() =>
                          addItem({
                            itemId: item._id,
                            name: item.name,
                            price: item.price,
                            qty: 1,
                          })
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-1.5 rounded-5 shadow transition-all duration-200"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* ===== FLOATING CART BUTTON ===== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          // onClick={() => navigate(`/${restaurantId}/cart`)}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-8 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300"
        >
          <FiShoppingCart className="text-lg" />
          View Cart
        </button>
      </div>
    </div>
  );
}
