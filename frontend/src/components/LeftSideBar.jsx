import React, { useEffect, useState } from "react";
import {
  Menu,
  Home,
  QrCode,
  UtensilsCrossed,
  ShoppingBag,
  BarChart3,
  Settings,
  Users,
  Bell,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const LeftSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  // ✅ Automatically collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", badge: null },
    {
      id: "menu",
      icon: UtensilsCrossed,
      label: "Menu Items",
      badge: null,
    },
    { id: "qr", icon: QrCode, label: "QR Codes", badge: null },
    { id: "orders", icon: ShoppingBag, label: "Orders", badge: "12" },
    { id: "analytics", icon: BarChart3, label: "Analytics", badge: null },
    { id: "customers", icon: Users, label: "Customers", badge: null },
    { id: "notifications", icon: Bell, label: "Notifications", badge: "3" },
    { id: "settings", icon: Settings, label: "Settings", badge: null },
  ];

  return (
    <div
      className={`col-12 h-screen bg-gradient-to-b from-emerald-900 via-green-900 to-teal-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
    >
      {/* Logo Section */}
      <div
        className={` ${
          isCollapsed ? "p-2" : "p-3"
        } flex items-center justify-between border-b border-emerald-700/50`}
      >
        <div className="flex items-center space-x-3 ">
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
              <User className="w-7 h-7 " />
            </div>
          )}
          {!isCollapsed && (
            <div>
              <div className="fs-2  m-0 font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text  text-white">
                DigiThali
              </div>
              <p className="text-xs m-0 text-emerald-300">Restaurant Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className={` col-12 ${isCollapsed ? "p-2" : "py-6 px-3"}`}>
        <ul className=" p-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center justify-between ${
                    isCollapsed ? "p-3" : "px-4 py-3 my-2 px-md-1 px-lg-4"
                  } rounded-4 transition-all duration-200 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/40"
                      : "hover:bg-emerald-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`${isCollapsed ? "w-4 h-4" : "w-5 h-5 "} ${
                        isActive
                          ? "text-white"
                          : "text-emerald-300 group-hover:text-white"
                      } transition-colors`}
                    />
                    {!isCollapsed && (
                      <span
                        className={`font-medium ${
                          isActive ? "text-white" : "text-emerald-100"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-400 text-green-900 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute right-2 top-2 w-2 h-2 bg-green-400 rounded-full"></span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default LeftSideBar;
