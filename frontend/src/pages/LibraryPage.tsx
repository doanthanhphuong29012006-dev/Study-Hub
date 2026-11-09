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

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(params);
    if (nextPage > 1) {
      next.set('page', String(nextPage));
    } else {
      next.delete('page');
    }
    setParams(next);
  };

  return (
    <div className="container bamboo-library-page">
      {/* Header Banner */}
      <div className="bamboo-page-heading">
        <div className="bamboo-page-heading__main">
          <div className="bamboo-eyebrow">
            <Icon name="bookmark" size={14} />
            <span>Tài liệu cá nhân</span>
          </div>
          <h1 className="bamboo-page-heading__title">
            {saved ? 'Tài liệu đã lưu' : 'Tài liệu của tôi'}
          </h1>
          <p className="bamboo-page-heading__subtitle">
            {saved
              ? 'Danh sách các tài liệu bạn đã lưu để xem lại sau.'
              : 'Quản lý và theo dõi các tài liệu bạn đã đăng tải lên hệ thống.'}
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
              <span>Tài liệu của tôi</span>
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
        <PageLoader label="Đang tải danh sách tài liệu…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : documents.length === 0 ? (
        <EmptyState
          title={saved ? 'Bạn chưa lưu tài liệu nào' : 'Bạn chưa đăng tài liệu nào'}
          description={
            saved
              ? 'Khám phá kho tài liệu và bấm “Lưu tài liệu” để xem lại sau tại đây.'
              : 'Hãy bắt đầu chia sẻ tài liệu học tập đầu tiên của bạn.'
          }
          action={
            <Link
              className="bamboo-btn bamboo-btn--primary"
              to={saved ? '/' : '/upload'}
            >
              <Icon name={saved ? 'leaf' : 'upload'} size={16} />
              <span>{saved ? 'Khám phá tài liệu' : 'Đăng tài liệu'}</span>
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
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
