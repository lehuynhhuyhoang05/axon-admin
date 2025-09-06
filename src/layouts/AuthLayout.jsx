import React from "react";
import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      {/* Brand / Illustration */}
      <div className="hidden md:flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl p-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  A
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Axon Admin</h1>
                <p className="text-sm text-white/80">Management System</p>
              </div>
            </div>

            <h2 className="text-3xl font-semibold leading-snug">
              Nền tảng quản trị hiện đại
            </h2>
            <p className="mt-3 text-white/90">
              Quản lý nhân sự, dự án, khách hàng và tài chính trong một nơi duy nhất.
            </p>

            <ul className="mt-6 space-y-3 text-white/95">
              <li>✅ Theo dõi hiệu suất & chấm công</li>
              <li>✅ Báo cáo tài chính trực quan</li>
              <li>✅ Lịch làm việc & nhắn tin nội bộ</li>
            </ul>

            <div className="mt-8">
              <Link
                to="/signin"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-gray-900 font-semibold hover:bg-white/90"
              >
                Bắt đầu ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Auth forms */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
