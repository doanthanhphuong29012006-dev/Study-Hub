import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';

export function ForbiddenPage() {
  return (
    <div className="container bamboo-status-page">
      <div className="bamboo-status-card">
        <span className="bamboo-status-card__code">403</span>
        <div className="bamboo-status-card__leaf">
          <Icon name="shield" size={36} />
        </div>
        <h1 className="bamboo-status-card__title">Không có quyền truy cập</h1>
        <p className="bamboo-status-card__desc">
          Khu vực này chỉ dành riêng cho Quản trị viên của StudyHub.
        </p>
        <Link className="bamboo-btn bamboo-btn--primary" to="/">
          <Icon name="arrow" size={16} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="container bamboo-status-page">
      <div className="bamboo-status-card">
        <span className="bamboo-status-card__code">404</span>
        <div className="bamboo-status-card__leaf">
          <Icon name="leaf" size={36} />
        </div>
        <h1 className="bamboo-status-card__title">Trang không tồn tại</h1>
        <p className="bamboo-status-card__desc">
          Đường dẫn có thể đã thay đổi hoặc nội dung đã được gỡ bỏ.
        </p>
        <Link className="bamboo-btn bamboo-btn--primary" to="/">
          <Icon name="leaf" size={16} />
          <span>Khám phá tài liệu</span>
        </Link>
      </div>
    </div>
  );
}
