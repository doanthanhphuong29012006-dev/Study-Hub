import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState, ErrorState, PageLoader } from '../components/AsyncState';
import { DocumentCard } from '../components/DocumentCard';
import { Icon } from '../components/Icon';
import { Pagination } from '../components/Pagination';
import { getErrorMessage } from '../lib/api-client';
import { userApi } from '../services/api';
import type { PaginationData, StudyDocument } from '../types/api';

export function LibraryPage({ mode }: { mode: 'mine' | 'saved' }) {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [pagination, setPagination] = useState<PaginationData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const saved = mode === 'saved';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (saved) {
        const response = await userApi.savedDocuments(page);
        setDocuments(response.savedDocuments);
        setPagination(response.pagination);
      } else {
        const response = await userApi.myDocuments(page);
        setDocuments(response.documents);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, saved]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="container bamboo-library-page">
      {/* Header Banner */}
      <div className="bamboo-page-heading">
        <div className="bamboo-page-heading__main">
          <div className="bamboo-eyebrow">
            <Icon name="bookmark" size={14} />
            <span>Tủ sách tri thức cá nhân</span>
          </div>
          <h1 className="bamboo-page-heading__title">
            {saved ? 'Tài liệu bạn đã lưu' : 'Tài liệu bạn đã đóng góp'}
          </h1>
          <p className="bamboo-page-heading__subtitle">
            {saved
              ? 'Kho lưu trữ những tài liệu giá trị bạn muốn quay lại nghiên cứu và ôn luyện.'
              : 'Theo dõi tình trạng phê duyệt và số lượt tương tác từ tài liệu bạn chia sẻ.'}
          </p>
        </div>

        <div className="bamboo-page-heading__actions">
          <div className="bamboo-tab-pill-group">
            <Link
              to="/saved"
              className={`bamboo-tab-pill ${saved ? 'is-active' : ''}`}
            >
              <Icon name="bookmark" size={15} />
              <span>Đã lưu</span>
            </Link>
            <Link
              to="/my-documents"
              className={`bamboo-tab-pill ${!saved ? 'is-active' : ''}`}
            >
              <Icon name="folder" size={15} />
              <span>Của tôi</span>
            </Link>
          </div>

          {!saved && (
            <Link className="bamboo-btn bamboo-btn--primary" to="/upload">
              <Icon name="upload" size={16} />
              <span>Đăng tài liệu</span>
            </Link>
          )}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <PageLoader label="Đang mở tủ sách tri thức của bạn…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : documents.length === 0 ? (
        <EmptyState
          title={saved ? 'Tủ sách chưa có tài liệu lưu trữ' : 'Bạn chưa chia sẻ tài liệu nào'}
          description={
            saved
              ? 'Khi khám phá được tài liệu hữu ích, bấm “Lưu vào tủ sách” để dễ dàng xem lại bất cứ lúc nào.'
              : 'Hãy chia sẻ tài liệu học tập đầu tiên để cùng bồi đắp cộng đồng tri thức StudyHub.'
          }
          action={
            <Link
              className="bamboo-btn bamboo-btn--primary"
              to={saved ? '/' : '/upload'}
            >
              <Icon name={saved ? 'leaf' : 'upload'} size={16} />
              <span>{saved ? 'Khám phá tài liệu ngay' : 'Đăng tải tài liệu đầu tiên'}</span>
            </Link>
          }
        />
      ) : (
        <>
          <div className="bamboo-grid">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} showStatus={!saved} />
            ))}
          </div>

          <Pagination
            data={pagination}
            onChange={(next) => setParams({ page: String(next) })}
          />
        </>
      )}
    </div>
  );
}
