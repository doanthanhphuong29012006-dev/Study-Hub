import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ErrorState, PageLoader } from '../components/AsyncState';
import { Icon } from '../components/Icon';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../lib/api-client';
import { formatDate, formatFileSize } from '../lib/format';
import { categoryApi, documentApi, reviewApi } from '../services/api';
import type { Category, PaginationData, Review, StudyDocument } from '../types/api';

export function DocumentDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const [document, setDocument] = useState<StudyDocument>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewPagination, setReviewPagination] = useState<PaginationData>();
  const [reviewPage, setReviewPage] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(false);
  const [docForm, setDocForm] = useState({ title: '', description: '', categoryId: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState('');
  const [formError, setFormError] = useState('');
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  const loadDocument = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [docResponse, saveResponse, categoryResponse] = await Promise.all([
        documentApi.detail(id),
        documentApi.saveStatus(id),
        categoryApi.list(),
      ]);
      setDocument(docResponse.document);
      setDocForm({
        title: docResponse.document.title,
        description: docResponse.document.description ?? '',
        categoryId: docResponse.document.category_id,
      });
      setIsSaved(saveResponse.isSaved);
      setCategories(categoryResponse.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadReviews = useCallback(async () => {
    try {
      const response = await documentApi.reviews(id, reviewPage, 6);
      setReviews(response.reviews);
      setReviewPagination(response.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [id, reviewPage]);

  useEffect(() => {
    void loadDocument();
  }, [loadDocument]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const toggleSave = async () => {
    if (busy) return;
    setBusy('save');
    try {
      const response = isSaved ? await documentApi.unsave(id) : await documentApi.save(id);
      setIsSaved(!isSaved);
      notify(response.message, 'success');
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setBusy('');
    }
  };

  const download = async () => {
    if (busy) return;
    setBusy('download');
    try {
      const response = await documentApi.download(id);
      const anchor = window.document.createElement('a');
      anchor.href = response.data.fileUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.click();
      notify(response.message, 'success');
      setDocument((current) =>
        current ? { ...current, download_count: Number(current.download_count) + 1 } : current,
      );
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setBusy('');
    }
  };

  const saveDocumentEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!docForm.title.trim()) {
      setFormError('Tiêu đề không được để trống.');
      return;
    }
    if (docForm.title.trim().length > 255) {
      setFormError('Tiêu đề không vượt quá 255 ký tự.');
      return;
    }
    setBusy('edit-document');
    setFormError('');
    try {
      const response = await documentApi.update(id, {
        title: docForm.title.trim(),
        description: docForm.description.trim(),
        categoryId: docForm.categoryId,
      });
      setDocument((current) =>
        current
          ? {
              ...current,
              title: docForm.title.trim(),
              description: docForm.description.trim(),
              category_id: docForm.categoryId,
              category_title:
                categories.find((item) => item.id === docForm.categoryId)?.name ?? current.category_title,
            }
          : current,
      );
      notify(response.message, 'success');
      setEditingDocument(false);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setBusy('');
    }
  };

  const removeDocument = async () => {
    setBusy('delete');
    try {
      const response = await documentApi.remove(id);
      notify(response.message, 'success');
      navigate('/my-documents');
    } catch (err) {
      notify(getErrorMessage(err), 'error');
      setBusy('');
    }
  };

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy('review');
    try {
      if (editingReview) {
        const response = await reviewApi.update(editingReview, {
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim() || null,
        });
        notify(response.message, 'success');
        setEditingReview('');
      } else {
        const response = await documentApi.createReview(id, {
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim() || null,
        });
        notify(response.message, 'success');
      }
      setReviewForm({ rating: 5, comment: '' });
      await Promise.all([loadDocument(), loadReviews()]);
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setBusy('');
    }
  };

  const removeReview = async (reviewId: string) => {
    setBusy(`review-${reviewId}`);
    try {
      const response = await reviewApi.remove(reviewId);
      notify(response.message, 'success');
      await Promise.all([loadDocument(), loadReviews()]);
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setBusy('');
    }
  };

  if (loading) {
    return (
      <section className="container bamboo-detail-page">
        <PageLoader label="Đang tải thông tin tài liệu…" />
      </section>
    );
  }

  if (error || !document) {
    return (
      <section className="container bamboo-detail-page">
        <ErrorState message={error || 'Tài liệu không tồn tại.'} onRetry={loadDocument} />
      </section>
    );
  }

  const isOwner = user?.id === document.uploader_id;
  const canManage = isOwner || user?.role === 'admin';

  const isImage =
    document.file_type?.startsWith('image/') ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(document.file_url);
  const isPdf =
    document.file_type === 'application/pdf' ||
    /\.pdf$/i.test(document.file_url);
  const isOffice =
    /\.(docx?|pptx?|xlsx?)$/i.test(document.file_url) ||
    document.file_type?.includes('wordprocessingml') ||
    document.file_type?.includes('presentationml') ||
    document.file_type?.includes('spreadsheetml');
  const isGoogleDrive =
    document.file_url?.includes('drive.google.com') ||
    document.file_url?.includes('docs.google.com');
  const isLink = document.file_type === 'link';

  let googleDrivePreviewUrl = '';
  if (isGoogleDrive) {
    const fileIdMatch = document.file_url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      googleDrivePreviewUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }

  return (
    <div className="container bamboo-detail-page">
      {/* Breadcrumb Navigation */}
      <nav className="bamboo-breadcrumbs" aria-label="Đường dẫn trang">
        <Link to="/">Trang chủ</Link>
        <span className="bamboo-breadcrumbs__sep">/</span>
        <span>{document.category_title ?? 'Tài liệu'}</span>
        <span className="bamboo-breadcrumbs__sep">/</span>
        <span className="bamboo-breadcrumbs__current">{document.title}</span>
      </nav>

      {/* Detail Header Hero */}
      <header className="bamboo-detail-header">
        <div className="bamboo-detail-header__badges">
          <span className="bamboo-pill">
            <Icon name="leaf" size={14} />
            <span>{document.category_title ?? 'Học liệu'}</span>
          </span>
          <StatusBadge value={document.status} />
        </div>

        <h1 className="bamboo-detail-header__title">{document.title}</h1>

        <div className="bamboo-detail-header__meta">
          <div className="bamboo-author-tag">
            <Avatar src={document.uploader_avatar} name={document.uploader_name ?? 'Thành viên'} size="sm" />
            <div className="bamboo-author-tag__info">
              <span>Được chia sẻ bởi <strong>{document.uploader_name ?? 'Thành viên StudyHub'}</strong></span>
              <small>{formatDate(document.created_at)}</small>
            </div>
          </div>

          <div className="bamboo-detail-header__stats">
            <span title="Điểm đánh giá">
              <Icon name="star" size={16} /> {Number(document.average_rating || 0).toFixed(1)} / 5.0
            </span>
            <span title="Lượt xem">
              <Icon name="eye" size={16} /> {document.view_count ?? 0} lượt xem
            </span>
            <span title="Lượt tải về">
              <Icon name="download" size={16} /> {document.download_count ?? 0} lượt tải
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bamboo-action-toolbar">
          <button
            type="button"
            className="bamboo-btn bamboo-btn--primary"
            onClick={download}
            disabled={busy === 'download'}
          >
            <Icon name="download" size={18} />
            <span>
              {busy === 'download'
                ? 'Đang chuẩn bị…'
                : isLink
                ? 'Mở liên kết tài liệu'
                : 'Tải tài liệu về máy'}
            </span>
          </button>

          <button
            type="button"
            className={`bamboo-btn bamboo-btn--secondary ${isSaved ? 'is-saved' : ''}`}
            onClick={toggleSave}
            disabled={busy === 'save'}
            aria-pressed={isSaved}
          >
            <Icon name={isSaved ? 'bookmark' : 'bookmark'} size={18} />
            <span>{isSaved ? 'Đã lưu trong tủ sách' : 'Lưu vào tủ sách'}</span>
          </button>

          {canManage && (
            <div className="bamboo-action-toolbar__manage">
              <button
                type="button"
                className="bamboo-btn bamboo-btn--ghost bamboo-btn--sm"
                onClick={() => setEditingDocument((value) => !value)}
              >
                <Icon name="edit" size={16} /> Sửa thông tin
              </button>
              <button
                type="button"
                className="bamboo-btn bamboo-btn--ghost bamboo-btn--sm bamboo-btn--danger-ghost"
                onClick={() => setDeleteOpen(true)}
              >
                <Icon name="trash" size={16} /> Xóa tài liệu
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="bamboo-detail-layout">
        {/* Left Column: Preview + Content + Reviews */}
        <div className="bamboo-detail-main">
          {/* Edit Form Modal/Inline Panel */}
          {editingDocument && (
            <form className="bamboo-form-card bamboo-edit-form" onSubmit={saveDocumentEdit}>
              <div className="bamboo-form-card__header">
                <h2>Chỉnh sửa thông tin tài liệu</h2>
                <button
                  type="button"
                  className="bamboo-icon-btn"
                  onClick={() => setEditingDocument(false)}
                  aria-label="Đóng form chỉnh sửa"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              {formError && <div className="bamboo-form-alert" role="alert">{formError}</div>}

              <div className="bamboo-field">
                <label htmlFor="edit-title">Tiêu đề tài liệu</label>
                <input
                  id="edit-title"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                />
              </div>

              <div className="bamboo-field">
                <label htmlFor="edit-category">Danh mục</label>
                <select
                  id="edit-category"
                  value={docForm.categoryId}
                  onChange={(e) => setDocForm({ ...docForm, categoryId: e.target.value })}
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bamboo-field">
                <label htmlFor="edit-description">Mô tả tóm tắt</label>
                <textarea
                  id="edit-description"
                  rows={4}
                  value={docForm.description}
                  onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                />
              </div>

              <div className="bamboo-form-actions">
                <button
                  type="button"
                  className="bamboo-btn bamboo-btn--ghost"
                  onClick={() => setEditingDocument(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bamboo-btn bamboo-btn--primary"
                  disabled={busy === 'edit-document'}
                >
                  {busy === 'edit-document' ? 'Đang lưu…' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          )}

          {/* Document Preview Section */}
          <section className="bamboo-preview-section">
            <div className="bamboo-preview-section__header">
              <div className="bamboo-preview-section__title">
                <Icon name="eye" size={20} />
                <h2>Xem trước tài liệu</h2>
              </div>

              <div className="bamboo-preview-section__tools">
                {isPdf && (
                  <button
                    type="button"
                    onClick={() => setUseGoogleViewer((prev) => !prev)}
                    className="bamboo-btn bamboo-btn--ghost bamboo-btn--sm"
                    title="Chuyển đổi giữa trình đọc trực tiếp và Google Docs Viewer"
                  >
                    {useGoogleViewer ? 'Dùng trình đọc trực tiếp' : 'Dùng Google Docs Viewer'}
                  </button>
                )}
                <a
                  href={document.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bamboo-btn bamboo-btn--ghost bamboo-btn--sm"
                >
                  <Icon name="external" size={14} /> Mở tab mới
                </a>
              </div>
            </div>

            {/* Viewer Display */}
            {isImage ? (
              <div className="bamboo-preview-frame bamboo-preview-frame--image">
                <img src={document.file_url} alt={document.title} />
              </div>
            ) : isPdf ? (
              <div className={`bamboo-preview-frame ${useGoogleViewer ? '' : 'bamboo-preview-frame--dark'}`}>
                {useGoogleViewer ? (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.file_url)}&embedded=true`}
                    title={document.title}
                  />
                ) : (
                  <iframe
                    src={`${document.file_url}#toolbar=1`}
                    title={document.title}
                  />
                )}
              </div>
            ) : isOffice ? (
              <div className="bamboo-preview-frame">
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.file_url)}&embedded=true`}
                  title={document.title}
                />
              </div>
            ) : isGoogleDrive && googleDrivePreviewUrl ? (
              <div className="bamboo-preview-frame">
                <iframe
                  src={googleDrivePreviewUrl}
                  title={document.title}
                  allow="autoplay"
                />
              </div>
            ) : (
              <div className="bamboo-fallback-preview">
                <div className="bamboo-fallback-preview__icon">
                  <Icon name="file" size={44} />
                </div>
                <h3>Tài liệu đính kèm</h3>
                <p>
                  {isLink
                    ? 'Tài liệu này được lưu trữ dưới dạng liên kết ngoài. Bạn có thể mở liên kết để xem đầy đủ nội dung.'
                    : 'Định dạng tệp tin này không hỗ trợ đọc trực tiếp trong trình duyệt. Bạn có thể tải về để mở trên máy tính hoặc điện thoại.'}
                </p>
                <button
                  type="button"
                  className="bamboo-btn bamboo-btn--primary"
                  onClick={download}
                  disabled={!!busy}
                >
                  <Icon name="download" size={16} />
                  <span>{busy === 'download' ? 'Đang chuẩn bị…' : isLink ? 'Mở liên kết' : 'Tải tài liệu về'}</span>
                </button>
              </div>
            )}
          </section>

          {/* Description Section */}
          <section className="bamboo-content-section">
            <h2 className="bamboo-content-section__heading">Giới thiệu & Ghi chú tài liệu</h2>
            <div className="bamboo-description-text">
              {document.description || 'Người chia sẻ chưa thêm mô tả chi tiết cho tài liệu này.'}
            </div>
          </section>

          {/* Reviews & Community Rating Section */}
          <section className="bamboo-content-section">
            <div className="bamboo-reviews-header">
              <div>
                <h2 className="bamboo-content-section__heading">Đánh giá từ cộng đồng</h2>
                <p className="bamboo-reviews-header__count">
                  {document.review_count ?? reviews.length} lượt đánh giá từ người học
                </p>
              </div>

              <div className="bamboo-score-badge">
                <Icon name="star" size={24} />
                <strong>{Number(document.average_rating || 0).toFixed(1)}</strong>
                <span>/ 5.0</span>
              </div>
            </div>

            {/* Review Input Box */}
            <form className="bamboo-review-form" onSubmit={submitReview}>
              <h3>{editingReview ? 'Chỉnh sửa đánh giá của bạn' : 'Gửi nhận xét của bạn'}</h3>

              <div className="bamboo-star-picker" role="radiogroup" aria-label="Chọn số sao đánh giá">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`bamboo-star-picker__btn ${reviewForm.rating >= star ? 'is-active' : ''}`}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    aria-label={`${star} sao`}
                  >
                    <Icon name="star" size={22} />
                  </button>
                ))}
                <span className="bamboo-star-picker__label">
                  {reviewForm.rating === 5 && 'Tuyệt vời, tài liệu rất hữu ích!'}
                  {reviewForm.rating === 4 && 'Rất tốt, nội dung đầy đủ.'}
                  {reviewForm.rating === 3 && 'Bình thường, có thể cải thiện.'}
                  {reviewForm.rating <= 2 && 'Cần hoàn thiện thêm.'}
                </span>
              </div>

              <div className="bamboo-field">
                <textarea
                  rows={3}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Chia sẻ cảm nhận, lời cảm ơn hoặc lưu ý dành cho người học khác…"
                />
              </div>

              <div className="bamboo-review-form__footer">
                {editingReview ? (
                  <button
                    type="button"
                    className="bamboo-btn bamboo-btn--ghost bamboo-btn--sm"
                    onClick={() => {
                      setEditingReview('');
                      setReviewForm({ rating: 5, comment: '' });
                    }}
                  >
                    Hủy sửa
                  </button>
                ) : <span />}

                <button
                  type="submit"
                  className="bamboo-btn bamboo-btn--primary bamboo-btn--sm"
                  disabled={busy === 'review'}
                >
                  <Icon name="check" size={16} />
                  <span>{busy === 'review' ? 'Đang gửi…' : editingReview ? 'Cập nhật nhận xét' : 'Gửi đánh giá'}</span>
                </button>
              </div>
            </form>

            {/* Review List */}
            {reviews.length === 0 ? (
              <div className="bamboo-reviews-empty">
                <Icon name="star" size={24} />
                <p>Chưa có đánh giá nào cho tài liệu này. Hãy là người đầu tiên để lại nhận xét!</p>
              </div>
            ) : (
              <div className="bamboo-review-list">
                {reviews.map((item) => (
                  <article key={item.id} className="bamboo-review-card">
                    <header className="bamboo-review-card__header">
                      <div className="bamboo-review-card__user">
                        <Avatar src={item.avatar} name={item.full_name} size="sm" />
                        <div>
                          <strong>{item.full_name}</strong>
                          <small>{formatDate(item.created_at)}</small>
                        </div>
                      </div>

                      <div className="bamboo-review-card__stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`bamboo-star ${i < Number(item.rating) ? 'is-active' : ''}`}
                          >
                            <Icon name="star" size={14} />
                          </span>
                        ))}
                      </div>
                    </header>

                    {item.comment && <p className="bamboo-review-card__comment">{item.comment}</p>}

                    {(user?.id === item.user_id || user?.role === 'admin') && (
                      <footer className="bamboo-review-card__footer">
                        {user?.id === item.user_id && (
                          <button
                            type="button"
                            className="bamboo-btn-link"
                            onClick={() => {
                              setEditingReview(item.id);
                              setReviewForm({ rating: Number(item.rating), comment: item.comment ?? '' });
                            }}
                          >
                            <Icon name="edit" size={13} /> Sửa
                          </button>
                        )}
                        <button
                          type="button"
                          className="bamboo-btn-link bamboo-btn-link--danger"
                          onClick={() => removeReview(item.id)}
                          disabled={busy === `review-${item.id}`}
                        >
                          <Icon name="trash" size={13} /> Xóa
                        </button>
                      </footer>
                    )}
                  </article>
                ))}

                <Pagination data={reviewPagination} onChange={setReviewPage} />
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Specifications & Quality Sidebar */}
        <aside className="bamboo-detail-sidebar">
          {/* Metadata Card */}
          <div className="bamboo-info-card">
            <h3 className="bamboo-info-card__title">
              <Icon name="layers" size={16} /> Thông số học liệu
            </h3>

            <dl className="bamboo-meta-list">
              <div className="bamboo-meta-item">
                <dt>Định dạng tệp</dt>
                <dd>
                  <span className="bamboo-badge bamboo-badge--sm">{document.file_type || 'FILE'}</span>
                </dd>
              </div>
              <div className="bamboo-meta-item">
                <dt>Dung lượng</dt>
                <dd>{isLink || Number(document.file_size) === 0 ? 'Trực tuyến' : formatFileSize(document.file_size)}</dd>
              </div>
              <div className="bamboo-meta-item">
                <dt>Lượt tải xuống</dt>
                <dd>{document.download_count ?? 0} lần</dd>
              </div>
              <div className="bamboo-meta-item">
                <dt>Lượt xem tài liệu</dt>
                <dd>{document.view_count ?? 0} lượt</dd>
              </div>
              <div className="bamboo-meta-item">
                <dt>Ngày đăng tải</dt>
                <dd>{formatDate(document.created_at)}</dd>
              </div>
              <div className="bamboo-meta-item">
                <dt>Quyền truy cập</dt>
                <dd className="bamboo-color--green">Công khai & Miễn phí</dd>
              </div>
            </dl>
          </div>

          {/* Academic Community Pledge Card */}
          <div className="bamboo-trust-card">
            <div className="bamboo-trust-card__icon">
              <Icon name="shield" size={20} />
            </div>
            <h4>Cam kết tri thức mở</h4>
            <p>
              Tài liệu được chia sẻ phi thương mại nhằm mục đích phục vụ cộng đồng học sinh, sinh
              viên và nghiên cứu sinh. Hãy cùng bảo vệ sự trong sáng của học thuật.
            </p>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Xác nhận xóa tài liệu?"
        description={`Bạn có chắc chắn muốn xóa tài liệu “${document.title}”? Mọi dữ liệu và đánh giá liên quan sẽ bị xóa vĩnh viễn.`}
        confirmLabel="Xóa tài liệu"
        busy={busy === 'delete'}
        onConfirm={removeDocument}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
