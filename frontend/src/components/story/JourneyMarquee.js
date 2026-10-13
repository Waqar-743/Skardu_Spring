'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from '@/components/layout/SiteImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JOURNEY } from './storyData';
import styles from './JourneyMarquee.module.css';

gsap.registerPlugin(ScrollTrigger);

const GHOST = 'A place. A people. A spring.';

export default function JourneyMarquee() {
  const rootRef = useRef(null);

  // Revert the pin wrapper before React removes this section on navigation.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let alive = true;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (min-height: 700px) and (min-width: 768px)', () => {
      const q = gsap.utils.selector(root);
      const track = q('[data-track]')[0];
      const ghost = q('[data-ghost]')[0];
      const bar = q('[data-bar]')[0];
      const count = q('[data-count]')[0];
      const items = q('[data-item]');

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const ghostDistance = () => Math.max(0, ghost.scrollWidth - window.innerWidth);

      const scrollTween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(ghost, { x: -ghostDistance() * (1 - self.progress) });
            gsap.set(bar, { scaleX: self.progress });
            const index = Math.min(items.length - 1, Math.floor(self.progress * items.length));
            if (count && count.dataset.index !== String(index)) {
              count.dataset.index = String(index);
              count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
            }
          },
        },
      });

      // Milestone copy follows horizontal progress, including reverse scrolling.
      items.forEach((item) => {
        const body = item.querySelectorAll('[data-body]');
        gsap.fromTo(
          body,
          { opacity: 0.85, y: 28 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              containerAnimation: scrollTween,
              start: 'left 82%',
              end: 'left 50%',
              scrub: 0.4,
            },
          }
        );
      });

      gsap.set(ghost, { x: () => -ghostDistance() });
    }, root);

    const onFontsReady = () => { if (alive) ScrollTrigger.refresh(); };
    document.fonts?.ready?.then(onFontsReady);

    return () => { alive = false; mm.revert(); };
  }, []);

  return (
    <section ref={rootRef} className={styles.journey} id="journey" aria-label="A timeline of the region">
      <div className={styles.top}>
        <p className={styles.kicker}>Threads of a place / A regional timeline</p>
        <p className={styles.count} data-count data-index="0" aria-hidden="true">
          01 / {String(JOURNEY.length).padStart(2, '0')}
        </p>
      </div>

      <div className={styles.rows}>
        <div className={styles.track} data-track>
          {JOURNEY.map((step, i) => (
            <article key={step.title} className={styles.item} data-item>
              <div className={styles.milestoneImage}><Image src={step.image} alt="" fill sizes="(max-width: 767px) 200px, 22vw" /></div>
              <span className={styles.index} data-body>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.when}>{step.when}</h3>
              <div className={styles.copy}>
                <p className={styles.title} data-body>
                  {step.title}
                </p>
                <p className={styles.text} data-body>
                  {step.text}
                </p>
              </div>
            </article>
          ))}
          <span className={styles.endcap} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.ghostRow} aria-hidden="true">
        <div className={styles.ghost} data-ghost>
          {[0, 1, 2, 3].map((n) => (
            <span key={n}>
              {GHOST}
              <i>·</i>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span className={styles.bar} data-bar />
      </div>
    </section>
  );
}
