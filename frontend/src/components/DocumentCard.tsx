import { Link } from 'react-router-dom';
import { formatDate, formatFileSize } from '../lib/format';
import type { StudyDocument } from '../types/api';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';

export function DocumentCard({ document, showStatus = false }: { document: StudyDocument; showStatus?: boolean }) {
  const extension = document.file_type?.split('/').pop()?.toUpperCase() || 'FILE';
  return (
    <article className="document-card">
      <div className="document-card__top">
        <span className="file-mark"><Icon name="file" size={22} /></span>
        <div>
          <span className="eyebrow">{document.category_title ?? extension}</span>
          {showStatus && <StatusBadge value={document.status} />}
        </div>
      </div>
      <div className="document-card__body">
        <h3><Link to={`/documents/${document.id}`}>{document.title}</Link></h3>
        <p>{document.description || 'Tài liệu chưa có mô tả.'}</p>
      </div>
      <div className="document-card__meta">
        <span><Icon name="star" size={15} /> {Number(document.average_rating || 0).toFixed(1)}</span>
        <span><Icon name="download" size={15} /> {document.download_count ?? 0}</span>
        <span>{formatFileSize(document.file_size)}</span>
      </div>
      <footer className="document-card__footer">
        <span>{formatDate(document.saved_at ?? document.created_at)}</span>
        <Link className="text-link" to={`/documents/${document.id}`}>Xem tài liệu <Icon name="arrow" size={16} /></Link>
      </footer>
    </article>
  );
}
