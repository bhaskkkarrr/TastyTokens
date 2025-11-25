import { useParams } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { NotificationProvider } from "../../context/NotificationContext";
import { OrderProvider } from "../../context/OrderContext";
import { PublicProvider } from "../../context/PublicContext";

export default function CustomerProviders({ children }) {
  const { restaurantId, tableId } = useParams();
  return (
    <PublicProvider restaurantId={restaurantId} tableId={tableId}>
      <OrderProvider>
        <NotificationProvider>
          <CartProvider>{children}</CartProvider>
        </NotificationProvider>
      </OrderProvider>
    </PublicProvider>
  );
}
