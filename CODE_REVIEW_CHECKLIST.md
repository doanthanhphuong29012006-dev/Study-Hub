# Backend code review checklist

Checklist này tổng hợp các mục còn cần xử lý sau khi đối chiếu mã nguồn backend tại commit `963a297`. Các ô `[ ]` có thể đổi thành `[x]` khi hoàn thành.

## Ưu tiên cao

- [ ] **Rà soát quyền với tài liệu pending/rejected** — `src/repositories/document.repository.ts`, `src/repositories/saved-document.repository.ts`, `src/repositories/review.repository.ts`
  - Cần sửa: hiện download không lọc trạng thái; saved-document trả `d.*` gồm `file_url`; save và create-review chưa xác nhận document đã approved. Chốt ma trận quyền trước, rồi dùng cùng điều kiện ở truy vấn lấy dữ liệu và truy vấn đếm.
  - [ ] Quy định và áp dụng quyền xem/tải cho người dùng, chủ tài liệu và admin.
  - [ ] Chỉ cấp URL tải sau khi xác nhận trạng thái và quyền; ưu tiên URL ký có hạn dùng nếu file cần được bảo vệ.
  - [ ] Saved-document không trả URL hoặc nội dung nhạy cảm của tài liệu không còn khả dụng.
  - [ ] Chỉ cho lưu/tạo review khi tài liệu đủ điều kiện; kiểm tra cả trường hợp document không tồn tại.
  - [ ] Đảm bảo query danh sách và query `COUNT` có cùng điều kiện lọc.

- [ ] **Cho chủ tài liệu và admin xem tài liệu chưa duyệt** — `src/repositories/document.repository.ts`
  - Cần sửa: `findDocumentById` hiện chỉ truy vấn `status = approved`, vì vậy pending/rejected bị coi như không tồn tại với cả chủ tài liệu và admin. Hàm cũng tăng view trong cùng truy vấn lấy chi tiết.
  - [ ] Truyền actor đã xác thực (ID và role từ middleware) vào service/repository; không lấy role từ body/query.
  - [ ] Cho chủ sở hữu xem tài liệu của họ và admin xem tài liệu để kiểm duyệt; người dùng khác chỉ xem tài liệu approved.
  - [ ] Trả 404 nếu không tồn tại và 403/404 theo chính sách nếu tồn tại nhưng actor không có quyền.
  - [ ] Tách việc tăng `view_count`; không tính lượt xem kiểm duyệt/chỉnh sửa nếu chính sách không muốn tính.

- [ ] **Sửa luồng PATCH tài liệu** — `src/repositories/document.repository.ts`, `src/routes/document.route.ts`, `src/validations`
  - Cần sửa: repository thêm `status = pending` vào mọi PATCH trước khi biết có trường nào được gửi; route PATCH hiện chưa gắn validator. Vì vậy body rỗng vẫn có thể đổi trạng thái.
  - [ ] Tạo schema Joi chỉ nhận `title`, `description`, `categoryId`; từ chối body rỗng, trường thừa và giá trị sai định dạng.
  - [ ] Chuyển trạng thái về pending chỉ khi có thay đổi thật ở trường cần kiểm duyệt; PATCH rỗng không chạy UPDATE.
  - [ ] Quy định quyền và trạng thái sau khi admin chỉnh sửa.
  - [ ] Dùng `RETURNING status` (hoặc cách tương đương) và trả trạng thái mới về frontend.

