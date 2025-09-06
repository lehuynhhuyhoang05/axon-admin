// src/components/ExportReports.jsx
import React from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

const ensureArray = (v) => (Array.isArray(v) ? v : []);

const toCSV = (rows) => {
  const arr = ensureArray(rows);
  if (arr.length === 0) return "data:text/csv;charset=utf-8,\uFEFF";
  const keys = Array.from(arr.reduce((s, r) => { Object.keys(r || {}).forEach((k) => s.add(k)); return s; }, new Set()));
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [keys.join(",")].concat(
    arr.map((r) => keys.map((k) => escape(r[k])).join(","))
  );
  const csv = "\uFEFF" + lines.join("\n"); // BOM cho Excel
  return "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
};

const download = (href, filename) => {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
};

export default function ExportReports({ employees = [], projects = [], clients = [] }) {
  const doExport = (type, fmt) => {
    const map = { employees, projects, clients };
    const data = map[type] || [];
    if (fmt === "csv") {
      download(toCSV(data), `${type}.csv`);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      download(url, `${type}.json`);
      URL.revokeObjectURL(url);
    }
  };

  const Card = ({ title, type }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Xuất dữ liệu {title.toLowerCase()} dưới dạng CSV/JSON</p>
      </div>
      <div className="pt-4 flex gap-2">
        <button
          onClick={() => doExport(type, "csv")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          <DocumentArrowDownIcon className="w-5 h-5" /> CSV
        </button>
        <button
          onClick={() => doExport(type, "json")}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <DocumentArrowDownIcon className="w-5 h-5" /> JSON
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Xuất báo cáo</h1>
        <p className="text-blue-100">Tải dữ liệu thô để phân tích thêm trên Excel/Python…</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Nhân sự" type="employees" />
        <Card title="Dự án" type="projects" />
        <Card title="Khách hàng" type="clients" />
      </div>
    </div>
  );
}
