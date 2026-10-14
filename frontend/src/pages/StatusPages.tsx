import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return <section className="container page-section"><div className="status-page"><span>403</span><h1>Bạn không có quyền truy cập</h1><p>Khu vực này chỉ dành cho quản trị viên StudyHub.</p><Link className="button button--primary" to="/">Về trang chủ</Link></div></section>;
}

export function NotFoundPage() {
  return <section className="container page-section"><div className="status-page"><span>404</span><h1>Trang này không tồn tại</h1><p>Đường dẫn có thể đã thay đổi hoặc nội dung đã được gỡ bỏ.</p><Link className="button button--primary" to="/">Khám phá tài liệu</Link></div></section>;
}
