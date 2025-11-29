import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Bike,
  Utensils,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderContext } from "../../context/OrderContext";
import { div } from "framer-motion/client";

export default function OrderStatus() {
  const { restaurantId, tableId, orderId } = useParams();
  const navigate = useNavigate();

  const { singleOrder, getOrderDetails, loading, error } =
    useContext(OrderContext);
  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId]);
  console.log("Order details:", singleOrder);
  const statusSteps = [
    { key: "PENDING", label: "Pending", icon: Clock },
    { key: "ACCEPTED", label: "Accepted", icon: CheckCircle },
    { key: "PREPARING", label: "Preparing", icon: Utensils },
    { key: "COMPLETED", label: "Completed", icon: Bike },
    { key: "CANCELLED", label: "Cancelled", icon: XCircle },
  ];

  const currentStepIndex = singleOrder
    ? statusSteps.findIndex((s) => s.key === singleOrder.status)
    : -1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-gray-700 font-medium">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white shadow-md hover:shadow-lg transition-all font-medium text-gray-700 border border-gray-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft size={20} />
          Back
        </motion.button>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border-l-4 border-red-500 p-6 rounded-2xl shadow-xl max-w-md"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
            <p className="text-red-600 font-bold text-lg">Error</p>
          </div>
          <p className="text-gray-700">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-gray-700 font-medium">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-3"
        >
          <motion.button
            onClick={() => navigate(`/r/${restaurantId}/t/${tableId}`)}
            className="flex items-center gap-2 px-2 py-2 rounded-5 bg-white shadow-md hover:shadow-lg transition-all font-medium text-gray-700 border-2 border-emerald-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </motion.button>
          <span className="text-2xl md:text-3xl font-bold text-black">
            Order Status
          </span>
          {/* <div className="w-20 sm:w-24" /> Spacer for centering */}
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Order ID Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 text-center py-3  flex flex-col">
            <span className="text-emerald-50 text-sm font-medium mb-1">
              Order ID
            </span>
            <span className="text-white text-3xl font-bold tracking-wide">
              #{singleOrder.orderId}
            </span>
          </div>

          <div className="px-4 py-2 pb-4 md:p-8 space-y-8">
            {/* Enhanced Timeline */}
            <div>
              <div className="text-xl font-bold text-gray-800 mb-2">
                Order Progress
              </div>

              {/* Desktop Timeline */}
              <div className="hidden sm:block relative px-4">
                {/* Background Track */}
                <div className="absolute top-12 left-16 right-16 h-2 bg-gray-200 rounded-full" />

                {/* Animated Progress Track */}
                <motion.div
                  className="absolute top-12 left-16 h-2 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 shadow-lg"
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      currentStepIndex >= 0
                        ? `${
                            (currentStepIndex / 3) *
                            (100 - (128 / window.innerWidth) * 100)
                          }%`
                        : "0%",
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {/* Glowing dot at the end */}
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(16, 185, 129, 0.7)",
                        "0 0 0 8px rgba(16, 185, 129, 0)",
                        "0 0 0 0 rgba(16, 185, 129, 0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Step Icons */}
                <div className="relative flex justify-between items-start pt-2">
                  {statusSteps.slice(0, 4).map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isPending = index > currentStepIndex;

                    return (
                      <motion.div
                        key={step.key}
                        className="flex flex-col items-center w-32"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                      >
                        {/* Icon Container */}
                        <motion.div
                          className="relative"
                          animate={isCurrent ? { y: [0, -8, 0] } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {/* Glow effect for current step */}
                          {isCurrent && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 blur-xl opacity-60"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}

                          {/* Main Icon Circle */}
                          <motion.div
                            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 ${
                              isCompleted
                                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-2 border-emerald-400"
                                : isCurrent
                                ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-4 border-white shadow-2xl"
                                : "bg-white text-gray-400 border-2 border-gray-300"
                            }`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            animate={
                              isCurrent
                                ? {
                                    boxShadow: [
                                      "0 10px 30px rgba(16, 185, 129, 0.3)",
                                      "0 10px 40px rgba(16, 185, 129, 0.5)",
                                      "0 10px 30px rgba(16, 185, 129, 0.3)",
                                    ],
                                  }
                                : {}
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Icon size={28} strokeWidth={2.5} />

                            {/* Checkmark overlay for completed steps */}
                            {isCompleted && (
                              <motion.div
                                className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                              >
                                <CheckCircle
                                  className="text-emerald-600"
                                  size={20}
                                  fill="currentColor"
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.div>

                        {/* Step Label */}
                        <motion.div className="mt-4 text-center">
                          <p
                            className={`text-sm font-bold transition-colors ${
                              isCompleted || isCurrent
                                ? "text-emerald-700"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <motion.div
                              className="mt-1 w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 0.5 }}
                            />
                          )}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Timeline - Vertical */}
              <div className="sm:hidden space-y-4">
                {statusSteps.slice(0, 4).map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isPending = index > currentStepIndex;

                  return (
                    <motion.div
                      key={step.key}
                      className="flex items-center gap-4 mb-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Icon and Line */}
                      <div className="flex flex-col items-center">
                        <motion.div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all relative ${
                            isCompleted
                              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                              : isCurrent
                              ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-4 border-white"
                              : "bg-white text-gray-400 border-2 border-gray-300"
                          }`}
                          animate={
                            isCurrent
                              ? {
                                  scale: [1, 1.1, 1],
                                  boxShadow: [
                                    "0 5px 20px rgba(16, 185, 129, 0.3)",
                                    "0 5px 30px rgba(16, 185, 129, 0.5)",
                                    "0 5px 20px rgba(16, 185, 129, 0.3)",
                                  ],
                                }
                              : {}
                          }
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Icon size={24} strokeWidth={2.5} />
                          {isCompleted && (
                            <motion.div
                              className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle
                                className="text-emerald-600"
                                size={16}
                                fill="currentColor"
                              />
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Vertical line */}
                        {index < 3 && (
                          <div
                            className={`w-1 h-12 rounded-full ${
                              index < currentStepIndex
                                ? "bg-gradient-to-b from-emerald-500 to-teal-500"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <div className="flex-1">
                        <div
                          className={`font-bold text-base ${
                            isCompleted || isCurrent
                              ? "text-emerald-700"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </div>
                        {isCurrent && (
                          <motion.div
                            className="mt-1 w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-center">
            <div className="text-2xl font-semibold text-white">
              Order Summary
            </div>
          </div>

          <div className="px-3 py-2 space-y-6">
            {/* ITEMS SECTION */}
            <div className="mb-3">
              <div className="text-xl font-bold text-gray-800 mb-1">Items</div>

              <div className="space-y-3">
                {singleOrder.items?.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex justify-between px-3 py-2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-4"
                  >
                    <div>
                      {/* Main Item */}
                      <div className="font-semibold text-gray-800">{item.name}</div>

                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <span>Qty: {item.quantity}</span>

                        {item.selectedVariant?.name && (
                          <span className="text-emerald-600 font-medium">
                            • {item.selectedVariant.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-lg font-bold text-emerald-600">
                      ₹{item.price}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SUMMARY SECTION */}
            <div className="text-xl font-bold text-gray-800 mb-1">Summary</div>
            <div className="bg-gradient-to-br from-emerald-50 mb-2 to-teal-50 p-4 rounded-4">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <div>Subtotal</div>
                  <div className="font-semibold">
                    ₹{singleOrder.pricing.subtotal}
                  </div>
                </div>

                <div className="flex justify-between text-gray-700">
                  <div>Tax</div>
                  <div className="font-semibold">₹{singleOrder.pricing.restaurantTax}</div>
                </div>

                <div className="flex justify-between text-gray-700">
                  <div>Service Charge</div>
                  <div className="font-semibold">
                    ₹{singleOrder.pricing.serviceCharge}
                  </div>
                </div>

                <div className="border-t border-emerald-300 pt-3 mt-2 flex justify-between items-center">
                  <div className="text-lg font-bold text-gray-800">Grand Total</div>

                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ₹{singleOrder.pricing.grandTotal}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
