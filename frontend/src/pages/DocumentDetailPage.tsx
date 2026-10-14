import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState, ErrorState, PageLoader } from '../components/AsyncState';
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

  const loadDocument = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [docResponse, saveResponse, categoryResponse] = await Promise.all([
        documentApi.detail(id), documentApi.saveStatus(id), categoryApi.list(),
      ]);
      setDocument(docResponse.document);
      setDocForm({ title: docResponse.document.title, description: docResponse.document.description ?? '', categoryId: docResponse.document.category_id });
      setIsSaved(saveResponse.isSaved);
      setCategories(categoryResponse.data);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }, [id]);

  const loadReviews = useCallback(async () => {
    try { const response = await documentApi.reviews(id, reviewPage, 6); setReviews(response.reviews); setReviewPagination(response.pagination); }
    catch (err) { setError(getErrorMessage(err)); }
  }, [id, reviewPage]);

  useEffect(() => { void loadDocument(); }, [loadDocument]);
  useEffect(() => { void loadReviews(); }, [loadReviews]);

  const toggleSave = async () => { if (busy) return; setBusy('save'); try { const response = isSaved ? await documentApi.unsave(id) : await documentApi.save(id); setIsSaved(!isSaved); notify(response.message, 'success'); } catch (err) { notify(getErrorMessage(err), 'error'); } finally { setBusy(''); } };
  const download = async () => { if (busy) return; setBusy('download'); try { const response = await documentApi.download(id); const anchor = window.document.createElement('a'); anchor.href = response.data.fileUrl; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; anchor.click(); notify(response.message, 'success'); setDocument((current) => current ? { ...current, download_count: Number(current.download_count) + 1 } : current); } catch (err) { notify(getErrorMessage(err), 'error'); } finally { setBusy(''); } };
  const saveDocumentEdit = async (event: React.FormEvent) => { event.preventDefault(); if (!docForm.title.trim()) { setFormError('Tiêu đề không được để trống.'); return; } if (docForm.title.trim().length > 255) { setFormError('Tiêu đề không vượt quá 255 ký tự.'); return; } setBusy('edit-document'); setFormError(''); try { const response = await documentApi.update(id, { title: docForm.title.trim(), description: docForm.description.trim(), categoryId: docForm.categoryId }); setDocument((current) => current ? { ...current, title: docForm.title.trim(), description: docForm.description.trim(), category_id: docForm.categoryId, category_title: categories.find((item) => item.id === docForm.categoryId)?.name ?? current.category_title } : current); notify(response.message, 'success'); setEditingDocument(false); } catch (err) { setFormError(getErrorMessage(err)); } finally { setBusy(''); } };
  const deleteDocument = async () => { setBusy('delete-document'); try { const response = await documentApi.remove(id); notify(response.message, 'success'); navigate('/my-documents', { replace: true }); } catch (err) { notify(getErrorMessage(err), 'error'); setBusy(''); setDeleteOpen(false); } };
  const submitReview = async (event: React.FormEvent) => { event.preventDefault(); if (reviewForm.comment.length > 500) { setFormError('Nội dung đánh giá không vượt quá 500 ký tự.'); return; } setBusy('review'); setFormError(''); try { const body = { rating: reviewForm.rating, comment: reviewForm.comment.trim() || null }; const oldReview = reviews.find((item) => item.id === editingReview); const response = editingReview ? await reviewApi.update(editingReview, body) : await documentApi.createReview(id, body); setDocument((current) => { if (!current) return current; const count = Number(current.review_count); const average = Number(current.average_rating); if (editingReview && oldReview && count > 0) return { ...current, average_rating: Math.max(0, (average * count - Number(oldReview.rating) + reviewForm.rating) / count) }; const nextCount = count + 1; return { ...current, review_count: nextCount, average_rating: (average * count + reviewForm.rating) / nextCount }; }); notify(response.message, 'success'); setReviewForm({ rating: 5, comment: '' }); setEditingReview(''); await loadReviews(); } catch (err) { setFormError(getErrorMessage(err)); } finally { setBusy(''); } };
  const startEditReview = (review: Review) => { setEditingReview(review.id); setReviewForm({ rating: Number(review.rating), comment: review.comment ?? '' }); window.document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' }); };
  const deleteReview = async (reviewId: string) => { if (!window.confirm('Bạn chắc chắn muốn xóa đánh giá này?')) return; setBusy(reviewId); try { const removedReview = reviews.find((item) => item.id === reviewId); const response = await reviewApi.remove(reviewId); setDocument((current) => { if (!current || !removedReview) return current; const count = Number(current.review_count); const nextCount = Math.max(0, count - 1); const nextAverage = nextCount ? Math.max(0, (Number(current.average_rating) * count - Number(removedReview.rating)) / nextCount) : 0; return { ...current, review_count: nextCount, average_rating: nextAverage }; }); notify(response.message, 'success'); await loadReviews(); } catch (err) { notify(getErrorMessage(err), 'error'); } finally { setBusy(''); } };

  if (loading) return <section className="container page-section"><PageLoader /></section>;
  if (error || !document) return <section className="container page-section"><ErrorState message={error || 'Không tìm thấy tài liệu.'} onRetry={loadDocument} /></section>;
  const canManage = user?.role === 'admin' || user?.id === document.uploader_id;

  return <section className="container page-section detail-page">
    <nav className="breadcrumbs" aria-label="Đường dẫn"><Link to="/">Thư viện</Link><Icon name="chevron" size={14} /><span>{document.category_title ?? 'Tài liệu'}</span></nav>
    <div className="detail-layout">
      <article className="detail-main">
        <header className="detail-header"><div className="file-mark file-mark--large"><Icon name="file" size={31} /></div><div><div className="detail-header__labels"><span className="eyebrow">{document.category_title ?? document.file_type}</span><StatusBadge value={document.status} /></div><h1>{document.title}</h1><div className="author-line"><Avatar src={document.uploader_avatar} name={document.uploader_name} size="sm" /><span>Đăng bởi <strong>{document.uploader_name ?? 'Thành viên StudyHub'}</strong> · {formatDate(document.created_at)}</span></div></div></header>
        <div className="detail-actions"><button className="button button--primary" onClick={download} disabled={!!busy}><Icon name="download" size={18} /> {busy === 'download' ? 'Đang chuẩn bị…' : 'Tải tài liệu'}</button><button className={`button button--secondary ${isSaved ? 'is-saved' : ''}`} onClick={toggleSave} disabled={!!busy}><Icon name="bookmark" size={18} /> {isSaved ? 'Đã lưu' : 'Lưu lại'}</button>{canManage && <><button className="button button--ghost" onClick={() => setEditingDocument((value) => !value)}><Icon name="edit" size={17} /> Sửa</button><button className="icon-button icon-button--danger" onClick={() => setDeleteOpen(true)} aria-label="Xóa tài liệu"><Icon name="trash" /></button></>}</div>
        {editingDocument && <form className="form-card compact-form" onSubmit={saveDocumentEdit}>{formError && <div className="form-alert" role="alert">{formError}</div>}<h2>Chỉnh sửa tài liệu</h2><div className="field"><label htmlFor="edit-title">Tiêu đề</label><input id="edit-title" maxLength={255} value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} /></div><div className="field"><label htmlFor="edit-category">Danh mục</label><select id="edit-category" value={docForm.categoryId} onChange={(e) => setDocForm({ ...docForm, categoryId: e.target.value })}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div className="field"><label htmlFor="edit-description">Mô tả</label><textarea id="edit-description" rows={4} value={docForm.description} onChange={(e) => setDocForm({ ...docForm, description: e.target.value })} /></div><div className="form-actions"><button className="button button--ghost" type="button" onClick={() => setEditingDocument(false)}>Hủy</button><button className="button button--primary" disabled={busy === 'edit-document'}>{busy === 'edit-document' ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div></form>}
        <section className="content-section"><h2>Giới thiệu tài liệu</h2><p className="document-description">{document.description || 'Người đăng chưa thêm mô tả cho tài liệu này.'}</p></section>
        <section className="content-section reviews-section"><div className="section-heading section-heading--compact"><div><span className="eyebrow">Cộng đồng nhận xét</span><h2>{document.review_count} đánh giá</h2></div><div className="rating-summary"><Icon name="star" size={23} /><strong>{Number(document.average_rating || 0).toFixed(1)}</strong><span>/ 5</span></div></div>
          <form id="review-form" className="review-form" onSubmit={submitReview}><h3>{editingReview ? 'Chỉnh sửa đánh giá' : 'Bạn thấy tài liệu này thế nào?'}</h3>{formError && !editingDocument && <div className="form-alert" role="alert">{formError}</div>}<fieldset className="rating-input"><legend>Chọn số sao</legend>{[1,2,3,4,5].map((rating) => <button key={rating} type="button" className={rating <= reviewForm.rating ? 'is-active' : ''} onClick={() => setReviewForm({ ...reviewForm, rating })} aria-label={`${rating} sao`}><Icon name="star" size={24} /></button>)}</fieldset><label className="sr-only" htmlFor="review-comment">Nội dung đánh giá</label><textarea id="review-comment" rows={3} maxLength={500} value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Chia sẻ cảm nhận của bạn (không bắt buộc)…" /><div className="review-form__footer"><small>{reviewForm.comment.length}/500</small><div>{editingReview && <button className="button button--ghost button--small" type="button" onClick={() => { setEditingReview(''); setReviewForm({ rating: 5, comment: '' }); }}>Hủy sửa</button>}<button className="button button--primary button--small" disabled={busy === 'review'}>{busy === 'review' ? 'Đang gửi…' : editingReview ? 'Lưu đánh giá' : 'Gửi đánh giá'}</button></div></div></form>
          {reviews.length === 0 ? <EmptyState title="Chưa có đánh giá" description="Hãy là người đầu tiên chia sẻ cảm nhận về tài liệu." /> : <div className="review-list">{reviews.map((review) => <article className="review-item" key={review.id}><Avatar src={review.avatar} name={review.full_name} /><div><header><div><strong>{review.full_name}</strong><span>{formatDate(review.created_at)}</span></div><div className="stars" aria-label={`${review.rating} trên 5 sao`}>{[1,2,3,4,5].map((star) => <span className={star <= Number(review.rating) ? 'is-active' : ''} key={star}><Icon name="star" size={14} /></span>)}</div></header><p>{review.comment || <em>Không có nhận xét.</em>}</p>{(user?.id === review.user_id || user?.role === 'admin') && <div className="review-item__actions">{user?.id === review.user_id && <button onClick={() => startEditReview(review)}><Icon name="edit" size={14} /> Sửa</button>}<button onClick={() => deleteReview(review.id)} disabled={busy === review.id}><Icon name="trash" size={14} /> Xóa</button></div>}</div></article>)}</div>}<Pagination data={reviewPagination} onChange={setReviewPage} />
        </section>
      </article>
      <aside className="detail-sidebar"><div className="info-card"><h2>Thông tin tệp</h2><dl><div><dt>Định dạng</dt><dd>{document.file_type}</dd></div><div><dt>Dung lượng</dt><dd>{formatFileSize(document.file_size)}</dd></div><div><dt>Lượt xem</dt><dd>{document.view_count}</dd></div><div><dt>Lượt tải</dt><dd>{document.download_count}</dd></div></dl></div><div className="info-note"><Icon name="heart" /><p>Hãy tôn trọng bản quyền và chỉ sử dụng tài liệu cho mục đích học tập.</p></div></aside>
    </div>
    <ConfirmDialog open={deleteOpen} title="Xóa tài liệu?" description="Tài liệu và dữ liệu liên quan sẽ bị xóa khỏi hệ thống. Thao tác này không thể hoàn tác." confirmLabel="Xóa tài liệu" busy={busy === 'delete-document'} onConfirm={deleteDocument} onClose={() => setDeleteOpen(false)} />
  </section>;
}
