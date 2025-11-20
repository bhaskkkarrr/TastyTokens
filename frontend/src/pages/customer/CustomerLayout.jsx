import React from "react";
import {
  Home,
  QrCode,
  Settings,
  Users,
  Bell,
  Search,
  UtensilsCrossed,
  ShoppingBag,
  X,
  BarChart3,
  LogOut,
  Plus,
} from "lucide-react";
import SideBar from "../../components/SideBar";

function CustomerLayout() {
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
      <SideBar menuItems={menuItems} />
    </div>
  );
}

export default CustomerLayout;
