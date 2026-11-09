import { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState, ErrorState, PageLoader } from '../../components/AsyncState';
import { Icon } from '../../components/Icon';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../lib/api-client';
import { adminApi, categoryApi } from '../../services/api';
import type { Category } from '../../types/api';
import { AdminTitle } from './AdminUsersPage';

const emptyForm = { name: '', slug: '', description: '' };

export function AdminCategoriesPage() {
  const notify = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category>();
  const [deleteTarget, setDeleteTarget] = useState<Category>();
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await categoryApi.list();
      setCategories(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(undefined);
    setForm(emptyForm);
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
    });
    setFormError('');
    setFormOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError('Tên danh mục và đường dẫn (slug) là bắt buộc.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      const response = editing
        ? await adminApi.updateCategory(editing.id, {
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description.trim(),
          })
        : await adminApi.createCategory({
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description.trim() || null,
          });
      notify(response.message, 'success');
      setFormOpen(false);
      await load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const response = await adminApi.removeCategory(deleteTarget.id);
      notify(response.message, 'success');
      setDeleteTarget(undefined);
      await load();
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bamboo-admin-page">
      <AdminTitle
        eyebrow="Cấu trúc thư viện"
        title="Quản lý danh mục"
        description="Tổ chức tài liệu học thuật theo từng khối ngành, học phần và chuyên môn."
        action={
          <button type="button" className="bamboo-btn bamboo-btn--primary" onClick={openCreate}>
            <Icon name="check" size={16} />
            <span>+ Thêm danh mục mới</span>
          </button>
        }
      />

      {/* Category Edit/Create Form Panel */}
      {formOpen && (
        <form className="bamboo-form-card bamboo-admin-inline-form" onSubmit={submit}>
          <div className="bamboo-form-card__header">
            <h2>{editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục học phần mới'}</h2>
            <button
              type="button"
              className="bamboo-icon-btn"
              onClick={() => setFormOpen(false)}
              aria-label="Đóng form"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          {formError && (
            <div className="bamboo-form-alert" role="alert">
              <Icon name="close" size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="bamboo-form-grid">
            <div className="bamboo-field">
              <label htmlFor="category-name">Tên danh mục học phần</label>
              <input
                id="category-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ví dụ: Công nghệ phần mềm"
              />
            </div>

            <div className="bamboo-field">
              <label htmlFor="category-slug">Đường dẫn định danh (Slug)</label>
              <input
                id="category-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                placeholder="cong-nghe-phan-mem"
              />
            </div>

            <div className="bamboo-field bamboo-field--full">
              <label htmlFor="category-description">Mô tả tóm lược</label>
              <textarea
                id="category-description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Giới thiệu các môn học và chủ đề thuộc danh mục này…"
              />
            </div>
          </div>

          <div className="bamboo-form-actions">
            <button
              type="button"
              className="bamboo-btn bamboo-btn--ghost"
              onClick={() => setFormOpen(false)}
            >
              Hủy
            </button>
            <button type="submit" className="bamboo-btn bamboo-btn--primary" disabled={busy}>
              {busy ? 'Đang lưu…' : 'Lưu danh mục'}
            </button>
          </div>
        </form>
      )}

      {/* Category Card Grid */}
      {loading ? (
        <PageLoader label="Đang tải danh mục học phần…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="Chưa có danh mục nào"
          description="Tạo danh mục đầu tiên để phân loại tài liệu cho người học."
          action={
            <button type="button" className="bamboo-btn bamboo-btn--primary" onClick={openCreate}>
              Thêm danh mục đầu tiên
            </button>
          }
        />
      ) : (
        <div className="bamboo-category-grid">
          {categories.map((category, index) => (
            <article className="bamboo-cat-card" key={category.id}>
              <div className="bamboo-cat-card__index">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="bamboo-cat-card__content">
                <h3 className="bamboo-cat-card__name">{category.name}</h3>
                <code className="bamboo-cat-card__slug">/{category.slug}</code>
                <p className="bamboo-cat-card__desc">
                  {category.description || 'Chưa có mô tả cho danh mục này.'}
                </p>
              </div>

              <div className="bamboo-cat-card__actions">
                <button
                  type="button"
                  className="bamboo-icon-btn"
                  onClick={() => openEdit(category)}
                  aria-label={`Sửa danh mục ${category.name}`}
                  title="Chỉnh sửa"
                >
                  <Icon name="edit" size={17} />
                </button>
                <button
                  type="button"
                  className="bamboo-icon-btn bamboo-icon-btn--danger"
                  onClick={() => setDeleteTarget(category)}
                  aria-label={`Xóa danh mục ${category.name}`}
                  title="Xóa danh mục"
                >
                  <Icon name="trash" size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xác nhận xóa danh mục?"
        description={`Lưu ý: Không thể xóa danh mục “${deleteTarget?.name ?? ''}” nếu hiện tại vẫn có tài liệu đang được gán vào danh mục này.`}
        confirmLabel="Xóa danh mục"
        busy={busy}
        onConfirm={remove}
        onClose={() => setDeleteTarget(undefined)}
      />
    </div>
  );
}
