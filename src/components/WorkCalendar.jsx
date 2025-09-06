import React, { useEffect, useMemo, useState } from "react";
import {
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  TrashIcon,
  PencilSquareIcon,
  CalendarIcon as CalIcon,
} from "@heroicons/react/24/outline";

// ====== cấu hình & helpers ======
const STORAGE_KEY = "axon_calendar_events";

const TYPE_OPTIONS = [
  { value: "meeting", label: "Meeting", color: "bg-blue-500" },
  { value: "deadline", label: "Deadline", color: "bg-red-500" },
  { value: "task", label: "Task", color: "bg-purple-500" },
  { value: "leave", label: "Nghỉ phép", color: "bg-amber-500" },
  { value: "other", label: "Khác", color: "bg-slate-500" },
];

const toYYYYMMDD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const isSameDay = (a, b) => toYYYYMMDD(a) === toYYYYMMDD(b);
const viDate = (d) =>
  d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });

// ngày bắt đầu tuần là Thứ 2
const startOfWeekMon = (date) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 = Mon ... 6 = Sun
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

// tạo 6 tuần (42 ô) cho tháng
const buildMonthGrid = (year, month /* 0-11 */) => {
  const first = new Date(year, month, 1);
  const gridStart = startOfWeekMon(first);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
};

const colorByType = (type) =>
  TYPE_OPTIONS.find((t) => t.value === type)?.color || "bg-slate-500";

const sampleEvents = [
  {
    id: "e1",
    title: "Họp sprint",
    date: toYYYYMMDD(new Date()),
    startTime: "10:00",
    endTime: "11:00",
    type: "meeting",
    location: "Phòng A",
    attendees: "Team FE",
    description: "Planning sprint tuần này",
  },
  {
    id: "e2",
    title: "Chốt UI trang Finance",
    date: toYYYYMMDD(new Date(new Date().setDate(new Date().getDate() + 2))),
    startTime: "16:00",
    endTime: "17:00",
    type: "deadline",
    location: "Figma",
    attendees: "PM, Designer",
    description: "Finalize layout & states",
  },
  {
    id: "e3",
    title: "Nghỉ phép",
    date: toYYYYMMDD(new Date(new Date().setDate(new Date().getDate() + 3))),
    startTime: "00:00",
    endTime: "23:59",
    type: "leave",
    location: "",
    attendees: "",
    description: "Nghỉ 1 ngày",
  },
];

