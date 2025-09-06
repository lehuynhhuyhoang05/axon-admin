// src/components/FinancialReports.jsx
import React, { useMemo, useState } from "react";
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ===== Helpers =====
const ensureArray = (v) => (Array.isArray(v) ? v : []);
const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
const monthLabels = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
const toDate = (d) => (d ? new Date(d) : null);
const inRange = (d, start, end) => d && d >= start && d <= end;

// ===== Sample fallback data (dùng khi không truyền props) =====
const sampleRevenue = [
  { date: "2025-01-10", client: "Công ty A", amount: 120_000_000, category: "Dịch vụ" },
  { date: "2025-02-05", client: "Công ty B", amount: 80_000_000, category: "Bảo trì" },
  { date: "2025-03-12", client: "Công ty A", amount: 150_000_000, category: "Dịch vụ" },
  { date: "2025-04-01", client: "Công ty C", amount: 60_000_000, category: "Khác" },
  { date: "2025-05-08", client: "Công ty B", amount: 95_000_000, category: "Dịch vụ" },
  { date: "2025-06-16", client: "Công ty D", amount: 110_000_000, category: "Dịch vụ" },
];
const sampleExpenses = [
  { date: "2025-01-20", vendor: "NCC X", amount: 45_000_000, category: "Nhân sự" },
  { date: "2025-02-17", vendor: "NCC Y", amount: 20_000_000, category: "Hạ tầng" },
  { date: "2025-03-04", vendor: "NCC X", amount: 30_000_000, category: "Marketing" },
  { date: "2025-04-10", vendor: "NCC Z", amount: 25_000_000, category: "Khác" },
  { date: "2025-05-05", vendor: "NCC Y", amount: 28_000_000, category: "Hạ tầng" },
  { date: "2025-06-22", vendor: "NCC X", amount: 40_000_000, category: "Nhân sự" },
];

