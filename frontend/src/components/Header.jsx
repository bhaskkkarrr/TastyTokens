import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Bell, Search, X, Menu, ChevronDown } from "lucide-react";
import { OrderContext } from "../context/OrderContext";
import NotificationModal from "./admin/NotificationModal";
import { NotificationContext } from "../context/NotificationContext";

function Header({ isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  const { user } = useContext(AuthContext);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { newOrderCount, setNewOrderCount } = useContext(OrderContext);
  const [open, setOpen] = useState(false);
  const { unread } = useContext(NotificationContext);
  const [openNotif, setOpenNotif] = useState(false);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white/95 backdrop-blur-xl shadow-sm z-40 border-b border-gray-200/60">
        <div className="h-full px-3 sm:px-4 md:px-6 flex items-center justify-between gap-3 w-full overflow-hidden">
          {/* LEFT: MOBILE MENU + LOGO */}
          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            {/* Menu Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:shadow-md active:scale-95 transition-all"
            >
              {isMobileSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* LOGO */}
            <span className="font-bold text-xl  sm:text-lg md:text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent truncate max-w-[140px] sm:max-w-[200px] md:max-w-[280px]">
              {user
                ? user?.role === "superadmin"
                  ? user?.restaurantId?.name === "NA"
                    ? "Owner"
                    : user?.restaurantId?.name
                  : user?.restaurantId?.name || "Restaurant"
                : "Restaurant"}
            </span>
          </div>

          {/* CENTER: DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menus..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-gray-700 text-sm"
              />
            </div>
          </div>

          {/* RIGHT: ICONS */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 active:scale-95"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 active:scale-95"
              onClick={() => setOpenNotif(true)}
            >
              <Bell className="w-5 h-5" />

              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                  {unread}
                </span>
              )}
            </button>

            {/* <NotificationModal open={open} setOpen={setOpen} /> */}

            {/* PROFILE */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-gray-800 m-0">
                  {user?.name || "Owner"}
                </p>
                <p className="text-xs text-gray-500 uppercase m-0">
                  {user?.role || "NA"}
                </p>
              </div>

              <button className="relative">
                <div
                  className="w-9 h-9 sm:w-9 sm:h-9 rounded-4 bg-gradient-to-br from-emerald-500 to-teal-600
                 flex items-center justify-center text-white font-bold shadow-md"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
                </div>
              </button>
            </div>
          </div>
        </div>
        <NotificationModal
          open={openNotif}
          onClose={() => setOpenNotif(false)}
        />
      </header>

      {/* MOBILE SEARCH DROPDOWN */}
      {showMobileSearch && (
        <div className="md:hidden fixed top-14 sm:top-16 left-0 right-0 bg-white shadow-lg border-b animate-slideDown z-50">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search menus..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                focus:outline-none focus:border-emerald-500 text-gray-700 text-sm"
              />
              <button
                onClick={() => setShowMobileSearch(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default Header;
