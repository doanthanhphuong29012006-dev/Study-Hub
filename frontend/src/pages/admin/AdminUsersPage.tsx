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
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>();
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.users(page, 10, query);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (target: User, status: UserStatus) => {
    setBusy(target.id);
    try {
      const response = await adminApi.changeUserStatus(target.id, status);
      notify(response.message, 'success');
      await load();
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setBusy('');
    }
  };

  const updateRole = async (target: User, role: UserRole) => {
    setBusy(target.id);
    try {
      const response = await adminApi.changeUserRole(target.id, role);
      notify(response.message, 'success');
      await load();
    } catch (err) {
      notify(getErrorMessage(err), 'error');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="bamboo-admin-page">
      <AdminTitle
        eyebrow="Quản trị"
        title="Quản lý người dùng"
        description="Quản lý tài khoản, vai trò và trạng thái người dùng."
      />

      {/* Toolbar Filter */}
      <form
        className="bamboo-admin-toolbar"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setQuery(email.trim());
        }}
        role="search"
      >
        <div className="bamboo-admin-search-field">
          <Icon name="search" size={18} />
          <label className="sr-only" htmlFor="user-search">
            Tìm theo địa chỉ email
          </label>
          <input
            id="user-search"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Tìm theo email tài khoản…"
          />
        </div>

        <button className="bamboo-btn bamboo-btn--secondary" type="submit">
          Tìm kiếm
        </button>
      </form>

      {/* User Table */}
      {loading ? (
        <PageLoader label="Đang tải danh sách người dùng…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : users.length === 0 ? (
        <EmptyState
          title="Không tìm thấy người dùng"
          description="Không có tài khoản nào phù hợp với bộ lọc tìm kiếm hiện tại."
        />
      ) : (
        <>
          <div className="bamboo-table-wrap">
            <table className="bamboo-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tham gia</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((target) => (
                  <tr key={target.id}>
                    <td>
                      <div className="bamboo-table-user-cell">
                        <Avatar src={target.avatar} name={target.full_name} size="sm" />
                        <div>
                          <strong>{target.full_name}</strong>
                          <small>{target.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge value={target.role} />
                    </td>
                    <td>
                      <StatusBadge value={target.status ?? 'active'} />
                    </td>
                    <td>{formatDate(target.created_at)}</td>
                    <td>
                      <div className="bamboo-table-actions">
                        <label className="sr-only" htmlFor={`role-${target.id}`}>
                          Vai trò của {target.full_name}
                        </label>
                        <select
                          id={`role-${target.id}`}
                          value={target.role}
                          disabled={busy === target.id || currentUser?.id === target.id}
                          onChange={(event) => updateRole(target, event.target.value as UserRole)}
                          className="bamboo-select-sm"
                        >
                          <option value="student">Sinh viên</option>
                          <option value="admin">Quản trị viên</option>
                        </select>

                        <button
                          type="button"
                          className="bamboo-btn bamboo-btn--ghost bamboo-btn--tiny"
                          disabled={busy === target.id || currentUser?.id === target.id}
                          onClick={() =>
                            updateStatus(target, target.status === 'locked' ? 'active' : 'locked')
                          }
                        >
                          {target.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination data={pagination} onChange={setPage} />
        </>
      )}
    </div>
  );
}

export function AdminTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bamboo-admin-heading">
      <div>
        <div className="bamboo-eyebrow">
          <Icon name="leaf" size={14} />
          <span>{eyebrow}</span>
        </div>
        <h1 className="bamboo-admin-heading__title">{title}</h1>
        <p className="bamboo-admin-heading__subtitle">{description}</p>
      </div>
      {action && <div className="bamboo-admin-heading__action">{action}</div>}
    </div>
  );
}
