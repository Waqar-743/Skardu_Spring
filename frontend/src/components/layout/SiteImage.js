import Image from 'next/image';
import { publicPath } from '@/lib/deployment';

/** Public assets need the repository prefix when hosted on GitHub Pages. */
export default function SiteImage({ src, alt, ...props }) {
  return <Image {...props} alt={alt} src={publicPath(src)} />;
}
