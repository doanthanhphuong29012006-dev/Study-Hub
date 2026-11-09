import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/api-client';
import { formatFileSize } from '../lib/format';
import { validateFile, validateUrl } from '../lib/validation';
import { categoryApi, documentApi } from '../services/api';
import type { Category } from '../types/api';

type UploadMethod = 'file' | 'link' | 'image';
type ImageMode = 'url' | 'file';

export function UploadPage() {
  const navigate = useNavigate();
  const notify = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [method, setMethod] = useState<UploadMethod>('file');
  const [form, setForm] = useState({ title: '', description: '', categoryId: '' });
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);

  // Link upload state
  const [linkUrl, setLinkUrl] = useState('');

  // Image upload state
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    categoryApi
      .list()
      .then((response) => setCategories(response.data))
      .catch((error) => setServerError(getErrorMessage(error)));
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleMethodChange = (newMethod: UploadMethod) => {
    setMethod(newMethod);
    setErrors({});
    setServerError('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {
      title: !form.title.trim()
        ? 'Vui lòng nhập tiêu đề.'
        : form.title.trim().length > 255
        ? 'Tiêu đề không vượt quá 255 ký tự.'
        : '',
      categoryId: form.categoryId ? '' : 'Vui lòng chọn danh mục.',
    };

    if (method === 'file') {
      nextErrors.file = validateFile(file);
    } else if (method === 'link') {
      nextErrors.link = validateUrl(linkUrl);
    } else if (method === 'image') {
      if (imageMode === 'url') {
        nextErrors.imageUrl = validateUrl(imageUrl);
      } else {
        nextErrors.imageFile = validateFile(imageFile, true);
      }
    }

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || submitting) return;

    setSubmitting(true);
    setServerError('');

    try {
      const body = new FormData();
      body.append('title', form.title.trim());
      body.append('description', form.description.trim());
      body.append('categoryId', form.categoryId);

      if (method === 'file' && file) {
        body.append('file', file);
      } else if (method === 'link') {
        body.append('link', linkUrl.trim());
        body.append('fileUrl', linkUrl.trim());
        body.append('fileType', 'link');
      } else if (method === 'image') {
        if (imageMode === 'url') {
          body.append('link', imageUrl.trim());
          body.append('fileUrl', imageUrl.trim());
          body.append('fileType', 'image/jpeg');
        } else if (imageFile) {
          body.append('file', imageFile);
        }
      }

      const response = await documentApi.create(body);
      notify(`${response.message} Tài liệu sẽ hiển thị công khai sau khi được duyệt.`, 'success');
      navigate('/my-documents');
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container page-section page-section--narrow">
      <div className="page-heading">
        <span className="eyebrow">Đóng góp tri thức</span>
        <h1>Đăng tài liệu mới</h1>
        <p>Chia sẻ tài liệu hữu ích với cộng đồng qua tệp tin, liên kết trực tuyến hoặc hình ảnh.</p>
      </div>

      <form className="form-card upload-form" onSubmit={submit} noValidate>
        {serverError && (
          <div className="form-alert" role="alert">
            {serverError}
          </div>
        )}

        <div className="category-tabs" role="tablist" aria-label="Phương thức đăng tài liệu" style={{ marginBottom: '0.5rem' }}>
          <button
            type="button"
            role="tab"
            aria-selected={method === 'file'}
            className={method === 'file' ? 'is-active' : ''}
            onClick={() => handleMethodChange('file')}
          >
            Tải tệp lên
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={method === 'link'}
            className={method === 'link' ? 'is-active' : ''}
            onClick={() => handleMethodChange('link')}
          >
            Gửi liên kết
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={method === 'image'}
            className={method === 'image' ? 'is-active' : ''}
            onClick={() => handleMethodChange('image')}
          >
            Gửi hình ảnh
          </button>
        </div>

        {method === 'file' && (
          <div className={`upload-dropzone ${errors.file ? 'field--error' : ''}`}>
            <input
              id="document-file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setErrors({ ...errors, file: '' });
              }}
            />
            <label htmlFor="document-file">
              <span className="upload-dropzone__icon">
                <Icon name="upload" size={27} />
              </span>
              <strong>{file ? file.name : 'Chọn tệp từ thiết bị'}</strong>
              <small>{file ? formatFileSize(file.size) : 'PDF, Word, PowerPoint, ZIP… · tối đa 10 MB'}</small>
            </label>
            {errors.file && (
              <small className="field-error" role="alert">
                {errors.file}
              </small>
            )}
          </div>
        )}

        {method === 'link' && (
          <div className={`field field--full ${errors.link ? 'field--error' : ''}`}>
            <label htmlFor="upload-link">Đường dẫn liên kết (URL)</label>
            <input
              id="upload-link"
              type="url"
              value={linkUrl}
              onChange={(event) => {
                setLinkUrl(event.target.value);
                setErrors({ ...errors, link: '' });
              }}
              placeholder="https://drive.google.com/... hoặc liên kết bài viết, tài liệu"
            />
            {errors.link ? (
              <small className="field-error" role="alert">
                {errors.link}
              </small>
            ) : (
              <small>Nhập link Google Drive, bài viết, hoặc tài liệu trực tuyến (không cần tải tệp)</small>
            )}
          </div>
        )}

        {method === 'image' && (
          <div>
            <div className="upload-mode-selector">
              <label className="upload-mode-label">
                <input
                  type="radio"
                  name="imageMode"
                  checked={imageMode === 'url'}
                  onChange={() => {
                    setImageMode('url');
                    setErrors({ ...errors, imageUrl: '', imageFile: '' });
                  }}
                />
                Gửi link ảnh (không cần upload file)
              </label>
              <label className="upload-mode-label">
                <input
                  type="radio"
                  name="imageMode"
                  checked={imageMode === 'file'}
                  onChange={() => {
                    setImageMode('file');
                    setErrors({ ...errors, imageUrl: '', imageFile: '' });
                  }}
                />
                Chọn ảnh từ thiết bị
              </label>
            </div>

            {imageMode === 'url' ? (
              <div className={`field field--full ${errors.imageUrl ? 'field--error' : ''}`}>
                <label htmlFor="upload-image-url">Liên kết hình ảnh (URL)</label>
                <input
                  id="upload-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => {
                    setImageUrl(event.target.value);
                    setErrors({ ...errors, imageUrl: '' });
                  }}
                  placeholder="https://example.com/tai-lieu-anh.png hoặc .jpg"
                />
                {errors.imageUrl ? (
                  <small className="field-error" role="alert">
                    {errors.imageUrl}
                  </small>
                ) : (
                  <small>Dán đường dẫn trực tiếp tới hình ảnh</small>
                )}
                {imageUrl.trim() && (
                  <div className="upload-preview-box">
                    <img
                      src={imageUrl}
                      alt="Xem trước ảnh"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className={`upload-dropzone ${errors.imageFile ? 'field--error' : ''}`}>
                <input
                  id="document-image-file"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const selected = event.target.files?.[0] ?? null;
                    setImageFile(selected);
                    setErrors({ ...errors, imageFile: '' });
                    if (selected) {
                      setImagePreview(URL.createObjectURL(selected));
                    } else {
                      setImagePreview('');
                    }
                  }}
                />
                <label htmlFor="document-image-file">
                  {imagePreview ? (
                    <div className="upload-image-selected">
                      <img
                        src={imagePreview}
                        alt="Xem trước ảnh"
                      />
                      <p>
                        <strong>{imageFile?.name}</strong> ({formatFileSize(imageFile?.size ?? 0)})
                      </p>
                      <small className="upload-change-hint">Bấm để đổi ảnh khác</small>
                    </div>
                  ) : (
                    <>
                      <span className="upload-dropzone__icon">
                        <Icon name="upload" size={27} />
                      </span>
                      <strong>Chọn ảnh từ thiết bị</strong>
                      <small>JPG, PNG, WebP, GIF · tối đa 10 MB</small>
                    </>
                  )}
                </label>
                {errors.imageFile && (
                  <small className="field-error" role="alert">
                    {errors.imageFile}
                  </small>
                )}
              </div>
            )}
          </div>
        )}

        <div className="form-grid">
          <div className={`field field--full ${errors.title ? 'field--error' : ''}`}>
            <label htmlFor="upload-title">Tiêu đề</label>
            <input
              id="upload-title"
              value={form.title}
              maxLength={255}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <small>{errors.title || `${form.title.length}/255 ký tự`}</small>
          </div>

          <div className={`field field--full ${errors.categoryId ? 'field--error' : ''}`}>
            <label htmlFor="upload-category">Danh mục</label>
            <select
              id="upload-category"
              value={form.categoryId}
              onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
            >
              <option value="">Chọn danh mục phù hợp</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <small>{errors.categoryId}</small>}
          </div>

          <div className="field field--full">
            <label htmlFor="upload-description">
              Mô tả <span>(không bắt buộc)</span>
            </label>
            <textarea
              id="upload-description"
              rows={6}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Tóm tắt nội dung và đối tượng phù hợp…"
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="button button--ghost" type="button" onClick={() => navigate(-1)} disabled={submitting}>
            Hủy
          </button>
          <button className="button button--primary" type="submit" disabled={submitting}>
            {submitting ? 'Đang gửi…' : 'Đăng tài liệu'} <Icon name="arrow" size={18} />
          </button>
        </div>
      </form>
    </section>
  );
}
