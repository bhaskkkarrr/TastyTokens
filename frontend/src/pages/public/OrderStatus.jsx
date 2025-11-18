import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Bike, Utensils, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderContext } from "../../context/OrderContext";

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
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        Loading order...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 text-black">
        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-4 mb-2 bg-gray-200 hover:bg-gray-300 transition font-medium text-sm w-fit"
        >
          ← Back
        </button>
        <div className="bg-red-100 border-2 border-red-400 p-6 rounded-4 text-center">
          <p className="text-red-600 font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
          Order not found
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-6">
        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate(`/r/${restaurantId}/t/${tableId}`)}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-medium text-sm w-fit"
        >
          ← Back
        </button>

        {/* TITLE */}
        <div className="text-2xl font-bold text-center text-black">
          Order Status
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-xl">
          {/* Order ID */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">Order ID</p>
            <p className="text-xl font-bold text-black">
              {singleOrder.orderId}
            </p>
          </div>

          {/* TIMELINE */}
          <div className="relative flex justify-between mt-10 mb-6">
            {statusSteps.slice(0, 4).map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center w-full"
                >
                  <motion.div
                    className={`w-12 h-12 flex items-center justify-center rounded-full border-2 ${
                      isActive
                        ? "border-green-600 bg-green-500 text-white"
                        : "border-gray-400 bg-white text-gray-400"
                    }`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    <Icon size={22} />
                  </motion.div>

                  <p
                    className={`text-xs mt-2 font-medium ${
                      isActive ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ITEMS */}
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-black">Items</h2>

            {singleOrder.items?.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-gray-200 pb-3"
              >
                <div>
                  <p className="font-medium text-black">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                    {item.selectedVariant?.name &&
                      ` • ${item.selectedVariant.name}`}
                  </p>
                </div>
                <p className="font-semibold">₹{item.price}</p>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="mt-6 border-t border-gray-300 pt-4 space-y-2">
            <h2 className="text-lg font-semibold text-black">Summary</h2>

            <div className="flex justify-between text-sm">
              <p>Subtotal</p>
              <p>₹{singleOrder.pricing.subtotal}</p>
            </div>

            <div className="flex justify-between text-sm">
              <p>Tax</p>
              <p>₹{singleOrder.pricing.tax}</p>
            </div>

            <div className="flex justify-between text-sm">
              <p>Service Charge</p>
              <p>₹{singleOrder.pricing.serviceCharge}</p>
            </div>

            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
              <p>Grand Total</p>
              <p>₹{singleOrder.pricing.grandTotal}</p>
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-black">Customer</h2>
            <p className="text-sm text-gray-600">
              {singleOrder.customer.name} • {singleOrder.customer.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
