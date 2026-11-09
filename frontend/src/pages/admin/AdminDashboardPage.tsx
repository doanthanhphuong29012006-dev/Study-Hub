import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorState, PageLoader } from '../../components/AsyncState';
import { Icon } from '../../components/Icon';
import { getErrorMessage } from '../../lib/api-client';
import { adminApi, categoryApi } from '../../services/api';

interface Stats {
  documents: number;
  users: number;
  reviews: number;
  categories: number;
  pending: number;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [documents, users, reviews, categories, pending] = await Promise.all([
        adminApi.documents({ page: 1, limit: 1 }),
        adminApi.users(1, 1),
        adminApi.reviews(1, 1),
        categoryApi.list(),
        adminApi.documents({ page: 1, limit: 100, sortedBy: 'created_at' }),
      ]);
      setStats({
        documents: Number(documents.pagination.totalCount),
        users: Number(users.pagination?.totalCount ?? users.users.length),
        reviews: Number(reviews.pagination.totalCount),
        categories: categories.data.length,
        pending: pending.documents.filter((item) => item.status === 'pending').length,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <PageLoader label="Đang tải dữ liệu tổng quan…" />;
  if (error || !stats) return <ErrorState message={error || 'Không có dữ liệu.'} onRetry={load} />;

  const cards = [
    { label: 'Tổng tài liệu', value: stats.documents, icon: 'file' as const, tone: 'green' },
    { label: 'Người dùng', value: stats.users, icon: 'users' as const, tone: 'teal' },
    { label: 'Đánh giá', value: stats.reviews, icon: 'star' as const, tone: 'gold' },
    { label: 'Danh mục', value: stats.categories, icon: 'book' as const, tone: 'purple' },
  ];

  return (
    <div className="bamboo-admin-page">
      <div className="bamboo-admin-heading">
        <div>
          <div className="bamboo-eyebrow">
            <Icon name="settings" size={14} />
            <span>Quản trị</span>
          </div>
          <h1 className="bamboo-admin-heading__title">Tổng quan hệ thống</h1>
          <p className="bamboo-admin-heading__subtitle">
            Thống kê số lượng tài liệu, người dùng và trạng thái kiểm duyệt của hệ thống.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="bamboo-stats-grid">
        {cards.map((card) => (
          <article className={`bamboo-stat-card bamboo-stat-card--${card.tone}`} key={card.label}>
            <span className="bamboo-stat-card__icon">
              <Icon name={card.icon} size={22} />
            </span>
            <div className="bamboo-stat-card__content">
              <span>{card.label}</span>
              <strong>{card.value.toLocaleString('vi-VN')}</strong>
            </div>
          </article>
        ))}
      </div>

      {/* Pending Moderation Banner */}
      <div className="bamboo-admin-alert-banner">
        <div className="bamboo-admin-alert-banner__content">
          <div className="bamboo-pill bamboo-pill--dark">
            <Icon name="leaf" size={13} /> Cần xử lý
          </div>
          <h2>{stats.pending} tài liệu đang chờ duyệt</h2>
          <p>
            Các tài liệu mới do người dùng đăng tải cần được kiểm duyệt trước khi hiển thị công khai.
          </p>
        </div>
        <Link className="bamboo-btn bamboo-btn--primary" to="/admin/documents">
          <span>Xem tài liệu chờ duyệt</span>
          <Icon name="arrow" size={17} />
        </Link>
      </div>
    </div>
  );
}
