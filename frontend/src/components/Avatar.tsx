import { initials } from '../lib/format';

export function Avatar({ src, name, size = 'md' }: { src?: string | null; name?: string; size?: 'sm' | 'md' | 'lg' }) {
  return src ? (
    <img className={`avatar avatar--${size}`} src={src} alt={`Ảnh đại diện của ${name ?? 'người dùng'}`} />
  ) : (
    <span className={`avatar avatar--${size} avatar--fallback`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
