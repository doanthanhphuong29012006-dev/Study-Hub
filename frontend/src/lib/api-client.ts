export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 0, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
export const API_BASE_URL = rawBaseUrl?.replace(/\/+$/, '') ?? '';

const rawAdminPath = import.meta.env.VITE_ADMIN_PATH?.trim();
export const ADMIN_PATH = rawAdminPath?.replace(/^\/+|\/+$/g, '') ?? '';

type QueryValue = string | number | boolean | null | undefined;

export function buildQuery(params: object = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params as Record<string, QueryValue>).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError('Chưa cấu hình VITE_API_BASE_URL cho frontend.');
  }

  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.');
  }

  const contentType = response.headers.get('content-type') ?? '';
  let payload: unknown = null;
  if (contentType.includes('application/json')) {
    payload = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => '');
    payload = text ? { message: text } : null;
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : `Yêu cầu thất bại (${response.status}).`;
    const error = new ApiError(message, response.status, payload);
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('studyhub:unauthorized'));
    }
    throw error;
  }

  return payload as T;
}

export function adminEndpoint(path: string) {
  if (!ADMIN_PATH) {
    throw new ApiError('Chưa cấu hình VITE_ADMIN_PATH khớp với ROUTE_ADMIN của backend.');
  }
  return `/${ADMIN_PATH}${path}`;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Đã có lỗi không xác định xảy ra.';
}
