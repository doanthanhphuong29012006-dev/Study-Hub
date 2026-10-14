# StudyHub Frontend

Frontend React + TypeScript cho backend StudyHub hiện có. Mọi request API dùng cookie HttpOnly (`credentials: include`) và không lưu JWT trong JavaScript.

## Cấu hình

Sao chép `.env.example` thành `.env` và đặt:

```env
VITE_API_BASE_URL=http://localhost:1234
VITE_ADMIN_PATH=admin
```

`VITE_ADMIN_PATH` phải khớp chính xác với `ROUTE_ADMIN` của backend. Backend hiện chỉ cho phép origin local `http://localhost:5173`, vì vậy dev server dùng cố định cổng 5173.

## Lệnh chạy

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run test
npm run build
```

## Phạm vi chức năng

- Khám phá, tìm kiếm, lọc và sắp xếp tài liệu.
- Đăng ký, đăng nhập, đăng xuất và khôi phục phiên bằng cookie.
- Hồ sơ, upload tài liệu, tài liệu đã đăng và đã lưu.
- Chi tiết, tải xuống, lưu/bỏ lưu, sửa/xóa tài liệu và CRUD đánh giá.
- Quản trị danh mục, người dùng, tài liệu và đánh giá.

## Lưu ý backend

- Cookie development đang dùng `SameSite=None` với `Secure=false`; một số trình duyệt sẽ từ chối cookie này.
- CORS dùng danh sách origin cố định trong backend.
- Prefix admin phụ thuộc `ROUTE_ADMIN` và không có fallback.
- Lỗi Multer (ví dụ tệp quá 10 MB) chưa có error middleware trả JSON; frontend chủ động chặn tệp vượt giới hạn.
- Một số PATCH không có validation backend và UUID/query phân trang sai có thể trả 500.
- `GET /documents/:id` tăng lượt xem, vì vậy frontend chỉ gọi một lần khi mở trang chi tiết.
