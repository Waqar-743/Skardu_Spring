import { test, expect } from '@playwright/test';

const chapters = ['mountains', 'river', 'heritage', 'orchards', 'table'];

async function ready(page) {
  await page.goto('./', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#brand-story')).toHaveAttribute('data-motion', 'cinematic');
  await page.waitForFunction(() => [...document.querySelectorAll('#brand-story [data-bg] img')].every(img => img.complete && img.naturalWidth > 0));
  await page.evaluate(() => document.fonts.ready);
}

async function settle(page) {
  await page.waitForFunction(() => {
    const state = document.getElementById('brand-story').dataset;
    return Math.abs(Number(state.progress) - Number(state.scrollProgress)) < .0001;
  });
}

async function sample(page, y) {
  await page.evaluate(y => new Promise(resolve => {
    window.scrollTo({ top: y, behavior: 'instant' });
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }), y);
  await settle(page);
  return page.locator('#brand-story').evaluate(root => ({
    chapter: root.dataset.chapter,
    matrix: getComputedStyle(root.querySelector('[data-travel]')).transform,
    ink: getComputedStyle(document.documentElement).getPropertyValue('--ink'),
    captions: [...root.querySelectorAll('[data-caption]')].filter(el => !el.inert).length,
  }));
}

for (const viewport of [
  { width: 1440, height: 900 }, { width: 1280, height: 600 },
  { width: 390, height: 844 }, { width: 319, height: 524 },
  { width: 667, height: 375 },
]) {
  test(`Five scenes, native wheel and reverse scrolling at ${viewport.width}×${viewport.height}`, async ({ page }, info) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await ready(page);
    await expect(page.locator('#brand-story .pin-spacer')).toHaveCount(1);
    await page.mouse.wheel(0, 300);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
    await settle(page);
    expect(await page.evaluate(() => scrollY)).toBeLessThan(420);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
    await settle(page);
    const span = await page.locator('#brand-story .pin-spacer').evaluate(el => parseFloat(el.style.paddingBottom));
    const forward = [];
    for (let i = 0; i < chapters.length; i++) {
      const state = await sample(page, span * i / 4);
      expect(state.chapter).toBe(chapters[i]);
      expect(state.captions).toBe(1);
      expect(await page.locator('#brand-story [data-caption]').filter({ visible: true }).count()).toBeGreaterThan(0);
      const active = page.locator(`#brand-story [data-caption][aria-hidden="false"]`);
      const box = await active.boundingBox();
      expect(box.y).toBeGreaterThan(35);
      expect(box.y + box.height).toBeLessThan(viewport.height - 45);
      forward.push(state);
      if (i === 3) await page.screenshot({ path: info.outputPath('orchard.png') });
    }
    for (let i = chapters.length - 2; i >= 0; i--) {
      const reverse = await sample(page, span * i / 4);
      expect(reverse.chapter).toBe(forward[i].chapter);
      const numbers = str => str.match(/-?\d*\.?\d+/g).map(Number);
      numbers(reverse.matrix).forEach((value, j) => expect(Math.abs(value - numbers(forward[i].matrix)[j])).toBeLessThan(.1));
      expect(reverse.ink).toBe(forward[i].ink);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    await page.screenshot({ path: info.outputPath('hero.png') });
  });
}

test('Fonts unavailable: motion starts and refresh never sends the shopper to the bottom', async ({ page }) => {
  await page.route('**/*.woff2', route => route.abort());
  await ready(page);
  expect(await page.locator('link[rel="stylesheet"]').evaluateAll(links => links.every(link => new URL(link.href).origin === location.origin))).toBe(true);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await settle(page);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(700);
});

test('Chapter buttons, editorial depth, horizontal timeline and collection remain reversible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  for (const [label, chapter] of [['Chapter 4: Orchards', 'orchards'], ['Chapter 2: River', 'river'], ['Chapter 5: Your table', 'table']]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page.locator('#brand-story')).toHaveAttribute('data-chapter', chapter);
    await settle(page);
  }
  const image = page.locator('#culture [data-image-drift]').first();
  const start = await page.locator('#culture').evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), start);
  await page.waitForTimeout(650);
  const firstImage = await image.evaluate(el => getComputedStyle(el).transform);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), start + 500);
  await page.waitForTimeout(650);
  expect(await image.evaluate(el => getComputedStyle(el).transform)).not.toBe(firstImage);
  const track = page.locator('#journey [data-track]');
  const journeyStart = await page.locator('#journey').evaluate(el => el.getBoundingClientRect().top + scrollY);
  const distance = await track.evaluate(el => el.scrollWidth - innerWidth);
  const matrices = [];
  for (const ratio of [.15, .7, .15]) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), journeyStart + distance * ratio);
    await page.waitForTimeout(1100);
    matrices.push(await track.evaluate(el => getComputedStyle(el).transform));
  }
  expect(matrices[0]).not.toBe(matrices[1]);
  expect(matrices[2]).toBe(matrices[0]);
  const product = page.locator('#product-showcase [data-drift]').first();
  const productStart = await product.evaluate(el => el.getBoundingClientRect().top + scrollY - innerHeight * .8);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), productStart);
  await page.waitForTimeout(700);
  const before = await product.evaluate(el => getComputedStyle(el).transform);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), productStart + 400);
  await page.waitForTimeout(700);
  expect(await product.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
});

