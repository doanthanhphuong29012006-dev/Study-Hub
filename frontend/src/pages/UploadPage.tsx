import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/api-client';
import { formatFileSize } from '../lib/format';
import { validateFile } from '../lib/validation';
import { categoryApi, documentApi } from '../services/api';
import type { Category } from '../types/api';

export function UploadPage() {
  const navigate = useNavigate();
  const notify = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: '', description: '', categoryId: '' });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { categoryApi.list().then((response) => setCategories(response.data)).catch((error) => setServerError(getErrorMessage(error))); }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = { title: !form.title.trim() ? 'Vui lòng nhập tiêu đề.' : form.title.trim().length > 255 ? 'Tiêu đề không vượt quá 255 ký tự.' : '', categoryId: form.categoryId ? '' : 'Vui lòng chọn danh mục.', file: validateFile(file) };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !file || submitting) return;
    const body = new FormData();
    body.append('file', file);
    body.append('title', form.title.trim());
    body.append('description', form.description.trim());
    body.append('categoryId', form.categoryId);
    setSubmitting(true); setServerError('');
    try {
      const response = await documentApi.create(body);
      notify(`${response.message} Tài liệu sẽ hiển thị công khai sau khi được duyệt.`, 'success');
      navigate('/my-documents');
    } catch (error) { setServerError(getErrorMessage(error)); }
    finally { setSubmitting(false); }
  };

  return <section className="container page-section page-section--narrow"><div className="page-heading"><span className="eyebrow">Đóng góp tri thức</span><h1>Đăng tài liệu mới</h1><p>Chia sẻ một tài liệu hữu ích với cộng đồng. Tệp tối đa 10 MB theo giới hạn của hệ thống.</p></div><form className="form-card upload-form" onSubmit={submit} noValidate>{serverError && <div className="form-alert" role="alert">{serverError}</div>}<div className={`upload-dropzone ${errors.file ? 'field--error' : ''}`}><input id="document-file" type="file" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setErrors({ ...errors, file: '' }); }} /><label htmlFor="document-file"><span className="upload-dropzone__icon"><Icon name="upload" size={27} /></span><strong>{file ? file.name : 'Chọn tệp từ thiết bị'}</strong><small>{file ? formatFileSize(file.size) : 'PDF, Word, PowerPoint, hình ảnh… · tối đa 10 MB'}</small></label>{errors.file && <small className="field-error" role="alert">{errors.file}</small>}</div><div className="form-grid"><div className={`field field--full ${errors.title ? 'field--error' : ''}`}><label htmlFor="upload-title">Tiêu đề</label><input id="upload-title" value={form.title} maxLength={255} onChange={(event) => setForm({ ...form, title: event.target.value })} /><small>{errors.title || `${form.title.length}/255 ký tự`}</small></div><div className={`field field--full ${errors.categoryId ? 'field--error' : ''}`}><label htmlFor="upload-category">Danh mục</label><select id="upload-category" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Chọn danh mục phù hợp</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{errors.categoryId && <small>{errors.categoryId}</small>}</div><div className="field field--full"><label htmlFor="upload-description">Mô tả <span>(không bắt buộc)</span></label><textarea id="upload-description" rows={6} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Tóm tắt nội dung và đối tượng phù hợp…" /></div></div><div className="form-actions"><button className="button button--ghost" type="button" onClick={() => navigate(-1)} disabled={submitting}>Hủy</button><button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Đang tải lên…' : 'Đăng tài liệu'} <Icon name="arrow" size={18} /></button></div></form></section>;
}
