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
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className="icon-button modal__close" onClick={onClose} aria-label="Đóng"><Icon name="close" /></button>
        <h2 id="confirm-title">{title}</h2>
        <p>{description}</p>
        <div className="modal__actions">
          <button className="button button--ghost" onClick={onClose} disabled={busy}>Hủy</button>
          <button className="button button--danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Đang xử lý…' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
