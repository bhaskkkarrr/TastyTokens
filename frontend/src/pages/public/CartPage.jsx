import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import { FaCircle, FaPlus, FaMinus } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { Triangle } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { restaurantId, tableId } = useParams();
  const { cartItems, removeItem, increaseQuantity, decreaseQuantity, total } =
    useContext(CartContext);

  if (!cartItems || cartItems.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <ShoppingCart size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty 🛒
        </h2>
        <p className="text-gray-500 mb-4">
          Add some delicious food to continue!
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          <ArrowLeft size={18} /> Back to Menu
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">
      {/* Header */}
      <div className="sticky z-50 top-0 bg-white shadow-sm px-3 py-2 flex items-center justify-between">
        <div className="text-3xl font-semibold text-emerald-600">My Cart</div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto space-y-4 p-3">
        {cartItems.map((item, i) => (
          <div
            key={i}
            className="flex px-3 py-3 bg-white rounded-xl shadow-md hover:shadow-md transition justify-between"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2 overflow-hidden">
                {/* Image */}
                <div className="relative h-13 w-13 ">
                  {item.imageUrl ? (
                    <div className="h-full w-full mr-3 rounded-lg overflow-hidden shadow-sm border">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                  {/* Veg / Non-Veg */}
                  {/* {item.foodType === "non-veg" ? (
                    <div className="absolute top-1 left-1 flex items-center justify-center border-2 h-5 w-5 rounded-sm bg-white shadow border-red-600">
                      <Triangle size={11} className="text-red-600" fill="red" />
                    </div>
                  ) : (
                    <div className="absolute top-1 left-1 flex bg-white items-center justify-center border-2 rounded-sm w-4 h-4 border-green-600">
                      <FaCircle className="w-2 h-2 text-emerald-600" />
                    </div>
                  )} */}
                </div>

                {/* Name */}
                <div className="flex flex-col justify-between gap-2">
                  <div className="text-base font-semibold text-gray-800 truncate block">
                    <span className="">{item.name}</span>
                  </div>
                  <div className="flex items-center w-[70px] px-2 bg-emerald-50 border-1 rounded-lg shadow gap-2">
                    <div
                      onClick={() => decreaseQuantity(i)}
                      className=" text-emerald-700 hover:text-emerald-900"
                    >
                      <FaMinus className="text-xs" />
                    </div>
                    <span className="text-base flex text-emerald-700 font-semibold">
                      {item.quantity}
                    </span>
                    <div
                      onClick={() => increaseQuantity(i)}
                      className="text-emerald-700  hover:text-emerald-900"
                    >
                      <FaPlus className="text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="text-lg w-[50px] flex justify-center font-semibold text-gray-800">
                <span className="flex items-center">
                  <span className="text-xs text-gray-500">₹</span>
                  {item.totalPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t-2 border-dotted border-gray-900 px-3 py-2 flex flex-col items-center shadow-md ">
        {/* Total Row */}
        <div className="flex w-full justify-between mb-2">
          <span className="text-gray-600 text-xl">Total</span>
          <span className="text-xl font-semibold text-gray-800">₹{total}</span>
        </div>
        <div className="w-full text-center">
          <div
            onClick={() => navigate(`/r/${restaurantId}/t/${tableId}/checkout`)}
            className="px-3 py-2 bg-emerald-600 text-white rounded-4 text-base font-medium hover:bg-emerald-800 transition"
          >
            Proceed to Checkout
          </div>
        </div>
      </div>
    </div>
  );
}
