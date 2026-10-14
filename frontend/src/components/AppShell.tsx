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
        { to: '/', label: 'Khám phá' },
        { to: '/saved', label: 'Đã lưu' },
        { to: '/my-documents', label: 'Tài liệu của tôi' },
      ]
    : [{ to: '/', label: 'Khám phá' }];

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" to="/" aria-label="StudyHub - Trang chủ">
            <span className="brand__mark"><Icon name="book" size={23} /></span>
            <span>Study<span>Hub</span></span>
          </Link>
          <button className="icon-button mobile-menu" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Mở menu">
            <Icon name={open ? 'close' : 'menu'} />
          </button>
          <div className={`site-header__content ${open ? 'is-open' : ''}`}>
            <nav className="main-nav" aria-label="Điều hướng chính">
              {nav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}>{item.label}</NavLink>
              ))}
              {user?.role === 'admin' && <NavLink to="/admin">Quản trị</NavLink>}
            </nav>
            <div className="header-actions">
              {user ? (
                <>
                  <Link className="button button--primary button--small" to="/upload"><Icon name="upload" size={17} /> Đăng tài liệu</Link>
                  <Link className="profile-chip" to="/profile" aria-label="Mở hồ sơ">
                    <Avatar src={user.avatar} name={user.full_name} size="sm" />
                    <span>{user.full_name}</span>
                  </Link>
                  <button className="icon-button" onClick={handleLogout} aria-label="Đăng xuất"><Icon name="logout" /></button>
                </>
              ) : (
                <>
                  <Link className="button button--ghost button--small" to="/login" state={{ from: location.pathname }}>Đăng nhập</Link>
                  <Link className="button button--primary button--small" to="/register">Tạo tài khoản</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div><Link className="brand brand--footer" to="/"><span className="brand__mark"><Icon name="book" size={20} /></span>StudyHub</Link><p>Chia sẻ tri thức. Cùng nhau tiến bộ.</p></div>
          <p>© {new Date().getFullYear()} StudyHub · Nền tảng tài liệu học tập</p>
        </div>
      </footer>
    </div>
  );
}
