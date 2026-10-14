import { useEffect, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { ErrorState, PageLoader } from '../components/AsyncState';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/api-client';
import { validateFile, validateFullName } from '../lib/validation';
import { userApi } from '../services/api';
import type { ProfileData } from '../types/api';

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const notify = useToast();
  const [profile, setProfile] = useState<ProfileData>();
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const load = async () => { setLoading(true); setError(''); try { const response = await userApi.profile(); setProfile(response.data); setFullName(response.data.full_name); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const selectAvatar = (file: File | null) => { if (!file) return; const fileError = validateFile(file, true); if (fileError) { setFieldError(fileError); return; } if (preview) URL.revokeObjectURL(preview); setAvatar(file); setPreview(URL.createObjectURL(file)); setFieldError(''); };
  const submit = async (event: React.FormEvent) => { event.preventDefault(); const nameError = validateFullName(fullName); setFieldError(nameError); if (nameError || submitting) return; const body = new FormData(); body.append('fullName', fullName.trim()); if (avatar) body.append('avatar', avatar); setSubmitting(true); try { const response = await userApi.updateProfile(body); await refreshProfile(); await load(); notify(response.message, 'success'); setAvatar(null); } catch (err) { setFieldError(getErrorMessage(err)); } finally { setSubmitting(false); } };

  if (loading) return <section className="container page-section"><PageLoader /></section>;
  if (error || !profile) return <section className="container page-section"><ErrorState message={error || 'Không có dữ liệu hồ sơ.'} onRetry={load} /></section>;
  return <section className="container page-section page-section--narrow"><div className="page-heading"><span className="eyebrow">Tài khoản</span><h1>Hồ sơ cá nhân</h1><p>Cập nhật tên hiển thị và ảnh đại diện của bạn.</p></div><form className="form-card profile-form" onSubmit={submit}><div className="profile-avatar"><Avatar src={preview || profile.avatar} name={profile.full_name} size="lg" /><div><label className="button button--secondary button--small" htmlFor="avatar-file"><Icon name="upload" size={16} /> Đổi ảnh</label><input className="sr-only" id="avatar-file" type="file" accept="image/*" onChange={(event) => selectAvatar(event.target.files?.[0] ?? null)} /><small>Ảnh JPG, PNG hoặc WEBP, tối đa 10 MB.</small></div></div>{fieldError && <div className="form-alert" role="alert">{fieldError}</div>}<div className="form-grid"><div className="field field--full"><label htmlFor="profile-name">Họ và tên</label><input id="profile-name" value={fullName} onChange={(event) => setFullName(event.target.value)} /></div><div className="field field--full"><label htmlFor="profile-email">Email</label><input id="profile-email" value={profile.email} disabled /><small>Email không thể thay đổi qua API hiện tại.</small></div><div className="field"><label>Vai trò</label><div className="read-only-value">{user?.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}</div></div></div><div className="form-actions"><button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div></form></section>;
}
