import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaTimes,
  FaCircle,
  FaRegCircle,
  FaCheck,
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
  const [portion, setPortion] = useState(null);
  const [selectedBeverages, setSelectedBeverages] = useState([]);
  const [selectedDesserts, setSelectedDesserts] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedBeverages([]);
      setSelectedDesserts([]);
      if (item.variants?.length > 0) {
        setPortion(item.variants[0].name);
      } else {
        setPortion(null);
      }
    }
  }, [item]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose && onClose();
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

  if (!item) return null;

  const selectedVariant = item.variants?.find((v) => v.name === portion);
  const basePrice = selectedVariant
    ? Number(selectedVariant.price ?? 0)
    : Number(item.discountedPrice ?? item.basePrice ?? 0);
  const beveragesTotal = selectedBeverages.reduce((total, name) => {
    const b = drinks.find((bev) => bev.name === name);
    return total + (b?.basePrice || 0);
  }, 0);

  const dessertsTotal = selectedDesserts.reduce((total, name) => {
    const d = desserts.find((des) => des.name === name);
    return total + (d?.basePrice || 0);
  }, 0);

  const totalPrice = (basePrice + beveragesTotal + dessertsTotal) * quantity;

  const buildCartItem = () => {
    const addons = [
      ...selectedBeverages.map((bevName) => {
        const b = drinks.find((bev) => bev.name === bevName);
        return { name: b?.name, price: Number(b?.basePrice ?? 0) };
      }),
      ...selectedDesserts.map((desName) => {
        const d = desserts.find((des) => des.name === desName);
        return { name: d?.name, price: Number(d?.basePrice ?? 0) };
      }),
    ];

    const unitPrice =
      basePrice + addons.reduce((s, a) => s + Number(a.price || 0), 0);
    const computedTotal = unitPrice * Number(quantity || 1);

    return {
      // compatibility fields (used for matching and UI)
      _id: item._id,
      item: item, // original item object (CartPage uses item.item.imageUrl)
      itemId: item._id,
      name: item.name,
      isVeg: item.isVeg,
      portion: portion, // selected variant name
      beverages: selectedBeverages,
      desserts: selectedDesserts,

      // ordering details
      quantity: Number(quantity || 1),
      selectedVariant: {
        name: portion,
        price: Number(basePrice || 0),
      },
      addons,
      totalPrice: Number(computedTotal),
    };
  };

  const OptionItem = ({
    active,
    label,
    price,
    isVeg,
    onClick,
    showPlus = true,
  }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center mb-1 justify-between px-3 py-2 rounded-4 transition-all duration-150 ${
        active
          ? "bg-emerald-100/70 border-2 border-emerald-400 shadow-sm"
          : "bg-white border-2 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30"
      }`}
    >
      <div className="flex items-center gap-3 relative z-10">
        <div
          className={`p-1 rounded-lg ${
            active ? "bg-white shadow-sm" : "bg-gray-50"
          }`}
        >
          {isVeg ? (
            <FaCircle className="text-emerald-600 text-xs" />
          ) : (
            <IoTriangle className="text-red-600 text-sm" />
          )}
        </div>

        <span
          className={`font-medium capitalize ${
            active ? "text-gray-900" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <span
          className={`font-semibold text-sm ${
            active ? "text-emerald-700" : "text-gray-600"
          }`}
        >
          {showPlus && "+"}₹{price}
        </span>
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
            active
              ? "bg-emerald-600 shadow-md"
              : "bg-gray-100 border-2 border-gray-300"
          }`}
        >
          {active && <FaCheck className="text-white text-[10px]" />}
        </div>
      </div>
    </button>
  );

  const SectionCard = ({ title, children }) => (
    <>
      <div className="text-xs text-gray-800 px-1 mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </>
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Close Button - Desktop/Tablet */}
          <motion.button
            onClick={onClose}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="hidden sm:flex absolute top-4 right-4 items-center justify-center bg-white/95 backdrop-blur-sm hover:bg-red-50 rounded-full w-12 h-12 text-gray-700 hover:text-red-600 shadow-2xl transition-colors z-50"
          >
            <FaTimes className="text-xl" />
          </motion.button>

          <motion.div
            ref={modalRef}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] bg-white sm:rounded-3xl rounded-t-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <div className="relative p-3 sm:px-6 sm:py-6">
                {/* Mobile Close Button */}
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className="sm:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white"
                >
                  <FaTimes className="text-sm" />
                </motion.button>

                <div className="flex items-start gap-4 pr-10 sm:pr-0">
                  {item.imageUrl && (
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="relative flex-shrink-0"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-3 border-white/40 shadow-xl"
                      />
                    </motion.div>
                  )}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-xl sm:text-2xl font-bold mb-1 truncate"
                    >
                      {item.name}
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm text-white/90 font-medium"
                    >
                      Customize your order below
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Wave Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-4">
                <svg viewBox="0 0 1200 20" className="w-full h-full">
                  <path
                    d="M0,10 Q300,0 600,10 T1200,10 L1200,20 L0,20 Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-3  sm:px-6 py-2 space-y-6 bg-gradient-to-b from-gray-50 to-white">
              {item.variants?.length > 0 && (
                <SectionCard title="Choose Portion">
                  {item.variants.map((v, idx) => (
                    <OptionItem
                      key={idx}
                      active={portion === v.name}
                      label={v.name}
                      price={v.price}
                      isVeg={item.isVeg}
                      onClick={() => setPortion(v.name)}
                      showPlus={false}
                    />
                  ))}
                </SectionCard>
              )}

              {drinks.length > 0 && (
                <SectionCard title="Add Beverages (Optional)">
                  {drinks.map((bev, idx) => (
                    <OptionItem
                      key={idx}
                      active={selectedBeverages.includes(bev.name)}
                      label={bev.name}
                      price={bev.basePrice}
                      isVeg={bev.isVeg}
                      onClick={() =>
                        setSelectedBeverages((prev) =>
                          prev.includes(bev.name)
                            ? prev.filter((x) => x !== bev.name)
                            : [...prev, bev.name]
                        )
                      }
                    />
                  ))}
                </SectionCard>
              )}

              {desserts.length > 0 && (
                <SectionCard title="Add Desserts (Optional)">
                  {desserts.map((des, idx) => (
                    <OptionItem
                      key={idx}
                      active={selectedDesserts.includes(des.name)}
                      label={des.name}
                      price={des.basePrice}
                      isVeg={des.isVeg}
                      onClick={() =>
                        setSelectedDesserts((prev) =>
                          prev.includes(des.name)
                            ? prev.filter((x) => x !== des.name)
                            : [...prev, des.name]
                        )
                      }
                    />
                  ))}
                </SectionCard>
              )}
            </div>

            {/* Footer - Sticky */}
            <div className="bg-white border-t-2 border-gray-100 px-3 sm:px-6 py-2 shadow-2xl">
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

              <div className="flex items-center justify-between gap-3 sm:gap-4">
                {/* Quantity Selector */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-4 sm:px-5 px-3 py-1.5 sm:py-3 gap-1 sm:gap-6 shadow-sm"
                >
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <FaMinus className="text-xs sm:text-lg" />
                  </motion.button>

                  <motion.span
                    key={quantity}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl sm:text-2xl font-bold text-emerald-700 min-w-[1.5rem] sm:min-w-[2rem] text-center"
                  >
                    {quantity}
                  </motion.span>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <FaPlus className="text-xs sm:text-lg" />
                  </motion.button>
                </motion.div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onAddToCart(buildCartItem());
                    onClose();
                  }}
                  className="flex-1 relative overflow-hidden sm:px-8 px-3 py-2.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-4 font-bold shadow-lg text-base sm:text-xl"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "linear",
                    }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="hidden xs:inline">Add</span>
                    <span>•</span>
                    <span>₹{totalPrice}</span>
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
