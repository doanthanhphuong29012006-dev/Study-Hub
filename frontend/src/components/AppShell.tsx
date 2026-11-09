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
    notify('Bạn đã đăng xuất.', 'success');
    navigate('/');
  };

  const nav = user
    ? [
        { to: '/', label: 'Khám phá', icon: 'leaf' as const },
        { to: '/saved', label: 'Đã lưu', icon: 'bookmark' as const },
        { to: '/my-documents', label: 'Tài liệu của tôi', icon: 'folder' as const },
      ]
    : [{ to: '/', label: 'Khám phá', icon: 'leaf' as const }];

  return (
    <div className="bamboo-shell">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>

      {/* Main Site Header */}
      <header className="bamboo-header">
        <div className="container bamboo-header__inner">
          <Link className="bamboo-brand" to="/" aria-label="StudyHub - Trang chủ">
            <span className="bamboo-brand__symbol">
              <Icon name="leaf" size={20} />
            </span>
            <div className="bamboo-brand__text">
              <span className="bamboo-brand__title">
                Study<strong>Hub</strong>
              </span>
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
                <span>Quản trị</span>
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
                  aria-label="Đăng tài liệu"
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
                  aria-label="Đăng xuất"
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
                  Đăng ký
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
                  <span>Quản trị</span>
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
                    Đăng ký tài khoản
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

      {/* Footer */}
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
              </div>
            </Link>
            <p className="bamboo-footer__manifesto">
              Nền tảng chia sẻ và tìm kiếm tài liệu học tập dành cho sinh viên. Cùng nhau học tập và chia sẻ kiến thức.
            </p>
            <div className="bamboo-footer__badges">
              <span className="bamboo-badge bamboo-badge--tree">Tài liệu miễn phí</span>
              <span className="bamboo-badge bamboo-badge--open">Cộng đồng mở</span>
            </div>
          </div>

          <div className="bamboo-footer__links-col">
            <div className="bamboo-footer__group">
              <h3>Điều hướng</h3>
              <ul>
                <li><Link to="/">Khám phá</Link></li>
                <li><Link to="/upload">Đăng tài liệu</Link></li>
                <li><Link to="/saved">Đã lưu</Link></li>
              </ul>
            </div>
            <div className="bamboo-footer__group">
              <h3>Thông tin</h3>
              <ul>
                <li><span className="bamboo-footer__text-item">Dành cho sinh viên</span></li>
                <li><span className="bamboo-footer__text-item">Quy định chia sẻ</span></li>
                <li><span className="bamboo-footer__text-item">Hỗ trợ học tập</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bamboo-footer__bottom">
          <div className="container bamboo-footer__bottom-inner">
            <p>© {new Date().getFullYear()} StudyHub · Nền tảng chia sẻ tài liệu học tập</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
