'use client';

import { useEffect, useRef, useState } from 'react';
import Link from '@/components/layout/SiteLink';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import navigateHomeAnchor from '@/lib/navigateHomeAnchor';
import styles from './Footer.module.css';
import { hasServerAPI, apiPath } from '@/lib/deployment';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle, loading, success, error
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const brand = root.querySelector('[data-brand]');
      const brandText = root.querySelector('[data-brand-text]');
      const fades = gsap.utils.toArray('[data-fade]', root);

      gsap.set(fades, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(fades, {
        start: 'top 94%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.1,
            overwrite: true,
          }),
      });

      // The brand name rises out of the floor as the footer arrives.
      if (brand && brandText) {
        gsap.fromTo(
          brandText,
          { yPercent: 70 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: brand,
              start: 'top 100%',
              end: 'bottom 100%',
              scrub: 0.6,
            },
          }
        );
      }
    });

    return () => mm.revert();
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setNewsletterStatus('loading');
    try {
      const res = await fetch(apiPath('newsletter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterStatus('success');
        setEmail('');
        setTimeout(() => setNewsletterStatus('idle'), 5000);
      } else {
        setNewsletterStatus('error');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      }
    } catch {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  const statusMessage =
    newsletterStatus === 'success'
      ? 'Thank you. You are on the list.'
      : newsletterStatus === 'error'
        ? 'Something went wrong. Please try again.'
        : newsletterStatus === 'loading'
          ? 'Subscribing…'
          : 'Offers, wellness notes and news from the source.';

  return (
    <footer ref={rootRef} className={styles.footer} id="site-footer">
      <div className={styles.inner}>
        {/* Single-line input */}
        <div className={styles.top}>
          <div className={styles.lead} data-fade>
            <p className={styles.kicker}>Stay refreshed</p>
            <h2 className={styles.heading}>
              Water, <em>straight from the mountain</em>, to your inbox.
            </h2>
          </div>

          {hasServerAPI ? <form className={styles.form} onSubmit={handleNewsletter} id="newsletter-form" data-fade>
            <label className={styles.field} htmlFor="newsletter-email">
              <span className={styles.srOnly}>Email for newsletter</span>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.input}
                id="newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={newsletterStatus === 'loading'}
              />
              <button
                type="submit"
                className={styles.submit}
                id="newsletter-submit"
                disabled={newsletterStatus === 'loading'}
                aria-label="Subscribe"
              >
                <span>{newsletterStatus === 'success' ? '✓' : '→'}</span>
              </button>
            </label>
            <p
              className={`${styles.status} ${newsletterStatus === 'error' ? styles.statusError : ''}`}
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </p>
          </form> : <div className={styles.form} data-fade>
            <a className={styles.field} href="mailto:info@skarduspring.com?subject=Skardu%20Spring%20updates">Request updates by email ↗</a>
            <p className={styles.status}>Online newsletter sign-up is currently unavailable. Contact our team for updates.</p>
          </div>}
        </div>

        {/* Links */}
        <div className={styles.columns}>
          <div className={styles.column} data-fade>
            <h3>Explore</h3>
            <ul>
              <li><Link href="/#culture" onClick={navigateHomeAnchor}>The Journal</Link></li>
              <li><Link href="/#product-showcase" onClick={navigateHomeAnchor}>Our Products</Link></li>
              <li><Link href="/source">The Source</Link></li>
              <li><Link href="/#science" onClick={navigateHomeAnchor}>Water Quality</Link></li>
              <li><Link href="/#certifications" onClick={navigateHomeAnchor}>Quality Standards</Link></li>
            </ul>
          </div>

          <div className={styles.column} id="contact" data-fade>
            <h3>Contact</h3>
            <ul>
              <li><a href="tel:+923492899537">+92 349 2899537</a></li>
              <li><a href="mailto:info@skarduspring.com">info@skarduspring.com</a></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/shop">Order Online</Link></li>
            </ul>
          </div>

          <div className={styles.column} data-fade>
            <h3>Company</h3>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/source">The landscape</Link></li>
              <li><a href="mailto:info@skarduspring.com">Business enquiries</a></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className={`${styles.column} ${styles.columnEnd}`} data-fade>
            <h3>Follow</h3>
            <div className={styles.social}>
              <a href="https://facebook.com/skarduspring" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com/skarduspring" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>
            <p className={styles.certs}><Link href="/#certifications" onClick={navigateHomeAnchor}>View quality documents ↗</Link></p>
          </div>
        </div>
      </div>

      {/* Massively scaled brand name */}
      <div className={styles.brand} data-brand aria-hidden="true">
        <svg
          className={styles.brandSvg}
          viewBox="0 0 1000 205"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <defs>
            <linearGradient id="footer-brand-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ecf3ff" />
              <stop offset="100%" stopColor="#6f8fc4" />
            </linearGradient>
          </defs>
          <text
            data-brand-text
            x="0"
            y="152"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="#e9ecdc"
            className={styles.brandText}
          >
            Skardu Spring
          </text>
        </svg>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {currentYear} Skardu Spring. All rights reserved.</p>
        <p className={styles.place}>Skardu, Gilgit-Baltistan</p>
        <div className={styles.legal}>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/faq">Support</Link>
        </div>
      </div>
    </footer>
  );
}
