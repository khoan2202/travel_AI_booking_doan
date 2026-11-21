// Chạy TRƯỚC khi trang hiển thị để không bị "nháy trắng" khi đang dùng chế độ tối.
// Ưu tiên lựa chọn đã lưu; chưa chọn thì theo cài đặt sáng/tối của hệ điều hành.
// Để file riêng (không viết inline trong index.html) vì CSP production chỉ cho chạy script cùng domain.
(function () {
  var theme = null;
  try { theme = localStorage.getItem("travel.theme"); } catch { /* trình duyệt chặn lưu trữ */ }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
})();
