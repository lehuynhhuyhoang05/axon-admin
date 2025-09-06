import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AppLayout = ({ darkMode, setDarkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "dark" : ""}`}>
      <Sidebar
        darkMode={darkMode}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="p-4 mx-auto max-w-7xl md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
