// src/components/HRReports.jsx
import React, { useMemo } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
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
import { UserGroupIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

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

export default function HRReports({ employees = [] }) {
  const emps = ensureArray(employees);

  const deptCounts = useMemo(() => {
    const obj = {};
    emps.forEach((e) => {
      const k = safeStr(e?.department);
      obj[k] = (obj[k] || 0) + 1;
    });
    return obj;
  }, [emps]);

  const genderCounts = useMemo(() => {
    const obj = { Nam: 0, Nữ: 0, Khác: 0 };
    emps.forEach((e) => {
      const g = safeStr(e?.gender);
      if (/nam/i.test(g)) obj.Nam++;
      else if (/nữ|nu/i.test(g)) obj.Nữ++;
      else obj.Khác++;
    });
    return obj;
  }, [emps]);

  // giả lập đường headcount 12 tháng (lấy tổng hiện tại + phân phối)
  const monthLabels = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
  const lineHeadcount = {
    labels: monthLabels,
    datasets: [
      {
        label: "Headcount",
        data: monthLabels.map((_, i) => Math.max(1, Math.round(emps.length * (0.75 + i * 0.02)))),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.12)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const chartDept = {
    labels: Object.keys(deptCounts),
    datasets: [{ label: "Nhân sự", data: Object.values(deptCounts), backgroundColor: "#8b5cf6" }],
  };

  const chartGender = {
    labels: Object.keys(genderCounts),
    datasets: [{ data: Object.values(genderCounts), backgroundColor: ["#3b82f6", "#f472b6", "#94a3b8"], borderWidth: 0 }],
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Báo cáo nhân sự</h1>
        <p className="text-blue-100">Phân tích headcount, giới tính, phòng ban</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tổng nhân sự</p>
          <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{emps.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Số phòng ban</p>
          <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{Object.keys(deptCounts).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Biểu tượng</p>
          <div className="mt-2 flex gap-3 text-blue-600">
            <UserGroupIcon className="w-8 h-8" />
            <BuildingOffice2Icon className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Headcount theo tháng</h3>
          <div className="h-80">
            <Line data={lineHeadcount} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } }} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cơ cấu giới tính</h3>
          <div className="h-80">
            <Doughnut data={chartGender} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Nhân sự theo phòng ban</h3>
        <div className="h-80">
          <Bar data={chartDept} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
        </div>
      </div>
    </div>
  );
}