- [ ] **Bảo vệ luồng upload** — `src/middlewares/upload.middleware.ts`, `src/routes/document.route.ts`, `src/routes/user.route.ts`
  - Cần sửa: một middleware dùng chung cho avatar/tài liệu chỉ giới hạn dung lượng; Multer gửi thẳng lên Cloudinary trước khi Joi kiểm tra metadata. Lỗi validation xảy ra sau upload có thể để lại asset mồ côi.
  - [ ] Tạo cấu hình upload avatar riêng (chỉ định dạng ảnh cần hỗ trợ) và document riêng (chỉ các định dạng sản phẩm chấp nhận).
  - [ ] Kiểm tra chữ ký/nội dung file thực tế; không tin riêng `mimetype` hoặc tên file client gửi.
  - [ ] Cấu hình `fileSize`, `files`, `fields`, `parts`, `fieldSize` và trả lỗi upload thành JSON có mã trạng thái phù hợp.
  - [ ] Chọn luồng staging: nhận file tạm → validate metadata/nội dung → upload Cloudinary → ghi DB; khi bước sau thất bại phải dọn asset đã upload.
  - [ ] Xác minh DOCX/PPTX theo cấu trúc cần thiết; kiểm tra file giả ZIP/ZIP hỏng.

- [ ] **Cookie và CSRF** — `src/controllers/auth.controller.ts`, `src/index.ts`, frontend API client
  - Cần sửa: login development đặt `SameSite=Lax`, nhưng logout vẫn clear với `SameSite=None`; production dùng cookie cross-site nhưng chưa thấy CSRF/Origin guard. CORS một mình không đảm bảo server bỏ qua request giả mạo.
  - [ ] Dùng chung các thuộc tính cookie (`httpOnly`, `secure`, `sameSite`, `path`, `domain`) cho set và clear; kiểm thử logout trên trình duyệt.
  - [ ] Với request thay đổi dữ liệu, kiểm tra `Origin` theo allowlist và/hoặc triển khai CSRF token phù hợp kiến trúc.
  - [ ] Nếu dùng CSRF header, thêm tên header vào CORS và gửi header đó từ frontend.
  - [ ] Giữ cookie `HttpOnly`; production chỉ gửi cookie qua HTTPS.

## Ưu tiên tiếp theo

- [ ] **Sửa hạn mức đăng nhập/đăng ký** — `src/middlewares/rate-limit.middleware.ts`, `src/routes/auth.route.ts`
  - Cần sửa: limiter đang gắn đúng route nhưng `skipSuccessfulRequests: true` được cấu hình cho register, khiến đăng ký thành công không bị tính vào hạn mức; login lại tính cả đăng nhập thành công.
  - [ ] Gỡ `skipSuccessfulRequests` khỏi register để mọi lần đăng ký đều tính quota.
  - [ ] Bật bỏ qua request đăng nhập thành công để chỉ các lần sai mật khẩu tiêu hao quota.
  - [ ] Nếu có nhiều instance, cấu hình store dùng chung (ví dụ Redis) để quota không bị tách theo process.
  - [ ] Cân nhắc kết hợp IP và email đã chuẩn hóa; không dùng email thô làm key có thể gây lộ dữ liệu qua log/store.

- [ ] **Giới hạn phân trang thống nhất** — `src/controllers/user.controller.ts`, các controller danh sách khác, `src/helpers/pagination.helper.ts`
  - Cần sửa: `/users/my-documents` còn dùng `parseInt` trực tiếp nên `limit` lớn đi xuống DB; các controller đã giới hạn limit vẫn có thể nhận chuỗi tiền tố số và page cực lớn.
  - [ ] Dùng parser/validator chung; chỉ chấp nhận số nguyên an toàn, `page >= 1`, `1 <= limit <= 100` (hoặc mức sản phẩm chọn).
  - [ ] Đặt giới hạn cho offset/page cực lớn; cân nhắc cursor pagination khi dữ liệu tăng.
  - [ ] Xử lý rõ query thiếu, sai định dạng, số âm, số thập phân và query lặp.
  - [ ] Kiểm tra metadata phân trang không chia cho 0 và trả số nhất quán.

- [ ] **Quản lý vòng đời file Cloudinary** — `src/controllers/user.controller.ts`, `src/controllers/document.controller.ts`, repositories
  - Cần sửa: avatar public ID đang suy từ URL nên có thể thiếu folder; ảnh cũ bị xóa trước khi DB đổi sang ảnh mới. Xóa document xóa DB trước và nếu Cloudinary lỗi thì chỉ log.
  - [ ] Thêm/lưu metadata asset cần thiết (`public_id`, `resource_type`, và delivery type nếu dùng asset private) khi upload.
  - [ ] Khi đổi avatar: upload mới → cập nhật DB → sau khi DB thành công mới xếp lịch xóa asset cũ.
  - [ ] Khi xóa document: giữ public ID trong bản ghi soft-delete hoặc outbox cho tới khi cleanup hoàn thành.
  - [ ] Thêm retry có giới hạn và log trạng thái; thao tác cleanup chạy lại phải an toàn nếu asset đã không còn.

