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

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userApi.profile();
      setProfile(response.data);
      setFullName(response.data.full_name);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const selectAvatar = (file: File | null) => {
    if (!file) return;
    const fileError = validateFile(file, true);
    if (fileError) {
      setFieldError(fileError);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    setFieldError('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nameError = validateFullName(fullName);
    setFieldError(nameError);
    if (nameError || submitting) return;

    const body = new FormData();
    body.append('fullName', fullName.trim());
    if (avatar) body.append('avatar', avatar);

    setSubmitting(true);
    try {
      const response = await userApi.updateProfile(body);
      await refreshProfile();
      await load();
      notify(response.message || 'Cập nhật hồ sơ thành công!', 'success');
      setAvatar(null);
    } catch (err) {
      setFieldError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="container bamboo-profile-page">
        <PageLoader label="Đang tải thông tin hồ sơ…" />
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="container bamboo-profile-page">
        <ErrorState message={error || 'Không có dữ liệu hồ sơ.'} onRetry={load} />
      </section>
    );
  }

  return (
    <div className="container bamboo-profile-page">
      <div className="bamboo-page-heading">
        <div className="bamboo-eyebrow">
          <Icon name="user" size={14} />
          <span>Thành viên StudyHub</span>
        </div>
        <h1 className="bamboo-page-heading__title">Hồ sơ học tập của bạn</h1>
        <p className="bamboo-page-heading__subtitle">
          Quản lý tên hiển thị, ảnh đại diện và nhận diện tài khoản trong cộng đồng.
        </p>
      </div>

      <div className="bamboo-profile-card">
        {/* Avatar Header Box */}
        <div className="bamboo-profile-card__hero">
          <div className="bamboo-profile-avatar-wrap">
            <Avatar src={preview || profile.avatar} name={profile.full_name} size="lg" />
            <label className="bamboo-avatar-uploader" htmlFor="avatar-file" title="Thay đổi ảnh đại diện">
              <Icon name="upload" size={16} />
              <input
                className="sr-only"
                id="avatar-file"
                type="file"
                accept="image/*"
                onChange={(event) => selectAvatar(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="bamboo-profile-hero__meta">
            <h2>{profile.full_name}</h2>
            <div className="bamboo-profile-hero__badges">
              <span className="bamboo-badge bamboo-badge--tree">
                <Icon name="shield" size={12} />
                <span>{user?.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}</span>
              </span>
              <span className="bamboo-badge bamboo-badge--open">
                <span>{profile.email}</span>
              </span>
            </div>
            <small>Ảnh hỗ trợ JPG, PNG hoặc WEBP, dung lượng tối đa 10 MB.</small>
          </div>
        </div>

        {fieldError && (
          <div className="bamboo-form-alert" role="alert">
            <Icon name="close" size={16} />
            <span>{fieldError}</span>
          </div>
        )}

        {/* Profile Editing Form */}
        <form className="bamboo-profile-form" onSubmit={submit}>
          <div className="bamboo-form-grid">
            <div className="bamboo-field bamboo-field--full">
              <label htmlFor="profile-name">
                Họ và tên hiển thị <span className="bamboo-required">*</span>
              </label>
              <input
                id="profile-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
              />
            </div>

            <div className="bamboo-field bamboo-field--full">
              <label htmlFor="profile-email">Địa chỉ Email</label>
              <input id="profile-email" value={profile.email} disabled />
              <small className="bamboo-field-hint">
                Email dùng để đăng nhập và không thể thay đổi trực tiếp.
              </small>
            </div>

            <div className="bamboo-field">
              <label>Vai trò trong hệ thống</label>
              <div className="bamboo-read-only-pill">
                <Icon name={user?.role === 'admin' ? 'shield' : 'user'} size={16} />
                <span>{user?.role === 'admin' ? 'Quản trị viên hệ thống' : 'Sinh viên / Người học'}</span>
              </div>
            </div>
          </div>

          <div className="bamboo-form-actions">
            <button
              className="bamboo-btn bamboo-btn--primary"
              type="submit"
              disabled={submitting}
            >
              <Icon name="check" size={16} />
              <span>{submitting ? 'Đang lưu thay đổi…' : 'Cập nhật hồ sơ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
