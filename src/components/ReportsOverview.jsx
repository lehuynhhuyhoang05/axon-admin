// src/components/ReportsOverview.jsx
import React, { useMemo } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  UserGroupIcon,
  FolderIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ensureArray = (v) => (Array.isArray(v) ? v : []);
const safeStr = (v, d = "Khác") => (typeof v === "string" && v.trim() ? v : d);

export default function ReportsOverview({
  employees = [],
  projects = [],
  clients = [],
}) {
  const emps = ensureArray(employees);
  const projs = ensureArray(projects);
  const cls = ensureArray(clients);

  // ===== KPIs =====
  const totalEmployees = emps.length;
  const inProgress = projs.filter((p) => p?.status === "Đang thực hiện").length || projs.length;
  const totalClients = cls.length;

  // Dự án theo trạng thái
  const statusCounts = useMemo(() => {
    const groups = { "Hoàn thành": 0, "Đang thực hiện": 0, "Chưa bắt đầu": 0, "Tạm dừng": 0, Khác: 0 };
    projs.forEach((p) => {
      const k = safeStr(p?.status);
      groups[k] = (groups[k] || 0) + 1;
    });
    return groups;
  }, [projs]);

  // Nhân sự theo phòng ban
  const deptCounts = useMemo(() => {
    const obj = {};
    emps.forEach((e) => {
      const k = safeStr(e?.department);
      obj[k] = (obj[k] || 0) + 1;
    });
    return obj;
  }, [emps]);

  // Dự án bắt đầu theo tháng (dựa startDate nếu có)
  const monthLabels = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
  const projectByMonth = useMemo(() => {
    const arr = Array(12).fill(0);
    projs.forEach((p) => {
      const d = p?.startDate ? new Date(p.startDate) : null;
      if (d && !isNaN(d)) arr[d.getMonth()]++;
    });
    return arr;
  }, [projs]);

  // ===== charts =====
  const chartStatus = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#94a3b8"],
        borderWidth: 0,
      },
    ],
  };

  const chartDept = {
    labels: Object.keys(deptCounts),
    datasets: [
      {
        label: "Nhân sự",
        data: Object.values(deptCounts),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const chartProjMonth = {
    labels: monthLabels,
    datasets: [
      {
        label: "Dự án bắt đầu",
        data: projectByMonth,
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139,92,246,0.12)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const Stat = ({ title, value, delta = "+0%", up = true, Icon = UsersIcon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className={`mt-1 text-sm ${up ? "text-green-600" : "text-red-500"} flex items-center gap-1`}>
            {up ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
            {delta} so với kỳ trước
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  // Danh sách nhanh
  const topSoon = projs
    .filter((p) => p?.endDate)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Báo cáo tổng quan</h1>
        <p className="text-blue-100">Ảnh tổng thế về nhân sự, dự án và khách hàng</p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Tổng nhân sự" value={totalEmployees} Icon={UserGroupIcon} />
        <Stat title="Dự án đang thực hiện" value={inProgress} Icon={FolderIcon} />
        <Stat title="Khách hàng" value={totalClients} Icon={UsersIcon} />
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Dự án bắt đầu theo tháng</h3>
          <div className="h-80">
            <Line
              data={chartProjMonth}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trạng thái dự án</h3>
          <div className="h-80">
            <Doughnut
              data={chartStatus}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Nhân sự theo phòng ban</h3>
          <div className="h-80">
            <Bar
              data={chartDept}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Deadline sắp tới</h3>
          <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {topSoon.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{p.name || "Dự án"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Kết thúc: {new Date(p.endDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span className="text-sm rounded-full px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {p.status || "Đang thực hiện"}
                </span>
              </li>
            ))}
            {topSoon.length === 0 && <li className="text-gray-500 dark:text-gray-400">Không có dữ liệu</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