- [ ] **Hoàn thiện validation và xử lý giá trị rỗng** — `src/validations`, `src/repositories/admin/category.repository.ts`
  - Cần sửa: một số PATCH category/profile/document thiếu schema; review rating chấp nhận số thập phân/chuỗi số; update category dùng `description || null` nên không thể chủ động lưu chuỗi rỗng.
  - [ ] Bổ sung Joi schema cho body/params/query còn thiếu; UUID sai phải trả 400 trước khi truy vấn DB.
  - [ ] Nếu rating là số sao nguyên, dùng kiểm tra integer và ràng buộc miền giá trị.
  - [ ] Sau `schema.validate`, gán/đưa `value` đã chuẩn hóa vào service thay vì tiếp tục dùng body thô.
  - [ ] Khi PATCH category: `undefined` nghĩa là giữ nguyên; `null` nghĩa là xóa nếu được phép; `""` được xử lý theo chính sách rõ ràng.

- [ ] **Chuẩn hóa UUID khi admin sửa tài khoản** — `src/controllers/admin/user.controller.ts`, admin user repository
  - Cần sửa: kiểm tra ngăn admin tự khóa/tự đổi role so sánh chuỗi ID trực tiếp; UUID cùng giá trị nhưng khác chữ hoa/thường có thể vượt qua kiểm tra.
  - [ ] Parse và chuẩn hóa cả actor ID lẫn target ID trước khi so sánh.
  - [ ] Thực hiện điều kiện bảo vệ self-update trong service/repository hoặc câu UPDATE để không phụ thuộc riêng vào controller.
  - [ ] Nếu nghiệp vụ cấm khóa/hạ quyền admin cuối cùng, khóa/kiểm tra/cập nhật trong một transaction để tránh hai request đồng thời cùng vượt qua.

- [ ] **Tách lỗi xác thực và lỗi hạ tầng** — `src/middlewares/auth.middleware.ts`, error handler
  - Cần sửa: middleware đã lấy `userId` từ JWT nhưng lại tìm user bằng email; `catch` hiện trả 401 cho cả lỗi DB hoặc lỗi lập trình trong quá trình xác thực.
  - [ ] Tra user theo ID và lấy role/status hiện hành từ DB để quyền bị thu hồi có hiệu lực.
  - [ ] Chỉ trả 401 cho thiếu/sai/hết hạn token; 403 cho user hợp lệ nhưng không đủ quyền.
  - [ ] Chuyển lỗi DB sang error handler và trả 500/503 phù hợp; không yêu cầu user đăng nhập lại khi DB lỗi.
  - [ ] Thêm error handler JSON cuối chuỗi middleware, bao gồm mã lỗi validation, Multer, JSON parser và DB.

## Migration, kiểm thử và vận hành

- [ ] **Đưa schema DB vào repository**
  - Cần sửa: không tìm thấy file schema/migration trong backend, vì vậy trạng thái constraint hiện tại chưa được kiểm chứng. Quy tắc quan trọng cần được bảo đảm tại DB để tránh race condition.
  - [ ] Thêm migration có thứ tự và seed dùng cho development/test; ghi hướng dẫn dựng DB mới.
  - [ ] Tạo/kiểm chứng unique constraint cho email, category slug/name và cặp user-document cần duy nhất (theo nghiệp vụ review/save).
  - [ ] Khai báo foreign key, hành vi xóa liên quan và CHECK cho rating/status.
  - [ ] Dựa vào constraint khi ghi; map lỗi PostgreSQL `23505` thành HTTP 409 thay vì chỉ SELECT kiểm tra trước.
  - [ ] Mọi transaction dùng một `PoolClient` duy nhất từ BEGIN đến COMMIT/ROLLBACK và luôn release client.

