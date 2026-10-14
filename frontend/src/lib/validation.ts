export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

export function validateEmail(value: string) {
  if (!value.trim()) return 'Vui lòng nhập email.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không đúng định dạng.';
  return '';
}

export function validatePassword(value: string) {
  if (!value) return 'Vui lòng nhập mật khẩu.';
  if (value.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.';
  if (!/[A-Z]/.test(value)) return 'Mật khẩu phải có ít nhất 1 chữ in hoa.';
  if (!/[a-z]/.test(value)) return 'Mật khẩu phải có ít nhất 1 chữ thường.';
  if (!/\d/.test(value)) return 'Mật khẩu phải có ít nhất 1 chữ số.';
  if (!/[\W_]/.test(value)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt.';
  return '';
}

export function validateFullName(value: string) {
  const length = value.trim().length;
  if (!length) return 'Vui lòng nhập họ tên.';
  if (length < 5) return 'Họ tên phải có ít nhất 5 ký tự.';
  if (length > 100) return 'Họ tên không quá 100 ký tự.';
  return '';
}

export function validateFile(file?: File | null, imageOnly = false) {
  if (!file) return 'Vui lòng chọn tệp.';
  if (file.size > MAX_UPLOAD_SIZE) return 'Tệp không được vượt quá 10 MB.';
  if (imageOnly && !file.type.startsWith('image/')) return 'Ảnh đại diện phải là tệp hình ảnh.';
  return '';
}
