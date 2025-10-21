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

function SuperAdminLayout() {
  const menuItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      badge: null,
      path: "super-admin/dashboard",
    },
    {
      id: "qr-codes",
      icon: QrCode,
      label: "QR Codes",
      badge: null,
      path: "super-admin/qr-codes",
    },
    {
      id: "orders",
      icon: ShoppingBag,
      label: "Orders",
      badge: "12",
      path: "super-admin/orders",
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: "Analytics",
      badge: null,
      path: "super-admin/analytics",
    },
    {
      id: "customers",
      icon: Users,
      label: "Customers",
      badge: null,
      path: "super-admin/customers",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      badge: "3",
      path: "super-admin/notifications",
    },
  ];
  return (
    <div>
      <CommonLayout menuItems={menuItems}></CommonLayout>
    </div>
  );
}

export default SuperAdminLayout;
