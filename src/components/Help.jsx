// src/components/Help.jsx
import React, { useState } from "react";
import { QuestionMarkCircleIcon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

const FAQ = [
  { q: "Làm sao bật/tắt chế độ tối?", a: "Vào Cài đặt → Tuỳ chọn, bật công tắc 'Chế độ tối'." },
  { q: "Xuất báo cáo ở đâu?", a: "Báo cáo → Xuất báo cáo (CSV/JSON)." },
  { q: "Quên mật khẩu?", a: "Phần này là demo offline, bạn có thể đổi mật khẩu trong Cài đặt." },
];

export default function Help() {
  const [open, setOpen] = useState(null);
  const [isTicket, setIsTicket] = useState(false);
  const [ticket, setTicket] = useState({ subject: "", message: "" });
  const [ok, setOk] = useState("");

  const submitTicket = () => {
    if (!ticket.subject || !ticket.message) return;
    const all = JSON.parse(localStorage.getItem("axon_tickets") || "[]");
    all.push({ id: crypto.randomUUID(), ...ticket, at: new Date().toISOString(), status: "open" });
    localStorage.setItem("axon_tickets", JSON.stringify(all));
    setOk("Đã gửi yêu cầu hỗ trợ! Chúng tôi sẽ phản hồi sớm.");
    setTicket({ subject: "", message: "" });
    setIsTicket(false);
    setTimeout(() => setOk(""), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <QuestionMarkCircleIcon className="h-6 w-6" />
          Trợ giúp
        </h1>
        <p className="text-blue-100">Câu hỏi thường gặp & gửi yêu cầu hỗ trợ</p>
      </div>

      {ok && <p className="rounded-lg bg-green-50 p-3 text-green-700">{ok}</p>}

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">FAQ</h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {FAQ.map((f, i) => (
            <div key={i} className="py-3">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white">{f.q}</span>
                <span className="text-sm text-blue-600">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Không tìm thấy câu trả lời?</h3>
          <button
            onClick={() => setIsTicket(true)}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-semibold text-white hover:from-blue-600 hover:to-purple-700"
          >
            Gửi yêu cầu hỗ trợ
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Đội ngũ hỗ trợ sẽ phản hồi trong giờ làm việc.
        </p>
      </div>

      {/* Modal ticket */}
      {isTicket && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Tạo ticket hỗ trợ</h3>
              <button onClick={() => setIsTicket(false)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Tiêu đề</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={ticket.subject}
                  onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                  placeholder="VD: Lỗi không hiển thị báo cáo"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Mô tả</label>
                <textarea
                  rows={5}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={ticket.message}
                  onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                  placeholder="Mô tả chi tiết vấn đề bạn gặp phải…"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
              <button onClick={() => setIsTicket(false)} className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
                Đóng
              </button>
              <button
                onClick={submitTicket}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-semibold text-white hover:from-blue-600 hover:to-purple-700"
              >
                <PaperAirplaneIcon className="h-5 w-5 -rotate-45" /> Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
