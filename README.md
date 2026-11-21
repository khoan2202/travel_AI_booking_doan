<div align="center">

# 🌿 Travel Mint

**Website đặt tour du lịch trong nước, có trợ lý AI tư vấn chuyến đi.**

Đồ án môn học · Xem tour · Đặt chỗ · Tư vấn AI · Trang quản trị

[![Live demo](https://img.shields.io/badge/Live%20demo-travel.trizportal.com-2ea44f?style=for-the-badge)](https://travel.trizportal.com/)
[![API docs](https://img.shields.io/badge/API%20docs-Swagger-85ea2d?style=for-the-badge&logo=swagger&logoColor=black)](https://travel.trizportal.com/api-docs)

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169e1?logo=postgresql&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-f38020?logo=cloudflare&logoColor=white)
![Gemini](https://img.shields.io/badge/Google-Gemini-4285f4?logo=googlegemini&logoColor=white)

**🔗 Truy cập: <https://travel.trizportal.com/>**

<br />

<a href="https://travel.trizportal.com/"><img src="docs/screenshots/home-light.jpg" alt="Trang chủ Travel Mint" width="100%" /></a>

</div>

---

## 📸 Giao diện

### 🧭 Chưa biết đi đâu? Trả lời 5 câu hỏi

Khách chọn đi cùng ai, sở thích, số ngày, ngân sách và khu vực. Hệ thống chấm điểm các tour còn chỗ và xếp hạng theo mức phù hợp.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/quiz-question.jpg" alt="Câu hỏi chọn tour" /></td>
    <td width="50%"><img src="docs/screenshots/quiz-result-light.jpg" alt="Kết quả gợi ý tour" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Từng câu hỏi với thanh tiến độ</sub></td>
    <td align="center"><sub>Tour hợp nhất kèm % phù hợp</sub></td>
  </tr>
</table>

### 🌗 Chế độ sáng / tối

Một nút trên thanh điều hướng, ghi nhớ lựa chọn, mặc định theo cài đặt của máy.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/quiz-result-light.jpg" alt="Giao diện sáng" /></td>
    <td width="50%"><img src="docs/screenshots/quiz-result-dark.jpg" alt="Giao diện tối" /></td>
  </tr>
  <tr>
    <td align="center"><sub>☀️ Sáng</sub></td>
    <td align="center"><sub>🌙 Tối</sub></td>
  </tr>
</table>

### 🗺️ Khám phá và đặt tour

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/tours.jpg" alt="Danh sách tour có bộ lọc" /></td>
    <td width="50%"><img src="docs/screenshots/tour-detail.jpg" alt="Chi tiết tour và chọn lịch khởi hành" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Danh sách tour, lọc theo điểm đến, khu vực, ngân sách</sub></td>
    <td align="center"><sub>Chi tiết tour, bộ sưu tập ảnh, chọn lịch còn chỗ</sub></td>
  </tr>
</table>

### ✦ Tư vấn AI và hỗ trợ

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/ai-dark.jpg" alt="Trang tư vấn AI" /></td>
    <td width="50%"><img src="docs/screenshots/contact-dark.jpg" alt="Trang liên hệ và hỗ trợ" /></td>
  </tr>
  <tr>
    <td align="center"><sub>Lọc tour và chat với trợ lý Gemini</sub></td>
    <td align="center"><sub>Gửi yêu cầu hỗ trợ, gắn với đơn đã đặt</sub></td>
  </tr>
</table>

### 📱 Trên điện thoại

<p align="center">
  <img src="docs/screenshots/mobile-quiz-light.jpg" alt="Quiz trên điện thoại, giao diện sáng" width="260" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/mobile-quiz-dark.jpg" alt="Quiz trên điện thoại, giao diện tối" width="260" />
</p>

---

## ✨ Tính năng

### Dành cho khách
- **Khám phá tour**: trang chủ có banner tự chạy, danh sách điểm đến, bộ sưu tập ảnh, hiệu ứng chuyển động.
- **Gợi ý nhanh (quiz)**: chưa biết đi đâu thì trả lời 5 câu hỏi, hệ thống chấm điểm tour theo sở thích; không có tour khớp thì tự nới số ngày, ngân sách, khu vực.
- **Chế độ sáng / tối**: đổi bằng một nút, ghi nhớ lựa chọn, không bị nháy trắng khi tải trang.
- **Chi tiết tour**: mô tả hành trình, chọn lịch khởi hành còn chỗ, xem giá theo từng đợt.
- **Đặt tour**: chọn lịch, số khách, nhập thông tin liên hệ; giá luôn lấy từ database, không tin dữ liệu từ trình duyệt.
- **Đơn của tôi**: xem danh sách, chi tiết và tự hủy đơn chưa thanh toán trước ngày đi.
- **Tư vấn AI**: lọc tour theo ngân sách, số ngày, số khách, khu vực, sở thích; chat với trợ lý Gemini để so sánh tour.
- **Liên hệ & hỗ trợ**: gửi yêu cầu hỗ trợ, có thể gắn với một đơn đã đặt.
- **Tài khoản**: đăng ký, đăng nhập, phiên đăng nhập lưu trong PostgreSQL.

### Dành cho quản trị viên
- **Dashboard**: tổng quan người dùng, tour đang bán, đơn, doanh thu đã nhận.
- **Quản lý tour**: tạo/sửa tour, điểm đến, lịch khởi hành, sức chứa, giá.
- **Quản lý đơn**: ghi nhận thanh toán, hủy đơn, hoàn tiền thủ công, kèm mã đối soát và nhật ký thao tác (audit log).

---

## 🛡️ Điểm nhấn kỹ thuật

| Vấn đề | Cách xử lý |
| --- | --- |
| Bán quá số chỗ | Khóa dòng `FOR UPDATE` trong transaction khi đặt và hủy; có ràng buộc `CHECK` ở database |
| Khách bấm đặt hai lần | `request_key` (UUID) cho mỗi lần đặt; gửi lại cùng mã thì trả đơn cũ, không tạo đơn mới |
| Giá bị thay đổi giữa chừng | Gửi kèm `expected_unit_price`, server báo `PRICE_CHANGED` nếu giá đã đổi |
| CSRF | Token theo phiên, so sánh bằng `timingSafeEqual`, kiểm tra thêm `Origin` |
| Dò mật khẩu / spam | Giới hạn tần suất (`express-rate-limit`) cho đăng nhập, đăng ký, đặt tour, hỗ trợ, chat AI |
| Lộ tài khoản qua thời gian phản hồi | Luôn chạy `bcrypt.compare` kể cả khi email không tồn tại |
| AI bịa tour | Danh sách tour lọc từ SQL trước, Gemini chỉ được chọn trong danh sách đó; kết quả được kiểm tra lại; lỗi thì tự quay về gợi ý từ database |
| Bảo mật trình duyệt | Cookie `httpOnly`, header `nosniff`, `X-Frame-Options`, CSP và HSTS trên production |

---

## 🧰 Công nghệ

| Lớp | Công nghệ |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 8 |
| Backend | Node.js 24, Express 5, `express-session` + `connect-pg-simple` |
| Database | PostgreSQL ([Neon](https://neon.tech)) |
| AI | Google Gemini (qua API phía server, key không lộ ra trình duyệt) |
| Triển khai | Cloudflare Workers + Hyperdrive, phục vụ giao diện và API cùng một domain |
| Tài liệu API | OpenAPI 3 + Swagger UI tại `/api-docs` |

---

## 📁 Cấu trúc thư mục

```
travel_AI_booking_doan/
├── client/                  # Giao diện React
│   └── src/
│       ├── pages/           # Các trang (Home, TourDetail, Booking, Admin...)
│       ├── components/      # Header, Footer, TourCard, Gallery...
│       ├── services/        # Hàm gọi API
│       ├── hooks/           # useRequest: tải dữ liệu dùng chung
│       └── styles/          # CSS theo từng nhóm trang (theme.css: chế độ tối)
├── docs/screenshots/        # Ảnh giao diện dùng trong README
└── server/                  # API Express
    ├── src/
    │   ├── routes/          # Khai báo đường dẫn API
    │   ├── controllers/     # Xử lý request
    │   ├── services/        # Nghiệp vụ đặt tour, gợi ý, tư vấn AI
    │   ├── middleware/      # Đăng nhập, CSRF, bảo mật
    │   ├── db/              # Pool kết nối và transaction
    │   ├── docs/            # OpenAPI / Swagger
    │   ├── app.js           # Dựng ứng dụng Express
    │   ├── server.js        # Chạy local (Node)
    │   └── worker.js        # Điểm vào Cloudflare Worker
    └── sql/                 # Schema và dữ liệu mẫu
```

---

## 🚀 Chạy trên máy

### Yêu cầu
- Node.js **24** (xem `.node-version`)
- Một database PostgreSQL (PostgreSQL cài sẵn hoặc project miễn phí trên [Neon](https://neon.tech))

### 1. Tải mã nguồn
```bash
git clone https://github.com/khoan2202/travel_AI_booking_doan.git
cd travel_AI_booking_doan
```

### 2. Tạo database
Chạy lần lượt trong SQL Editor (hoặc `psql`) trên một database **trống**:

```text
server/sql/deploy/001_FRESH_DATABASE_ONLY.sql    # tạo toàn bộ bảng
server/sql/deploy/002_OPTIONAL_DEMO_DATA.sql     # dữ liệu mẫu (tùy chọn)
```

### 3. Cấu hình backend
Tạo file `server/.env` (xem thêm `server/.env.example`):

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Cách 1: một chuỗi kết nối (khuyên dùng với Neon, dùng chuỗi KHÔNG qua pooler)
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
DATABASE_SSL=true

# Cách 2: khai báo riêng từng thông tin
# PGHOST=localhost
# PGPORT=5432
# PGDATABASE=travel_ai_booking
# PGUSER=travel_app
# PGPASSWORD=...

# Chuỗi ngẫu nhiên, ít nhất 32 ký tự
SESSION_SECRET=

# Tùy chọn: để trống thì vẫn có gợi ý từ database, chỉ chưa có chat AI
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash-lite
```

Tạo `SESSION_SECRET` nhanh:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 4. Chạy backend và frontend
```bash
# Terminal 1: API tại http://localhost:5000
cd server
npm install
npm run dev

# Terminal 2: giao diện tại http://localhost:5173
cd client
npm install
npm run dev
```

Mở <http://localhost:5173>. Tài liệu API: <http://localhost:5000/api-docs>.

### Tạo tài khoản admin
Đăng ký một tài khoản trên website, sau đó nâng quyền trong database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'email-cua-ban@example.com';
```

---

## ☁️ Triển khai lên Cloudflare

Ứng dụng chạy như một Worker, phục vụ cả giao diện (`client/dist`) lẫn API `/api/*` trên cùng một domain, kết nối Neon qua Hyperdrive.

```bash
cd server
cp wrangler.example.jsonc wrangler.jsonc    # điền domain và Hyperdrive ID
npm run cf:release                           # build giao diện rồi deploy
```

Chi tiết các bước tạo Hyperdrive và secret xem [`server/CLOUDFLARE_SETUP.md`](server/CLOUDFLARE_SETUP.md).

---

## 🧪 Kiểm tra chất lượng mã

```bash
cd client
npm run lint     # ESLint
npm run build    # build bản production
```

---

## 🔌 Một số API chính

| Method | Đường dẫn | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/api/tours` | Danh sách tour còn lịch đi | Công khai |
| `GET` | `/api/tours/:id/departures` | Lịch khởi hành còn chỗ | Công khai |
| `GET` | `/api/recommendations` | Gợi ý tour theo bộ lọc | Công khai |
| `GET` | `/api/recommendations/quiz` | Chọn tour bằng câu hỏi, chấm điểm theo sở thích | Công khai |
| `POST` | `/api/recommendations/consult` | Chat tư vấn AI | Đăng nhập |
| `POST` | `/api/bookings` | Tạo đơn đặt tour | Đăng nhập |
| `POST` | `/api/bookings/:id/cancel` | Hủy đơn | Đăng nhập |
| `POST` | `/api/support` | Gửi yêu cầu hỗ trợ | Công khai |
| `GET` | `/api/admin/overview` | Số liệu tổng quan | Admin |
| `POST` | `/api/admin/bookings/:id/action` | Ghi nhận thanh toán / hủy / hoàn tiền | Admin |

Danh sách đầy đủ có tại [Swagger UI](https://travel.trizportal.com/api-docs).

---

## 👥 Nhóm thực hiện

| Thành viên | GitHub |
| --- | --- |
| Khoan | [@khoan2202](https://github.com/khoan2202) |
| Hùng | [@hungdz](https://github.com/hungdz) |

---

<div align="center">

Đồ án môn học · Made with ☕ tại Việt Nam

</div>
