import { Home, QrCode, Bell, UtensilsCrossed, ShoppingBag } from "lucide-react";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { MdLocalOffer } from "react-icons/md";

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
      id: "offers",
      icon: MdLocalOffer,
      label: "Offers",
      badge: "3",
      path: "admin/offers",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      badge: "3",
      path: "admin/notifications",
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
        role={"admin"}
      />
      {/* Main Content */}
      <main className="pt-16 lg:pl-72 min-h-screen bg-emerald-50">
        <div className="px-2 px-sm-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
