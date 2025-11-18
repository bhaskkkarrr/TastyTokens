import React, { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { PublicContext } from "../../context/PublicContext";
import { FaUtensils, FaCircle, FaPlus, FaMinus } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineAddShoppingCart, MdHistory } from "react-icons/md";
import { Triangle, MapPin, Phone } from "lucide-react";
import "../../index.css";
import FoodFilterToggles from "../../components/FoodFilterToggles";
import AddToCartModal from "../../components/AddToCartModal";
import { CartContext } from "../../context/CartContext";
import { FiPlus } from "react-icons/fi";

export default function CustomerMenu() {
  const [filter, setFilter] = useState(null);
  const navigate = useNavigate();
  const { restaurantId, tableId } = useParams();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [order, setOrder] = useState(null);
  const { isLoading, data, error } = useContext(PublicContext);
  const { addItem, cartItems, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const { restaurant = {}, table = {}, menu = [] } = data || {};

  useEffect(() => {
    const storedOrder = localStorage.getItem("order");
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);
  console.log("Orders from localStorage:", order);

  const orderId = order?.orderId;
  // Get item quantity in cart - only count items with matching itemId
  const getItemQuantityInCart = (itemId) => {
    const items = cartItems.filter((cartItem) => cartItem.itemId === itemId);
    return items.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  // Get cart item index for a specific item
  const getCartItemIndex = (itemId) => {
    return cartItems.findIndex((cartItem) => cartItem.itemId === itemId);
  };

  // Total items in cart
  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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

  const beverages = useMemo(() => {
    const beverageCategory = menu.find(
      (cat) => cat.name?.toLowerCase() === "beverages"
    );
    return beverageCategory ? beverageCategory.items : [];
  }, [menu]);

  const desserts = useMemo(() => {
    const dessertsCategory = menu.find(
      (des) => des.name?.toLowerCase() === "desserts"
    );
    return dessertsCategory ? dessertsCategory.items : [];
  }, [menu]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 pb-28">
      {isLoading && (
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center text-red-600 mt-10 font-semibold">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* HEADER */}
          <header className="bg-white shadow-lg sticky top-0 z-30">
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white px-3 sm:px-6 py-3">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <FaUtensils className="text-2xl" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
                    {restaurant.name || "Cafe"}
                  </h1>
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm text-white/95">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{restaurant.phoneNumber || "NA"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                    <span className="flex-1 line-clamp-2">
                      {restaurant.address || "NA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Badge */}
            <div className="bg-emerald-50 border-y border-emerald-200 py-1 ">
              <div className="max-w-6xl mx-auto text-center">
                <span className="text-gray-700 text-xs sm:text-sm font-medium">
                  Dining at{" "}
                  <span className="font-bold text-emerald-700 text-sm sm:text-base">
                    {table.name}
                  </span>
                </span>
              </div>
            </div>
          </header>

          {/* MENU SECTION */}
          <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
            {/* SEARCH BAR */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 6.65a7.5 7.5 0 016 9.999z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>

            {/* FILTER TOGGLES */}
            <FoodFilterToggles filter={filter} setFilter={setFilter} />

            {/* CATEGORY TABS */}
            <div className="space-y-3">
              <div className="text-lg sm:text-xl font-semibold text-gray-800">
                Categories
              </div>
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                <button
                  onClick={() => setCategoryFilter("All")}
                  className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-5 font-semibold text-xs sm:text-sm ${
                    categoryFilter === "All"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-500"
                  }`}
                >
                  All
                </button>
                {menu.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setCategoryFilter(cat.name)}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-5 font-semibold text-xs sm:text-sm ${
                      categoryFilter === cat.name
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-500"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* MENU ITEMS */}
            {filteredMenu.length > 0 ? (
              filteredMenu.map((category) => (
                <section key={category._id} className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xl sm:text-2xl font-semibold  text-gray-800">
                      {category.name}
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-transparent rounded"></div>
                  </div>

                  {/* 2 ITEMS PER ROW */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {category.items.map((item) => {
                      const itemQty = getItemQuantityInCart(item._id);
                      const cartIndex = getCartItemIndex(item._id);

                      return (
                        <div
                          key={item._id}
                          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg"
                        >
                          {/* Image */}
                          <div className="relative h-32 sm:h-40 ">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="object-cover rounded-b-2xl  w-full h-full"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}

                            {/* Bestseller Badge */}
                            {item.isBestSeller && (
                              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-amber-500 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
                                Best
                              </span>
                            )}

                            {/* Veg/Non-veg Badge */}
                            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                              {item.isVeg === false ? (
                                <div className="flex items-center justify-center border-2 h-5 w-5 sm:h-6 sm:w-6 rounded bg-white shadow-md border-red-600">
                                  <Triangle
                                    size={12}
                                    className="text-red-600 sm:w-3 sm:h-3"
                                    fill="red"
                                  />
                                </div>
                              ) : (
                                <div className="flex bg-white items-center justify-center border-2 rounded h-5 w-5 sm:h-6 sm:w-6 border-green-600 shadow-md">
                                  <FaCircle className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-emerald-600" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="p-2.5 sm:p-3 space-y-2 sm:space-y-2.5">
                            <div className="flex flex-col justify-between">
                              <div className="font-bold truncate text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2 leading-tight">
                                {item.name || "NA"}
                              </div>
                              <div className="flex justify-between">
                                <div className="text-emerald-700 py-1 font-bold text-sm sm:text-base">
                                  ₹{item.basePrice || "NA"}
                                </div>
                                {itemQty === 0 ? (
                                  <div
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setShowAddToCartModal(true);
                                    }}
                                    className=" bg-emerald-600 hover:bg-emerald-700 text-white font-semibold sm:py-2.5 rounded-4 flex items-center justify-center sm:text-sm"
                                  >
                                    <span className="text-xs px-3 py-0.5">
                                      Add
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between bg-emerald-50 border-2 border-emerald-600 rounded-lg sm:px-3 sm:py-2 px-2 py-0.5 gap-1">
                                    <button
                                      onClick={() => {
                                        if (cartIndex !== -1) {
                                          decreaseQuantity(cartIndex);
                                        }
                                      }}
                                      className="text-emerald-700 hover:text-emerald-900 font-bold"
                                    >
                                      <FaMinus className="text-xs sm:text-sm" />
                                    </button>
                                    <span className="font-bold text-emerald-700 text-sm sm:text-base sm:px-3">
                                      {itemQty}
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (cartIndex !== -1) {
                                          increaseQuantity(cartIndex);
                                        }
                                      }}
                                      className="text-emerald-700 hover:text-emerald-900 font-bold "
                                    >
                                      <FaPlus className="text-xs sm:text-sm" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Add to Cart Button */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center text-gray-500 py-16 sm:py-20 bg-white rounded-2xl shadow-sm">
                <div className="text-4xl sm:text-5xl mb-3">🍽️</div>
                <p className="text-base sm:text-lg font-medium">
                  No items found
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </main>

          {/* FLOATING ACTION BUTTONS */}
          {totalCartItems > 0 && (
            <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2 sm:gap-3">
              {/* View Cart */}
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 sm:px-6 py-3 sm:py-3.5 rounded-4 shadow-2xl flex items-center gap-2 text-sm sm:text-base"
                onClick={() => navigate(`/r/${restaurantId}/t/${tableId}/cart`)}
              >
                <FiShoppingCart className="text-lg sm:text-xl" />
                <span className="hidden xs:inline">View Cart</span>
                <span className="bg-white text-emerald-700 font-bold px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm">
                  {totalCartItems}
                </span>
              </button>

              {/* Order Status */}
              {order && (
                <button
                  className="bg-white hover:bg-gray-50 text-gray-700 font-bold p-3 sm:p-3.5 rounded-circle shadow-2xl border-2 border-gray-200"
                  onClick={() =>
                    navigate(`/r/${restaurantId}/t/${tableId}/order/${orderId}`)
                  }
                  title="Order Status"
                >
                  <MdHistory className="text-lg sm:text-xl" />
                </button>
              )}
            </div>
          )}

          {/* Order Status Button - Always visible in top right */}
          {
            <button
              className="fixed top-20 sm:top-4 right-3 sm:right-4 z-40 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-2 sm:px-4 py-2 rounded-5 shadow border-2 border-emerald-700  flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              onClick={() =>
                navigate(`/r/${restaurantId}/t/${tableId}/order/${orderId}`)
              }
            >
              <MdHistory className="text-base sm:text-lg" />
              <span className="hidden sm:inline">Orders</span>
            </button>
          }

          {/* ADD TO CART MODAL */}
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
