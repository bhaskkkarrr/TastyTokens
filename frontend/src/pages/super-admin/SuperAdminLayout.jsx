import React, { useState } from "react";
import {
  Home,
  QrCode,
  Users,
  Bell,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50">
      <Header
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      <SideBar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        menuItems={menuItems}
        role={"superadmin"}
      />
      {/* Main Content */}
      <main className="pt-16 lg:pl-72 min-h-screen bg-emerald-50">
        <div className="px-3 px-sm-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default SuperAdminLayout;
