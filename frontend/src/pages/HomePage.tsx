import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DocumentCard } from '../components/DocumentCard';
import { EmptyState, ErrorState, PageLoader } from '../components/AsyncState';
import { Icon } from '../components/Icon';
import { Pagination } from '../components/Pagination';
import { getErrorMessage } from '../lib/api-client';
import { categoryApi, documentApi } from '../services/api';
import type { Category, PaginationData, StudyDocument } from '../types/api';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [pagination, setPagination] = useState<PaginationData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '');

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const categoryId = searchParams.get('categoryId') ?? '';
  const sortedBy = (searchParams.get('sortedBy') ?? 'created_at') as 'created_at' | 'review_count' | 'view_count' | 'download_count';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [categoryResponse, documentResponse] = await Promise.all([
        categoryApi.list(),
        documentApi.list({ page, limit: 9, categoryId, keyword: searchParams.get('keyword') ?? '', sortedBy, order: 'DESC' }),
      ]);
      setCategories(categoryResponse.data);
      setDocuments(documentResponse.documents);
      setPagination(documentResponse.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [categoryId, page, searchParams, sortedBy]);

  useEffect(() => { void load(); }, [load]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateFilter('keyword', keyword.trim());
  };

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="pill"><span /> Không gian học tập mở</span>
            <h1>Tri thức tốt hơn khi được <em>chia sẻ.</em></h1>
            <p>Khám phá tài liệu học tập chất lượng, đóng góp kiến thức và cùng cộng đồng StudyHub tiến bộ mỗi ngày.</p>
            <form className="hero-search" onSubmit={submitSearch} role="search">
              <Icon name="search" />
              <label className="sr-only" htmlFor="hero-keyword">Tìm kiếm tài liệu</label>
              <input id="hero-keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm theo tiêu đề hoặc nội dung…" />
              <button className="button button--dark" type="submit">Tìm kiếm</button>
            </form>
            <div className="hero__notes"><span><Icon name="check" size={16} /> Tải lên miễn phí</span><span><Icon name="check" size={16} /> Đánh giá cộng đồng</span></div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <div className="paper paper--one"><span>STUDY NOTES</span><strong>01</strong><i /></div>
            <div className="paper paper--two"><Icon name="book" size={52} /><strong>Share & learn</strong></div>
            <div className="hero__stamp">OPEN<br />KNOWLEDGE</div>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-heading">
          <div><span className="eyebrow">Thư viện cộng đồng</span><h2>Tài liệu mới dành cho bạn</h2></div>
          <Link className="text-link" to="/upload">Chia sẻ tài liệu <Icon name="arrow" size={17} /></Link>
        </div>
        <div className="filters" aria-label="Bộ lọc tài liệu">
          <div className="category-tabs">
            <button className={!categoryId ? 'is-active' : ''} onClick={() => updateFilter('categoryId', '')}>Tất cả</button>
            {categories.map((category) => (
              <button key={category.id} className={categoryId === category.id ? 'is-active' : ''} onClick={() => updateFilter('categoryId', category.id)}>{category.name}</button>
            ))}
          </div>
          <label className="select-field">Sắp xếp
            <select value={sortedBy} onChange={(event) => updateFilter('sortedBy', event.target.value)}>
              <option value="created_at">Mới nhất</option>
              <option value="review_count">Nhiều đánh giá</option>
              <option value="view_count">Nhiều lượt xem</option>
              <option value="download_count">Nhiều lượt tải</option>
            </select>
          </label>
        </div>
        {loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={load} /> : documents.length === 0 ? (
          <EmptyState title="Chưa tìm thấy tài liệu" description="Thử thay đổi từ khóa hoặc danh mục để xem thêm kết quả." />
        ) : (
          <>
            <div className="document-grid">{documents.map((document) => <DocumentCard key={document.id} document={document} />)}</div>
            <Pagination data={pagination} onChange={(nextPage) => { const next = new URLSearchParams(searchParams); next.set('page', String(nextPage)); setSearchParams(next); window.scrollTo({ top: 500, behavior: 'smooth' }); }} />
          </>
        )}
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner"><div><span className="eyebrow">Cùng xây kho tri thức</span><h2>Bạn có tài liệu hữu ích?</h2><p>Một bài ghi chú của bạn có thể giúp nhiều người học tốt hơn.</p></div><Link className="button button--light" to="/upload"><Icon name="upload" size={18} /> Đăng tài liệu ngay</Link></div>
      </section>
    </>
  );
}
