import React from "react";
import { Link } from "react-router-dom";
// 👉 đổi sang "../untils/auth" nếu bạn chưa rename
import { getUser } from "../utils/auth";

export default function Profile() {
  const user = getUser() || {
    name: "Guest",
    role: "Visitor",
    email: "guest@example.com",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Guest",
    preferences: { darkMode: false, notifications: { email: true, push: false, weeklyDigest: false } },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl ring-2 ring-blue-500/60" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tùy chọn</h2>
        <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
          <li>Dark mode: <b>{user.preferences?.darkMode ? "Bật" : "Tắt"}</b></li>
          <li>Thông báo Email: <b>{user.preferences?.notifications?.email ? "Bật" : "Tắt"}</b></li>
          <li>Thông báo Push: <b>{user.preferences?.notifications?.push ? "Bật" : "Tắt"}</b></li>
          <li>Bản tin hàng tuần: <b>{user.preferences?.notifications?.weeklyDigest ? "Bật" : "Tắt"}</b></li>
        </ul>
        <div className="mt-4">
          <Link
            to="/settings"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            Cập nhật trong Cài đặt
          </Link>
        </div>
      </div>
    </div>
  );
}
