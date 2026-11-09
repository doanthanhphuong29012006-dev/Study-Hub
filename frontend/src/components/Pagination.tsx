import { Icon } from './Icon';
import type { PaginationData } from '../types/api';

export function Pagination({
  data,
  onChange,
}: {
  data?: PaginationData | null;
  onChange: (page: number) => void;
}) {
  if (!data) return null;

  const currentPage = Number(data.currentPage) || 1;
  const totalPage = Number(data.totalPage) || 1;

  if (totalPage <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPage) }, (_, index) => {
    const start = Math.max(1, Math.min(currentPage - 2, totalPage - 4));
    return start + index;
  });

  return (
    <nav className="bamboo-pagination" aria-label="Phân trang tài liệu">
      <button
        type="button"
        className="bamboo-pagination__btn bamboo-pagination__btn--prev"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        aria-label="Trang trước"
      >
        <Icon name="chevron" size={16} />
      </button>

      {pages.map((page) => (
        <button
          type="button"
          key={page}
          className={`bamboo-pagination__btn ${page === currentPage ? 'is-active' : ''}`}
          onClick={() => onChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Tới trang ${page}`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="bamboo-pagination__btn bamboo-pagination__btn--next"
        disabled={currentPage >= totalPage}
        onClick={() => onChange(currentPage + 1)}
        aria-label="Trang sau"
      >
        <Icon name="chevron" size={16} />
      </button>
    </nav>
  );
}
