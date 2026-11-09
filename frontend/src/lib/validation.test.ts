import { describe, expect, it } from 'vitest';
import { buildQuery } from './api-client';
import { validateEmail, validateFullName, validatePassword, validateUrl } from './validation';

describe('validation theo hợp đồng backend', () => {
  it('kiểm tra mật khẩu đủ bốn nhóm ký tự', () => {
    expect(validatePassword('Studyhub1!')).toBe('');
    expect(validatePassword('studyhub1!')).toContain('in hoa');
  });

  it('kiểm tra email và độ dài họ tên', () => {
    expect(validateEmail('ban@studyhub.vn')).toBe('');
    expect(validateEmail('email-sai')).not.toBe('');
    expect(validateFullName('An')).not.toBe('');
  });

  it('kiểm tra định dạng đường dẫn URL', () => {
    expect(validateUrl('https://studyhub.vn/tailieu')).toBe('');
    expect(validateUrl('http://example.com')).toBe('');
    expect(validateUrl('')).not.toBe('');
    expect(validateUrl('not-a-valid-url')).not.toBe('');
    expect(validateUrl('ftp://example.com')).not.toBe('');
  });
});

describe('buildQuery', () => {
  it('encode giá trị và bỏ qua tham số rỗng', () => {
    expect(buildQuery({ keyword: 'học & thi', page: 2, categoryId: '' })).toBe(
      '?keyword=h%E1%BB%8Dc+%26+thi&page=2',
    );
  });
});
