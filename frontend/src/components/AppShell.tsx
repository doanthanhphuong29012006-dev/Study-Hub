import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export function AppShell() {
  const { user, logout } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    notify('Bạn đã đăng xuất khỏi StudyHub.', 'success');
    navigate('/');
  };

  const nav = user
    ? [
        { to: '/', label: 'Khám phá tri thức', icon: 'leaf' as const },
        { to: '/saved', label: 'Tủ sách đã lưu', icon: 'bookmark' as const },
        { to: '/my-documents', label: 'Tài liệu của tôi', icon: 'folder' as const },
      ]
    : [{ to: '/', label: 'Khám phá tri thức', icon: 'leaf' as const }];

  return (
    <div className="bamboo-shell">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>

      {/* Top Banner Accent - Bamboo Canopy Glow */}
      <div className="bamboo-topbar-accent" aria-hidden="true" />

      {/* Main Site Header */}
      <header className="bamboo-header">
        <div className="container bamboo-header__inner">
          <Link className="bamboo-brand" to="/" aria-label="StudyHub - Nền tảng học liệu mở">
            <span className="bamboo-brand__symbol">
              <Icon name="leaf" size={20} />
            </span>
            <div className="bamboo-brand__text">
              <span className="bamboo-brand__title">
                Study<strong>Hub</strong>
              </span>
              <span className="bamboo-brand__tagline">Rừng tri thức mở</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="bamboo-nav" aria-label="Điều hướng chính">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `bamboo-nav__item ${isActive ? 'is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="bamboo-nav__icon">
                  <Icon name={item.icon} size={16} />
                </span>
                <span>{item.label}</span>
                <span className="bamboo-nav__sprout" aria-hidden="true" />
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `bamboo-nav__item bamboo-nav__item--admin ${isActive ? 'is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="bamboo-nav__icon">
                  <Icon name="settings" size={16} />
                </span>
                <span>Quản trị hệ thống</span>
                <span className="bamboo-nav__sprout" aria-hidden="true" />
              </NavLink>
            )}
          </nav>

          {/* Header Action Toolbar */}
          <div className="bamboo-header__actions">
            {user ? (
              <>
                <Link
                  className="bamboo-btn bamboo-btn--primary bamboo-btn--sm"
                  to="/upload"
                  aria-label="Đăng tải tài liệu mới"
                >
                  <Icon name="upload" size={16} />
                  <span>Đăng tài liệu</span>
                </Link>

                <Link
                  className="bamboo-user-pill"
                  to="/profile"
                  aria-label={`Hồ sơ cá nhân của ${user.full_name}`}
                >
                  <Avatar src={user.avatar} name={user.full_name} size="sm" />
                  <span className="bamboo-user-pill__name">{user.full_name}</span>
                </Link>

                <button
                  type="button"
                  className="bamboo-icon-btn"
                  onClick={handleLogout}
                  aria-label="Đăng xuất tài khoản"
                  title="Đăng xuất"
                >
                  <Icon name="logout" size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  className="bamboo-btn bamboo-btn--ghost bamboo-btn--sm"
                  to="/login"
                  state={{ from: location.pathname }}
                >
                  Đăng nhập
                </Link>
                <Link className="bamboo-btn bamboo-btn--primary bamboo-btn--sm" to="/register">
                  Tham gia cộng đồng
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="bamboo-icon-btn bamboo-mobile-toggle"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? 'Đóng menu' : 'Mở menu điều hướng'}
            >
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="bamboo-mobile-drawer">
            <nav className="bamboo-mobile-nav" aria-label="Điều hướng trên di động">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `bamboo-mobile-nav__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `bamboo-mobile-nav__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <Icon name="settings" size={18} />
                  <span>Quản trị hệ thống</span>
                </NavLink>
              )}
            </nav>
            <div className="bamboo-mobile-drawer__footer">
              {user ? (
                <div className="bamboo-mobile-user">
                  <div className="bamboo-mobile-user__info">
                    <Avatar src={user.avatar} name={user.full_name} size="md" />
                    <div>
                      <strong>{user.full_name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bamboo-btn bamboo-btn--ghost bamboo-btn--full"
                    onClick={() => {
                      setOpen(false);
                      void handleLogout();
                    }}
                  >
                    <Icon name="logout" size={16} /> Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="bamboo-mobile-auth">
                  <Link
                    className="bamboo-btn bamboo-btn--primary bamboo-btn--full"
                    to="/login"
                    onClick={() => setOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    className="bamboo-btn bamboo-btn--secondary bamboo-btn--full"
                    to="/register"
                    onClick={() => setOpen(false)}
                  >
                    Tạo tài khoản mới
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main id="main-content" className="bamboo-main">
        <Outlet />
      </main>

      {/* Deep Bamboo Forest Footer */}
      <footer className="bamboo-footer">
        <div className="container bamboo-footer__inner">
          <div className="bamboo-footer__brand-col">
            <Link className="bamboo-brand bamboo-brand--footer" to="/">
              <span className="bamboo-brand__symbol">
                <Icon name="leaf" size={20} />
              </span>
              <div className="bamboo-brand__text">
                <span className="bamboo-brand__title">
                  Study<strong>Hub</strong>
                </span>
                <span className="bamboo-brand__tagline">Cây tre vươn mình cùng tri thức</span>
              </div>
            </Link>
            <p className="bamboo-footer__manifesto">
              Nền tảng chia sẻ học liệu mở lấy cảm hứng từ hình tượng cây tre Việt Nam: mộc mạc, bền bỉ,
              kết nối thành lũy và cùng nhau vươn tới tầm cao tri thức.
            </p>
            <div className="bamboo-footer__badges">
              <span className="bamboo-badge bamboo-badge--tree">🌱 Giáo dục vì cộng đồng</span>
              <span className="bamboo-badge bamboo-badge--open">📖 Học liệu mở 100%</span>
            </div>
          </div>

          <div className="bamboo-footer__links-col">
            <div className="bamboo-footer__group">
              <h3>Khám phá</h3>
              <ul>
                <li><Link to="/">Kho tài liệu</Link></li>
                <li><Link to="/upload">Chia sẻ tài liệu mới</Link></li>
                <li><Link to="/saved">Tủ sách đã lưu</Link></li>
              </ul>
            </div>
            <div className="bamboo-footer__group">
              <h3>Cộng đồng</h3>
              <ul>
                <li><span className="bamboo-footer__text-item">Sinh viên & Giảng viên</span></li>
                <li><span className="bamboo-footer__text-item">Kiểm duyệt mở</span></li>
                <li><span className="bamboo-footer__text-item">Quy tắc học thuật</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bamboo-footer__bottom">
          <div className="container bamboo-footer__bottom-inner">
            <p>© {new Date().getFullYear()} StudyHub · Dự án học tập & chia sẻ tri thức mở</p>
            <div className="bamboo-footer__node-marker">
              <span />
              <em>Đốt tre vững chãi — Tri thức vươn xa</em>
              <span />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