// ====== Modal ======
const EventModal = ({ open, onClose, initial, onSubmit, onDelete }) => {
  const [form, setForm] = useState(
    initial || {
      title: "",
      date: toYYYYMMDD(new Date()),
      startTime: "09:00",
      endTime: "10:00",
      type: "meeting",
      location: "",
      attendees: "",
      description: "",
    }
  );

  useEffect(() => {
    if (open) setForm(initial || { ...form, date: form.date }); // keep date if creating by day click
    // eslint-disable-next-line
  }, [open, initial]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title?.trim()) return;
    onSubmit({
      ...form,
      id: initial?.id || crypto.randomUUID(),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {initial ? "Chỉnh sửa sự kiện" : "Thêm sự kiện"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Tiêu đề</label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Ngày</label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
                value={form.date}
                onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Loại</label>
              <select
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
                value={form.type}
                onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Bắt đầu</label>
              <input
                type="time"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
                value={form.startTime}
                onChange={(e) => setForm((s) => ({ ...s, startTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Kết thúc</label>
              <input
                type="time"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
                value={form.endTime}
                onChange={(e) => setForm((s) => ({ ...s, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Địa điểm</label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
                value={form.location}
                onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Thành viên</label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
                placeholder="VD: PM, FE, BE"
                value={form.attendees}
                onChange={(e) => setForm((s) => ({ ...s, attendees: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Mô tả</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 dark:bg-gray-700 dark:text-white"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {initial ? (
              <button
                type="button"
                onClick={() => onDelete(initial.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <TrashIcon className="w-5 h-5" />
                Xóa
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ====== trang lịch ======
export default function WorkCalendar({ events: propEvents }) {
  // init: localStorage -> props (nếu có) -> sample
  const [events, setEvents] = useState(() => {
    const fromLS = localStorage.getItem(STORAGE_KEY);
    if (fromLS) {
      try {
        const parsed = JSON.parse(fromLS);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    if (Array.isArray(propEvents) && propEvents.length) return propEvents;
    return sampleEvents;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth(); // 0..11
  const days = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const goPrev = () => setCursor(new Date(year, month - 1, 1));
  const goNext = () => setCursor(new Date(year, month + 1, 1));
  const goToday = () => setCursor(new Date(today.getFullYear(), today.getMonth(), 1));

  const openNewOn = (dateStr) => {
    setEditing({
      title: "",
      date: dateStr,
      startTime: "09:00",
      endTime: "10:00",
      type: "meeting",
      location: "",
      attendees: "",
      description: "",
    });
    setModalOpen(true);
  };

  const openEdit = (ev) => {
    setEditing(ev);
    setModalOpen(true);
  };

  const saveEvent = (ev) => {
    setEvents((prev) => {
      const existed = prev.some((x) => x.id === ev.id);
      return existed ? prev.map((x) => (x.id === ev.id ? ev : x)) : [...prev, ev];
    });
    setModalOpen(false);
    setEditing(null);
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((x) => x.id !== id));
    setModalOpen(false);
    setEditing(null);
  };

  // lọc nhanh theo query
  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.attendees?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q)
    );
  }, [events, query]);

  const eventsByDay = useMemo(() => {
    const map = {};
    filteredEvents.forEach((e) => {
      map[e.date] = map[e.date] || [];
      map[e.date].push(e);
    });
    // sort by startTime
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
    );
    return map;
  }, [filteredEvents]);

  const upcoming = useMemo(() => {
    const nowStr = toYYYYMMDD(today);
    return filteredEvents
      .filter((e) => e.date >= nowStr)
      .sort((a, b) => (a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)))
      .slice(0, 8);
  }, [filteredEvents]);

  // xuất ICS toàn bộ
  const exportICS = () => {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Axon Admin//Calendar//VI",
    ];
    filteredEvents.forEach((e) => {
      const dt = e.date.replace(/-/g, "");
      const st = (e.startTime || "00:00").replace(":", "") + "00";
      const et = (e.endTime || "00:00").replace(":", "") + "00";
      lines.push(
        "BEGIN:VEVENT",
        `UID:${e.id}@axon-admin`,
        `DTSTAMP:${dt}T${st}Z`,
        `DTSTART:${dt}T${st}Z`,
        `DTEND:${dt}T${et}Z`,
        `SUMMARY:${e.title}`,
        `DESCRIPTION:${(e.description || "").replace(/\n/g, "\\n")}`,
        `LOCATION:${e.location || ""}`,
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "axon_calendar.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <CalIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lịch làm việc</h1>
              <p className="text-blue-100">Tổ chức sự kiện, cuộc họp và deadline của bạn</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={goPrev} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="px-3 py-1.5 rounded-lg bg-white/10">
              {cursor.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
            </div>
            <button onClick={goNext} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button onClick={goToday} className="ml-2 px-3 py-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50">
              Hôm nay
            </button>
            <button
              onClick={exportICS}
              className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50"
              title="Xuất tất cả sự kiện ra .ics"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Xuất .ics
            </button>
          </div>
        </div>

        {/* search + add */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 text-white/70 absolute left-3 top-2.5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tiêu đề, địa điểm hoặc thành viên..."
              className="w-full bg-white/10 placeholder-white/60 text-white rounded-lg pl-10 pr-3 py-2 border border-white/20 focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-700 hover:bg-blue-50"
          >
            <PlusIcon className="w-5 h-5" />
            Thêm sự kiện
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* weekdays */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
            {["T2","T3","T4","T5","T6","T7","CN"].map((w) => (
              <div key={w} className="px-3 py-2">{w}</div>
            ))}
          </div>

          {/* days */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
            {days.map((d, idx) => {
              const isCurrentMonth = d.getMonth() === month;
              const isToday = isSameDay(d, new Date());
              const dayStr = toYYYYMMDD(d);
              const dayEvents = eventsByDay[dayStr] || [];

              return (
                <div key={idx} className="bg-white dark:bg-gray-800 min-h-[110px] p-2 flex flex-col">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openNewOn(dayStr)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 ${
                        isToday
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300"
                      } ${!isCurrentMonth ? "opacity-50" : ""}`}
                      title={`Thêm sự kiện ngày ${viDate(d)}`}
                    >
                      {d.getDate()}
                    </button>
                  </div>

                  <div className="mt-1 space-y-1 overflow-auto">
                    {dayEvents.slice(0, 3).map((e) => (
                      <button
                        key={e.id}
                        onClick={() => openEdit(e)}
                        className={`group w-full text-left text-xs rounded-lg px-2 py-1 text-white ${colorByType(
                          e.type
                        )} hover:opacity-90 transition`}
                        title={`${e.title} (${e.startTime} - ${e.endTime})`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{e.title}</span>
                          <span className="ml-2 opacity-90">{e.startTime}</span>
                        </div>
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">+{dayEvents.length - 3} sự kiện</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sắp diễn ra</h3>
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {upcoming.map((e) => (
              <div
                key={e.id}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${colorByType(e.type)}`} />
                      <p className="font-medium text-gray-900 dark:text-white">{e.title}</p>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>
                        {viDate(new Date(e.date))} • {e.startTime} - {e.endTime}
                      </span>
                    </div>
                    {e.location && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{e.location}</span>
                      </div>
                    )}
                    {e.attendees && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" />
                        <span>{e.attendees}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(e)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      title="Chỉnh sửa"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteEvent(e.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                      title="Xóa"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {e.description && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{e.description}</p>
                )}
              </div>
            ))}
            {upcoming.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400">Không có sự kiện nào sắp diễn ra.</div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phân loại</h4>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((t) => (
                <span key={t.value} className="inline-flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <span className={`w-3 h-3 rounded-full ${t.color}`} />
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EventModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={saveEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
}
