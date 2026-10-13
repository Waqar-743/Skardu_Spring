'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from '@/components/layout/SiteImage';
import Link from '@/components/layout/SiteLink';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CHAPTERS as STORY_CHAPTERS } from './storyData';
import PRODUCTS from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './StoryStage.module.css';
import { publicPath } from '@/lib/deployment';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Give each researched scene its own product tilt and foreground composition.
const MOTION = [
  { tilt: -3, types: ['stone', 'drop', 'stone', 'drop'] },
  { tilt: 2, types: ['drop', 'ripple', 'stone', 'drop'] },
  { tilt: -2, types: ['stone', 'stone', 'stone', 'drop'] },
  { tilt: 3, types: ['apricot', 'apricot', 'apricot', 'stone'] },
  { tilt: 0, types: ['apricot', 'stone', 'apricot', 'stone'] },
];
const POSITIONS = [
  { x: 12, y: 25, size: 4, depth: .07, rot: -18, layer: 'back' },
  { x: 84, y: 18, size: 3, depth: .035, rot: 20, layer: 'back' },
  { x: 88, y: 78, size: 5, depth: .12, rot: -12, layer: 'front' },
  { x: 35, y: 18, size: 2, depth: .04, rot: -16, layer: 'back' },
];
const CHAPTERS = STORY_CHAPTERS.map((chapter, i) => ({
  ...chapter, ...MOTION[i],
  palette: { top: chapter.color, bottom: chapter.color, glow: 'rgba(255,255,255,.3)' },
  props: POSITIONS.map((position, j) => ({ ...position, type: MOTION[i].types[j] })),
}));
const COUNT = CHAPTERS.length;
/** Scene units leave a readable hold between each reversible crossfade. */
const STEP = 1.25;
const CROSSFADE = 0.78;
const FEATURED = PRODUCTS.find((product) => product.id === 'glacial-reserve-1000');

const BOTTLE_SRC = publicPath('/images/bottle-subject.webp');
const BOTTLE_MASK = `url(${BOTTLE_SRC})`;
/** Excludes the paper label band so the liquid tint never colours the logo. */
const LIQUID_MASK = `${BOTTLE_MASK}, linear-gradient(to bottom, #000 0, #000 63.5%, transparent 63.5%, transparent 81%, #000 81%, #000 100%)`;

const maskStyle = (image, intersect = false) => ({
  WebkitMaskImage: image,
  maskImage: image,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  ...(intersect
    ? { WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }
    : {}),
});

const pad = (n) => String(n).padStart(2, '0');

