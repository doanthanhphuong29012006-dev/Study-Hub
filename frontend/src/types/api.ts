export type UserRole = 'student' | 'admin';
export type UserStatus = 'active' | 'locked';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar: string | null;
  role: UserRole;
  status?: UserStatus;
  created_at?: string;
}

export interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  avatar: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: number | string;
  file_type: string;
  category_id: string;
  uploader_id: string;
  status: DocumentStatus;
  view_count: number | string;
  download_count: number | string;
  review_count: number | string;
  average_rating: number | string;
  created_at: string;
  updated_at?: string;
  category_title?: string;
  uploader_name?: string;
  uploader_avatar?: string | null;
  saved_at?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  full_name: string;
  avatar: string | null;
  document_id?: string;
  title?: string;
  email?: string;
}

export interface PaginationData {
  currentPage: number;
  totalCount: number;
  limit: number;
  totalPage: number;
}

export interface MessageResponse {
  message: string;
}

export interface DocumentFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  keyword?: string;
  sortedBy?: 'created_at' | 'review_count' | 'view_count' | 'download_count';
  order?: 'ASC' | 'DESC';
}
