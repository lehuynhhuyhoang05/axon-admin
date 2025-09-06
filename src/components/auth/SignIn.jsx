import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const draft = JSON.parse(localStorage.getItem("axon_user_draft") || "{}");
    const user = {
      name: draft.name || "Guest",
      email: form.email,
      avatar: draft.avatar || "",
      role: "Administrator",
    };
    localStorage.setItem("axon_user", JSON.stringify(user));
    navigate("/", { replace: true }); // về Dashboard
  };

  return (
    <div className="rounded-3xl bg-white shadow-xl p-6 md:p-8 text-gray-900 dark:bg-white">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mx-auto mb-4">
        <span className="text-xl">🔒</span>
      </div>
      <h1 className="text-2xl font-bold text-center">Đăng nhập</h1>
      <p className="text-center text-gray-600 mb-6">Truy cập bảng điều khiển Axon</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400
                       focus:border-blue-500 focus:ring-blue-500 p-2.5"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400
                         focus:border-blue-500 focus:ring-blue-500 p-2.5 pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
              title={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" /> Ghi nhớ
          </label>
          <button className="text-blue-600 hover:underline" type="button">
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-95"
        >
          Đăng nhập
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Chưa có tài khoản?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Tạo tài khoản
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
