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
        <h1 className="bamboo-status-card__title">Cổng tre khép lại — Giới hạn truy cập</h1>
        <p className="bamboo-status-card__desc">
          Khu vực bạn đang cố gắng truy cập chỉ dành riêng cho Quản trị viên của StudyHub.
        </p>
        <Link className="bamboo-btn bamboo-btn--primary" to="/">
          <Icon name="arrow" size={16} />
          <span>Quay lại trang chủ</span>
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
        <h1 className="bamboo-status-card__title">Lạc lối giữa rừng tre tri thức</h1>
        <p className="bamboo-status-card__desc">
          Trang hoặc tài liệu bạn đang tìm kiếm không tồn tại, đã đổi đường dẫn hoặc đã được gỡ bỏ khỏi kho học liệu.
        </p>
        <Link className="bamboo-btn bamboo-btn--primary" to="/">
          <Icon name="leaf" size={16} />
          <span>Khám phá kho học liệu StudyHub</span>
        </Link>
      </div>
    </div>
  );
}
