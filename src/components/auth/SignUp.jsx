import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", avatar: "" });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Auto sign-in demo
    const user = {
      name: form.name,
      email: form.email,
      avatar: form.avatar || "",
      role: "Administrator",
    };
    localStorage.setItem("axon_user", JSON.stringify(user));
    navigate("/", { replace: true }); // về Dashboard
  };

  return (
    <div className="rounded-3xl bg-white shadow-xl p-6 md:p-8 text-gray-900 dark:bg-white">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 mx-auto mb-4">
        <span className="text-xl">👤</span>
      </div>
      <h1 className="text-2xl font-bold text-center">Tạo tài khoản</h1>
      <p className="text-center text-gray-600 mb-6">Miễn phí & nhanh chóng</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Họ và tên</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400
                       focus:border-purple-500 focus:ring-purple-500 p-2.5"
            placeholder="Huy Hoàng"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400
                       focus:border-purple-500 focus:ring-purple-500 p-2.5"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400
                       focus:border-purple-500 focus:ring-purple-500 p-2.5"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Avatar (URL - tuỳ chọn)</label>
          <input
            name="avatar"
            value={form.avatar}
            onChange={onChange}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400
                       focus:border-purple-500 focus:ring-purple-500 p-2.5"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95"
        >
          Đăng ký
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Đã có tài khoản?{" "}
        <Link to="/signin" className="text-purple-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
