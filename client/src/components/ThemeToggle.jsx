// Nút đổi chế độ sáng / tối, đặt trên thanh điều hướng.
// Chế độ hiện tại nằm ở <html data-theme="..."> (đặt sẵn bởi public/theme-init.js trước khi trang hiển thị).
// Bấm nút thì đổi chế độ và lưu vào localStorage để lần sau mở lại vẫn giữ.
import { useState } from "react";

const STORAGE_KEY = "travel.theme";

function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);
  const isDark = theme === "dark";

  function toggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Không lưu được thì vẫn đổi cho phiên hiện tại. */ }
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={isDark ? "Giao diện sáng" : "Giao diện tối"}
    >
      <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
