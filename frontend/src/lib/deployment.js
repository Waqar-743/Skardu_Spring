export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const isStaticSite = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github-pages';
const apiOrigin = (process.env.NEXT_PUBLIC_API_ORIGIN || '').replace(/\/$/, '');
export const hasServerAPI = !isStaticSite || Boolean(apiOrigin);

export function publicPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
  if (basePath && (value === basePath || value.startsWith(basePath + '/'))) return value;
  return basePath + value;
}

export function apiPath(name) {
  return apiOrigin ? `${apiOrigin}/api/${name}` : publicPath(`/api/${name}`);
}
