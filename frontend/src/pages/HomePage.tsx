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
  const sortedBy = (searchParams.get('sortedBy') ?? 'created_at') as
    | 'created_at'
    | 'review_count'
    | 'view_count'
    | 'download_count';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [categoryResponse, documentResponse] = await Promise.all([
        categoryApi.list(),
        documentApi.list({
          page,
          limit: 9,
          categoryId,
          keyword: searchParams.get('keyword') ?? '',
          sortedBy,
          order: 'DESC',
        }),
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

  useEffect(() => {
    void load();
  }, [load]);

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
    <div className="bamboo-home">
      {/* Hero Section */}
      <section className="bamboo-hero">
        <div className="container bamboo-hero__inner">
          <div className="bamboo-hero__content">
            <div className="bamboo-pill">
              <span className="bamboo-pill__dot" aria-hidden="true" />
              <span>Nền tảng chia sẻ tài liệu học tập</span>
            </div>

            <h1 className="bamboo-hero__title">
              Chia sẻ tài liệu, <em>kết nối</em> kiến thức.
            </h1>

            <p className="bamboo-hero__desc">
              Tìm kiếm và tải về giáo trình, bài giảng, đề thi và tài liệu học tập chất lượng từ
              cộng đồng sinh viên.
            </p>

            {/* Central Search Widget */}
            <form className="bamboo-search-form" onSubmit={submitSearch} role="search">
              <span className="bamboo-search-form__icon" aria-hidden="true">
                <Icon name="search" size={20} />
              </span>
              <label className="sr-only" htmlFor="bamboo-search-input">
                Tìm kiếm tài liệu học tập
              </label>
              <input
                id="bamboo-search-input"
                className="bamboo-search-form__input"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm giáo trình, đề thi, bài tập hoặc tác giả…"
              />
              {keyword && (
                <button
                  type="button"
                  className="bamboo-search-form__clear"
                  onClick={() => {
                    setKeyword('');
                    updateFilter('keyword', '');
                  }}
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
              <button className="bamboo-btn bamboo-btn--primary" type="submit">
                Tìm kiếm
              </button>
            </form>

            {/* Value Trust Markers */}
            <div className="bamboo-hero__trust">
              <span className="bamboo-hero__trust-item">
                <Icon name="check" size={16} /> Tài liệu miễn phí
              </span>
              <span className="bamboo-hero__trust-item">
                <Icon name="check" size={16} /> Xem trước trực tiếp
              </span>
              <span className="bamboo-hero__trust-item">
                <Icon name="check" size={16} /> Đánh giá từ cộng đồng
              </span>
            </div>
          </div>

          {/* Bamboo Abstract Art */}
          <div className="bamboo-hero__visual" aria-hidden="true">
            <div className="bamboo-stalk-art">
              <div className="bamboo-culm bamboo-culm--1">
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <div className="bamboo-leaf-sprout bamboo-leaf-sprout--left">
                  <Icon name="leaf" size={24} />
                </div>
              </div>
              <div className="bamboo-culm bamboo-culm--2">
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <div className="bamboo-leaf-sprout bamboo-leaf-sprout--right">
                  <Icon name="leaf" size={28} />
                </div>
              </div>
              <div className="bamboo-culm bamboo-culm--3">
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <div className="bamboo-leaf-sprout bamboo-leaf-sprout--left">
                  <Icon name="leaf" size={20} />
                </div>
              </div>

              {/* Study Plates */}
              <div className="bamboo-plate bamboo-plate--one">
                <span className="bamboo-plate__tag">TÀI LIỆU HỌC TẬP</span>
                <strong>STUDY NOTES</strong>
                <p>Cùng học tập, chia sẻ và phát triển kiến thức.</p>
                <div className="bamboo-plate__seam" />
              </div>

              <div className="bamboo-plate bamboo-plate--two">
                <div className="bamboo-plate__icon">
                  <Icon name="book" size={32} />
                </div>
                <span>StudyHub Community</span>
              </div>

              <div className="bamboo-hero__seal">
                <span>STUDY</span>
                <strong>HUB</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="container bamboo-catalog-section">
        <div className="bamboo-section-header">
          <div>
            <div className="bamboo-eyebrow">
              <Icon name="leaf" size={14} />
              <span>Tài liệu</span>
            </div>
            <h2 className="bamboo-section-header__title">Tài liệu mới nhất</h2>
            <p className="bamboo-section-header__subtitle">
              Khám phá các tài liệu vừa được chia sẻ bởi cộng đồng sinh viên.
            </p>
          </div>

          <Link className="bamboo-btn bamboo-btn--secondary" to="/upload">
            <Icon name="upload" size={16} />
            <span>Đăng tài liệu</span>
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="bamboo-filter-bar">
          <div className="bamboo-categories-wrap" aria-label="Bộ lọc danh mục">
            <button
              type="button"
              className={`bamboo-cat-chip ${!categoryId ? 'is-active' : ''}`}
              onClick={() => updateFilter('categoryId', '')}
            >
              <Icon name="layers" size={14} />
              <span>Tất cả</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`bamboo-cat-chip ${categoryId === category.id ? 'is-active' : ''}`}
                onClick={() => updateFilter('categoryId', category.id)}
              >
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <div className="bamboo-sort-field">
            <label htmlFor="bamboo-sort-select">
              <Icon name="trending" size={15} /> Sắp xếp:
            </label>
            <select
              id="bamboo-sort-select"
              value={sortedBy}
              onChange={(event) => updateFilter('sortedBy', event.target.value)}
            >
              <option value="created_at">Mới nhất</option>
              <option value="review_count">Nhiều đánh giá nhất</option>
              <option value="view_count">Nhiều lượt xem nhất</option>
              <option value="download_count">Nhiều lượt tải nhất</option>
            </select>
          </div>
        </div>

        {/* Document Results Grid */}
        {loading ? (
          <PageLoader label="Đang tải danh sách tài liệu…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : documents.length === 0 ? (
          <EmptyState
            title="Không tìm thấy tài liệu"
            description="Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác."
            action={
              <button
                type="button"
                className="bamboo-btn bamboo-btn--secondary"
                onClick={() => {
                  setKeyword('');
                  const next = new URLSearchParams();
                  setSearchParams(next);
                }}
              >
                Xóa bộ lọc tìm kiếm
              </button>
            }
          />
        ) : (
          <>
            <div className="bamboo-grid">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>

            <Pagination data={pagination} onChange={(nextPage) => updateFilter('page', String(nextPage))} />
          </>
        )}
      </section>

      {/* Community Contribution Band */}
      <section className="bamboo-cta-band">
        <div className="container bamboo-cta-band__inner">
          <div className="bamboo-cta-band__text">
            <span className="bamboo-pill bamboo-pill--dark">Chia sẻ tài liệu</span>
            <h2>Bạn có tài liệu học tập muốn chia sẻ?</h2>
            <p>
              Đăng tải giáo trình, đề thi hoặc bài tập để cùng hỗ trợ các bạn sinh viên khác học tập tốt hơn.
            </p>
          </div>
          <Link className="bamboo-btn bamboo-btn--primary bamboo-btn--lg" to="/upload">
            <Icon name="upload" size={18} />
            <span>Đăng tài liệu ngay</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
