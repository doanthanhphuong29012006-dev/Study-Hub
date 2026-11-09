import { Link } from 'react-router-dom';
import { formatDate, formatFileSize } from '../lib/format';
import type { StudyDocument } from '../types/api';
import { Icon } from './Icon';
import { StatusBadge } from './StatusBadge';

export function DocumentCard({
  document,
  showStatus = false,
}: {
  document: StudyDocument;
  showStatus?: boolean;
}) {
  const isLink = document.file_type === 'link';
  const rawExt = isLink ? 'LINK' : document.file_type?.split('/').pop()?.toUpperCase() || 'TỆP';
  const formatLabel = rawExt === 'PDF' ? 'PDF' : rawExt === 'VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT' ? 'DOCX' : rawExt;

  return (
    <article className="bamboo-card">
      <div className="bamboo-card__header">
        <div className="bamboo-card__format-tag" data-format={formatLabel.toLowerCase()}>
          <Icon name={isLink ? 'external' : 'file'} size={15} />
          <span>{formatLabel}</span>
        </div>

        <div className="bamboo-card__category-wrap">
          <span className="bamboo-card__category">
            <Icon name="leaf" size={13} />
            {document.category_title ?? 'Chung'}
          </span>
          {showStatus && <StatusBadge value={document.status} />}
        </div>
      </div>

      <div className="bamboo-card__body">
        <h3 className="bamboo-card__title">
          <Link to={`/documents/${document.id}`}>{document.title}</Link>
        </h3>
        <p className="bamboo-card__desc">
          {document.description || 'Tài liệu học tập được chia sẻ bởi thành viên cộng đồng StudyHub.'}
        </p>
      </div>

      <div className="bamboo-card__metrics">
        <span className="bamboo-card__metric" title="Điểm đánh giá trung bình">
          <Icon name="star" size={14} />
          <strong>{Number(document.average_rating || 0).toFixed(1)}</strong>
        </span>
        <span className="bamboo-card__metric" title="Lượt tải về">
          <Icon name="download" size={14} />
          <span>{document.download_count ?? 0}</span>
        </span>
        <span className="bamboo-card__metric" title="Dung lượng tệp">
          <Icon name="layers" size={14} />
          <span>{isLink || Number(document.file_size) === 0 ? 'Trực tuyến' : formatFileSize(document.file_size)}</span>
        </span>
      </div>

      <div className="bamboo-card__node-seam" aria-hidden="true" />

      <footer className="bamboo-card__footer">
        <span className="bamboo-card__date">
          {formatDate(document.saved_at ?? document.created_at)}
        </span>
        <Link className="bamboo-card__link" to={`/documents/${document.id}`}>
          <span>Xem tài liệu</span>
          <Icon name="arrow" size={15} />
        </Link>
      </footer>
    </article>
  );
}
