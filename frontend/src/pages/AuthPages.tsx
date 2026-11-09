import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/api-client';
import { validateEmail, validateFullName, validatePassword } from '../lib/validation';
import { authApi } from '../services/api';

export function LoginPage() {
  const { login } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Vui lòng nhập mật khẩu tài khoản.',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || submitting) return;
    setSubmitting(true);
    setServerError('');
    try {
      const message = await login(form.email.trim(), form.password);
      notify(message, 'success');
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from !== '/login' ? from : '/', { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Đăng nhập vào tài khoản của bạn để tiếp tục."
    >
      <form className="bamboo-stack-form" onSubmit={submit} noValidate>
        {serverError && (
          <div className="bamboo-form-alert" role="alert">
            <Icon name="close" size={16} />
            <span>{serverError}</span>
          </div>
        )}

        <Field label="Địa chỉ Email" id="login-email" error={errors.email}>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="ban@sinhvien.edu.vn"
          />
        </Field>

        <Field label="Mật khẩu" id="login-password" error={errors.password}>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>

        <button className="bamboo-btn bamboo-btn--primary bamboo-btn--full" type="submit" disabled={submitting}>
          <span>{submitting ? 'Đang xác thực tài khoản…' : 'Đăng nhập vào StudyHub'}</span>
          <Icon name="arrow" size={18} />
        </button>
      </form>

      <p className="bamboo-auth-switch">
        Bạn là người học mới? <Link to="/register">Tạo tài khoản miễn phí</Link>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const notify = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = {
      fullName: validateFullName(form.fullName),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: form.confirm === form.password ? '' : 'Mật khẩu xác nhận chưa khớp với mật khẩu.',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || submitting) return;
    setSubmitting(true);
    setServerError('');
    try {
      const response = await authApi.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      notify(response.message, 'success');
      navigate('/login', { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Khởi tạo tài khoản StudyHub"
      subtitle="Tham gia mạng lưới học tập mở và kết nối cùng hàng nghìn sinh viên cả nước."
    >
      <form className="bamboo-stack-form" onSubmit={submit} noValidate>
        {serverError && (
          <div className="bamboo-form-alert" role="alert">
            <Icon name="close" size={16} />
            <span>{serverError}</span>
          </div>
        )}

        <Field label="Họ và tên của bạn" id="register-name" error={errors.fullName}>
          <input
            id="register-name"
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Ví dụ: Nguyễn Văn An"
          />
        </Field>

        <Field label="Địa chỉ Email" id="register-email" error={errors.email}>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="ban@example.com"
          />
        </Field>

        <Field
          label="Mật khẩu bảo mật"
          id="register-password"
          error={errors.password}
          hint="Tối thiểu 8 ký tự, kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt."
        >
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>

        <Field label="Xác nhận mật khẩu" id="register-confirm" error={errors.confirm}>
          <input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="••••••••"
          />
        </Field>

        <button className="bamboo-btn bamboo-btn--primary bamboo-btn--full" type="submit" disabled={submitting}>
          <span>{submitting ? 'Đang tạo tài khoản…' : 'Đăng ký thành viên'}</span>
          <Icon name="arrow" size={18} />
        </button>
      </form>

      <p className="bamboo-auth-switch">
        Đã có tài khoản StudyHub? <Link to="/login">Đăng nhập ngay</Link>
      </p>
    </AuthLayout>
  );
}

function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bamboo-auth-page">
      <div className="bamboo-auth-visual">
        <div className="bamboo-auth-visual__art" aria-hidden="true">
          <div className="bamboo-culm bamboo-culm--1" />
          <div className="bamboo-culm bamboo-culm--2" />
        </div>

        <div className="bamboo-auth-quote">
          <span className="bamboo-auth-quote__leaf">
            <Icon name="book" size={32} />
          </span>
          <blockquote>
            “Cùng nhau chia sẻ tài liệu và học tập hiệu quả hơn mỗi ngày.”
          </blockquote>
          <span className="bamboo-auth-quote__author">— StudyHub Community</span>
        </div>
      </div>

      <div className="bamboo-auth-panel">
        <Link className="bamboo-brand bamboo-auth-panel__brand" to="/">
          <span className="bamboo-brand__symbol">
            <Icon name="leaf" size={20} />
          </span>
          <div className="bamboo-brand__text">
            <span className="bamboo-brand__title">
              Study<strong>Hub</strong>
            </span>
          </div>
        </Link>

        <div className="bamboo-auth-card">
          <div className="bamboo-eyebrow">
            <Icon name="leaf" size={13} />
            <span>Không gian học tập mở</span>
          </div>
          <h1 className="bamboo-auth-card__title">{title}</h1>
          <p className="bamboo-auth-card__subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bamboo-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <small className="bamboo-field-hint">{hint}</small>}
      {error && <small className="bamboo-field-error" role="alert">{error}</small>}
    </div>
  );
}
