// src/utils/auth.js
const USERS_KEY = "axon_users";
const CURRENT_KEY = "axon_current_user";

const readUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};
const writeUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));
const readCurrent = () => {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeCurrent = (u) => localStorage.setItem(CURRENT_KEY, JSON.stringify(u));

export function getUser() {
  return readCurrent();
}
export function isAuthenticated() {
  return !!readCurrent();
}
export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function signup({ name, email, password, avatar }) {
  name = name?.trim();
  email = email?.trim().toLowerCase();
  if (!name || !email || !password) return { ok: false, error: "Thiếu thông tin" };

  const users = readUsers();
  if (users.some((u) => u.email === email)) return { ok: false, error: "Email đã tồn tại" };

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    password, // demo only
    role: "Administrator",
    avatar:
      avatar ||
      `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name || "User")}`,
    preferences: {
      darkMode: JSON.parse(localStorage.getItem("darkMode") || "false"),
      notifications: { email: true, push: true, weeklyDigest: true },
    },
  };

  users.push(user);
  writeUsers(users);
  writeCurrent(user);
  return { ok: true, user };
}

export function login(email, password) {
  email = email?.trim().toLowerCase();
  const users = readUsers();
  const found = users.find((u) => u.email === email);
  if (!found) return { ok: false, error: "Không tìm thấy tài khoản" };
  if (found.password !== password) return { ok: false, error: "Mật khẩu không đúng" };
  writeCurrent(found);
  return { ok: true, user: found };
}

export function updateUser(updates) {
  const cur = readCurrent();
  if (!cur) return { ok: false, error: "Chưa đăng nhập" };
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === cur.id);
  if (idx === -1) return { ok: false, error: "Không tìm thấy người dùng" };

  const newUser = { ...cur, ...updates, preferences: { ...cur.preferences, ...updates?.preferences } };
  users[idx] = newUser;
  writeUsers(users);
  writeCurrent(newUser);
  return { ok: true, user: newUser };
}

export function changePassword(oldPass, newPass) {
  const cur = readCurrent();
  if (!cur) return { ok: false, error: "Chưa đăng nhập" };
  if (cur.password !== oldPass) return { ok: false, error: "Mật khẩu cũ không đúng" };

  const users = readUsers();
  const idx = users.findIndex((u) => u.id === cur.id);
  users[idx] = { ...users[idx], password: newPass };
  writeUsers(users);
  writeCurrent(users[idx]);
  return { ok: true };
}
