import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
import { AuthContext } from "../context/AuthContext";

// Menu icon component (since Menu conflicts with the variable name)
const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CommonLayout = ({ menuItems }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Menu Item Component
  const MenuItem = ({ item, onClick, isMobile = false }) => (
    <NavLink
      to={`/${item.path}`}
      onClick={onClick}
      className={({ isActive }) =>
        `flex text-decoration-none items-center space-x-3 px-md-4 py-md-3.5 p-2.5 rounded-4 transition-all duration-300 group relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30"
            : "text-white hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`p-2 rounded-lg transition-all ${
              isActive
                ? "bg-white/20 shadow-lg"
                : "bg-white/5 group-hover:bg-white/10"
            }`}
          >
            <item.icon
              className={`w-5 h-5 ${
                isActive
                  ? "text-white"
                  : "text-emerald-400 group-hover:text-emerald-300"
              } transition-all group-hover:scale-110`}
            />
          </div>
          <span className="font-medium text-[15px]">{item.label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50">
        {/* Header */}
        <header className="h-16 fixed top-0 left-0 right-0 bg-white backdrop-blur-xl shadow-2xl z-40 border-b border-emerald-900/30">
          <div className="h-full px-6 py-2 py-sm-3 flex items-center justify-between">
            {/* Left Side - Mobile Menu + Logo */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden p-2.5 rounded-3 bg-gradient-to-br from-emerald-600 to-green-700 text-white hover:shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105 me-3 transition-all duration-200 "
              >
                {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon />}
              </button>
              {/* Logo */}
              <div className="flex items-center ">
                <div className="hidden sm:block ">
                  <h1 className="text-xl mb-0 me-3 font-bold ">
                    <span className="text-emerald-700">
                      {user
                        ? user.role === "superadmin"
                          ? user.restaurantName === "NA"
                            ? "Owner"
                            : user.restaurantName || "Owner"
                          : user.restaurantName || "Restaurant"
                        : "Restaurant"}
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl me-3 ">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Search menus..."
                  className="w-full pl-12 pr-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 border-2 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all text-emerald-600 placeholder-gray-500 "
                />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2.5 rounded-3 bg-emerald-600 transition-all duration-300 group hover:scale-105 hover:shadow-lg border border-transparent">
                <Bell className="w-5 h-5 text-white  transition-transform duration-300 group-hover:rotate-12 group-hover:-translate-y-1" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full animate-pulse"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center  space-x-3 ml-2 pl-3 border-l border-slate-700/50">
                <div className="hidden xl:block text-right">
                  <p className="text-sm font-semibold m-0 text-emerald-600">
                    {(user && user.ownerName) || "Owner"}
                  </p>
                  <p className="text-xs text-gray-400 m-0 uppercase">
                    {(user && user.role) || "NA"}
                  </p>
                </div>
                <button className="w-10 h-10 rounded-3 bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-105 transition-all">
                  RO
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar - Desktop & Tablet */}
        <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-72 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-800 shadow-2xl z-30 border-r border-emerald-900/30">
          <div className="h-full flex flex-col">
            <nav className="flex-1 px-4 py-3 space-y-1.5">
              {menuItems.map((item, index) => (
                <MenuItem key={index} item={item} />
              ))}
            </nav>

            <div className="p-2 border-t border-slate-800">
              <NavLink
                to={`/settings`}
                className={({ isActive }) =>
                  `flex items-center text-decoration-none space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/5 hover:text-white transition-all group ${
                    isActive ? "bg-white/10" : ""
                  }`
                }
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">
                  <Settings className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 group-hover:rotate-90 transition-all duration-300" />
                </div>
                <span className="font-medium text-[15px]">Settings</span>
              </NavLink>
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all">
                  <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="font-medium text-[15px]">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {isMobileSidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40 top-16"
              onClick={() => setIsMobileSidebarOpen(false)}
            ></div>
            <aside className="lg:hidden fixed left-0 top-16 bottom-0 w-56 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-800 shadow-2xl z-50 transform transition-all duration-300 border-r border-emerald-900/30">
              <div className="h-full flex flex-col">
                <nav className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                  {menuItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      item={item}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      isMobile={true}
                    />
                  ))}
                </nav>

                <div className="space-y-1.5 p-2 border-t border-slate-800">
                  {/* Setting */}
                  <NavLink
                    to={`/settings`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center text-decoration-none text-white space-x-3 px-md-4 py-md-3.5 p-3 rounded-4 hover:bg-white/5 hover:text-white transition-all group ${
                        isActive ? "bg-white/10" : ""
                      }`
                    }
                  >
                    <div className="p-2 rounded-4 bg-white/5 group-hover:bg-white/10 transition-all">
                      <Settings className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 group-hover:rotate-90 transition-all duration-300" />
                    </div>
                    <span className="font-medium text-[15px]">Settings</span>
                  </NavLink>

                  {/* LogOut */}
                  <button
                    className="w-full flex items-center space-x-3 px-md-4 py-md-3.5 p-3 rounded-4 text-red-400 hover:bg-red-500/10 transition-all group"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all">
                      <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="font-medium text-[15px]">Logout</span>
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="pt-16 lg:pl-72 min-h-screen bg-emerald-50">
          <div className="px-3 px-sm-4">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default CommonLayout;