- [ ] **Thiết lập test và CI**
  - Cần sửa: hiện chưa thấy test/spec hay workflow CI trong backend; chưa có kiểm chứng tự động để ngăn các lỗi quyền và regression quay lại.
  - [ ] Thêm unit test cho validation và quy tắc service.
  - [ ] Thêm integration test dùng PostgreSQL riêng cho quyền owner/admin/other-user, trạng thái pending/approved/rejected, saved/review và pagination.
  - [ ] Thêm test PATCH body rỗng, file sai loại, cleanup Cloudinary được mock, UUID khác kiểu chữ và hai request tạo dữ liệu trùng đồng thời.
  - [ ] CI chạy typecheck, test và build trên pull request; không cần thông tin xác thực Cloudinary thật trong test.

- [ ] **Chuẩn bị chạy production** — `package.json`, `README.md`, `src/index.ts`
  - Cần sửa: `start` đang chạy `tsx watch`, README hướng dẫn `yarn dev` nhưng script `dev` chưa có; server listen rồi mới chờ kiểm tra DB.
  - [ ] Tách script `dev` (watch), `build` (compile) và `start` (chạy output đã build).
  - [ ] Sửa README để lệnh cài/chạy/build/test đúng với `package.json`.
  - [ ] Validate env bắt buộc và kiểu dữ liệu ngay lúc boot; dừng với thông báo rõ nếu thiếu/sai.
  - [ ] Hoàn tất kết nối DB rồi mới gọi `listen`.
  - [ ] Thêm readiness/liveness endpoint và graceful shutdown cho HTTP server/DB pool.

- [ ] **Đo và tối ưu truy vấn theo số liệu**
  - Cần sửa: truy vấn tìm kiếm dùng `ILIKE '%keyword%'`, các danh sách dùng OFFSET và thứ tự sort có thể không duy nhất; chưa có benchmark/schema để xác định bottleneck thật.
  - [ ] Tạo bộ dữ liệu đại diện rồi lưu kết quả `EXPLAIN (ANALYZE, BUFFERS)` cho truy vấn danh sách/tìm kiếm chậm.
  - [ ] Thêm index theo filter/join/order đã đo; đánh giá `pg_trgm` cho tìm kiếm substring.
  - [ ] Thêm `id` làm khóa phụ trong ORDER BY để trang kết quả ổn định khi nhiều bản ghi cùng thời gian/số lượt.
  - [ ] Benchmark trước/sau với cùng dữ liệu và concurrency; ghi p95, throughput và tỷ lệ lỗi.

## Nâng cấp để trình bày với nhà tuyển dụng

- [ ] **OpenAPI** — mô tả endpoint, request/response, cookie/CSRF, phân trang và mã lỗi; thêm cách chạy Swagger UI trên môi trường development.
- [ ] **Lịch sử kiểm duyệt** — tạo dữ liệu lưu admin đã duyệt, thời gian, trạng thái trước/sau, lý do từ chối và revision được duyệt; hiển thị được lịch sử đó.
- [ ] **Revision/version tài liệu** — lưu revision pending riêng hoặc version number; admin chỉ duyệt đúng version đã xem; nếu tài liệu đổi trong lúc duyệt thì trả conflict để admin tải lại.
- [ ] **Worker/outbox** — ghi tác vụ cần xử lý cùng transaction DB; worker dọn file/tạo thumbnail/trích xuất nội dung; có retry, trạng thái lỗi và idempotency để retry không nhân đôi kết quả.
- [ ] **Observability** — tạo request ID xuyên suốt log; log JSON có method/path/status/duration; thêm metrics cơ bản như request count, latency, lỗi và sức khỏe DB.
- [ ] **README/CV** — ghi cách chạy, kiến trúc và kết quả đo benchmark thật (dữ liệu, concurrency, p95 trước/sau); không ghi số liệu chưa đo.
