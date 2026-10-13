'use client';

import { useEffect, useState } from 'react';
import Image from '@/components/layout/SiteImage';
import Link from '@/components/layout/SiteLink';
import concepts from './concepts.json';
import variations from './variations.json';
import refinements from './refinements.json';
import styles from './page.module.css';
import { publicPath } from '@/lib/deployment';

const allChoices = [...refinements, ...variations, ...concepts];
const code = (id) => String(id).padStart(2, '0');

export default function BrandLab() {
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');
  const [view, setView] = useState('refinements');
  const visibleChoices = view === 'refinements' ? refinements : view === 'variations' ? variations : concepts;
  useEffect(() => {
    try {
      const value = localStorage.getItem('skardu-logo-direction');
      const choice = allChoices.find((c) => String(c.id) === value);
      if (choice) Promise.resolve().then(() => setSelected(choice.id));
    } catch { /* Selection still works when browser storage is unavailable. */ }
  }, []);

  function select(id) {
    if (selected === id) {
      setSelected(null);
      try { localStorage.removeItem('skardu-logo-direction'); } catch {}
      setNotice('Selection cleared. Choose any direction to compare it.');
      return;
    }
    setSelected(id);
    try { localStorage.setItem('skardu-logo-direction', String(id)); } catch {}
    setNotice('Direction ' + code(id) + ' selected. Share this code in our chat to refine it.');
  }

  return <section className={styles.lab}>
    <header>
      <p className={styles.kicker}>Skardu Spring / Identity exploration</p>
      <h1>Your favourite 06A.<br /><em>A more generous drop.</em></h1>
      <p>Compare the larger single droplet with the three droplet version. The earlier 06, 07 and 08 variations are still available below.</p>
      <Link href="/" className={styles.back}>Return to the story ↗</Link>
    </header>
    <div className={styles.filters} aria-label="Logo comparison groups">
      <button type="button" aria-pressed={view === 'refinements'} onClick={() => setView('refinements')}>06A refinements <span>02</span></button>
      <button type="button" aria-pressed={view === 'variations'} onClick={() => setView('variations')}>Nine new variations <span>09</span></button>
      <button type="button" aria-pressed={view === 'originals'} onClick={() => setView('originals')}>Original directions <span>10</span></button>
      <a href={publicPath(view === 'refinements' ? '/brand-concepts/logo-06a-refinements.png' : '/brand-concepts/logo-variations-06-07-08.png')} download>Download comparison sheet ↗</a>
    </div>
    <p className={styles.notice} role="status" aria-live="polite">{notice || (selected ? 'Your current choice: direction ' + code(selected) + '.' : 'Select a direction below, or tell me its code in our chat.')}</p>
    <div className={`${styles.grid} ${view === 'variations' ? styles.variations : ''}`}>
      {visibleChoices.map((concept) => <article key={concept.id} className={styles.concept} data-selected={selected === concept.id}>
        <div className={styles.cardTop}><span>{code(concept.id)}</span><span>{concept.name}</span></div>
        <div className={styles.artwork}><Image src={concept.file} alt={concept.name + ': ' + concept.desc} width={560} height={240} unoptimized /></div>
        <p>{concept.desc}</p>
        <div className={styles.actions}>
          <button type="button" onClick={() => select(concept.id)} aria-pressed={selected === concept.id}>{selected === concept.id ? 'Clear selection' : 'Choose direction ' + code(concept.id)}<span aria-hidden="true">{selected === concept.id ? '✓' : '↗'}</span></button>
          <a href={publicPath(concept.file)} download={'skardu-spring-logo-' + code(concept.id).toLowerCase() + '.svg'}>Download SVG</a>
        </div>
      </article>)}
    </div>
  </section>;
}
