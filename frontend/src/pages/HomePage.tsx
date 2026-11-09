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
      {/* Hero Section — Bamboo Knowledge Forest */}
      <section className="bamboo-hero">
        <div className="container bamboo-hero__inner">
          <div className="bamboo-hero__content">
            <div className="bamboo-pill">
              <span className="bamboo-pill__dot" aria-hidden="true" />
              <span>Hệ sinh thái học liệu mở StudyHub</span>
            </div>

            <h1 className="bamboo-hero__title">
              Vươn mình cùng tri thức, <em>sẻ chia</em> như rừng tre xanh.
            </h1>

            <p className="bamboo-hero__desc">
              Khám phá và đóng góp tài liệu học tập, giáo trình chuyên ngành, đề thi và đồ án
              chất lượng cao từ sinh viên và giảng viên khắp cả nước.
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
                <Icon name="check" size={16} /> Học liệu mở & miễn phí
              </span>
              <span className="bamboo-hero__trust-item">
                <Icon name="check" size={16} /> Đánh giá minh bạch
              </span>
              <span className="bamboo-hero__trust-item">
                <Icon name="check" size={16} /> Xem trước trực tiếp
              </span>
            </div>
          </div>

          {/* Bamboo Abstract Knowledge Visual */}
          <div className="bamboo-hero__visual" aria-hidden="true">
            <div className="bamboo-stalk-art">
              {/* Culm 1 */}
              <div className="bamboo-culm bamboo-culm--1">
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <div className="bamboo-leaf-sprout bamboo-leaf-sprout--left">
                  <Icon name="leaf" size={24} />
                </div>
              </div>
              {/* Culm 2 with Floating Knowledge Card */}
              <div className="bamboo-culm bamboo-culm--2">
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <div className="bamboo-leaf-sprout bamboo-leaf-sprout--right">
                  <Icon name="leaf" size={28} />
                </div>
              </div>
              {/* Culm 3 */}
              <div className="bamboo-culm bamboo-culm--3">
                <span className="bamboo-node" />
                <span className="bamboo-node" />
                <div className="bamboo-leaf-sprout bamboo-leaf-sprout--left">
                  <Icon name="leaf" size={20} />
                </div>
              </div>

              {/* Floating Abstract Study Plates */}
              <div className="bamboo-plate bamboo-plate--one">
                <span className="bamboo-plate__tag">BÀI GIẢNG CHỌN LỌC</span>
                <strong>TRI THỨC XANH</strong>
                <p>Mỗi tài liệu là một mầm tre nuôi dưỡng tương lai.</p>
                <div className="bamboo-plate__seam" />
              </div>

              <div className="bamboo-plate bamboo-plate--two">
                <div className="bamboo-plate__icon">
                  <Icon name="book" size={32} />
                </div>
                <span>StudyHub Open Community</span>
              </div>

              <div className="bamboo-hero__seal">
                <span>TRE VƯƠN</span>
                <strong>2026</strong>
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
              <span>Kho tàng học liệu</span>
            </div>
            <h2 className="bamboo-section-header__title">Tài liệu học tập mới từ cộng đồng</h2>
            <p className="bamboo-section-header__subtitle">
              Được đóng góp và kiểm duyệt bởi các bạn sinh viên và giảng viên năng động.
            </p>
          </div>

          <Link className="bamboo-btn bamboo-btn--secondary" to="/upload">
            <Icon name="upload" size={16} />
            <span>Chia sẻ tài liệu mới</span>
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
              <option value="created_at">Mới đăng nhất</option>
              <option value="review_count">Nhiều đánh giá nhất</option>
              <option value="view_count">Nhiều lượt xem nhất</option>
              <option value="download_count">Nhiều lượt tải nhất</option>
            </select>
          </div>
        </div>

        {/* Document Results Grid */}
        {loading ? (
          <PageLoader label="Đang chọn lọc tài liệu từ kho tri thức…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : documents.length === 0 ? (
          <EmptyState
            title="Chưa tìm thấy tài liệu phù hợp"
            description="Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác."
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
            <span className="bamboo-pill bamboo-pill--dark">🌱 Cùng vun đắp mầm tri thức</span>
            <h2>Bạn có tài liệu học tập hữu ích muốn sẻ chia?</h2>
            <p>
              Mỗi đề cương, bài giảng hay báo cáo đồ án bạn đăng tải sẽ tiếp sức cho hàng ngàn
              sinh viên khác trên con đường học vấn.
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
