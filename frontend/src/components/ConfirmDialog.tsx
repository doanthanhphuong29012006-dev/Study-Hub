import { Icon } from './Icon';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Xác nhận',
  busy = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="bamboo-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="bamboo-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <button
          type="button"
          className="bamboo-icon-btn bamboo-modal__close"
          onClick={onClose}
          aria-label="Đóng cửa sổ"
        >
          <Icon name="close" size={18} />
        </button>

        <div className="bamboo-modal__icon-wrap">
          <Icon name="trash" size={26} />
        </div>

        <h2 id="confirm-title" className="bamboo-modal__title">
          {title}
        </h2>
        <p className="bamboo-modal__desc">{description}</p>

        <div className="bamboo-modal__actions">
          <button
            type="button"
            className="bamboo-btn bamboo-btn--ghost"
            onClick={onClose}
            disabled={busy}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="bamboo-btn bamboo-btn--danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Đang xử lý…' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
