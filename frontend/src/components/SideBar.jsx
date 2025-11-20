import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Settings, LogOut } from "lucide-react";

function SideBar({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  menuItems,
  role,
}) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
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
      {/* Sidebar - Desktop & Tablet */}
      <aside className="hidden lg:block  fixed left-0 top-16 bottom-0 w-72 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-800 shadow-2xl z-30 border-r border-emerald-900/30">
        <div className="h-full flex flex-col">
          <nav className="flex-1 px-4 py-3 space-y-1.5">
            {menuItems.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </nav>

          <div className="p-2 border-t border-slate-800">
            <NavLink
              to={`/${role}/settings`}
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
            className="lg:hidden fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40 top-14"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
          <aside className="lg:hidden fixed left-0 top-14 bottom-0 w-56 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-800 shadow-2xl z-50 transform transition-all duration-300 border-r border-emerald-900/30">
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
                  to={`/${role}/settings`}
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
    </>
  );
}

export default SideBar;
