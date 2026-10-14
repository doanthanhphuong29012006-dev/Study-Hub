import { NavLink, Outlet } from 'react-router-dom';
import { Icon } from './Icon';

const items = [
  { to: '/admin', label: 'Tổng quan', icon: 'grid' as const, end: true },
  { to: '/admin/documents', label: 'Tài liệu', icon: 'file' as const },
  { to: '/admin/categories', label: 'Danh mục', icon: 'book' as const },
  { to: '/admin/users', label: 'Người dùng', icon: 'users' as const },
  { to: '/admin/reviews', label: 'Đánh giá', icon: 'star' as const },
];

export function AdminShell() {
  return (
    <div className="container admin-layout">
      <aside className="admin-sidebar" aria-label="Điều hướng quản trị">
        <div className="admin-sidebar__title"><Icon name="settings" /> Trung tâm quản trị</div>
        <nav>
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              <Icon name={item.icon} size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="admin-content"><Outlet /></section>
    </div>
  );
}
