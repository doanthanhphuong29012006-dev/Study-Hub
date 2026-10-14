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
  const load = useCallback(async () => { setLoading(true); setError(''); try { if (saved) { const response = await userApi.savedDocuments(page); setDocuments(response.savedDocuments); setPagination(response.pagination); } else { const response = await userApi.myDocuments(page); setDocuments(response.documents); setPagination(response.pagination); } } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, [page, saved]);
  useEffect(() => { void load(); }, [load]);
  return <section className="container page-section"><div className="section-heading"><div><span className="eyebrow">Thư viện cá nhân</span><h1>{saved ? 'Tài liệu đã lưu' : 'Tài liệu của tôi'}</h1><p>{saved ? 'Những tài liệu bạn muốn quay lại đọc sau.' : 'Theo dõi trạng thái các tài liệu bạn đã đóng góp.'}</p></div>{!saved && <Link className="button button--primary" to="/upload"><Icon name="upload" size={17} /> Đăng tài liệu</Link>}</div>{loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={load} /> : documents.length === 0 ? <EmptyState title={saved ? 'Bạn chưa lưu tài liệu nào' : 'Bạn chưa đăng tài liệu nào'} description={saved ? 'Khám phá thư viện và lưu lại tài liệu hữu ích.' : 'Hãy bắt đầu bằng việc chia sẻ tài liệu đầu tiên.'} action={<Link className="button button--secondary" to={saved ? '/' : '/upload'}>{saved ? 'Khám phá tài liệu' : 'Đăng tài liệu'}</Link>} /> : <><div className="document-grid">{documents.map((document) => <DocumentCard key={document.id} document={document} showStatus={!saved} />)}</div><Pagination data={pagination} onChange={(next) => setParams({ page: String(next) })} /></>}</section>;
}
