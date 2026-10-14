export function PageLoader({ label = 'Đang tải dữ liệu…' }: { label?: string }) {
  return (
    <div className="state-card" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state-card state-card--error" role="alert">
      <span className="state-symbol" aria-hidden="true">!</span>
      <h2>Chưa thể tải dữ liệu</h2>
      <p>{message}</p>
      {onRetry && <button className="button button--secondary" onClick={onRetry}>Thử lại</button>}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="state-card">
      <span className="state-symbol state-symbol--soft" aria-hidden="true">∅</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
