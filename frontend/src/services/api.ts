import { adminEndpoint, apiRequest, buildQuery } from '../lib/api-client';
import type {
  Category,
  DocumentFilters,
  MessageResponse,
  PaginationData,
  ProfileData,
  Review,
  StudyDocument,
  User,
  UserRole,
  UserStatus,
  DocumentStatus,
} from '../types/api';

export const authApi = {
  register: (body: { fullName: string; email: string; password: string }) =>
    apiRequest<MessageResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    apiRequest<MessageResponse & { user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  logout: () => apiRequest<MessageResponse>('/auth/logout', { method: 'POST' }),
};

export const categoryApi = {
  list: () => apiRequest<MessageResponse & { data: Category[] }>('/category'),
  detail: (slug: string) =>
    apiRequest<MessageResponse & { category: Category }>(`/category/${encodeURIComponent(slug)}`),
};

export const documentApi = {
  list: (filters: DocumentFilters = {}) =>
    apiRequest<MessageResponse & { documents: StudyDocument[]; pagination: PaginationData }>(
      `/documents${buildQuery(filters)}`,
    ),
  create: (body: FormData) =>
    apiRequest<MessageResponse & { data: { fileUrl: string } }>('/documents', {
      method: 'POST',
      body,
    }),
  detail: (id: string) =>
    apiRequest<MessageResponse & { document: StudyDocument }>(`/documents/${encodeURIComponent(id)}`),
  download: (id: string) =>
    apiRequest<MessageResponse & { data: { fileUrl: string } }>(
      `/documents/${encodeURIComponent(id)}/download`,
    ),
  update: (id: string, body: { title?: string; description?: string; categoryId?: string }) =>
    apiRequest<MessageResponse>(`/documents/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    apiRequest<MessageResponse>(`/documents/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  reviews: (id: string, page = 1, limit = 6) =>
    apiRequest<MessageResponse & { reviews: Review[]; pagination: PaginationData }>(
      `/documents/${encodeURIComponent(id)}/reviews${buildQuery({ page, limit })}`,
    ),
  createReview: (id: string, body: { rating: number; comment: string | null }) =>
    apiRequest<MessageResponse>(`/documents/${encodeURIComponent(id)}/reviews`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  saveStatus: (id: string) =>
    apiRequest<MessageResponse & { isSaved: boolean }>(`/documents/${encodeURIComponent(id)}/save`),
  save: (id: string) =>
    apiRequest<MessageResponse>(`/documents/${encodeURIComponent(id)}/save`, { method: 'POST' }),
  unsave: (id: string) =>
    apiRequest<MessageResponse>(`/documents/${encodeURIComponent(id)}/save`, { method: 'DELETE' }),
};

export const reviewApi = {
  update: (id: string, body: { rating: number; comment: string | null }) =>
    apiRequest<MessageResponse>(`/reviews/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    apiRequest<MessageResponse>(`/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export const userApi = {
  profile: () =>
    apiRequest<MessageResponse & { data: ProfileData; role: UserRole }>('/users/profile'),
  updateProfile: (body: FormData) =>
    apiRequest<MessageResponse>('/users/profile', { method: 'PATCH', body }),
  myDocuments: (page = 1, limit = 9) =>
    apiRequest<MessageResponse & { documents: StudyDocument[]; pagination: PaginationData }>(
      `/users/my-documents${buildQuery({ page, limit })}`,
    ),
  savedDocuments: (page = 1, limit = 9) =>
    apiRequest<MessageResponse & { savedDocuments: StudyDocument[]; pagination: PaginationData }>(
      `/users/saved-document${buildQuery({ page, limit })}`,
    ),
};

export const adminApi = {
  users: (page = 1, limit = 10, email = '') =>
    apiRequest<MessageResponse & { users: User[]; pagination: PaginationData | null }>(
      `${adminEndpoint('/users')}${buildQuery({ page, limit, email })}`,
    ),
  changeUserStatus: (id: string, status: UserStatus) =>
    apiRequest<MessageResponse>(adminEndpoint(`/users/${encodeURIComponent(id)}/status`), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  changeUserRole: (id: string, role: UserRole) =>
    apiRequest<MessageResponse>(adminEndpoint(`/users/${encodeURIComponent(id)}/role`), {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  documents: (filters: DocumentFilters = {}) =>
    apiRequest<MessageResponse & { documents: StudyDocument[]; pagination: PaginationData }>(
      `${adminEndpoint('/documents')}${buildQuery(filters)}`,
    ),
  changeDocumentStatus: (id: string, status: DocumentStatus) =>
    apiRequest<MessageResponse>(adminEndpoint(`/documents/${encodeURIComponent(id)}/status`), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  removeDocument: (id: string) =>
    apiRequest<MessageResponse>(adminEndpoint(`/documents/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    }),
  reviews: (page = 1, limit = 10, keyword = '') =>
    apiRequest<MessageResponse & { reviews: Review[]; pagination: PaginationData }>(
      `${adminEndpoint('/reviews')}${buildQuery({ page, limit, keyword })}`,
    ),
  removeReview: (id: string) =>
    apiRequest<MessageResponse>(adminEndpoint(`/reviews/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    }),
  createCategory: (body: { name: string; slug: string; description: string | null }) =>
    apiRequest<MessageResponse>(adminEndpoint('/category'), {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateCategory: (id: string, body: { name?: string; slug?: string; description?: string }) =>
    apiRequest<MessageResponse>(adminEndpoint(`/category/${encodeURIComponent(id)}`), {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  removeCategory: (id: string) =>
    apiRequest<MessageResponse>(adminEndpoint(`/category/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    }),
};