test('Navigation away and back recreates pins without hiding the footer or breaking shopping', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await page.getByRole('link', { name: 'Explore the collection', exact: true }).click();
  await expect(page).toHaveURL(/\/shop\/$/);
  await page.locator('#site-footer').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('#site-footer [data-fade]').first().evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.95);
  await page.locator('#main-navbar').getByRole('link', { name: 'The Journal', exact: true }).click();
  await page.waitForFunction(() => Math.abs(document.getElementById('culture')?.getBoundingClientRect().top - 96) < 5);
  await expect(page.locator('#brand-story .pin-spacer')).toHaveCount(1);
  await page.locator('#main-navbar').getByRole('link', { name: 'Collection', exact: true }).click();
  await page.waitForFunction(() => Math.abs(document.getElementById('product-showcase')?.getBoundingClientRect().top - 96) < 5);
  await page.getByRole('button', { name: 'Add Glacial Reserve to cart', exact: true }).click();
  await page.getByRole('button', { name: /Open cart, 1 item/i }).click();
  const cart = page.getByRole('dialog', { name: 'Your Cart' });
  await expect(cart.getByText('Glacial Reserve', { exact: true })).toBeVisible();
  await cart.getByRole('button', { name: /Proceed to Checkout/ }).click();
  await expect(page).toHaveURL(/\/checkout\/$/);
  await page.getByRole('link', { name: 'Skardu Spring Home', exact: true }).click();
  await expect(page.locator('#brand-story')).toHaveAttribute('data-motion', 'cinematic');
  await page.getByRole('button', { name: /Open cart, 1 item/i }).click();
  await page.keyboard.press('Escape');
  await expect(cart).toBeHidden();
  await page.getByRole('link', { name: 'Skardu Spring Home', exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
  await page.getByRole('button', { name: 'Chapter 4: Orchards', exact: true }).click();
  await expect(page.locator('#brand-story')).toHaveAttribute('data-chapter', 'orchards');
});

test('Viewport changes keep one valid story; reduced motion keeps every chapter readable', async ({ page }) => {
  await ready(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#brand-story')).toHaveAttribute('data-layout', 'compact');
  await expect(page.locator('#brand-story .pin-spacer')).toHaveCount(1);
  await page.setViewportSize({ width: 667, height: 375 });
  await page.getByRole('button', { name: 'Chapter 3: Heritage', exact: true }).click();
  await expect(page.locator('#brand-story')).toHaveAttribute('data-chapter', 'heritage');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#brand-story')).toHaveAttribute('data-motion', 'flow');
  await expect(page.locator('#brand-story .pin-spacer')).toHaveCount(0);
  expect(await page.locator('#brand-story [class*="flowChapter"]').count()).toBe(5);
  expect(await page.locator('#brand-story').evaluate(el => el.getBoundingClientRect().height > innerHeight * 3)).toBe(true);
});

test('Mobile timeline reveals move with scroll and empty checkout returns to the shop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const item = page.locator('#journey [data-item]').first();
  const body = item.locator('[data-body]').first();
  const top = await item.evaluate(el => scrollY + el.getBoundingClientRect().top);
  const states = [];
  for (const offset of [760, 420, 760]) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top - offset);
    await page.waitForTimeout(600);
    states.push(await body.evaluate(el => getComputedStyle(el).transform));
  }
  expect(states[0]).not.toBe(states[1]);
  expect(states[2]).toBe(states[0]);
  await page.goto('./checkout/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/shop\/$/);
});
