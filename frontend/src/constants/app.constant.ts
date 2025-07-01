export const PROJECT_LIMIT = 10;

export const initialScreen = {
  AUDIENCE: '/home',
  SPEAKER: '/home',
  ORGANIZER: '/organization/overview',
  ADMIN: '/admin/dashboard',
  GUEST: '/home',
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.vievent.site';

export const CDN_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'roominar';

export const CDN_UPLOAD_URL =
  process.env.NEXT_PUBLIC_CLOUDINARY_URL ||
  'https://api.cloudinary.com/v1_1/dxkjlspxi/image/upload';

export const CDN_DELETE_URL =
  process.env.NEXT_PUBLIC_CLOUDINARY_DELETE_URL ||
  'https://api.cloudinary.com/v1_1/dxkjlspxi/image/destroy';