export default function FinancialReports({
  revenue = sampleRevenue,
  expenses = sampleExpenses,
}) {
  const rev = ensureArray(revenue);
  const exp = ensureArray(expenses);

  // ===== Date range state (default: từ 01/01 năm nay -> cuối tháng hiện tại) =====
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [start, setStart] = useState(
    `${startOfYear.getFullYear()}-${String(startOfYear.getMonth() + 1).padStart(2, "0")}`
  );
  const [end, setEnd] = useState(
    `${endThisMonth.getFullYear()}-${String(endThisMonth.getMonth() + 1).padStart(2, "0")}`
  );

  // Convert month inputs ("YYYY-MM") -> Date range
  const startDate = useMemo(() => {
    const [y, m] = start.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [start]);
  const endDate = useMemo(() => {
    const [y, m] = end.split("-").map(Number);
    return new Date(y, m, 0); // last day of month
  }, [end]);

  // Presets
  const setPresetThisYear = () => {
    setStart(`${now.getFullYear()}-01`);
    setEnd(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  };
  const setPresetSixMonths = () => {
    const endM = new Date(now.getFullYear(), now.getMonth(), 1);
    const startM = new Date(endM);
    startM.setMonth(startM.getMonth() - 5);
    setStart(`${startM.getFullYear()}-${String(startM.getMonth() + 1).padStart(2, "0")}`);
    setEnd(`${endM.getFullYear()}-${String(endM.getMonth() + 1).padStart(2, "0")}`);
  };
  const setPresetQuarter = () => {
    const q = Math.floor(now.getMonth() / 3); // 0..3
    const qStart = new Date(now.getFullYear(), q * 3, 1);
    const qEnd = new Date(now.getFullYear(), q * 3 + 3, 0);
    setStart(`${qStart.getFullYear()}-${String(qStart.getMonth() + 1).padStart(2, "0")}`);
    setEnd(`${qEnd.getFullYear()}-${String(qEnd.getMonth() + 1).padStart(2, "0")}`);
  };

  // ===== Filtered data in range =====
  const revFiltered = useMemo(
    () => rev.filter((r) => inRange(toDate(r.date), startDate, endDate)),
    [rev, startDate, endDate]
  );
  const expFiltered = useMemo(
    () => exp.filter((e) => inRange(toDate(e.date), startDate, endDate)),
    [exp, startDate, endDate]
  );

  // ===== KPIs =====
  const totalRevenue = useMemo(
    () => revFiltered.reduce((s, r) => s + Number(r.amount || 0), 0),
    [revFiltered]
  );
  const totalExpenses = useMemo(
    () => expFiltered.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expFiltered]
  );
  const profit = totalRevenue - totalExpenses;
  const margin = totalRevenue ? (profit / totalRevenue) * 100 : 0;

  // ===== Group by month (1..12 for the selected year range). For simplicity we still show 12 months labels. =====
  const sumByMonth = (arr) => {
    const map = Array(12).fill(0);
    arr.forEach((x) => {
      const d = toDate(x.date);
      if (!d) return;
      const idx = d.getMonth(); // 0..11
      if (inRange(d, startDate, endDate)) {
        map[idx] += Number(x.amount || 0);
      }
    });
    return map;
  };
  const revMonths = sumByMonth(rev);
  const expMonths = sumByMonth(exp);
  const profitMonths = revMonths.map((v, i) => v - expMonths[i]);

  // ===== Category breakdown (expenses) =====
  const expenseBreakdown = useMemo(() => {
    const obj = {};
    expFiltered.forEach((e) => {
      const k = e.category || "Khác";
      obj[k] = (obj[k] || 0) + Number(e.amount || 0);
    });
    const labels = Object.keys(obj);
    const data = labels.map((k) => obj[k]);
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#60a5fa", "#f97316", "#22c55e", "#a78bfa", "#f43f5e", "#f59e0b", "#10b981"],
          borderWidth: 0,
        },
      ],
    };
  }, [expFiltered]);

  // ===== Top tables =====
  const topBy = (arr, key) => {
    const obj = {};
    arr.forEach((x) => {
      const k = x[key] || "Khác";
      obj[k] = (obj[k] || 0) + Number(x.amount || 0);
    });
    return Object.entries(obj)
      .map(([k, v]) => ({ name: k, amount: v }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };
  const topClients = useMemo(() => topBy(revFiltered, "client"), [revFiltered]);
  const topVendors = useMemo(() => topBy(expFiltered, "vendor"), [expFiltered]);

  // ===== Charts =====
  const lineData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Doanh thu",
        data: revMonths,
        borderColor: "rgb(59,130,246)",
        backgroundColor: "rgba(59,130,246,0.12)",
        fill: true,
        tension: 0.35,
      },
      {
        label: "Chi phí",
        data: expMonths,
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.12)",
        fill: true,
        tension: 0.35,
      },
    ],
  };
  const barProfitData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Lợi nhuận",
        data: profitMonths,
        backgroundColor: profitMonths.map((v) => (v >= 0 ? "#22c55e" : "#ef4444")),
      },
    ],
  };

  // ===== CSV Export =====
  const exportCSV = () => {
    const header = "type,date,label,amount\n";
    const rows = [
      ...revFiltered.map((r) => `revenue,${r.date},${r.client},${r.amount}`),
      ...expFiltered.map((e) => `expense,${e.date},${e.vendor},${e.amount}`),
    ].join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "financial_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ===== UI =====
  const KPICard = ({ title, value, sub, positive = true, Icon = CurrencyDollarIcon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {sub && (
            <p className={`text-sm mt-1 ${positive ? "text-green-600" : "text-red-500"}`}>{sub}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <ChartBarIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Báo cáo tài chính</h1>
              <p className="text-blue-100">Theo dõi doanh thu, chi phí, lợi nhuận theo thời gian</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <input
                type="month"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="bg-transparent text-white placeholder-blue-100/70 border border-white/20 rounded-md px-2 py-1 focus:outline-none"
              />
              <span className="text-white/70">—</span>
              <input
                type="month"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="bg-transparent text-white placeholder-blue-100/70 border border-white/20 rounded-md px-2 py-1 focus:outline-none"
              />
            </div>
            <button onClick={setPresetThisYear} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition">
              Năm nay
            </button>
            <button onClick={setPresetSixMonths} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition">
              6 tháng
            </button>
            <button onClick={setPresetQuarter} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition">
              Quý này
            </button>

            <button
              onClick={exportCSV}
              className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition"
              title="Xuất CSV theo khoảng thời gian đã lọc"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Xuất CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Doanh thu" value={fmt(totalRevenue)} sub="Tổng trong khoảng đã chọn" positive Icon={CurrencyDollarIcon} />
        <KPICard title="Chi phí" value={fmt(totalExpenses)} sub="Tổng trong khoảng đã chọn" positive={false} Icon={ArrowTrendingDownIcon} />
        <KPICard title="Lợi nhuận (ước tính)" value={fmt(profit)} sub={profit >= 0 ? "Dương" : "Âm"} positive={profit >= 0} Icon={ArrowTrendingUpIcon} />
        <KPICard title="Biên lợi nhuận" value={`${margin.toFixed(1)}%`} sub="(Profit / Revenue)" positive={margin >= 0} Icon={ChartBarIcon} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Doanh thu vs Chi phí theo tháng</h3>
          <div className="h-80">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                interaction: { mode: "index", intersect: false },
                scales: { y: { ticks: { callback: (v) => fmt(v) } } },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cơ cấu chi phí</h3>
          <div className="h-80">
            <Doughnut data={expenseBreakdown} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Lợi nhuận theo tháng</h3>
        <div className="h-72">
          <Bar
            data={barProfitData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmt(ctx.parsed.y) } } },
              scales: { y: { ticks: { callback: (v) => fmt(v) } } },
            }}
          />
        </div>
      </div>

      {/* Top lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Top khách hàng (theo doanh thu)</h3>
          </div>
          <ul className="space-y-2">
            {topClients.map((c) => (
              <li key={c.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-800 dark:text-gray-200">{c.name}</span>
                <span className="font-semibold text-green-600">{fmt(c.amount)}</span>
              </li>
            ))}
            {topClients.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">Không có dữ liệu</li>
            )}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <BuildingStorefrontIcon className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Top nhà cung cấp (theo chi phí)</h3>
          </div>
          <ul className="space-y-2">
            {topVendors.map((v) => (
              <li key={v.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-800 dark:text-gray-200">{v.name}</span>
                <span className="font-semibold text-red-500">-{fmt(v.amount)}</span>
              </li>
            ))}
            {topVendors.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">Không có dữ liệu</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
