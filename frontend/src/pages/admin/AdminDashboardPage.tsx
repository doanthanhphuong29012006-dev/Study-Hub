import { useEffect, useState } from 'react';
import { ErrorState, PageLoader } from '../../components/AsyncState';
import { Icon } from '../../components/Icon';
import { getErrorMessage } from '../../lib/api-client';
import { adminApi, categoryApi } from '../../services/api';

interface Stats { documents: number; users: number; reviews: number; categories: number; pending: number; }

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); setError(''); try { const [documents, users, reviews, categories, pending] = await Promise.all([adminApi.documents({ page: 1, limit: 1 }), adminApi.users(1, 1), adminApi.reviews(1, 1), categoryApi.list(), adminApi.documents({ page: 1, limit: 100, sortedBy: 'created_at' })]); setStats({ documents: Number(documents.pagination.totalCount), users: Number(users.pagination?.totalCount ?? users.users.length), reviews: Number(reviews.pagination.totalCount), categories: categories.data.length, pending: pending.documents.filter((item) => item.status === 'pending').length }); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  if (loading) return <PageLoader label="Đang tổng hợp dữ liệu…" />;
  if (error || !stats) return <ErrorState message={error || 'Không có dữ liệu.'} onRetry={load} />;
  const cards = [{ label: 'Tổng tài liệu', value: stats.documents, icon: 'file' as const, tone: 'blue' }, { label: 'Người dùng', value: stats.users, icon: 'users' as const, tone: 'green' }, { label: 'Đánh giá', value: stats.reviews, icon: 'star' as const, tone: 'yellow' }, { label: 'Danh mục', value: stats.categories, icon: 'book' as const, tone: 'purple' }];
  return <><div className="admin-heading"><div><span className="eyebrow">Trung tâm quản trị</span><h1>Tổng quan hệ thống</h1><p>Theo dõi nhanh hoạt động của StudyHub.</p></div></div><div className="stats-grid">{cards.map((card) => <article className="stat-card" key={card.label}><span className={`stat-card__icon stat-card__icon--${card.tone}`}><Icon name={card.icon} /></span><div><span>{card.label}</span><strong>{card.value.toLocaleString('vi-VN')}</strong></div></article>)}</div><div className="admin-highlight"><div><span className="eyebrow">Cần xử lý</span><h2>{stats.pending} tài liệu đang chờ duyệt</h2><p>Danh sách được tính từ tối đa 100 tài liệu gần nhất do backend chưa có bộ lọc trạng thái hoặc endpoint thống kê.</p></div><a className="button button--light" href="/admin/documents">Đi tới kiểm duyệt <Icon name="arrow" size={17} /></a></div></>;
}
