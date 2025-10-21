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
import CommonLayout from "../CommonLayout";

function AdminLayout() {
  const menuItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      badge: null,
      path: "admin/dashboard",
    },
    {
      id: "menu-items",
      icon: UtensilsCrossed,
      label: "Menu Items",
      badge: null,
      path: "admin/menu-items",
    },
    {
      id: "qr-codes",
      icon: QrCode,
      label: "QR Codes",
      badge: null,
      path: "admin/qr-codes",
    },
    {
      id: "orders",
      icon: ShoppingBag,
      label: "Orders",
      badge: "12",
      path: "admin/orders",
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: "Analytics",
      badge: null,
      path: "admin/analytics",
    },
    {
      id: "customers",
      icon: Users,
      label: "Customers",
      badge: null,
      path: "admin/customers",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      badge: "3",
      path: "admin/notifications",
    },
  ];
  return (
    <div>
      <CommonLayout menuItems={menuItems}></CommonLayout>
    </div>
  );
}

export default AdminLayout;
