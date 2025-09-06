import React, { useMemo, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(n || 0));
const ensureArray = (v) => (Array.isArray(v) ? v : []);

const seed = [
  { id: 1, date: "2025-06-03", vendor: "Nhà cung cấp X", amount: 12_000_000, category: "Hạ tầng", note: "Server tháng 6" },
  { id: 2, date: "2025-06-14", vendor: "Nhà cung cấp Y", amount: 8_500_000, category: "Marketing", note: "Ads FB" },
];

export default function Expenses({ initial = seed }) {
  const [list, setList] = useState(ensureArray(initial));
  const [q, setQ] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ date: "", vendor: "", amount: "", category: "Hạ tầng", note: "" });

  const filtered = useMemo(
    () => list.filter((x) => [x.vendor, x.category, x.note].join(" ").toLowerCase().includes(q.toLowerCase())),
    [list, q]
  );
  const total = useMemo(() => filtered.reduce((s, x) => s + Number(x.amount || 0), 0), [filtered]);

  const openAdd = () => {
    setEditing(null);
    setForm({ date: "", vendor: "", amount: "", category: "Hạ tầng", note: "" });
    setShow(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ date: row.date, vendor: row.vendor, amount: row.amount, category: row.category, note: row.note });
    setShow(true);
  };
  const save = () => {
    if (!form.date || !form.vendor || !form.amount) return;
    if (editing) {
      setList((prev) => prev.map((x) => (x.id === editing.id ? { ...editing, ...form, amount: Number(form.amount) } : x)));
    } else {
      setList((prev) => [...prev, { id: Date.now(), ...form, amount: Number(form.amount) }]);
    }
    setShow(false);
  };
  const removeRow = (id) => setList((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chi phí</h1>
        <button onClick={openAdd} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700">
          <PlusIcon className="w-5 h-5 mr-2" /> Thêm khoản chi
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo NCC, nhóm, ghi chú…"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white"
        />
        <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
          Tổng: <span className="font-semibold text-red-500">-{fmt(total)}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left">Nhà cung cấp</th>
              <th className="p-3 text-right">Số tiền</th>
              <th className="p-3 text-left">Nhóm</th>
              <th className="p-3 text-left">Ghi chú</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.vendor}</td>
                <td className="p-3 text-right text-red-500 font-semibold">-{fmt(row.amount)}</td>
                <td className="p-3">{row.category}</td>
                <td className="p-3">{row.note}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => openEdit(row)} className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeRow(row.id)} className="px-2 py-1 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500 dark:text-gray-400" colSpan={6}>
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Chỉnh sửa khoản chi" : "Thêm khoản chi"}</h3>
            <div className="space-y-3">
              <input className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <input className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Nhà cung cấp" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
              <input className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" type="number" placeholder="Số tiền" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <select className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Hạ tầng</option>
                <option>Marketing</option>
                <option>Nhân sự</option>
                <option>Khác</option>
              </select>
              <input className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Ghi chú" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShow(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">Hủy</button>
              <button onClick={save} className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
