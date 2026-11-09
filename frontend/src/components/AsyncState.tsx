import { Icon } from './Icon';

export function PageLoader({ label = 'Đang tải dữ liệu…' }: { label?: string }) {
  return (
    <div className="bamboo-async-card" role="status">
      <div className="bamboo-spinner-wrap">
        <span className="bamboo-spinner" aria-hidden="true" />
        <span className="bamboo-spinner__sprout">
          <Icon name="leaf" size={16} />
        </span>
      </div>
      <p className="bamboo-async-card__label">{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bamboo-async-card bamboo-async-card--error" role="alert">
      <div className="bamboo-async-card__icon bamboo-async-card__icon--error">
        <Icon name="close" size={24} />
      </div>
      <h2 className="bamboo-async-card__title">Chưa thể tải dữ liệu</h2>
      <p className="bamboo-async-card__desc">{message}</p>
      {onRetry && (
        <button type="button" className="bamboo-btn bamboo-btn--secondary" onClick={onRetry}>
          <Icon name="leaf" size={16} /> Thử tải lại
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bamboo-async-card bamboo-async-card--empty">
      <div className="bamboo-async-card__icon bamboo-async-card__icon--sprout">
        <Icon name="leaf" size={28} />
      </div>
      <h2 className="bamboo-async-card__title">{title}</h2>
      <p className="bamboo-async-card__desc">{description}</p>
      {action && <div className="bamboo-async-card__action">{action}</div>}
    </div>
  );
}
