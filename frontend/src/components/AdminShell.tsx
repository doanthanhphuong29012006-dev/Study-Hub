import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from './Icon';

const items = [
  { to: '/admin', label: 'Tổng quan hệ thống', icon: 'grid' as const, end: true },
  { to: '/admin/documents', label: 'Kiểm duyệt tài liệu', icon: 'file' as const },
  { to: '/admin/categories', label: 'Cấu trúc danh mục', icon: 'book' as const },
  { to: '/admin/users', label: 'Thành viên & Quyền', icon: 'users' as const },
  { to: '/admin/reviews', label: 'Đánh giá & Phản hồi', icon: 'star' as const },
];

export function AdminShell() {
  return (
    <div className="container bamboo-admin-layout">
      {/* Admin Bamboo Sidebar */}
      <aside className="bamboo-admin-sidebar" aria-label="Điều hướng trung tâm quản trị">
        <div className="bamboo-admin-sidebar__header">
          <span className="bamboo-admin-sidebar__icon">
            <Icon name="settings" size={20} />
          </span>
          <div className="bamboo-admin-sidebar__title">
            <strong>Quản trị StudyHub</strong>
            <small>Bảng điều khiển BQT</small>
          </div>
        </div>

        <nav className="bamboo-admin-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `bamboo-admin-nav__item ${isActive ? 'is-active' : ''}`}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              <span className="bamboo-admin-nav__dot" aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Admin Content Viewport */}
      <section className="bamboo-admin-content">
        <Outlet />
      </section>
    </div>
  );
}
