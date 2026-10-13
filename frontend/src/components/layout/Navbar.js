'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from '@/components/layout/SiteLink';
import { usePathname } from 'next/navigation';
import { IoCartOutline } from 'react-icons/io5';
import BrandMark from './BrandMark';
import { useCart } from '@/context/CartContext';
import ThemeToggle from './ThemeToggle';
import useModalAccessibility from '@/lib/useModalAccessibility';
import navigateHomeAnchor from '@/lib/navigateHomeAnchor';
import styles from './Navbar.module.css';

const navItems = [
  { label: 'Our Story', href: '/about' },
  { label: 'The Journal', href: '/#culture' },
  { label: 'The Source', href: '/source', prefetch: true },
  { label: 'Collection', href: '/shop', prefetch: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const firstMobileLinkRef = useRef(null);
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const closeMenu = useCallback(() => setMobileOpen(false), []);
  useModalAccessibility(mobileOpen, navRef, closeMenu, firstMobileLinkRef, '#mobile-menu-toggle');
  const visibleNavItems = navItems.map((item) => item.label === 'Collection' && isHome
    ? { ...item, href: '/#product-showcase' } : item);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => { if (window.innerWidth > 1050) closeMenu(); };
    window.addEventListener('resize', closeOnDesktop, { passive: true });
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, [closeMenu]);

  return (
    <nav
      ref={navRef}
      role={mobileOpen ? 'dialog' : undefined}
      aria-modal={mobileOpen ? true : undefined}
      aria-label={mobileOpen ? 'Navigation menu' : 'Main navigation'}
      tabIndex={-1}
      className={`${styles.navbar} ${mobileOpen ? styles.menuIsOpen : ''} ${
        isHome ? styles.navStory : scrolled || pathname === '/brand-lab' ? styles.navScrolled : styles.navTransparent
      }`}
      id="main-navbar"
    >
      <div className={styles.navInner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Skardu Spring Home" onClick={(event) => { navigateHomeAnchor(event); closeMenu(); }}>
          <div className={styles.logoIcon}>
            <BrandMark />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>Skardu Spring</span>
            <span className={styles.logoTagline}>Pure Mountain Water</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          {visibleNavItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={navigateHomeAnchor} className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`} aria-current={pathname === item.href ? 'page' : undefined} prefetch={item.prefetch}>
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <button 
            className={styles.cartBtn} 
            onClick={() => setIsCartOpen(true)}
            aria-label={cartCount > 0 ? `Open cart, ${cartCount} items` : 'Open cart'}
          >
            <IoCartOutline />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
          <Link href="/shop" className={styles.navCta} prefetch={true}>
            Shop Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`${styles.mobileToggle} ${mobileOpen ? styles.toggleOpen : ''}`}
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          id="mobile-menu-toggle"
        >
          <span className={styles.toggleBar}></span>
          <span className={styles.toggleBar}></span>
          <span className={styles.toggleBar}></span>
        </button>

        {/* Mobile Menu */}
        <div id="mobile-navigation" className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileOpen : ''}`}>
          {visibleNavItems.map((item, index) => (
            <Link
              ref={index === 0 ? firstMobileLinkRef : undefined}
              key={item.href}
              href={item.href}
              className={styles.navLink}
              onClick={(event) => { navigateHomeAnchor(event); setMobileOpen(false); }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/shop" className={styles.navCta} onClick={() => setMobileOpen(false)}>
            Shop Now
          </Link>
          <button type="button" className={styles.navLink} aria-label="Open Cart"
            onClick={() => { setMobileOpen(false); setIsCartOpen(true); }}>
            Your basket{cartCount > 0 ? ' (' + cartCount + ')' : ''}
          </button>
        </div>
      </div>
    </nav>
  );
}
