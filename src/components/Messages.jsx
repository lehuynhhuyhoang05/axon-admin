import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  XMarkIcon,
  StarIcon,
  TrashIcon,
  BellSlashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const LS_THREADS = "axon_msgs_threads";

// ===== helpers =====
const uuid = () => crypto.randomUUID();
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};
const avatarUrl = (seed) => `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

const sampleContacts = [
  { id: "c1", name: "Nguyễn Văn A", role: "PM", online: true, avatar: avatarUrl("A") },
  { id: "c2", name: "Trần Thị B", role: "Designer", online: false, avatar: avatarUrl("B") },
  { id: "c3", name: "Lê Văn C", role: "Backend", online: true, avatar: avatarUrl("C") },
  { id: "c4", name: "Phạm D", role: "Frontend", online: false, avatar: avatarUrl("D") },
];

function buildContactsFromEmployees(employees) {
  if (!Array.isArray(employees) || employees.length === 0) return sampleContacts;
  return employees.slice(0, 20).map((e, i) => ({
    id: `emp-${e.id ?? i}`,
    name: e.name ?? `Nhân viên ${i + 1}`,
    role: e.department ?? "Nhân sự",
    online: Math.random() > 0.5,
    avatar: e.avatar || avatarUrl(e.name || String(i)),
  }));
}

const initialThreads = (contacts) => {
  const now = new Date();
  return [
    {
      id: "t1",
      participants: ["me", contacts[0].id],
      pinned: true,
      muted: false,
      unread: 2,
      messages: [
        { id: uuid(), sender: contacts[0].id, text: "Chào bạn, tài liệu Finance ok chưa?", at: new Date(now.getTime() - 3600e3).toISOString(), attachments: [] },
        { id: uuid(), sender: "me", text: "Đang review nè. Mình gửi lại trong chiều nay nha!", at: new Date(now.getTime() - 3300e3).toISOString(), attachments: [] },
        { id: uuid(), sender: contacts[0].id, text: "Oke mình đợi 👍", at: new Date(now.getTime() - 3200e3).toISOString(), attachments: [] },
      ],
    },
    {
      id: "t2",
      participants: ["me", contacts[1].id],
      pinned: false,
      muted: false,
      unread: 0,
      messages: [
        { id: uuid(), sender: contacts[1].id, text: "File logo mới ở đây nhé.", at: new Date(now.getTime() - 7200e3).toISOString(), attachments: [{ name: "logo.svg", size: 1240 }] },
      ],
    },
  ];
};

// ===== UI components =====
const Badge = ({ children }) => (
  <span className="ml-2 inline-flex min-w-[20px] justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
    {children}
  </span>
);

const Dot = ({ color = "bg-green-500" }) => <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;

const EmptyState = ({ title, desc }) => (
  <div className="flex h-full flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
    <ArrowPathIcon className="mb-3 h-10 w-10 opacity-50" />
    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</p>
    <p className="mt-1 max-w-sm">{desc}</p>
  </div>
);

export default function Messages({ employees = [] }) {
  const contacts = useMemo(() => buildContactsFromEmployees(employees), [employees]);

  const [threads, setThreads] = useState(() => {
    const raw = localStorage.getItem(LS_THREADS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return initialThreads(contacts);
  });
  useEffect(() => localStorage.setItem(LS_THREADS, JSON.stringify(threads)), [threads]);

  const [activeId, setActiveId] = useState(() => threads[0]?.id || null);
  const [search, setSearch] = useState("");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newTarget, setNewTarget] = useState(null);
  const [attachQueue, setAttachQueue] = useState([]); // {name,size}

  const activeThread = useMemo(() => threads.find((t) => t.id === activeId) || null, [threads, activeId]);

  // scroll to bottom on new message
  const bottomRef = useRef(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [activeThread?.messages?.length, activeId]);

  // derived: conversation list with search/filter
  const threadCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = threads
      .map((t) => {
        const otherId = t.participants.find((p) => p !== "me");
        const other = contacts.find((c) => c.id === otherId) || { name: "Unknown", avatar: avatarUrl("x"), online: false };
        const last = t.messages[t.messages.length - 1];
        const lastText = last?.text || (last?.attachments?.length ? `📎 ${last.attachments[0].name}` : "");
        return {
          ...t,
          other,
          lastText,
          lastAt: last?.at,
          matches:
            !q ||
            other.name.toLowerCase().includes(q) ||
            lastText.toLowerCase().includes(q) ||
            t.messages.some((m) => m.text?.toLowerCase().includes(q)),
        };
      })
      .filter((x) => x.matches && (!showOnlyUnread || x.unread > 0))
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return (new Date(b.lastAt).getTime() || 0) - (new Date(a.lastAt).getTime() || 0);
      });
    return list;
  }, [threads, contacts, search, showOnlyUnread]);

  const pickContactById = (id) => contacts.find((c) => c.id === id);

  // actions
  const openThreadWith = (contactId) => {
    const existing = threads.find((t) => t.participants.includes(contactId));
    if (existing) {
      setActiveId(existing.id);
      setIsNewOpen(false);
      return;
    }
    const newT = {
      id: uuid(),
      participants: ["me", contactId],
      pinned: false,
      muted: false,
      unread: 0,
      messages: [],
    };
    setThreads((prev) => [newT, ...prev]);
    setActiveId(newT.id);
    setIsNewOpen(false);
  };

  const sendMessage = (text) => {
    if (!activeThread || !text.trim()) return;
    const msg = { id: uuid(), sender: "me", text: text.trim(), at: new Date().toISOString(), attachments: attachQueue };
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThread.id ? { ...t, messages: [...t.messages, msg] } : t))
    );
    setAttachQueue([]);
    // simulate reply
    setTimeout(() => {
      const otherId = activeThread.participants.find((p) => p !== "me");
      const reply = { id: uuid(), sender: otherId, text: "Đã nhận 👌", at: new Date().toISOString(), attachments: [] };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id ? { ...t, messages: [...t.messages, reply], unread: t.unread + 1 } : t
        )
      );
    }, 900);
  };

  const markRead = (threadId) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t)));

  useEffect(() => {
    if (activeId) markRead(activeId);
    // eslint-disable-next-line
  }, [activeId]);

  const togglePin = (threadId) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, pinned: !t.pinned } : t)));

  const toggleMute = (threadId) =>
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, muted: !t.muted } : t)));

  const deleteThread = (threadId) => {
    if (!window.confirm("Xóa cuộc trò chuyện này?")) return;
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (activeId === threadId) setActiveId(null);
  };

  // compose input
  const [draft, setDraft] = useState("");
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(draft);
      setDraft("");
    }
  };

  const onAttach = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachQueue((prev) => [
      ...prev,
      ...files.map((f) => ({ name: f.name, size: f.size })),
    ]);
    e.target.value = "";
  };
  const removeQueued = (name) => setAttachQueue((prev) => prev.filter((f) => f.name !== name));

  // ===== RENDER =====
  return (
    <div className="grid h-[calc(100vh-140px)] grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: conversations */}
      <div className="col-span-1 flex min-h-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tin nhắn</h2>
          <button
            onClick={() => setIsNewOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700"
          >
            <PlusIcon className="h-4 w-4" />
            Cuộc trò chuyện
          </button>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, nội dung…"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowOnlyUnread((v) => !v)}
            className={`rounded-lg px-3 py-2 text-sm ${
              showOnlyUnread
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            }`}
            title="Chỉ hiện chưa đọc"
          >
            Chưa đọc
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {threadCards.length === 0 && (
            <EmptyState title="Không có hội thoại" desc="Tạo cuộc trò chuyện mới hoặc bỏ lọc để xem tất cả." />
          )}
          {threadCards.map((t) => {
            const otherId = t.participants.find((p) => p !== "me");
            const other = pickContactById(otherId) || { name: "Unknown", avatar: avatarUrl("x"), online: false };
            const active = t.id === activeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="relative">
                  <img src={other.avatar} alt={other.name} className="h-11 w-11 rounded-xl" />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                      other.online ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`truncate text-sm font-semibold ${active ? "" : "text-gray-900 dark:text-white"}`}>
                      {other.name}
                      {t.pinned && <StarIcon className="ml-1 inline h-4 w-4 text-yellow-500" />}
                    </p>
                    {t.lastAt && (
                      <span className="ml-2 shrink-0 text-xs text-gray-500 dark:text-gray-400">
                        {timeAgo(t.lastAt)}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{t.lastText || "—"}</p>
                </div>
                {t.unread > 0 && <Badge>{t.unread}</Badge>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: thread */}
      <div className="col-span-1 lg:col-span-2 flex min-h-0 flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {!activeThread ? (
          <EmptyState title="Chọn một cuộc trò chuyện" desc="Hoặc tạo mới để bắt đầu nhắn tin." />
        ) : (
          <>
            {/* header */}
            {(() => {
              const otherId = activeThread.participants.find((p) => p !== "me");
              const other = pickContactById(otherId) || { name: "Unknown", avatar: avatarUrl("x"), online: false };
              return (
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <img src={other.avatar} alt={other.name} className="h-10 w-10 rounded-xl" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{other.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <Dot color={other.online ? "bg-green-500" : "bg-gray-400"} />{" "}
                        {other.online ? "Đang hoạt động" : "Ngoại tuyến"} • {activeThread.messages.length} tin
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePin(activeThread.id)}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      title={activeThread.pinned ? "Bỏ ghim" : "Ghim hội thoại"}
                    >
                      <StarIcon className={`h-5 w-5 ${activeThread.pinned ? "text-yellow-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => toggleMute(activeThread.id)}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      title={activeThread.muted ? "Bật thông báo" : "Tắt thông báo"}
                    >
                      <BellSlashIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteThread(activeThread.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Xóa hội thoại"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      title="Tùy chọn"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* body */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {activeThread.messages.map((m, idx) => {
                const isMe = m.sender === "me";
                const prev = activeThread.messages[idx - 1];
                const showName = !prev || prev.sender !== m.sender;
                const contact = isMe ? { name: "Tôi", avatar: avatarUrl("me") } : pickContactById(m.sender) || {};
                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`flex max-w-[80%] items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      {showName && (
                        <img src={contact.avatar} alt={contact.name} className="h-8 w-8 rounded-lg" />
                      )}
                      <div>
                        {showName && (
                          <p className={`mb-1 text-xs ${isMe ? "text-right" : ""} text-gray-500 dark:text-gray-400`}>
                            {isMe ? "Bạn" : contact.name}
                          </p>
                        )}
                        <div
                          className={`whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow ${
                            isMe
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                          }`}
                        >
                          {m.text}
                          {m.attachments?.length > 0 && (
                            <div className={`mt-2 space-y-1 ${isMe ? "text-white/90" : "text-gray-800"}`}>
                              {m.attachments.map((f) => (
                                <div
                                  key={f.name}
                                  className={`flex items-center gap-2 rounded-lg ${
                                    isMe ? "bg-white/20" : "bg-white/80"
                                  } px-2 py-1 text-xs`}
                                >
                                  📎 {f.name}{" "}
                                  <span className="opacity-60">({(f.size / 1024).toFixed(0)} KB)</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className={`mt-1 text-[11px] ${isMe ? "text-right" : ""} text-gray-500 dark:text-gray-400`}>
                          {fmtTime(m.at)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* composer */}
            <div className="border-t border-gray-200 p-3 dark:border-gray-700">
              {attachQueue.length > 0 && (
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {attachQueue.map((f) => (
                    <span
                      key={f.name}
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    >
                      📎 {f.name}
                      <button onClick={() => removeQueued(f.name)} className="rounded p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <label className="flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <PaperClipIcon className="h-5 w-5" />
                  <input type="file" className="hidden" multiple onChange={onAttach} />
                </label>
                <textarea
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Nhập tin nhắn… (Enter để gửi, Shift+Enter xuống dòng)"
                  className="max-h-32 flex-1 resize-none rounded-xl border border-gray-300 bg-white p-2 text-sm leading-6 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => {
                    sendMessage(draft);
                    setDraft("");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                  disabled={!draft.trim() && attachQueue.length === 0}
                >
                  <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
                  Gửi
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* New conversation modal */}
      {isNewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Cuộc trò chuyện mới</h3>
              <button onClick={() => setIsNewOpen(false)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setNewTarget(c.id);
                    openThreadWith(c.id);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <img src={c.avatar} alt={c.name} className="h-10 w-10 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-white">{c.name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{c.role}</p>
                  </div>
                  {c.online ? <Dot /> : <Dot color="bg-gray-400" />}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
              <button onClick={() => setIsNewOpen(false)} className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
