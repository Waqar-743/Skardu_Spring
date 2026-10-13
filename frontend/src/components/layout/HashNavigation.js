'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Align requested anchors after the new page's pinned layout has initialized. */
export default function HashNavigation() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined;
    let timer;
    let frame;
    const sizes = new WeakMap();
    // Async route content and fonts can settle after the pathname changes.
    const observer = new ResizeObserver((entries) => {
      const changed = entries.some(({ target, contentRect }) => {
        const previous = sizes.get(target);
        sizes.set(target, { width: contentRect.width, height: contentRect.height });
        return !previous || Math.abs(previous.width - contentRect.width) > 1 || Math.abs(previous.height - contentRect.height) > 1;
      });
      if (!changed) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 80);
    });
    [document.getElementById('main-content'), document.getElementById('site-footer')].filter(Boolean).forEach(element => observer.observe(element));
    return () => { observer.disconnect(); clearTimeout(timer); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    let cancelPending = () => {};
    const alignRequestedHash = () => {
      cancelPending();
      const hash = window.location.hash;
      if (!hash) {
        let frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => ScrollTrigger.refresh());
        });
        cancelPending = () => cancelAnimationFrame(frame);
        return;
      }
      let stopped = false;
      let frame;
      let timer;
      let expiry;
      let observer;
      let fontsReady = false;
      const stop = () => {
        stopped = true;
        cancelAnimationFrame(frame);
        clearTimeout(timer);
        clearTimeout(expiry);
        observer?.disconnect();
        ScrollTrigger.removeEventListener('refresh', schedule);
        ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(name => window.removeEventListener(name, stop));
      };
      cancelPending = stop;
      ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(name => window.addEventListener(name, stop, { passive: true, once: true }));
      const align = () => {
        if (stopped || window.location.hash !== hash) return false;
        let id;
        try { id = decodeURIComponent(hash.slice(1)); } catch { return false; }
        const target = document.getElementById(id);
        if (!target) return false;
        const story = document.getElementById('brand-story');
        if (pathname === '/' && !story?.dataset.motion) return false;
        const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - navHeight - 16);
        if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top, behavior: 'instant' });
        return true;
      };
      const schedule = () => {
        // Coalesce layout notifications instead of postponing alignment while
        // animated text and streamed sections continue mutating the page.
        if (frame !== undefined) return;
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            frame = undefined;
            if (align()) {
              observer?.disconnect();
              if (fontsReady) {
                clearTimeout(timer);
                timer = setTimeout(() => { align(); stop(); }, 160);
              }
            }
          });
        });
      };
      observer = new MutationObserver(schedule);
      ScrollTrigger.addEventListener('refresh', schedule);
      observer.observe(document.getElementById('main-content'), { childList: true, subtree: true, attributes: true, attributeFilter: ['data-motion'] });
      expiry = setTimeout(stop, 5000);
      schedule();
      Promise.resolve(document.fonts?.ready).then(() => {
        if (stopped) return;
        fontsReady = true;
        schedule();
      });
    };
    // The pathname can commit before Next updates the browser URL's fragment.
    // Read the destination after the router's commit effects have completed.
    const routeFrame = requestAnimationFrame(alignRequestedHash);
    window.addEventListener('hashchange', alignRequestedHash);
    return () => { cancelAnimationFrame(routeFrame); cancelPending(); window.removeEventListener('hashchange', alignRequestedHash); };
  }, [pathname]);

  return null;
}
