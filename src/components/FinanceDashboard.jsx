import React, { useMemo, useState } from "react";
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(n || 0));

const ensureArray = (v) => (Array.isArray(v) ? v : []);

const sampleRevenue = [
  { id: 1, date: "2025-01-10", client: "Công ty A", amount: 120_000_000, category: "Dịch vụ" },
  { id: 2, date: "2025-02-05", client: "Công ty B", amount: 80_000_000, category: "Bảo trì" },
  { id: 3, date: "2025-03-12", client: "Công ty A", amount: 150_000_000, category: "Dịch vụ" },
  { id: 4, date: "2025-04-01", client: "Công ty C", amount: 60_000_000, category: "Khác" },
  { id: 5, date: "2025-05-08", client: "Công ty B", amount: 95_000_000, category: "Dịch vụ" },
  { id: 6, date: "2025-06-16", client: "Công ty D", amount: 110_000_000, category: "Dịch vụ" },
];

const sampleExpenses = [
  { id: 1, date: "2025-01-20", vendor: "Nhà cung cấp X", amount: 45_000_000, category: "Nhân sự" },
  { id: 2, date: "2025-02-17", vendor: "Nhà cung cấp Y", amount: 20_000_000, category: "Hạ tầng" },
  { id: 3, date: "2025-03-04", vendor: "Nhà cung cấp X", amount: 30_000_000, category: "Marketing" },
  { id: 4, date: "2025-04-10", vendor: "Nhà cung cấp Z", amount: 25_000_000, category: "Khác" },
  { id: 5, date: "2025-05-05", vendor: "Nhà cung cấp Y", amount: 28_000_000, category: "Hạ tầng" },
  { id: 6, date: "2025-06-22", vendor: "Nhà cung cấp X", amount: 40_000_000, category: "Nhân sự" },
];

const sampleInvoices = [
  { id: 1, invoiceNo: "INV-001", client: "Công ty A", issueDate: "2025-05-25", dueDate: "2025-06-10", amount: 80_000_000, status: "Unpaid" },
  { id: 2, invoiceNo: "INV-002", client: "Công ty B", issueDate: "2025-05-30", dueDate: "2025-06-15", amount: 60_000_000, status: "Paid" },
  { id: 3, invoiceNo: "INV-003", client: "Công ty C", issueDate: "2025-06-02", dueDate: "2025-06-12", amount: 50_000_000, status: "Overdue" },
];

export default function FinanceDashboard({ revenue = sampleRevenue, expenses = sampleExpenses, invoices = sampleInvoices }) {
  const [year] = useState(new Date().getFullYear());
  const rev = ensureArray(revenue);
  const exp = ensureArray(expenses);
  const inv = ensureArray(invoices);

  const totalRevenue = useMemo(() => rev.reduce((s, r) => s + Number(r.amount || 0), 0), [rev]);
  const totalExpenses = useMemo(() => exp.reduce((s, e) => s + Number(e.amount || 0), 0), [exp]);
  const profit = totalRevenue - totalExpenses;
  const overdue = useMemo(() => inv.filter((i) => i.status === "Overdue").length, [inv]);

  // group by month
  const byMonth = (arr) => {
    const m = Array(12).fill(0);
    arr.forEach((x) => {
      const d = new Date(x.date || x.issueDate);
      if (!isNaN(d)) m[d.getMonth()] += Number(x.amount || 0);
    });
    return m;
  };

  const revenueMonths = byMonth(rev);
  const expenseMonths = byMonth(exp);

  const lineData = {
    labels: ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
    datasets: [
      {
        label: "Doanh thu",
        data: revenueMonths,
        borderColor: "rgb(59,130,246)",
        backgroundColor: "rgba(59,130,246,0.12)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Chi phí",
        data: expenseMonths,
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.12)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const expenseCats = useMemo(() => {
    const map = {};
    exp.forEach((e) => (map[e.category] = (map[e.category] || 0) + Number(e.amount || 0)));
    const labels = Object.keys(map);
    return {
      labels,
      datasets: [{ data: labels.map((k) => map[k]), backgroundColor: ["#60a5fa", "#f97316", "#10b981", "#a78bfa", "#f43f5e"] }],
    };
  }, [exp]);

  const kpi = (title, value, sub, positive = true) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <p className={`text-sm mt-1 ${positive ? "text-green-600" : "text-red-500"}`}>{sub}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          {positive ? <ArrowTrendingUpIcon className="w-7 h-7" /> : <ArrowTrendingDownIcon className="w-7 h-7" />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Tổng quan Tài chính {year}</h1>
            <p className="text-blue-100">Doanh thu, chi phí, lợi nhuận & hóa đơn</p>
          </div>
          <CurrencyDollarIcon className="w-20 h-20 opacity-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpi("Doanh thu", fmt(totalRevenue), "Tổng thu năm nay", true)}
        {kpi("Chi phí", fmt(totalExpenses), "Tổng chi năm nay", false)}
        {kpi("Lợi nhuận (ước tính)", fmt(profit), profit >= 0 ? "Dương" : "Âm", profit >= 0)}
        {kpi("Hóa đơn quá hạn", overdue, "Số lượng", overdue === 0)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Doanh thu vs Chi phí theo tháng</h3>
          <div className="h-72">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } }} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cơ cấu Chi phí theo nhóm</h3>
          <div className="h-72">
            <Doughnut data={expenseCats} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Giao dịch gần đây</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Doanh thu</p>
            <ul className="space-y-2">
              {rev.slice(-5).reverse().map((r) => (
                <li key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-800 dark:text-gray-200">{r.client}</span>
                  <span className="text-green-600 font-semibold">{fmt(r.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Chi phí</p>
            <ul className="space-y-2">
              {exp.slice(-5).reverse().map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-800 dark:text-gray-200">{e.category}</span>
                  <span className="text-red-500 font-semibold">-{fmt(e.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
