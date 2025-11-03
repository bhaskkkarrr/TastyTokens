import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";

export default function Checkout() {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const { restaurantId, tableId } = useParams(); // you can pass them in the QR URL
  const navigate = useNavigate();
  const BASE_API = import.meta.env.VITE_BASE_API;
  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(`${BASE_API}/api/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          tableId,
          items: cartItems,
          total,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        clearCart();
        console.log("order-success");
      } else {
        console.log("Order failed!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Confirm Your Order</h2>
      <p className="text-gray-600 mb-4">Total Amount: ₹{total}</p>
      <button
        onClick={handlePlaceOrder}
        className="w-full bg-emerald-600 text-white py-2 rounded-5 font-medium hover:bg-emerald-800 transition"
      >
        Place Order
      </button>
    </div>
  );
}
