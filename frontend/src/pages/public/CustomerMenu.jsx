import React, { useContext, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { PublicContext } from "../../context/PublicContext";
import { FaUtensils, FaCircle } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { Triangle } from "lucide-react";
import "../../index.css";
import FoodFilterToggles from "../../components/FoodFilterToggles";
import AddToCartModal from "../../components/AddToCartModal";
import { CartContext } from "../../context/CartContext";

export default function CustomerMenu() {
  const [filter, setFilter] = useState(null); // "veg" | "nonveg" | "bestseller" | null
  const navigate = useNavigate();
  const { restaurantId, tableId } = useParams();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const { isLoading, data, error } = useContext(PublicContext);
  const { addItem } = useContext(CartContext);
  // Safeguard defaults
  const { restaurant = {}, table = {}, menu = [] } = data || {};

  // ===== FILTERED MENU =====
  const filteredMenu = useMemo(() => {
    return menu
      .filter((category) =>
        categoryFilter === "All" ? true : category.name === categoryFilter
      )
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const matchesFilter =
            (filter === "veg" && item.isVeg === true) ||
            (filter === "nonveg" && item.isVeg === false) ||
            (filter === "bestseller" && item.isBestSeller === true) ||
            filter === null;

          const matchesSearch = item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return matchesFilter && matchesSearch;
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [menu, categoryFilter, filter, searchQuery]);

  // ===== BEVERAGES =====
  const beverages = useMemo(() => {
    const beverageCategory = menu.find(
      (cat) => cat.name?.toLowerCase() === "beverages"
    );
    return beverageCategory ? beverageCategory.items : [];
  }, [menu]);

  // ===== DESSERTS =====
  const desserts = useMemo(() => {
    const dessertsCategory = menu.find(
      (des) => des.name?.toLowerCase() === "desserts"
    );
    return dessertsCategory ? dessertsCategory.items : [];
  }, [menu]);

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24">
      {/* ===== LOADING ===== */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      )}

      {/* ===== ERROR ===== */}
      {!isLoading && error && (
        <div className="text-center text-red-600 mt-10">{error}</div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      {!isLoading && !error && (
        <>
          {/* ===== HEADER ===== */}
          <header className="bg-emerald-700 z-30 py-3 px-2 shadow-lg border-b-3 rounded-bottom-5 border-emerald-900 flex items-center justify-center">
            <div className="relative col-12 px-4 py-3 bg-emerald-50 flex flex-col justify-center text-center rounded-5">
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-2 border-b w-full text-gray-500">
                  <FaUtensils className="text-2xl text-black" />
                  <div className="text-3xl font-semibold text-black tracking-wide">
                    {restaurant.name || "Cafe"}
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <span className="font-semibold text-gray-500 text-sm mb-0">
                    {restaurant.phoneNumber || "NA"}
                  </span>
                  <span className="font-semibold border-b-2 border-dotted text-gray-500 text-sm mb-0">
                    {restaurant.address || "NA"}
                  </span>
                </div>
              </div>

              {/* Dining Table */}
              <div className="absolute left-24 right-24 -bottom-10 border-8 flex shadow justify-center items-center rounded-5 border-emerald-900">
                <div className="text-black text-sm w-full py-2 rounded-5 bg-emerald-50">
                  Dining at <span className="font-semibold">{table.name}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ===== MENU SECTION ===== */}
          <main className="max-w-6xl mx-auto px-3 md:px-6 space-y-6">
            {/* ===== SEARCH & FILTER BAR ===== */}
            <div className="mt-8 space-y-5">
              {/* 🔍 Search Bar */}
              <div className="flex items-center bg-white rounded-3 shadow-sm border border-emerald-200 px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-400 transition-all duration-300 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-emerald-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 6.65a7.5 7.5 0 016 9.999z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search your favorite dish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ml-2 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
                />
              </div>

              {/* 🎯 Filter Section */}
              <FoodFilterToggles filter={filter} setFilter={setFilter} />

              {/* 🍽️ Category Scroll Bar */}
              <div className="space-y-2 border-b pb-3">
                <div className="text-2xl font-semibold mb-0 tracking-wide">
                  Food Categories
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-3 py-2">
                  <button
                    onClick={() => setCategoryFilter("All")}
                    className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-3 shadow-sm transition-all ${
                      categoryFilter === "All"
                        ? "bg-emerald-600 text-white"
                        : "bg-white border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
                    }`}
                  >
                    All
                  </button>
                  {menu.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setCategoryFilter(cat.name)}
                      className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-3 shadow-sm transition-all ${
                        categoryFilter === cat.name
                          ? "bg-emerald-600 text-white"
                          : "bg-white border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== MENU LIST ===== */}
            {filteredMenu.length > 0 ? (
              filteredMenu.map((category) => (
                <section key={category._id} className="animate-fadeIn mb-3">
                  <div className="flex items-center mb-2">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-1">
                    {category.items.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Name */}
                        <div className="d-flex justify-content-center py-2">
                          <div className="text-sm md:text-base font-semibold text-gray-900 truncate">
                            {item.name || "NA"}
                          </div>
                        </div>

                        {/* Image */}
                        <div className="relative h-32 w-full bg-gray-100">
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
                            <span className="absolute top-1 z-20 right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-semibold px-1 rounded-full shadow">
                              Bestseller
                            </span>
                          )}

                          {/* Veg / Non-Veg */}
                          {item.isVeg === false ? (
                            <div className="absolute top-1 left-1 flex items-center justify-center border-2 h-5 w-5 rounded-sm bg-white shadow border-red-600">
                              <Triangle
                                size={11}
                                className="text-red-600"
                                fill="red"
                              />
                            </div>
                          ) : (
                            <div className="absolute top-1 left-1 flex bg-white items-center justify-center border-2 rounded-sm w-5 h-5 border-green-600">
                              <FaCircle className="w-3 h-3 text-emerald-600" />
                            </div>
                          )}
                        </div>

                        {/* Price + Add Button */}
                        <div className="flex flex-col justify-between px-2 py-2">
                          <div className="d-flex justify-between items-center">
                            <div className="d-flex flex-col">
                              <p className="text-emerald-700 font-medium mb-0">
                                ₹{item.basePrice || "NA"}
                              </p>
                            </div>
                            <div className="flex items-center justify-center">
                              <div
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowAddToCartModal(true);
                                }}
                                className="flex justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white text-base font-medium p-2 rounded-3 transition-all duration-200 cursor-pointer"
                              >
                                <MdOutlineAddShoppingCart />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center text-gray-500 py-20">
                No items found matching your search or filter.
              </div>
            )}
          </main>

          {/* ===== FLOATING CART BUTTON ===== */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <button
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-8 py-3 rounded-5 shadow-lg flex items-center gap-2 transition-all duration-300"
              onClick={() => navigate(`/r/${restaurantId}/t/${tableId}/cart`)}
            >
              <FiShoppingCart className="text-lg" /> View Cart
            </button>
          </div>

          {/* ===== ADD TO CART MODAL ===== */}
          <AddToCartModal
            item={selectedItem}
            drinks={beverages}
            desserts={desserts}
            show={showAddToCartModal}
            onClose={() => setShowAddToCartModal(false)}
            onAddToCart={(cartData) => {
              console.log("Added to cart:", cartData);
              addItem(cartData);
            }}
          />
        </>
      )}
    </div>
  );
}
