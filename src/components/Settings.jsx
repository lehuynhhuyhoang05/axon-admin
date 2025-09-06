// src/components/Settings.jsx
import React, { useEffect, useState } from "react";
import { getUser, updateUser, changePassword } from "../utils/auth";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function Settings({ darkMode, setDarkMode }) {
  const [user, setUser] = useState(getUser());
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [prefs, setPrefs] = useState({
    darkMode: !!darkMode,
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      push: user?.preferences?.notifications?.push ?? true,
      weeklyDigest: user?.preferences?.notifications?.weeklyDigest ?? true,
    },
  });
  const [pwd, setPwd] = useState({ oldPass: "", newPass: "", ok: "", err: "" });
  const [status, setStatus] = useState("");

  useEffect(() => setDarkMode(prefs.darkMode), [prefs.darkMode, setDarkMode]);

  const saveProfile = () => {
    const { ok, user: u, error } = updateUser({
      name: profile.name,
      avatar: profile.avatar,
      preferences: prefs,
    });
    if (!ok) return setStatus(error || "Lưu thất bại");
    setUser(u);
    setStatus("Đã lưu cài đặt!");
    localStorage.setItem("darkMode", JSON.stringify(prefs.darkMode));
  };

  const changePwd = () => {
    if (!pwd.oldPass || !pwd.newPass) return setPwd((s) => ({ ...s, err: "Nhập đủ mật khẩu" }));
    const res = changePassword(pwd.oldPass, pwd.newPass);
    if (!res.ok) return setPwd((s) => ({ ...s, err: res.error, ok: "" }));
    setPwd({ oldPass: "", newPass: "", ok: "Đổi mật khẩu thành công!", err: "" });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6" />
          Cài đặt
        </h1>
        <p className="text-blue-100">Quản lý hồ sơ và tuỳ chọn cá nhân</p>
      </div>

      {status && <p className="rounded-lg bg-green-50 p-3 text-green-700">{status}</p>}

      {/* Profile */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Hồ sơ</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="shrink-0">
            <img
              src={profile.avatar || "https://api.dicebear.com/7.x/thumbs/svg?seed=User"}
              alt="avatar"
              className="h-20 w-20 rounded-2xl"
            />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Họ tên</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                disabled
                className="mt-1 w-full rounded-lg border border-gray-200 p-2 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50 dark:text-white"
                value={profile.email}
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500">Avatar URL</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={profile.avatar}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Tuỳ chọn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700">
            <span>Chế độ tối</span>
            <input
              type="checkbox"
              checked={prefs.darkMode}
              onChange={(e) => setPrefs((p) => ({ ...p, darkMode: e.target.checked }))}
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700">
            <span>Thông báo Email</span>
            <input
              type="checkbox"
              checked={prefs.notifications.email}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, notifications: { ...p.notifications, email: e.target.checked } }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700">
            <span>Thông báo Push</span>
            <input
              type="checkbox"
              checked={prefs.notifications.push}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, notifications: { ...p.notifications, push: e.target.checked } }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700">
            <span>Bản tin hàng tuần</span>
            <input
              type="checkbox"
              checked={prefs.notifications.weeklyDigest}
              onChange={(e) =>
                setPrefs((p) => ({
                  ...p,
                  notifications: { ...p.notifications, weeklyDigest: e.target.checked },
                }))
              }
            />
          </label>
        </div>
        <div className="mt-4">
          <button
            onClick={saveProfile}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-semibold text-white hover:from-blue-600 hover:to-purple-700"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Bảo mật</h3>
        {pwd.err && <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{pwd.err}</p>}
        {pwd.ok && <p className="mb-3 rounded-lg bg-green-50 p-2 text-sm text-green-700">{pwd.ok}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-500">Mật khẩu cũ</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={pwd.oldPass}
              onChange={(e) => setPwd({ ...pwd, oldPass: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Mật khẩu mới</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={pwd.newPass}
              onChange={(e) => setPwd({ ...pwd, newPass: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={changePwd}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
