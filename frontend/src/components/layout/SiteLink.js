import Link from 'next/link';
import { isStaticSite, publicPath } from '@/lib/deployment';

/** Pages serves complete HTML documents; avoid server-dependent RSC navigation. */
export default function SiteLink({ href, prefetch, scroll, replace, onNavigate, ...props }) {
  if (isStaticSite) return <a {...props} href={publicPath(href)} />;
  return <Link {...props} href={href} prefetch={prefetch} scroll={scroll} replace={replace} onNavigate={onNavigate} />;
}
