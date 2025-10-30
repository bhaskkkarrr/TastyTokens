import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaTimes,
  FaCircle,
  FaRegCircle,
} from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";

export default function AddToCartModal({
  item,
  onClose,
  drinks = [],
  desserts = [],
  onAddToCart,
  show,
}) {
  const [quantity, setQuantity] = useState(1);
  const [portion, setPortion] = useState("full");
  const [selectedBeverages, setSelectedBeverages] = useState([]);
  const [selectedDesserts, setSelectedDesserts] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setPortion("full");
      setSelectedBeverages([]);
      setSelectedDesserts([]);
    }
  }, [item]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  const toggleBeverage = (name) =>
    setSelectedBeverages((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );

  const toggleDessert = (name) =>
    setSelectedDesserts((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );

  if (!item) return null;

  const beveragesTotal = selectedBeverages.reduce((acc, name) => {
    const b = drinks.find((bev) => bev.name === name);
    return acc + (b ? Number(b.price) : 0);
  }, 0);

  const dessertsTotal = selectedDesserts.reduce((acc, name) => {
    const d = desserts.find((des) => des.name === name);
    return acc + (d ? Number(d.price) : 0);
  }, 0);

  const basePrice =
    portion === "half" ? Number(item.price) / 2 : Number(item.price);
  const totalPrice = (basePrice + beveragesTotal + dessertsTotal) * quantity;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close button (floating outside top center) */}
          <motion.button
            onClick={onClose}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-[15%] md:top-[20%] flex items-center justify-center bg-black/40 rounded-5 w-10 h-10 shadow-lg text-white z-50"
          >
            <FaTimes className="text-lg" />
          </motion.button>

          {/* Modal container */}
          <motion.div
            ref={modalRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className="relative max-h-[75vh] w-full bg-white rounded-t-3xl shadow-[0_-10px_25px_rgba(0,0,0,0.3)] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-white px-3 py-2 border-b rounded-t-3xl">
              <div className="flex items-center">
                {item.imageUrl && (
                  <div className="h-10 w-10 mr-3 rounded-lg overflow-hidden shadow-sm border">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-lg font-semibold">{item.name}</div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 bg-emerald-50">
              {/* Portion Selector */}
              <div className="flex flex-col gap-2">
                <span className="block font-medium text-gray-800">
                  Quantity
                </span>
                <div className="text-xs text-gray-600">Select one</div>
                <div className="px-2 w-full">
                  <div className="flex flex-col bg-white rounded shadow-sm overflow-hidden">
                    {["half", "full"].map((type) => {
                      const isActive = portion === type;
                      return (
                        <button
                          key={type}
                          onClick={() => setPortion(type)}
                          className="px-3 py-2 text-sm flex justify-between items-center font-medium"
                        >
                          <div className="flex items-center gap-2">
                            {item.foodType === "veg" ? (
                              <FaCircle className="text-emerald-600 border-1 p-0.5 rounded" />
                            ) : (
                              <IoTriangle className="text-red-600 border-1 p-0.5 rounded" />
                            )}
                            <span className="capitalize">{type}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="text-sm font-semibold mr-2 text-gray-800">
                              ₹{type === "half" ? item.price / 2 : item.price}
                            </div>
                            {isActive ? (
                              <FaCircle className="text-emerald-600 text-xs" />
                            ) : (
                              <FaRegCircle className="text-gray-400 text-xs" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Beverages */}
              {drinks.length > 0 && (
                <div>
                  <div className="font-medium mb-2 text-gray-700">
                    Add Beverages
                  </div>
                  <div className="px-2 w-full">
                    <div className="flex flex-col bg-white rounded shadow-sm overflow-hidden">
                      {drinks.map((bev) => {
                        const isActive = selectedBeverages.includes(bev.name);
                        return (
                          <button
                            key={bev._id}
                            onClick={() => toggleBeverage(bev.name)}
                            className="px-3 py-2 text-sm flex justify-between items-center font-medium"
                          >
                            <div className="flex items-center gap-2">
                              {bev.foodType === "veg" ? (
                                <FaCircle className="text-emerald-600 border-1 p-0.5 rounded" />
                              ) : (
                                <IoTriangle className="text-red-600 border-1 p-0.5 rounded" />
                              )}
                              <span className="capitalize">{bev.name}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="text-sm font-semibold mr-2 text-gray-800">
                                (+₹{bev.price})
                              </div>
                              {isActive ? (
                                <FaCircle className="text-emerald-600 text-xs" />
                              ) : (
                                <FaRegCircle className="text-gray-400 text-xs" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Desserts */}
              {desserts.length > 0 && (
                <div>
                  <div className="font-medium mb-2 text-gray-700">
                    Add Desserts
                  </div>
                  <div className="px-2 w-full">
                    <div className="flex flex-col bg-white rounded shadow-sm overflow-hidden">
                      {desserts.map((des) => {
                        const isActive = selectedDesserts.includes(des.name);
                        return (
                          <button
                            key={des._id}
                            onClick={() => toggleDessert(des.name)}
                            className="px-3 py-2 text-sm flex justify-between items-center font-medium"
                          >
                            <div className="flex items-center gap-2">
                              {des.foodType === "veg" ? (
                                <FaCircle className="text-emerald-600 border-1 p-0.5 rounded" />
                              ) : (
                                <IoTriangle className="text-red-600 border-1 p-0.5 rounded" />
                              )}
                              <span className="capitalize">{des.name}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="text-sm font-semibold mr-2 text-gray-800">
                                (+₹{des.price})
                              </div>
                              {isActive ? (
                                <FaCircle className="text-emerald-600 text-xs" />
                              ) : (
                                <FaRegCircle className="text-gray-400 text-xs" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t py-3 px-3 bg-white flex items-center justify-between">
              <div className="p-1 flex items-center bg-emerald-50 border-2 rounded gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-emerald-700"
                >
                  <FaMinus className="text-xs" />
                </button>
                <span className="text-lg text-emerald-700 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-emerald-700"
                >
                  <FaPlus className="text-xs" />
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart({
                    ...item,
                    quantity,
                    portion,
                    beverages: selectedBeverages,
                    desserts: selectedDesserts,
                    totalPrice,
                  });
                  onClose();
                }}
                className="px-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded font-semibold text-lg shadow"
              >
                Add to Cart · ₹{totalPrice}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
