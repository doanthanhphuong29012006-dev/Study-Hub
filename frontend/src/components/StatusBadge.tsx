const statusConfig: Record<string, { label: string; tone: string }> = {
  active: { label: 'Đang hoạt động', tone: 'green' },
  locked: { label: 'Đã khóa', tone: 'red' },
  pending: { label: 'Chờ duyệt', tone: 'amber' },
  approved: { label: 'Đã duyệt', tone: 'green' },
  rejected: { label: 'Từ chối', tone: 'red' },
  admin: { label: 'Quản trị viên', tone: 'purple' },
  student: { label: 'Sinh viên', tone: 'teal' },
};

export function StatusBadge({ value }: { value: string }) {
  const config = statusConfig[value] ?? { label: value, tone: 'default' };
  return (
    <span className={`bamboo-status-badge bamboo-status-badge--${config.tone}`}>
      <span className="bamboo-status-badge__dot" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
