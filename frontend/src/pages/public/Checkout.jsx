import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Phone,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { OrderContext } from "../../context/OrderContext";

export default function Checkout() {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const { restaurantId, tableId } = useParams();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { createOrder } = useContext(OrderContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      setIsPlacingOrder(true);
      // Convert cart items to expected format
      const formattedItems = cartItems.map((item) => ({
        itemId: item.itemId || item._id,
        name: item.name,
        isVeg: item.isVeg,
        quantity: item.quantity,
        portion: item.portion,
        selectedVariant: item.selectedVariant || {},
        addons: item.addons || [],
        beverages: item.beverages || [],
        desserts: item.desserts || [],
        notes: item.notes || "",
        totalPrice: item.totalPrice,
      }));

      // Pricing object (you can compute dynamically later)
      const pricing = {
        tax: 10,
        serviceCharge: 15,
        discount: 0,
        deliveryCharge: 0,
      };

      const orderBody = {
        restaurantId,
        table: tableId,
        orderType: "DINE_IN",
        customer: {
          name: formData.name,
          phone: formData.phone,
        },
        items: formattedItems,
        pricing,
      };

      const result = await createOrder(orderBody);
      if (result.success) {
        clearCart();
        navigate(`/r/${restaurantId}/t/${tableId}/order/${result.data.order.orderId}`);
      } else {
        console.log("Order failed!");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg"
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
            <ShoppingBag className="text-emerald-600 w-6 h-6" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Checkout
            </h1>
          </div>

          <div className="w-10" />
        </div>
      </motion.div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Order Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-2 text-white">
              <div className="text-2xl sm:text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Order Summary
              </div>
            </div>

            <div className="px-3 py-2 sm:p-6 space-y-2">
              {/* Items Count */}
              <div className="flex  items-center justify-between  border-b border-gray-100">
                <span className="text-gray-600 text-sm">Total Items</span>
                <span className="text-sm font-bold text-gray-900">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-sm">
                        {item.name}
                      </div>
                      {item.selectedVariant?.name && (
                        <div className="text-xs text-gray-500">
                          {item.selectedVariant.name}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">
                        × {item.quantity}
                      </div>
                      <div className="text-sm font-bold text-emerald-700">
                        ₹{item.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm  sm:text-xl font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-xl sm:text-3xl font-bold text-emerald-700">
                    ₹{total}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Details Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-3 py-2 text-white">
              <div className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Details
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-3 py-2 sm:p-6 space-y-5"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  Full Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Name can only contain letters",
                    },
                  })}
                  className={`w-full px-2 py-1 rounded-xl border-2 transition-all duration-200 text-gray-800 font-medium ${
                    errors.name
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white"
                  } outline-none`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm font-medium flex items-center gap-1"
                  >
                    <span className="text-lg">⚠️</span>
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Phone Number
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit mobile number",
                      },
                    })}
                    className={`w-full pl-14 pr-4 py-1 rounded-xl border-2 transition-all duration-200 text-gray-800 font-medium ${
                      errors.phone
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white"
                    } outline-none`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm font-medium flex items-center gap-1"
                  >
                    <span className="text-lg">⚠️</span>
                    {errors.phone.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: isPlacingOrder ? 1 : 1.02 }}
                whileTap={{ scale: isPlacingOrder ? 1 : 0.98 }}
                type="submit"
                disabled={isPlacingOrder}
                className={`relative w-full py-2 mb-2 rounded-4 text-lg font-bold shadow-xl overflow-hidden transition-all ${
                  isPlacingOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:shadow-2xl"
                } text-white`}
              >
                {!isPlacingOrder && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Place Order • ₹{total}</span>
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Safe Area for Mobile */}
      {/* <div className="h-4 bg-gray-50 " /> */}
    </div>
  );
}
