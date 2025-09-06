// src/components/ProjectReports.jsx
import React, { useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FolderIcon, ChartBarIcon } from "@heroicons/react/24/outline";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ensureArray = (v) => (Array.isArray(v) ? v : []);
const safeNum = (x) => (isFinite(+x) ? +x : 0);

export default function ProjectReports({ projects = [] }) {
  const projs = ensureArray(projects);

  const total = projs.length;
  const completed = projs.filter((p) => p?.status === "Hoàn thành").length;
  const inProgress = projs.filter((p) => p?.status === "Đang thực hiện").length;
  const avgProgress =
    total > 0
      ? Math.round(
          projs.reduce((s, p) => s + (isFinite(+p?.progress) ? +p.progress : 0), 0) / total
        )
      : 0;

  const statusCounts = useMemo(() => {
    const obj = {};
    projs.forEach((p) => {
      const k = p?.status || "Khác";
      obj[k] = (obj[k] || 0) + 1;
    });
    return obj;
  }, [projs]);

  // Top 7 dự án theo ngân sách (và ước tính chi tiêu = budget * progress/100)
  const topBudget = [...projs]
    .map((p) => ({ ...p, budget: safeNum(p?.budget), progress: safeNum(p?.progress) }))
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 7);

  const barBudget = {
    labels: topBudget.map((p) => p.name || `Dự án ${p.id}`),
    datasets: [
      { label: "Ngân sách", data: topBudget.map((p) => p.budget), backgroundColor: "#3b82f6" },
      {
        label: "Ước chi",
        data: topBudget.map((p) => Math.round((p.budget * p.progress) / 100)),
        backgroundColor: "#f59e0b",
      },
    ],
  };

  const doughnutStatus = {
    labels: Object.keys(statusCounts),
    datasets: [{ data: Object.values(statusCounts), backgroundColor: ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#94a3b8"], borderWidth: 0 }],
  };

  const fmt = (n) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Báo cáo dự án</h1>
        <p className="text-blue-100">Trạng thái, ngân sách & tiến độ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tổng dự án</p>
          <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Đang thực hiện</p>
          <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Hoàn thành</p>
          <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tiến độ TB</p>
          <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{avgProgress}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Ngân sách vs Ước chi (Top)</h3>
          <div className="h-80">
            <Bar
              data={barBudget}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.parsed.y)}` } } },
                scales: { y: { ticks: { callback: (v) => fmt(v) } } },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tỷ lệ trạng thái</h3>
          <div className="h-80">
            <Doughnut data={doughnutStatus} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
          </div>
        </div>
      </div>

      {/* bảng deadline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5" /> Deadline sắp tới
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500 dark:text-gray-400">
              <tr>
                <th className="py-2 pr-4">Dự án</th>
                <th className="py-2 pr-4">Trạng thái</th>
                <th className="py-2 pr-4">Tiến độ</th>
                <th className="py-2">Kết thúc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[...projs]
                .filter((p) => p?.endDate)
                .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
                .slice(0, 10)
                .map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white">{p.name || `Dự án ${p.id}`}</td>
                    <td className="py-2 pr-4">{p.status || "—"}</td>
                    <td className="py-2 pr-4">{isFinite(+p?.progress) ? `${p.progress}%` : "—"}</td>
                    <td className="py-2">{new Date(p.endDate).toLocaleDateString("vi-VN")}</td>
                  </tr>
                ))}
              {projs.length === 0 && (
                <tr><td colSpan="4" className="py-4 text-gray-500 dark:text-gray-400">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
