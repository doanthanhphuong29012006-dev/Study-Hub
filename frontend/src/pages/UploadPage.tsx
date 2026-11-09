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
        ? 'Vui lòng nhập tiêu đề tài liệu.'
        : form.title.trim().length > 255
        ? 'Tiêu đề không vượt quá 255 ký tự.'
        : '',
      categoryId: form.categoryId ? '' : 'Vui lòng chọn danh mục phù hợp.',
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
          body.append('fileType', 'image');
        } else if (imageFile) {
          body.append('file', imageFile);
        }
      }

      const response = await documentApi.create(body);
      notify(response.message || 'Đăng tài liệu thành công!', 'success');
      navigate('/my-documents');
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container bamboo-upload-page">
      <div className="bamboo-page-heading">
        <div className="bamboo-eyebrow">
          <Icon name="leaf" size={14} />
          <span>Góp mầm tri thức</span>
        </div>
        <h1 className="bamboo-page-heading__title">Đăng tải tài liệu học tập</h1>
        <p className="bamboo-page-heading__subtitle">
          Chia sẻ giáo trình, bài tập, đề thi hoặc liên kết học tập hữu ích để tiếp sức cho cộng đồng người học.
        </p>
      </div>

      <div className="bamboo-upload-container">
        {serverError && (
          <div className="bamboo-form-alert" role="alert">
            <Icon name="close" size={16} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Method Picker Tabs */}
        <div className="bamboo-method-cards" role="tablist" aria-label="Phương thức đóng góp">
          <button
            type="button"
            role="tab"
            aria-selected={method === 'file'}
            className={`bamboo-method-card ${method === 'file' ? 'is-active' : ''}`}
            onClick={() => handleMethodChange('file')}
          >
            <div className="bamboo-method-card__icon">
              <Icon name="file" size={24} />
            </div>
            <div className="bamboo-method-card__text">
              <strong>Tải tệp tin lên</strong>
              <small>PDF, DOCX, PPTX, ZIP (tối đa 10 MB)</small>
            </div>
            <span className="bamboo-method-card__check" aria-hidden="true" />
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={method === 'link'}
            className={`bamboo-method-card ${method === 'link' ? 'is-active' : ''}`}
            onClick={() => handleMethodChange('link')}
          >
            <div className="bamboo-method-card__icon">
              <Icon name="external" size={24} />
            </div>
            <div className="bamboo-method-card__text">
              <strong>Liên kết trực tuyến</strong>
              <small>Google Drive, Notion, bài viết web</small>
            </div>
            <span className="bamboo-method-card__check" aria-hidden="true" />
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={method === 'image'}
            className={`bamboo-method-card ${method === 'image' ? 'is-active' : ''}`}
            onClick={() => handleMethodChange('image')}
          >
            <div className="bamboo-method-card__icon">
              <Icon name="eye" size={24} />
            </div>
            <div className="bamboo-method-card__text">
              <strong>Hình ảnh học tập</strong>
              <small>Sơ đồ tư duy, infographic, ảnh bài giảng</small>
            </div>
            <span className="bamboo-method-card__check" aria-hidden="true" />
          </button>
        </div>

        <form className="bamboo-form-card bamboo-upload-form" onSubmit={submit} noValidate>
          {/* File Upload Zone */}
          {method === 'file' && (
            <div className={`bamboo-dropzone ${errors.file ? 'has-error' : ''} ${file ? 'has-file' : ''}`}>
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
                <span className="bamboo-dropzone__symbol">
                  <Icon name={file ? 'check' : 'upload'} size={28} />
                </span>
                <strong>{file ? file.name : 'Chọn hoặc kéo thả tệp tài liệu vào đây'}</strong>
                <small>{file ? `Kích thước: ${formatFileSize(file.size)}` : 'Hỗ trợ định dạng PDF, Word, PowerPoint, ZIP · tối đa 10 MB'}</small>
                {file && <span className="bamboo-dropzone__change-hint">Bấm để chọn tệp khác</span>}
              </label>
              {errors.file && <small className="bamboo-field-error" role="alert">{errors.file}</small>}
            </div>
          )}

          {/* Link Input Field */}
          {method === 'link' && (
            <div className={`bamboo-field ${errors.link ? 'has-error' : ''}`}>
              <label htmlFor="upload-link">Đường dẫn tài liệu trực tuyến (URL)</label>
              <input
                id="upload-link"
                type="url"
                value={linkUrl}
                onChange={(event) => {
                  setLinkUrl(event.target.value);
                  setErrors({ ...errors, link: '' });
                }}
                placeholder="https://drive.google.com/... hoặc liên kết bài viết, kho tài liệu"
              />
              {errors.link ? (
                <small className="bamboo-field-error" role="alert">{errors.link}</small>
              ) : (
                <small>Nhập link công khai Google Drive, Notion hoặc tài liệu học thuật trực tuyến</small>
              )}
            </div>
          )}

          {/* Image Input Options */}
          {method === 'image' && (
            <div className="bamboo-image-upload-wrap">
              <div className="bamboo-radio-group">
                <label className="bamboo-radio-label">
                  <input
                    type="radio"
                    name="imageMode"
                    checked={imageMode === 'url'}
                    onChange={() => {
                      setImageMode('url');
                      setErrors({ ...errors, imageUrl: '', imageFile: '' });
                    }}
                  />
                  <span>Dán đường dẫn ảnh (URL)</span>
                </label>
                <label className="bamboo-radio-label">
                  <input
                    type="radio"
                    name="imageMode"
                    checked={imageMode === 'file'}
                    onChange={() => {
                      setImageMode('file');
                      setErrors({ ...errors, imageUrl: '', imageFile: '' });
                    }}
                  />
                  <span>Tải ảnh từ thiết bị</span>
                </label>
              </div>

              {imageMode === 'url' ? (
                <div className={`bamboo-field ${errors.imageUrl ? 'has-error' : ''}`}>
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
                    <small className="bamboo-field-error" role="alert">{errors.imageUrl}</small>
                  ) : (
                    <small>Đường dẫn trực tiếp tới tệp ảnh hiển thị trên mạng</small>
                  )}
                  {imageUrl.trim() && (
                    <div className="bamboo-image-preview-box">
                      <img
                        src={imageUrl}
                        alt="Xem trước ảnh tải lên"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className={`bamboo-dropzone ${errors.imageFile ? 'has-error' : ''} ${imageFile ? 'has-file' : ''}`}>
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
                      <div className="bamboo-image-selected">
                        <img src={imagePreview} alt="Xem trước ảnh đã chọn" />
                        <p>
                          <strong>{imageFile?.name}</strong> ({formatFileSize(imageFile?.size ?? 0)})
                        </p>
                        <span className="bamboo-dropzone__change-hint">Bấm để đổi ảnh khác</span>
                      </div>
                    ) : (
                      <>
                        <span className="bamboo-dropzone__symbol">
                          <Icon name="upload" size={28} />
                        </span>
                        <strong>Chọn tệp ảnh từ máy tính hoặc điện thoại</strong>
                        <small>Hỗ trợ JPG, PNG, WebP, GIF · tối đa 10 MB</small>
                      </>
                    )}
                  </label>
                  {errors.imageFile && (
                    <small className="bamboo-field-error" role="alert">{errors.imageFile}</small>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Core Metadata Fields */}
          <div className="bamboo-form-grid">
            <div className={`bamboo-field bamboo-field--full ${errors.title ? 'has-error' : ''}`}>
              <label htmlFor="upload-title">
                Tiêu đề tài liệu <span className="bamboo-required">*</span>
              </label>
              <input
                id="upload-title"
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  setErrors({ ...errors, title: '' });
                }}
                placeholder="Ví dụ: Đề cương chi tiết Giải tích 1 - ĐHBK Hà Nội 2024"
              />
              {errors.title && <small className="bamboo-field-error" role="alert">{errors.title}</small>}
            </div>

            <div className={`bamboo-field bamboo-field--full ${errors.categoryId ? 'has-error' : ''}`}>
              <label htmlFor="upload-category">
                Danh mục học phần <span className="bamboo-required">*</span>
              </label>
              <select
                id="upload-category"
                value={form.categoryId}
                onChange={(e) => {
                  setForm({ ...form, categoryId: e.target.value });
                  setErrors({ ...errors, categoryId: '' });
                }}
              >
                <option value="">-- Chọn danh mục học phần --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <small className="bamboo-field-error" role="alert">{errors.categoryId}</small>
              )}
            </div>

            <div className="bamboo-field bamboo-field--full">
              <label htmlFor="upload-description">
                Mô tả chi tiết hoặc hướng dẫn sử dụng <span>(không bắt buộc)</span>
              </label>
              <textarea
                id="upload-description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tóm tắt nội dung tài liệu, môn học tương ứng, giảng viên phụ trách hoặc lưu ý quan trọng khi ôn tập…"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="bamboo-form-actions">
            <button
              type="button"
              className="bamboo-btn bamboo-btn--ghost"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="bamboo-btn bamboo-btn--primary"
              disabled={submitting}
            >
              <Icon name="upload" size={17} />
              <span>{submitting ? 'Đang tải lên hệ thống…' : 'Xuất bản tài liệu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