function Prop({ prop, chapterId, index }) {
  const filters = ['drop-shadow(0 14px 18px rgba(0, 0, 0, 0.16))'];
  if (prop.blur) filters.push(`blur(${prop.blur}px)`);

  return (
    <div
      className={styles.prop}
      data-prop
      data-prop-chapter={chapterId}
      style={{
              left: `${prop.x}%`,
              top: `${prop.y}%`,
              width: `calc(${prop.size}vw * var(--prop-scale, 1))`,
            }}
    >
      <div className={styles.propPar} data-depth={prop.depth}>
        <div data-prop-drift>
        <div
          className={styles.propFloat}
          data-float
          style={{ filter: prop.type === 'star' || prop.type === 'orb' ? undefined : filters.join(' ') }}
        >
          {prop.type === 'stone' || prop.type === 'apricot' ? (
            <Image src={`/images/story/${prop.type}-prop.webp`} alt="" width={600} height={600}
              loading="eager" fetchPriority="low"
              className={styles.propImage} sizes="(max-width: 767px) 65px, 150px"
              style={{ transform: `rotate(${prop.rot}deg)` }} />
          ) : (
            <span className={`${styles.shape} ${styles[prop.type]}`}
              style={{ '--rot': `${prop.rot}deg` }} />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

function PropLayer({ layer }) {
  return (
    <div
      className={`${styles.layer} ${layer === 'back' ? styles.layerBack : styles.layerFront}`}
      data-layer={layer}
      aria-hidden="true"
    >
      {CHAPTERS.map((chapter) =>
        chapter.props
          .map((prop, index) => ({ prop, index }))
          .filter(({ prop }) => prop.layer === layer)
          .map(({ prop, index }) => (
            <Prop key={`${chapter.id}-${index}`} prop={prop} chapterId={chapter.id} index={index} />
          ))
      )}
    </div>
  );
}

export default function StoryStage() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const { addToCart } = useCart();

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return undefined;
    const html = document.documentElement;
    const mm = gsap.matchMedia();
    let alive = true;

    // Static scenes are an accessibility preference, not a viewport limitation.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      root.dataset.motion = 'flow';
      html.dataset.story = 'after';
      html.style.setProperty('--ink', '#f5f0e4');
      return () => { delete root.dataset.motion; };
    });

    mm.add({ motion: '(prefers-reduced-motion: no-preference)', roomy: '(min-width: 900px) and (min-height: 621px)' }, (context) => {
      if (!context.conditions.motion) return undefined;
      const compact = !context.conditions.roomy;
      root.dataset.motion = 'cinematic';
      root.dataset.layout = compact ? 'compact' : 'wide';
      html.dataset.story = 'active';
      const q = gsap.utils.selector(stage);
      const bgs = q('[data-bg]');
      const landscapes = q('[data-landscape]');
      const words = q('[data-word]');
      const captions = q('[data-caption]');
      const facts = q('[data-fact]');
      const tabs = q('[data-tab]');
      const chars = words.map((word) => word.querySelectorAll('[data-char]'));
      const props = CHAPTERS.map((chapter) => q(`[data-prop-chapter="${chapter.id}"]`));
      const travel = q('[data-travel]')[0];
      const tilt = q('[data-tilt]')[0];
      const tint = q('[data-tint]')[0];
      const shadow = q('[data-shadow]')[0];
      const glow = q('[data-glow]')[0];
      const fill = q('[data-fill]')[0];
      const roll = q('[data-roll]')[0];
      const hint = q('[data-hint]')[0];
      const sheen = q('[data-sheen-bar]')[0];
      const lightShadow = q('[data-light-shadow]')[0];
      const postcards = q('[data-postcard]');
      const lastStart = (COUNT - 1) * STEP;
      const total = lastStart + 0.85;
      let active = -1;
      let navigation;
      let trigger;
      let idle;
      const cleanups = [];

      gsap.set([bgs, words, captions, facts, props.flat()], { autoAlpha: 0 });
      gsap.set([bgs[0], words[0], captions[0], facts[0], props[0]], { autoAlpha: 1 });
      gsap.set(chars.flatMap((group) => [...group]), { autoAlpha: 1, yPercent: 0 });
      gsap.set(q('[data-subject], [data-intro]'), { autoAlpha: 1 });
      gsap.set(tilt, { rotation: CHAPTERS[0].tilt });
      gsap.set(tint, { backgroundColor: CHAPTERS[0].tint, clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(html, { '--ink': CHAPTERS[0].ink });

      const setActive = (index) => {
        if (active === index) return;
        active = index;
        root.dataset.chapter = CHAPTERS[index].id;
        captions.forEach((caption, i) => {
          caption.inert = i !== index;
          caption.setAttribute('aria-hidden', String(i !== index));
        });
        tabs.forEach((tab, i) => {
          tab.dataset.state = i === index ? 'active' : i < index ? 'past' : 'future';
          if (i === index) tab.setAttribute('aria-current', 'step');
          else tab.removeAttribute('aria-current');
        });
      };
      setActive(0);

      // Every scene change belongs to this one timeline, so reversing scroll
      // retraces the exact same composition. No snapping or wheel interception.
      const story = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => {
          const time = story.time();
          root.dataset.progress = (time / total).toFixed(5);
          root.dataset.scrollProgress = (story.scrollTrigger?.progress ?? 0).toFixed(5);
          setActive(gsap.utils.clamp(0, COUNT - 1, Math.floor((time + CROSSFADE / 2) / STEP)));
        },
        scrollTrigger: {
          id: 'skardu-story', trigger: root, start: 'top top',
          end: () => `+=${window.innerHeight * (compact ? 3.7 : 4.3)}`,
          pin: stage, scrub: 0.45, anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => { html.dataset.story = 'after'; },
          onEnterBack: () => { html.dataset.story = 'active'; },
          onEnter: () => { html.dataset.story = 'active'; },
          onToggle: (self) => idle?.paused(!self.isActive || compact),
        },
      });
      trigger = story.scrollTrigger;
      story.addLabel('scene-mountains', 0);
      // The first scroll visibly brings the product into the story.
      story.fromTo(travel, { x: compact ? 16 : window.innerWidth * .13, y: 24, scale: .8 },
        { x: 0, y: 0, scale: 1, duration: .47, ease: 'power1.out' }, 0);
      story.fromTo(lightShadow, { rotation: -32, scaleX: .8, opacity: .12 },
        { rotation: -42, scaleX: 1, opacity: .2, duration: .6 }, 0);
      story.fromTo(postcards[0], { clipPath: 'inset(48% 0% 48% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: .48 }, 0);
      story.to(fill, { scaleX: 1, duration: total }, 0);
      story.to(hint, { autoAlpha: 0, duration: .3 }, .2);

      CHAPTERS.forEach((chapter, i) => {
        const sceneStart = i * STEP;
        const transitionStart = sceneStart - CROSSFADE;
        // Each landscape moves more slowly than the bottle and foreground props.
        story.fromTo(landscapes[i], { yPercent: 2, scale: 1.06 },
          { yPercent: -3, scale: 1.015, duration: i === COUNT - 1 ? CROSSFADE + .85 : STEP + CROSSFADE }, Math.max(0, transitionStart));
        // Continuous drift during each readable hold creates layered depth.
        story.fromTo(props[i].map((el) => el.querySelector('[data-prop-drift]')),
          { y: 18, rotation: -4 }, { y: -22, rotation: 5, stagger: .025, duration: STEP + .25 }, Math.max(0, transitionStart));
        if (i === 0) return;
        story.addLabel(`scene-${chapter.id}`, sceneStart);
        story.to(bgs[i - 1], { autoAlpha: 0, duration: CROSSFADE }, transitionStart);
        story.fromTo(bgs[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: CROSSFADE }, transitionStart);
        story.to(html, { '--ink': chapter.ink, duration: CROSSFADE }, transitionStart);
        story.to(roll, { yPercent: -(100 / COUNT) * i, duration: CROSSFADE }, transitionStart);
        story.to(words[i - 1], { yPercent: -24, autoAlpha: 0, duration: .55, ease: 'power1.inOut' }, transitionStart);
        story.fromTo(words[i], { yPercent: 26, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: .62, ease: 'power1.inOut' }, transitionStart + .1);
        story.to(captions[i - 1], { autoAlpha: 0, y: -22, duration: .22 }, transitionStart);
        story.fromTo(captions[i], { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: .32 }, transitionStart + .28);
        story.to(facts[i - 1], { autoAlpha: 0, y: -14, duration: .22 }, transitionStart);
        story.fromTo(facts[i], { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: .34 }, transitionStart + .22);
        story.fromTo(postcards[i], { clipPath: 'inset(48% 0% 48% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: .55 }, transitionStart + .18);
        story.to(props[i - 1], { autoAlpha: 0, y: -65, scale: .8, duration: .35 }, transitionStart);
        story.fromTo(props[i], { autoAlpha: 0, y: 90, scale: .7 },
          { autoAlpha: 1, y: 0, scale: 1, stagger: .025, duration: .45 }, transitionStart + .1);
        story.to(tilt, { rotation: chapter.tilt, duration: CROSSFADE }, transitionStart);
        story.to(tint, { backgroundColor: chapter.tint, duration: CROSSFADE }, transitionStart);
        story.to(shadow, { scaleX: i % 2 ? 1.35 : 1, opacity: i === COUNT - 1 ? .7 : .4, duration: CROSSFADE }, transitionStart);
        story.to(glow, { xPercent: (i % 2 ? 1 : -1) * 10, opacity: i === COUNT - 1 ? .16 : .45, duration: CROSSFADE }, transitionStart);
        story.to(lightShadow, { rotation: [-42, -63, -130, -154, -35][i], scaleX: [1, .85, 1.15, 1.05, .7][i], opacity: i === COUNT - 1 ? .12 : .2, duration: CROSSFADE }, transitionStart);
        story.fromTo(sheen, { xPercent: -160 }, { xPercent: 260, duration: CROSSFADE }, transitionStart);
        story.to(travel, {
          x: () => compact ? [0, -9, 8, -8, 0][i] : window.innerWidth * [0, -.035, .035, -.025, .08][i],
          y: compact ? [0, 8, -8, 5, 4][i] : [0, 20, -10, 14, 24][i],
          scale: [1, .9, 1.04, .95, .88][i], duration: CROSSFADE,
        }, transitionStart);
      });
      // A short held shopping composition gives the call to action breathing room.
      story.to({}, { duration: .85 }, lastStart);

      // Ambient float is subordinate to the scroll choreography and sleeps offscreen.
      idle = gsap.timeline({ repeat: -1, yoyo: true, paused: !trigger.isActive || compact });
      idle.to(q('[data-bottle-float]'), { y: -9, duration: 3.8, ease: 'sine.inOut' }, 0);
      q('[data-float]:not([data-bottle-float])').forEach((el, i) => {
        idle.to(el, { y: -8 - (i % 3) * 3, rotation: (i % 2 ? 1 : -1) * 3, duration: 3.8, ease: 'sine.inOut' }, 0);
      });

      tabs.forEach((tab, index) => {
        const onClick = () => {
          navigation?.kill();
          const previousBehavior = html.style.scrollBehavior;
          html.style.scrollBehavior = 'auto';
          const restoreBehavior = () => { html.style.scrollBehavior = previousBehavior; };
          navigation = gsap.to(window, {
            scrollTo: { y: trigger.start + index * STEP / total * (trigger.end - trigger.start), autoKill: true },
            duration: .8, ease: 'power2.inOut', overwrite: true,
            onComplete: restoreBehavior,
            onInterrupt: restoreBehavior,
          });
        };
        tab.addEventListener('click', onClick);
        cleanups.push(() => tab.removeEventListener('click', onClick));
      });
      const interruptNavigation = () => navigation?.kill();
      window.addEventListener('wheel', interruptNavigation, { passive: true });
      window.addEventListener('touchstart', interruptNavigation, { passive: true });
      cleanups.push(() => {
        window.removeEventListener('wheel', interruptNavigation);
        window.removeEventListener('touchstart', interruptNavigation);
      });

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const movers = q('[data-depth]').map((element) => ({
          depth: Number(element.dataset.depth),
          x: gsap.quickTo(element, 'x', { duration: .8, ease: 'power3.out' }),
          y: gsap.quickTo(element, 'y', { duration: .8, ease: 'power3.out' }),
        }));
        const onMove = (event) => {
          const rect = stage.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width * 2 - 1;
          const y = (event.clientY - rect.top) / rect.height * 2 - 1;
          movers.forEach((mover) => { mover.x(-x * mover.depth * 200); mover.y(-y * mover.depth * 140); });
        };
        const onLeave = () => movers.forEach((mover) => { mover.x(0); mover.y(0); });
        stage.addEventListener('pointermove', onMove);
        stage.addEventListener('pointerleave', onLeave);
        cleanups.push(() => { stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerleave', onLeave); });
      }
      return () => {
        navigation?.kill();
        cleanups.forEach((cleanup) => cleanup());
        captions.forEach((caption) => { caption.inert = false; caption.removeAttribute('aria-hidden'); });
        delete root.dataset.motion;
        delete root.dataset.layout;
      };
    }, root);
    document.fonts?.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => {
      alive = false;
      mm.revert();
      html.style.removeProperty('--ink');
      delete html.dataset.story;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={styles.story}
      id="brand-story"
      aria-label="The journey of Skardu Spring water"
    >
      <div ref={stageRef} className={styles.stage}>
        {/* 1 — Backgrounds: one palette per chapter, crossfaded */}
        <div className={styles.bgStack} aria-hidden="true">
          {CHAPTERS.map((chapter, i) => (
            <div
              key={chapter.id}
              className={styles.bg}
              data-bg
              data-first={i === 0}
              style={{
                background: `radial-gradient(70% 58% at 50% 48%, ${chapter.palette.glow}, transparent 72%), linear-gradient(180deg, ${chapter.palette.top} 0%, ${chapter.palette.bottom} 100%)`,
                '--scene-color': chapter.color,
              }}
            >
              <Image src={chapter.image} alt="" fill preload={i === 0}
                loading={i === 0 ? undefined : 'eager'} fetchPriority={i === 0 ? undefined : 'low'}
                sizes="100vw" className={styles.landscape} data-landscape />
              <div className={styles.landscapeVeil} />
            </div>
          ))}
          <div className={styles.ambientGlow} data-glow />
          <div className={styles.grain} />
        </div>

        {/* 2 — Fine editorial frame */}
        <div className={styles.frame} aria-hidden="true">
          <span className={`${styles.tick} ${styles.tickTl}`} />
          <span className={`${styles.tick} ${styles.tickTr}`} />
          <span className={`${styles.tick} ${styles.tickBl}`} />
          <span className={`${styles.tick} ${styles.tickBr}`} />
        </div>

        {/* 3 — Giant serif words, behind the bottle */}
        <div className={styles.words} data-depth="-0.02" aria-hidden="true">
          {CHAPTERS.map((chapter) => (
            <div key={chapter.id} className={styles.word} data-word>
              {[...chapter.word].map((char, i) => (
                <span key={`${chapter.id}-${i}`} className={styles.charMask}>
                  <span className={styles.char} data-char>
                    {char}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.lightShadow} data-light-shadow aria-hidden="true" />
        {/* 4 — Props behind the bottle */}
        <PropLayer layer="back" />

        {/* 5 — Sticky central subject */}
        <div className={styles.subjectWrap}>
          <div className={styles.travel} data-travel>
          <div className={styles.subject} data-subject>
            <div className={styles.groundShadow} data-shadow aria-hidden="true" />
            <div className={styles.rig} data-depth="0.012">
              <div data-mouse-tilt>
                <div className={styles.tilt} data-tilt>
                  <div className={styles.float} data-float data-bottle-float>
                    <div className={styles.bottle}>
                      <Image
                        src={BOTTLE_SRC}
                        alt="Skardu Spring water bottle"
                        width={278}
                        height={930}
                        preload
                        sizes="(max-width: 768px) 120px, 240px"
                        className={styles.bottleImg}
                      />
                      <div
                        className={styles.tint}
                        data-tint
                        aria-hidden="true"
                        style={maskStyle(LIQUID_MASK, true)}
                      />
                      <div
                        className={styles.sheen}
                        aria-hidden="true"
                        style={maskStyle(BOTTLE_MASK)}
                      >
                        <span className={styles.sheenBar} data-sheen-bar />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* 6 — Props in front of the bottle */}
        <PropLayer layer="front" />

        {/* 7 — Minimalist UI shell */}
        <div className={styles.shell}>
          <div className={styles.topbar} data-intro>
            <span className={styles.topLabel}>Gilgit-Baltistan, Pakistan</span>
            <span className={styles.counter} aria-hidden="true">
              <span className={styles.counterWindow}>
                <span className={styles.counterRoll} data-roll>
                  {CHAPTERS.map((chapter, i) => (
                    <span key={chapter.id}>{pad(i + 1)}</span>
                  ))}
                </span>
              </span>
              <span className={styles.counterTotal}>/ {pad(COUNT)}</span>
            </span>
          </div>

          <div className={styles.captions}>
            {CHAPTERS.map((chapter, i) => (
              <article key={chapter.id} className={styles.caption} data-caption>
                <p className={styles.eyebrow} data-reveal>
                  <span>{pad(i + 1)}</span>
                  {chapter.eyebrow}
                </p>
                {i === 0 ? <h1 className={styles.captionTitle} data-reveal>{chapter.title}</h1>
                  : <h2 className={styles.captionTitle} data-reveal>{chapter.title}</h2>}
                <p className={styles.captionBody} data-reveal>
                  {chapter.body}
                </p>
                {(i === 0 || i === COUNT - 1) && (
                  <div className={styles.cta} data-reveal>
                    {i === 0 ? <Link href="/shop" className={styles.ctaPrimary}>Explore the collection</Link>
                      : <button type="button" className={styles.ctaPrimary} onClick={() => addToCart(FEATURED)}>
                        Add {FEATURED.size} · Rs. {FEATURED.price}
                      </button>}
                    <Link href={i === 0 ? '/source' : `/shop/${FEATURED.id}`} className={styles.ctaGhost}>
                      {i === 0 ? 'Discover Skardu' : 'View the bottle'}
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className={styles.facts} aria-hidden="true">
            {CHAPTERS.map((chapter) => (
              <div key={chapter.id} className={styles.fact} data-fact>
                <figure className={styles.postcard} data-reveal>
                  <div className={styles.postcardImage} data-postcard>
                    <Image src={chapter.image} alt={chapter.alt} fill
                      sizes="(max-width: 767px) 28vw, 22vw" />
                  </div>
                  <figcaption>{chapter.photoLabel}</figcaption>
                </figure>
                <span className={styles.factNote} data-reveal>{chapter.note}</span>
              </div>
            ))}
          </div>

          <div className={styles.hint} data-hint data-intro aria-hidden="true">
            <span>Scroll to travel</span>
            <i />
          </div>

          <nav className={styles.timeline} aria-label="Story chapters" data-intro>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.trackFill} data-fill />
            </div>
            <ol className={styles.stops}>
              {CHAPTERS.map((chapter, i) => (
                <li key={chapter.id} className={styles.stop}>
                  <button
                    type="button"
                    className={styles.tab}
                    data-tab
                    data-state={i === 0 ? 'active' : 'future'}
                    aria-label={`Chapter ${i + 1}: ${chapter.label}`}
                  >
                    <span className={styles.node} />
                    <span className={styles.stopNum}>{pad(i + 1)}</span>
                    <span className={styles.stopLabel}>{chapter.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      <div className={styles.flowStory}>
        {CHAPTERS.map((chapter, index) => (
          <article key={chapter.id} className={styles.flowChapter} style={{ '--scene-color': chapter.color, '--scene-ink': chapter.ink }}>
            <div className={styles.flowVisual}>
              <Image src={chapter.image} alt={chapter.alt} fill sizes="100vw" preload={index === 0} className={styles.flowLandscape} />
              <span className={styles.flowWord} aria-hidden="true">{chapter.word}</span>
              {index === 0 && <div className={styles.flowBottle}><Image src={BOTTLE_SRC} alt="Skardu Spring water bottle" fill sizes="140px" preload /></div>}
            </div>
            <div className={styles.flowCopy}>
              <p className={styles.eyebrow}>{chapter.eyebrow}</p>
              {index === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
              <p>{chapter.body}</p>
              {(index === 0 || index === COUNT - 1) && <div className={styles.cta}>
                <Link href="/shop" className={styles.ctaPrimary}>Shop the collection</Link>
                <Link href={`/shop/${FEATURED.id}`} className={styles.ctaGhost}>View the bottle</Link>
              </div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
