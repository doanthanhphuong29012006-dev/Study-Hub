import { Icon } from './Icon';
import type { PaginationData } from '../types/api';

export function Pagination({
  data,
  onChange,
}: {
  data?: PaginationData | null;
  onChange: (page: number) => void;
}) {
  if (!data || data.totalPage <= 1) return null;

  const pages = Array.from({ length: Math.min(5, data.totalPage) }, (_, index) => {
    const start = Math.max(1, Math.min(data.currentPage - 2, data.totalPage - 4));
    return start + index;
  });

  return (
    <nav className="bamboo-pagination" aria-label="Phân trang tài liệu">
      <button
        type="button"
        className="bamboo-pagination__btn bamboo-pagination__btn--prev"
        disabled={data.currentPage <= 1}
        onClick={() => onChange(data.currentPage - 1)}
        aria-label="Trang trước"
      >
        <Icon name="chevron" size={16} />
      </button>

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          className={`bamboo-pagination__btn ${page === data.currentPage ? 'is-active' : ''}`}
          onClick={() => onChange(page)}
          aria-current={page === data.currentPage ? 'page' : undefined}
          aria-label={`Tới trang ${page}`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="bamboo-pagination__btn bamboo-pagination__btn--next"
        disabled={data.currentPage >= data.totalPage}
        onClick={() => onChange(data.currentPage + 1)}
        aria-label="Trang sau"
      >
        <Icon name="chevron" size={16} />
      </button>
    </nav>
  );
}
