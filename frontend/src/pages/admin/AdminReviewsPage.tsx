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
  const notify = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationData>();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Review>();

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.reviews(page, 10, query);
      setReviews(response.reviews);
      setPagination(response.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const response = await adminApi.removeReview(deleteTarget.id);
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
        eyebrow="Kiểm duyệt cộng đồng"
        title="Đánh giá & Nhận xét"
        description="Theo dõi chất lượng phản hồi và loại bỏ các bình luận tiêu cực hoặc vi phạm quy tắc."
      />

      {/* Toolbar Filter */}
      <form
        className="bamboo-admin-toolbar"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setQuery(keyword.trim());
        }}
        role="search"
      >
        <div className="bamboo-admin-search-field">
          <Icon name="search" size={18} />
          <input
            aria-label="Tìm kiếm trong nội dung bình luận"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo nội dung bình luận hoặc phản hồi…"
          />
        </div>

        <button className="bamboo-btn bamboo-btn--secondary" type="submit">
          Tìm kiếm
        </button>
      </form>

      {/* Review List */}
      {loading ? (
        <PageLoader label="Đang tải danh sách phản hồi…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="Không tìm thấy đánh giá"
          description="Không có nhận xét nào phù hợp với bộ lọc tìm kiếm hiện tại."
        />
      ) : (
        <>
          <div className="bamboo-admin-review-list">
            {reviews.map((review) => (
              <article key={review.id} className="bamboo-admin-review-card">
                <header className="bamboo-admin-review-card__header">
                  <div className="bamboo-admin-review-card__user">
                    <strong>{review.full_name}</strong>
                    <small>
                      {review.email} · {formatDateTime(review.created_at)}
                    </small>
                  </div>

                  <div className="bamboo-admin-review-card__stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`bamboo-star ${i < Number(review.rating) ? 'is-active' : ''}`}
                      >
                        <Icon name="star" size={14} />
                      </span>
                    ))}
                  </div>
                </header>

                <p className="bamboo-admin-review-card__comment">
                  {review.comment || <em>(Người học không để lại bình luận chữ)</em>}
                </p>

                <footer className="bamboo-admin-review-card__footer">
                  <Link
                    to={`/documents/${review.document_id}`}
                    className="bamboo-admin-review-card__link"
                  >
                    <Icon name="file" size={14} />
                    <span>{review.title ?? 'Mở trang tài liệu liên kết'}</span>
                    <Icon name="arrow" size={13} />
                  </Link>

                  <button
                    type="button"
                    className="bamboo-btn bamboo-btn--ghost bamboo-btn--tiny bamboo-btn--danger-ghost"
                    onClick={() => setDeleteTarget(review)}
                  >
                    <Icon name="trash" size={14} /> Xóa đánh giá này
                  </button>
                </footer>
              </article>
            ))}
          </div>

          <Pagination data={pagination} onChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xác nhận xóa đánh giá?"
        description="Đánh giá này sẽ bị gỡ bỏ vĩnh viễn khỏi tài liệu và điểm trung bình sẽ được tính toán lại."
        confirmLabel="Xóa đánh giá"
        busy={busy}
        onConfirm={remove}
        onClose={() => setDeleteTarget(undefined)}
      />
    </div>
  );
}
