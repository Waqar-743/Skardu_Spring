'use client';

import { publicPath } from '@/lib/deployment';

import { useEffect, useRef } from 'react';
import Image from '@/components/layout/SiteImage';
import Link from '@/components/layout/SiteLink';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOURCES } from './storyData';
import styles from './EditorialReveal.module.css';

gsap.registerPlugin(ScrollTrigger);

const INTRO = 'To know Skardu is to look a little closer. Past the peaks, there is a language, a craft, an orchard and a welcome.';
const REGIONAL_SOURCES = [
  { title: 'Mountain products & livelihoods in Gilgit-Baltistan', publisher: 'ICIMOD', href: 'https://www.icimod.org/article/high-value-mountain-products-promote-sustainable-livelihoods/' },
  { title: 'Apricot kernel oil extraction & composition', publisher: 'Grasas y Aceites · CSIC', href: 'https://grasasyaceites.revistas.csic.es/index.php/grasasyaceites/article/download/1366/1363/1361' },
  { title: 'Research into the formation of Shilajit', publisher: 'Primary research · PubMed Central', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7322889/' },
];

export default function EditorialReveal() {
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px)' }, ({ conditions }) => {
      if (!conditions.motion) return;

      // Each reveal follows scroll in both directions; links remain fully visible.
      gsap.utils.toArray('[data-reveal]', root).forEach((target) => {
        gsap.fromTo(target, { opacity: 0.75, y: conditions.desktop ? 32 : 16 }, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: target, start: 'top 94%', end: 'top 68%', scrub: 0.5 },
        });
      });

      const intro = root.querySelector('[data-word-reveal]');
      gsap.fromTo(intro.querySelectorAll('[data-word]'), { opacity: 0.72 }, {
        opacity: 1, stagger: 0.06, ease: 'none',
        scrollTrigger: { trigger: intro, start: 'top 87%', end: 'bottom 57%', scrub: 0.6 },
      });

      if (!conditions.desktop) return;
      gsap.utils.toArray('[data-image-drift]', root).forEach((image) => {
        gsap.fromTo(image, { yPercent: -4, scale: 1.1 }, {
          yPercent: 4, scale: 1.1, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
      });
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.journal} id="culture">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.kicker} data-reveal>Field notes / Baltistan</p>
          <h2 data-reveal>More than a landscape.<br /><em>A living story.</em></h2>
          <p className={styles.intro} data-word-reveal>
            <span className={styles.srOnly}>{INTRO}</span>
            <span aria-hidden="true">{INTRO.split(' ').map((word, i) => <span key={`${word}-${i}`} data-word>{word}{' '}</span>)}</span>
          </p>
        </header>
        <div className={styles.gallery}>
          <article className={styles.heritage}>
            <div className={styles.largeImage} data-reveal><Image src="/images/story/heritage.webp" alt="Generated artistic interpretation of a Balti stone and timber fort-palace" fill sizes="(max-width: 767px) 100vw, 62vw" data-image-drift /></div>
            <div className={styles.imageCaption}><span>01 / Stone & timber</span><span>Shigar, Baltistan</span></div>
            <div className={styles.articleCopy}>
              <span className={styles.smallIndex}>A heritage of making</span>
              <h3 data-reveal>The mountain is only<br /><em>half the story.</em></h3>
              <p data-reveal>Shigar’s seventeenth-century fort-palace, Fong Khar, was built upon a great boulder. Its restoration brought traditional building skills back into use, alongside improvements to life in the surrounding settlements.</p>
              <a href={SOURCES[2].href} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Read the architectural history <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <article className={styles.orchard}>
            <div className={styles.tallImage} data-reveal><Image src="/images/story/orchard.webp" alt="Generated artistic interpretation of apricot blossom in a terraced Balti valley" fill sizes="(max-width: 767px) 100vw, 32vw" data-image-drift /></div>
            <div className={styles.imageCaption}><span>02 / The orchard</span><span>Chunda valley</span></div>
            <h3 data-reveal>A season,<br /><em>softly spoken.</em></h3>
            <p data-reveal>Terraced fields, apricot trees and traditional stone homes shape Chunda valley. Spring blossom is one of its most distinctive sights.</p>
            <a href={SOURCES[1].href} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Explore the valley <span aria-hidden="true">↗</span></a>
          </article>
        </div>
        <aside className={styles.regionalNote} aria-labelledby="regional-products">
          <p className={styles.kicker}>From orchard & mountain / Regional notes</p>
          <h3 id="regional-products" data-reveal>Small details.<br /><em>A deeper connection.</em></h3>
          <div className={styles.regionalCopy}>
            <p>Apricot kernel oil comes from the kernel inside the fruit’s stone. ICIMOD identifies apricots and silajeet, also called Shilajit, among Gilgit-Baltistan’s mountain products. Shilajit is a dark natural material found exuding from mountain rocks; its formation and composition continue to be studied.</p>
            <a href={REGIONAL_SOURCES[0].href} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Read the regional context <span aria-hidden="true">↗</span></a>
          </div>
        </aside>
        <div className={styles.table}>
          <div className={styles.tablePhoto} data-reveal><Image src="/images/story/table.webp" alt="Generated still life inspired by a shared mountain table, with apricots and ceramic cups" fill sizes="(max-width: 767px) 100vw, 55vw" /></div>
          <div className={styles.tableCopy}>
            <p className={styles.kicker}>The art of slowing down</p>
            <h3 data-reveal>Good things<br />are better<br /><em>shared.</em></h3>
            <p data-reveal>Leave a little space for conversation. Pour a glass. Let the day take its time.</p>
            <Link href="/shop" className={styles.textLink}>Bring the story home <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className={styles.water} id="science">
          <div><p className={styles.kicker}>The water / Quality documents</p><h3 data-reveal>A clear view<br />of what you drink.</h3></div>
          <div id="certifications">
            <p>Explore the collection and read the available quality documents.</p>
            <a href={publicPath('/assets/certs/gb-food-cert.pdf')} target="_blank" rel="noopener noreferrer" className={styles.textLink}>GB Food Authority document <span aria-hidden="true">↗</span></a>
            <a href={publicPath('/assets/certs/ALSCERT-UK-2025.pdf')} target="_blank" rel="noopener noreferrer" className={styles.textLink}>ALS UK laboratory document <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <details className={styles.sources}>
          <summary>Behind the story <span>Research & image notes +</span></summary>
          <p>The regional story draws on the sources below. The imagery is AI-generated artwork inspired by Baltistan; it is not documentary photography of the named locations. Bottle tints represent changing scene light.</p>
          <ul>{[...SOURCES, ...REGIONAL_SOURCES].map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.title}<span>{source.publisher} ↗</span></a></li>)}</ul>
        </details>
      </div>
    </section>
  );
}
