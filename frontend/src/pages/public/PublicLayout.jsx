import { Home, QrCode, ShoppingBag } from "lucide-react";
import CommonLayout from "../CommonLayout";

function PublicLayout() {
  const menuItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      badge: null,
      path: "dashboard",
    },
    {
      id: "reward-points",
      icon: QrCode,
      label: "Reward Points",
      badge: null,
      path: "reward-points",
    },
    {
      id: "orders",
      icon: ShoppingBag,
      label: "Orders",
      badge: "12",
      path: "orders",
    },
  ];
  return (
    <div>
      <CommonLayout menuItems={menuItems}></CommonLayout>
    </div>
  );
}

export default PublicLayout;
