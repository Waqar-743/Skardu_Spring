'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { isStaticSite, publicPath } from './deployment';

export default function useSiteRouter() {
  const router = useRouter();
  return useMemo(() => isStaticSite ? {
    ...router,
    push: href => window.location.assign(publicPath(href)),
    replace: href => window.location.replace(publicPath(href)),
  } : router, [router]);
}
