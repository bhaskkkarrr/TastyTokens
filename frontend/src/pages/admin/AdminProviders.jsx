import { MenuProvider } from "../../context/MenuContext";
import { CategoryProvider } from "../../context/CategoryContext";
import { TableProvider } from "../../context/TableAndQrContext";
import { OrderProvider } from "../../context/OrderContext";
import { NotificationProvider } from "../../context/NotificationContext";
import { SettingProvider } from "../../context/SettingsContext";
import { DiscountProvider } from "../../context/DiscountContext";

export default function AdminProviders({ children }) {
  return (
    <SettingProvider>
      <DiscountProvider>
        <MenuProvider>
          <CategoryProvider>
            <TableProvider>
              <OrderProvider>
                <NotificationProvider>{children}</NotificationProvider>
              </OrderProvider>
            </TableProvider>
          </CategoryProvider>
        </MenuProvider>
      </DiscountProvider>
    </SettingProvider>
  );
}
