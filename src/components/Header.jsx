import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";


// import { getUser, logout } from "../untils/auth";
import { getUser, logout } from "../utils/auth";

export default function Header({ darkMode, setDarkMode, setIsSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const menuRef = useRef(null);

  const user = getUser() || {
    name: "Guest",
    role: "Visitor",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Guest",
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

 const toggleDark = () => {
  setDarkMode(prev => !prev); // App sẽ đồng bộ lên <html> + localStorage
};

  const handleLogout = () => {
    logout();
    setOpenUserMenu(false);
    navigate("/signin", { replace: true, state: { from: location.pathname } });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/60 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Left: Sidebar toggle + Search */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>

          <div className="relative w-[56vw] sm:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm nhân viên, dự án, khách hàng…"
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right: theme, bell, user menu */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
            title={darkMode ? "Chuyển sang Light" : "Chuyển sang Dark"}
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>

          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Thông báo"
            title="Thông báo"
          >
            <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-red-500 text-white">
              2
            </span>
          </button>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenUserMenu((v) => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-haspopup="menu"
              aria-expanded={openUserMenu}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-2 ring-blue-500/60 object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-4">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>

            {openUserMenu && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email || "no-email@example.com"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setOpenUserMenu(false);
                    navigate("/profile");
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  Xem hồ sơ
                </button>
                <button
                  onClick={() => {
                    setOpenUserMenu(false);
                    navigate("/settings");
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  Cài đặt
                </button>

                <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
