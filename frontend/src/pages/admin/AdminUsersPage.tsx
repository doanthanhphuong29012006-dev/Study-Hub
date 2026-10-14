import { useCallback, useEffect, useState } from 'react';
import { Avatar } from '../../components/Avatar';
import { EmptyState, ErrorState, PageLoader } from '../../components/AsyncState';
import { Icon } from '../../components/Icon';
import { Pagination } from '../../components/Pagination';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../lib/api-client';
import { formatDate } from '../../lib/format';
import { adminApi } from '../../services/api';
import type { PaginationData, User, UserRole, UserStatus } from '../../types/api';

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const notify = useToast();
  const [users, setUsers] = useState<User[]>([]); const [pagination, setPagination] = useState<PaginationData | null>();
  const [page, setPage] = useState(1); const [email, setEmail] = useState(''); const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [busy, setBusy] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const response = await adminApi.users(page, 10, query); setUsers(response.users); setPagination(response.pagination); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, [page, query]);
  useEffect(() => { void load(); }, [load]);
  const updateStatus = async (target: User, status: UserStatus) => { setBusy(target.id); try { const response = await adminApi.changeUserStatus(target.id, status); notify(response.message, 'success'); await load(); } catch (err) { notify(getErrorMessage(err), 'error'); } finally { setBusy(''); } };
  const updateRole = async (target: User, role: UserRole) => { setBusy(target.id); try { const response = await adminApi.changeUserRole(target.id, role); notify(response.message, 'success'); await load(); } catch (err) { notify(getErrorMessage(err), 'error'); } finally { setBusy(''); } };
  return <><AdminTitle eyebrow="Quản lý thành viên" title="Người dùng" description="Tìm kiếm, phân quyền và kiểm soát trạng thái tài khoản." /><form className="admin-toolbar" onSubmit={(event) => { event.preventDefault(); setPage(1); setQuery(email.trim()); }} role="search"><div className="search-field"><Icon name="search" size={18} /><label className="sr-only" htmlFor="user-search">Tìm theo email</label><input id="user-search" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Tìm theo email…" /></div><button className="button button--secondary" type="submit">Tìm kiếm</button></form>{loading ? <PageLoader /> : error ? <ErrorState message={error} onRetry={load} /> : users.length === 0 ? <EmptyState title="Không có người dùng" description="Không tìm thấy tài khoản phù hợp với bộ lọc." /> : <><div className="table-wrap"><table><thead><tr><th>Người dùng</th><th>Vai trò</th><th>Trạng thái</th><th>Tham gia</th><th>Thao tác</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><div className="user-cell"><Avatar src={user.avatar} name={user.full_name} size="sm" /><div><strong>{user.full_name}</strong><span>{user.email}</span></div></div></td><td><StatusBadge value={user.role} /></td><td><StatusBadge value={user.status ?? 'active'} /></td><td>{formatDate(user.created_at)}</td><td><div className="table-actions"><label className="sr-only" htmlFor={`role-${user.id}`}>Vai trò của {user.full_name}</label><select id={`role-${user.id}`} value={user.role} disabled={busy === user.id || currentUser?.id === user.id} onChange={(event) => updateRole(user, event.target.value as UserRole)}><option value="student">Sinh viên</option><option value="admin">Quản trị viên</option></select><button className="button button--ghost button--tiny" disabled={busy === user.id || currentUser?.id === user.id} onClick={() => updateStatus(user, user.status === 'locked' ? 'active' : 'locked')}>{user.status === 'locked' ? 'Mở khóa' : 'Khóa'}</button></div></td></tr>)}</tbody></table></div><Pagination data={pagination} onChange={setPage} /></>}</>;
}

function AdminTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <div className="admin-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>; }
export { AdminTitle };
