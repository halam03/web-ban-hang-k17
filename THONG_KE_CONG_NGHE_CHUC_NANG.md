# Thống kê công nghệ và chức năng (theo feature)

Tài liệu này tổng hợp công nghệ và chức năng hiện có trong project, dựa trên mã nguồn ở backend (Laravel) và frontend (React).

Nguồn chính: `composer.json`, `package.json`, `routes/web.php`, `app/Http/Controllers/Api/*`, `app/Http/Middleware/EnsureAdmin.php`, `resources/js/*`, `resources/views/app.blade.php`, `database/migrations/*`.

## Công nghệ

- Backend: PHP `^8.1`, Laravel `^10.10`, Eloquent ORM, Validation, Session-based auth, CSRF.
- Backend packages: `laravel/sanctum`, `guzzlehttp/guzzle`, `laravel/tinker`.
- Frontend: React `18`, React Router DOM `6`, Axios, Context API (Auth/Cart).
- Build/Tooling: Laravel Mix, Babel preset React, PostCSS, Autoprefixer.
- UI/Assets: Bootstrap 4 (JS bundle), jQuery, Font Awesome, OwlCarousel, Animate.css, custom CSS `resources/css/app.css`, theme assets `/assets/Camera/*`.
- Database: bảng nghiệp vụ `t_user`, `t_khach_hang`, `t_danh_muc_sp`, `t_anh_sp`, `t_loai_sp`, `t_loai_dt`, `t_hang_sx`, `t_chat_lieu`, `t_quoc_gia`, `t_hoa_don_ban`, `t_chi_tiet_hdb`.

## Chức năng theo feature

### Auth

- API: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- Logic: validate email/password + thông tin khách hàng, tạo `UserAccount` + `KhachHang`, lưu session `username` + `loai_user`, middleware admin chỉ cho `loai_user = 0`.
- UI: trang đăng nhập/đăng ký, redirect theo role (admin vào `/admin`).

### Product

- API: `GET /api/products` (search, filter brand/category/type/price_ranges, pagination), `GET /api/products/{maSp}`.
- UI: Home hiển thị danh mục + sản phẩm nổi bật, Shop filter theo danh mục/giá + phân trang, Product Detail hiển thị ảnh + thông tin + add to cart.

### Brand

- API: `GET /api/brands`, `GET /api/brands/{maHangSx}/products`.

### Meta (Danh mục/Loại/Chất liệu/Xuất xứ)

- API: `GET /api/meta/categories`, `GET /api/meta/types`, `GET /api/meta/materials`, `GET /api/meta/countries`.
- UI: dùng cho filter danh mục trên Home/Shop/Admin.

### Cart

- Logic (frontend): lưu giỏ hàng bằng `localStorage` (`resources/js/store/cart.js`), thêm sản phẩm, cập nhật số lượng, tính tổng tiền.
- UI: trang giỏ hàng, tăng/giảm số lượng, tổng tiền, xóa giỏ.

### Checkout / Order

- API: `POST /api/orders` tạo hóa đơn và chi tiết hóa đơn, tự tạo khách hàng nếu chưa đăng nhập.
- UI: form thông tin khách hàng + ghi chú, tổng hợp phí (có cộng phí vận chuyển cố định 10.000 VND).

### Admin

- Quyền: middleware `admin` (session `loai_user = 0`).
- Quản lý sản phẩm: CRUD `GET/POST/PUT/DELETE /api/admin/products`, upload ảnh đại diện + ảnh chi tiết (multi-file).
- Quản lý danh mục: CRUD `GET/POST/PUT/DELETE /api/admin/categories`, chặn xóa nếu còn sản phẩm.
- Quản lý đơn hàng: danh sách, chi tiết, cập nhật, xóa; thống kê doanh thu theo tháng và theo khoảng.
- Quản lý người dùng: CRUD `GET/POST/PUT/DELETE /api/admin/users`, không cho xóa tài khoản đang đăng nhập.
- UI: dashboard admin có thống kê doanh thu/đơn hàng + biểu đồ theo thời gian, form CRUD cho sản phẩm/danh mục/đơn hàng/người dùng.

---
