import { Icon } from './Icon';
import type { PaginationData } from '../types/api';

export function Pagination({ data, onChange }: { data?: PaginationData | null; onChange: (page: number) => void }) {
  if (!data || data.totalPage <= 1) return null;
  const pages = Array.from({ length: Math.min(5, data.totalPage) }, (_, index) => {
    const start = Math.max(1, Math.min(data.currentPage - 2, data.totalPage - 4));
    return start + index;
  });
  return (
    <nav className="pagination" aria-label="Phân trang">
      <button
        className="pagination__button"
        disabled={data.currentPage <= 1}
        onClick={() => onChange(data.currentPage - 1)}
        aria-label="Trang trước"
      >
        <Icon name="chevron" size={17} />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`pagination__button ${page === data.currentPage ? 'is-active' : ''}`}
          onClick={() => onChange(page)}
          aria-current={page === data.currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination__button pagination__button--next"
        disabled={data.currentPage >= data.totalPage}
        onClick={() => onChange(data.currentPage + 1)}
        aria-label="Trang sau"
      >
        <Icon name="chevron" size={17} />
      </button>
    </nav>
  );
}
