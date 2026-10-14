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
    const nextErrors = { email: validateEmail(form.email), password: form.password ? '' : 'Vui lòng nhập mật khẩu.' };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || submitting) return;
    setSubmitting(true); setServerError('');
    try {
      const message = await login(form.email.trim(), form.password);
      notify(message, 'success');
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from !== '/login' ? from : '/', { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally { setSubmitting(false); }
  };

  return <AuthLayout title="Chào mừng trở lại" subtitle="Đăng nhập để tiếp tục hành trình học tập của bạn.">
    <form className="stack-form" onSubmit={submit} noValidate>
      {serverError && <div className="form-alert" role="alert">{serverError}</div>}
      <Field label="Email" id="login-email" error={errors.email}><input id="login-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ban@example.com" /></Field>
      <Field label="Mật khẩu" id="login-password" error={errors.password}><input id="login-password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></Field>
      <button className="button button--primary button--wide" type="submit" disabled={submitting}>{submitting ? 'Đang đăng nhập…' : 'Đăng nhập'} <Icon name="arrow" size={18} /></button>
    </form>
    <p className="auth-switch">Chưa có tài khoản? <Link to="/register">Đăng ký miễn phí</Link></p>
  </AuthLayout>;
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
    const nextErrors = { fullName: validateFullName(form.fullName), email: validateEmail(form.email), password: validatePassword(form.password), confirm: form.confirm === form.password ? '' : 'Mật khẩu xác nhận chưa khớp.' };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || submitting) return;
    setSubmitting(true); setServerError('');
    try {
      const response = await authApi.register({ fullName: form.fullName.trim(), email: form.email.trim(), password: form.password });
      notify(response.message, 'success');
      navigate('/login', { replace: true });
    } catch (error) { setServerError(getErrorMessage(error)); }
    finally { setSubmitting(false); }
  };

  return <AuthLayout title="Bắt đầu cùng StudyHub" subtitle="Tạo tài khoản và tham gia cộng đồng chia sẻ tri thức.">
    <form className="stack-form" onSubmit={submit} noValidate>
      {serverError && <div className="form-alert" role="alert">{serverError}</div>}
      <Field label="Họ và tên" id="register-name" error={errors.fullName}><input id="register-name" autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
      <Field label="Email" id="register-email" error={errors.email}><input id="register-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
      <Field label="Mật khẩu" id="register-password" error={errors.password} hint="Ít nhất 8 ký tự, gồm hoa, thường, số và ký tự đặc biệt."><input id="register-password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
      <Field label="Xác nhận mật khẩu" id="register-confirm" error={errors.confirm}><input id="register-confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></Field>
      <button className="button button--primary button--wide" type="submit" disabled={submitting}>{submitting ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'} <Icon name="arrow" size={18} /></button>
    </form>
    <p className="auth-switch">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="auth-page"><div className="auth-visual"><div className="auth-quote"><Icon name="book" size={38} /><blockquote>“Học tập không phải là đổ đầy một cái bình, mà là thắp sáng một ngọn lửa.”</blockquote><span>StudyHub community</span></div></div><div className="auth-panel"><Link className="brand" to="/"><span className="brand__mark"><Icon name="book" size={23} /></span><span>Study<span>Hub</span></span></Link><div className="auth-card"><span className="eyebrow">Không gian học tập mở</span><h1>{title}</h1><p>{subtitle}</p>{children}</div></div></section>;
}

function Field({ label, id, error, hint, children }: { label: string; id: string; error?: string; hint?: string; children: React.ReactNode }) {
  return <div className={`field ${error ? 'field--error' : ''}`}><label htmlFor={id}>{label}</label>{children}{hint && !error && <small>{hint}</small>}{error && <small role="alert">{error}</small>}</div>;
}
