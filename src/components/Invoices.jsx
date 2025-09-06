import React, { useMemo, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

const fmt = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(n || 0));
const ensureArray = (v) => (Array.isArray(v) ? v : []);

const seed = [
  { id: 1, invoiceNo: "INV-001", client: "Công ty A", issueDate: "2025-06-01", dueDate: "2025-06-15", amount: 80_000_000, status: "Unpaid" },
  { id: 2, invoiceNo: "INV-002", client: "Công ty B", issueDate: "2025-06-05", dueDate: "2025-06-20", amount: 60_000_000, status: "Paid" },
  { id: 3, invoiceNo: "INV-003", client: "Công ty C", issueDate: "2025-05-29", dueDate: "2025-06-10", amount: 50_000_000, status: "Overdue" },
];

const Badge = ({ status }) => {
  const map = {
    Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    Unpaid: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    Draft: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status] || map.Draft}`}>{status}</span>;
};

export default function Invoices({ initial = seed }) {
  const [list, setList] = useState(ensureArray(initial));
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ invoiceNo: "", client: "", issueDate: "", dueDate: "", amount: "", status: "Draft" });

  const filtered = useMemo(
    () =>
      list
        .filter((x) => (status === "all" ? true : x.status === status))
        .filter((x) => [x.invoiceNo, x.client].join(" ").toLowerCase().includes(q.toLowerCase())),
    [list, q, status]
  );

  const total = useMemo(() => filtered.reduce((s, x) => s + Number(x.amount || 0), 0), [filtered]);

  const openAdd = () => {
    setEditing(null);
    setForm({ invoiceNo: "", client: "", issueDate: "", dueDate: "", amount: "", status: "Draft" });
    setShow(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ invoiceNo: row.invoiceNo, client: row.client, issueDate: row.issueDate, dueDate: row.dueDate, amount: row.amount, status: row.status });
    setShow(true);
  };
  const save = () => {
    if (!form.invoiceNo || !form.client || !form.issueDate || !form.dueDate || !form.amount) return;
    if (editing) {
      setList((prev) => prev.map((x) => (x.id === editing.id ? { ...editing, ...form, amount: Number(form.amount) } : x)));
    } else {
      setList((prev) => [...prev, { id: Date.now(), ...form, amount: Number(form.amount) }]);
    }
    setShow(false);
  };
  const removeRow = (id) => setList((prev) => prev.filter((x) => x.id !== id));
  const markPaid = (row) => setList((prev) => prev.map((x) => (x.id === row.id ? { ...x, status: "Paid" } : x)));

  const download = (row) => {
    // xuất JSON nhanh gọn (có thể thay bằng PDF generator sau)
    const blob = new Blob([JSON.stringify(row, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${row.invoiceNo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hóa đơn</h1>
        <button onClick={openAdd} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700">
          <PlusIcon className="w-5 h-5 mr-2" /> Tạo hóa đơn
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo mã hóa đơn, khách hàng…"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-48 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Draft">Bản nháp</option>
          <option value="Unpaid">Chưa thanh toán</option>
          <option value="Paid">Đã thanh toán</option>
          <option value="Overdue">Quá hạn</option>
        </select>
        <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
          Tổng: <span className="font-semibold">{fmt(total)}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">Mã HĐ</th>
              <th className="p-3 text-left">Khách hàng</th>
              <th className="p-3 text-left">Ngày lập</th>
              <th className="p-3 text-left">Hạn thanh toán</th>
              <th className="p-3 text-right">Số tiền</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="p-3">{row.invoiceNo}</td>
                <td className="p-3">{row.client}</td>
                <td className="p-3">{row.issueDate}</td>
                <td className="p-3">{row.dueDate}</td>
                <td className="p-3 text-right font-semibold">{fmt(row.amount)}</td>
                <td className="p-3"><Badge status={row.status} /></td>
                <td className="p-3 text-right space-x-2">
                  {row.status !== "Paid" && (
                    <button onClick={() => markPaid(row)} className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" title="Đánh dấu đã thanh toán">
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => openEdit(row)} className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" title="Chỉnh sửa">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => download(row)} className="px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" title="Tải xuống">
                    <DocumentArrowDownIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeRow(row.id)} className="px-2 py-1 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300" title="Xóa">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500 dark:text-gray-400" colSpan={7}>
                  Không có hóa đơn phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Mã hóa đơn" value={form.invoiceNo} onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })} />
              <input className="rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" placeholder="Khách hàng" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
              <input className="rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
              <input className="rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              <input className="rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" type="number" placeholder="Số tiền" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <select className="rounded-lg border p-2 dark:bg-gray-700 dark:border-gray-600" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Draft</option>
                <option>Unpaid</option>
                <option>Paid</option>
                <option>Overdue</option>
              </select>
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
