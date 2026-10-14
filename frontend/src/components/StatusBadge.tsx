const labels: Record<string, string> = {
  active: 'Hoạt động',
  locked: 'Đã khóa',
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  admin: 'Quản trị viên',
  student: 'Sinh viên',
};

export function StatusBadge({ value }: { value: string }) {
  return <span className={`badge badge--${value}`}>{labels[value] ?? value}</span>;
}
