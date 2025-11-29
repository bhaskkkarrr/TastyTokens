import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, ArrowLeft, ShoppingCart, ShoppingBag } from "lucide-react";
import { FaCircle, FaPlus, FaMinus } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { restaurantId, tableId } = useParams();
  const {
    cartItems,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    isCartLoaded,
    total,
    restaurantTax,
  } = useContext(CartContext);
  const { restaurant } = useContext(AuthContext);
  if (!isCartLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading cart...</div>
      </div>
    );
  }
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="relative bg-white rounded-3xl p-12 shadow-2xl">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              Add some delicious items to get started!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto mx-auto"
            >
              <ArrowLeft size={18} />
              <span>Back to Menu</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }
  const finalPrice = (total, taxRate) => total + taxRate;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky z-50 top-0 bg-white/95 backdrop-blur-md shadow-lg"
      >
        <div className=" sm:px-6 px-3 py-2 flex items-center justify-between border-b border-gray-100">
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-emerald-50"
          >
            <ArrowLeft size={22} />
          </motion.button>

          <div className="flex items-center gap-2">
            <ShoppingCart className="text-emerald-600 w-6 h-6" />
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              My Cart
            </div>
          </div>

          <div className="w-10" />
        </div>

        {/* Items Count */}
        <div className="px-4 sm:px-6 py-2 bg-emerald-50/50 border-b border-emerald-100">
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-semibold text-emerald-700">
              {cartItems.length}
            </span>{" "}
            {cartItems.length === 1 ? "item" : "items"} in your cart
          </div>
        </div>
      </motion.div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-3 sm:space-y-4">
        <AnimatePresence>
          {cartItems.map((item, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-2 sm:p-5 flex gap-3 sm:gap-4 relative">
                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeItem(i)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-5 bg-red-50 text-red-500 hover:bg-red-100 transition-colors z-10"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </motion.button>

                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
                    {item.item.imageUrl ? (
                      <img
                        src={item.item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag className="text-gray-300 w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-8 sm:pr-10 space-y-2 sm:space-y-3">
                  {/* Name with Veg/Non-veg indicator */}
                  <div className="mb-0  flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1">
                      {item.isVeg ? (
                        <div className="p-0.5 rounded border border-emerald-500">
                          <FaCircle className="text-emerald-600 text-[10px]" />
                        </div>
                      ) : (
                        <div className="p-0.5 rounded border border-red-500">
                          <IoTriangle className="text-red-600 text-[10px]" />
                        </div>
                      )}
                    </div>
                    <div className="text-xl sm:text-lg font-semibold text-gray-800 leading-tight">
                      {item.name}
                    </div>
                  </div>

                  {/* Selected Variant */}
                  {item.selectedVariant?.name && (
                    <div className="flex items-center mb-1 gap-2 px-1 py-0.5 bg-emerald-50 rounded-lg w-fit">
                      <span className="text-[12px] font-medium text-emerald-700">
                        {item.selectedVariant.name}
                      </span>
                      <span className="text-[10px] text-emerald-600">
                        ₹{item.selectedVariant.price}
                      </span>
                    </div>
                  )}
                  {console.log("rest", restaurant)}
                  {/* Quantity & Price Row */}
                  <div className="flex items-center justify-between ">
                    {/* Quantity Controls */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl shadow-sm"
                    >
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => decreaseQuantity(i)}
                        className="p-2 sm:p-2.5 text-emerald-700 hover:text-emerald-900 transition-colors"
                      >
                        <FaMinus className="text-xs sm:text-sm" />
                      </motion.button>

                      <motion.span
                        key={item.quantity}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-1 sm:px-4 text-base sm:text-lg font-bold text-emerald-800 min-w-[32px] sm:min-w-[40px] text-center"
                      >
                        {item.quantity}
                      </motion.span>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => increaseQuantity(i)}
                        className="p-2 sm:p-2.5 text-emerald-700 hover:text-emerald-900 transition-colors"
                      >
                        <FaPlus className="text-xs sm:text-sm" />
                      </motion.button>
                    </motion.div>

                    {/* Total Price */}
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        ₹{item.totalPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer - Bill Summary */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="sticky bottom-0 bg-white border-t-2 border-gray-100 shadow-2xl"
      >
        {/* Gradient Line */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

        <div className="px-3 py-2 sm:px-6 sm:py-5 space-y-4">
          {/* Bill Details */}
          <div className="space-y-2 mb-0">
            <div className="flex mb-0 justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">₹{total}</span>
            </div>
            <div className="flex mb-2 justify-between text-sm text-gray-600">
              <span>Taxes & Fees</span>
              <span className="font-semibold text-emerald-600">
                {restaurantTax}
              </span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
              <span>Total</span>
              <span className="text-emerald-700">₹{total}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/r/${restaurantId}/t/${tableId}/checkout`)}
            className="relative w-full py-2 sm:py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white rounded-4 text-base sm:text-lg font-bold shadow-xl overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
              animate={{ x: ["-200%", "200%"] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </span>
          </motion.button>

          {/* Safe Area for Mobile */}
          <div className="h-2 sm:h-0" />
        </div>
      </motion.div>
    </div>
  );
}
