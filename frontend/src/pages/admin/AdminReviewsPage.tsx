import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState, ErrorState, PageLoader } from '../../components/AsyncState';
import { Icon } from '../../components/Icon';
import { Pagination } from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../lib/api-client';
import { formatDateTime } from '../../lib/format';
import { adminApi } from '../../services/api';
import type { PaginationData, Review } from '../../types/api';
import { AdminTitle } from './AdminUsersPage';

export function AdminReviewsPage() {
  const notify = useToast(); const [reviews, setReviews] = useState<Review[]>([]); const [pagination, setPagination] = useState<PaginationData>(); const [page, setPage] = useState(1); const [keyword, setKeyword] = useState(''); const [query, setQuery] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [deleteTarget, setDeleteTarget] = useState<Review>();
  const load = useCallback(async () => { setLoading(true); setError(''); try { const response = await adminApi.reviews(page, 10, query); setReviews(response.reviews); setPagination(response.pagination); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, [page, query]);
  useEffect(() => { void load(); }, [load]);
  const remove = async () => { if (!deleteTarget) return; setBusy(true); try { const response = await adminApi.removeReview(deleteTarget.id); notify(response.message, 'success'); setDeleteTarget(undefined); await load(); } catch (err) { notify(getErrorMessage(err), 'error'); } finally { setBusy(false); } };
  return <><AdminTitle eyebrow="Kiểm duyệt cộng đồng" title="Đánh giá" description="Theo dõi và loại bỏ những đánh giá không phù hợp." /><form className="admin-toolbar" onSubmit={(event) => { event.preventDefault(); setPage(1); setQuery(keyword); }} role="search"><div className="search-field"><Icon name="search" size={18} /><input aria-label="Tìm trong bình luận" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm trong nội dung bình luận…" /></div><button className="button button--secondary" type="submit">Tìm kiếm</button></form>{loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={load} /> : reviews.length === 0 ? <EmptyState title="Không có đánh giá" description="Không tìm thấy đánh giá phù hợp." /> : <><div className="review-admin-list">{reviews.map((review) => <article key={review.id}><header><div><strong>{review.full_name}</strong><span>{review.email} · {formatDateTime(review.created_at)}</span></div><div className="stars stars--active">{Array.from({ length: Number(review.rating) }, (_, index) => <Icon key={index} name="star" size={14} />)}</div></header><p>{review.comment || <em>Không có nội dung bình luận.</em>}</p><footer><Link to={`/documents/${review.document_id}`}>{review.title ?? 'Mở tài liệu'} <Icon name="arrow" size={14} /></Link><button className="button button--ghost button--tiny" onClick={() => setDeleteTarget(review)}><Icon name="trash" size={14} /> Xóa</button></footer></article>)}</div><Pagination data={pagination} onChange={setPage} /></>}<ConfirmDialog open={!!deleteTarget} title="Xóa đánh giá?" description="Đánh giá sẽ bị xóa vĩnh viễn khỏi tài liệu." confirmLabel="Xóa đánh giá" busy={busy} onConfirm={remove} onClose={() => setDeleteTarget(undefined)} /></>;
}
