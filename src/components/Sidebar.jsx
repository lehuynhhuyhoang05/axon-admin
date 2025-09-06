// src/components/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth"
import {
  ChartBarIcon,
  UserGroupIcon,
  FolderIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ darkMode, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = useState(() => ({
    employees: location.pathname.startsWith("/employees"),
    projects: location.pathname.startsWith("/projects"),
    clients: location.pathname.startsWith("/clients"),
    finance: location.pathname.startsWith("/finance"),
    reports: location.pathname.startsWith("/reports"),
  }));

  const navigation = [
    { name: "Dashboard", icon: ChartBarIcon, key: "dashboard", path: "/" },

    {
      name: "Nhân viên",
      icon: UserGroupIcon,
      key: "employees",
      badge: "24",
      subItems: [
        { name: "Tất cả nhân viên", key: "employees-all", path: "/employees" },
        { name: "Phòng ban", key: "departments", path: "/employees/departments" },
        { name: "Chấm công", key: "attendance", path: "/employees/attendance" },
        { name: "Đánh giá", key: "performance", path: "/employees/performance" },
      ],
    },

    {
      name: "Dự án",
      icon: FolderIcon,
      key: "projects",
      badge: "12",
      path: "/projects",
      subItems: [
        { name: "Tổng quan", key: "projects-overview", path: "/projects" },
        { name: "Dự án hiện tại", key: "projects-current", path: "/projects/current" },
        { name: "Dự án hoàn thành", key: "projects-completed", path: "/projects/completed" },
        { name: "Templates", key: "project-templates", path: "/projects/templates" },
      ],
    },

    {
      name: "Khách hàng",
      icon: UsersIcon,
      key: "clients",
      badge: "8",
      path: "/clients",
      subItems: [
        { name: "Tổng quan", key: "clients-overview", path: "/clients" },
        { name: "Khách hàng Hiện tại", key: "clients-active", path: "/clients/active" },
        { name: "Leads", key: "leads", path: "/clients/leads" },
        { name: "Hợp đồng", key: "contracts", path: "/clients/contracts" },
      ],
    },

    {
      name: "Tài chính",
      icon: CurrencyDollarIcon,
      key: "finance",
      path: "/finance", // <— thêm path cho parent
      subItems: [
        { name: "Tổng quan", key: "finance-overview", path: "/finance" }, // <— thêm Tổng quan
        { name: "Doanh thu", key: "revenue", path: "/finance/revenue" },
        { name: "Chi phí", key: "expenses", path: "/finance/expenses" },
        { name: "Hóa đơn", key: "invoices", path: "/finance/invoices" },
        { name: "Báo cáo tài chính", key: "financial-reports", path: "/finance/reports" },
      ],
    },

    { name: "Lịch làm việc", icon: CalendarIcon, key: "calendar", path: "/calendar", badge: "3" },
    { name: "Tin nhắn", icon: ChatBubbleLeftEllipsisIcon, key: "messages", path: "/messages", badge: "5" },

    {
      name: "Báo cáo",
      icon: DocumentTextIcon,
      key: "reports",
      subItems: [
        { name: "Báo cáo tổng quan", key: "overview-reports", path: "/reports/overview" },
        { name: "Báo cáo nhân sự", key: "hr-reports", path: "/reports/hr" },
        { name: "Báo cáo dự án", key: "project-reports", path: "/reports/projects" },
        { name: "Xuất báo cáo", key: "export-reports", path: "/reports/export" },
      ],
    },
  ];

  const bottomNavigation = [
    { name: "Cài đặt", icon: Cog6ToothIcon, key: "settings", path: "/settings" },
    { name: "Trợ giúp", icon: QuestionMarkCircleIcon, key: "help", path: "/help" },
  ];

  const handleNavClick = (item) => {
    const hasSubs = Array.isArray(item.subItems) && item.subItems.length > 0;
    if (hasSubs) {
      const next = !expandedMenus[item.key];
      setExpandedMenus((prev) => ({ ...prev, [item.key]: next }));
      if (next && item.path) {
        navigate(item.path);      // bấm parent -> đi tới Tổng quan
        onClose && onClose();
      }
    } else if (item.path) {
      navigate(item.path);
      onClose && onClose();
    }
  };

  const handleSubItemClick = (subItem) => {
    navigate(subItem.path);
    onClose && onClose();
  };

  const isActive = (item) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.subItems?.some((s) => location.pathname === s.path)) return true;
    return false;
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col overscroll-contain">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Axon Admin</h1>
                <p className="text-xs text-blue-100">Management System</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors">
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* User */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img className="w-12 h-12 rounded-full ring-2 ring-blue-500" src="https://randomuser.me/api/portraits/men/10.jpg" alt="User" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Huy Hoàng</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Administrator</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav (scroll area) */}
          <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              const expanded = !!expandedMenus[item.key];

              return (
                <div key={item.key}>
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          active ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.subItems && (
                        <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-90" : ""} ${active ? "text-white" : "text-gray-400"}`} />
                      )}
                    </div>
                  </button>

                  {item.subItems && expanded && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.key}
                          onClick={() => handleSubItemClick(sub)}
                          className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                            location.pathname === sub.path
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-3" />
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2 shrink-0">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    active ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}

            <button
  onClick={() => {
    logout();
    navigate('/signin');
  }}
  className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
>
  {/* icon + Đăng xuất */}
</button>
          </div>
        </div>
      </aside>
    </>
  );
};



export default Sidebar;
