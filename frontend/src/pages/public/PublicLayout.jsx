import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { PublicProvider } from "../../context/PublicContext";
import { CartProvider } from "../../context/CartContext";

export default function PublicLayout() {
  const { restaurantId, tableId } = useParams();

  return (
    <PublicProvider restaurantId={restaurantId} tableId={tableId}>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </PublicProvider>
  );
}
