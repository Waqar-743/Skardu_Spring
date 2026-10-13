# Skardu Spring

Some places stay with you. A river moving through a mountain valley, an orchard coming into blossom, a table where there is always room for one more person.

Skardu Spring takes its inspiration from Baltistan. This website gives visitors a little time with that place before inviting them to explore the water collection. Its story moves through mountains, the Indus, local heritage, apricot orchards and the simple pleasure of sharing a meal.

[Visit the storefront](https://waqar-743.github.io/Skardu_Spring/)

## Follow the journey

A bottle stays in view while the scenery changes around it. Scroll forward to move through the five chapters, or scroll back to revisit them. The light, lettering, landscape and small foreground details each move at their own pace.

Further down the page, field notes introduce the region's living heritage. A timeline connects those stories, and the collection brings the journey back to something familiar: choosing a bottle for the day ahead.

The cultural scenes use artistic interpretations inspired by Baltistan. Research links and image notes are available on the site. Regional stories provide context; product information and quality documents are presented separately.

## Make yourself at home

Visitors can browse products, save favourites, add bottles to their cart and review delivery details. The cart stays with them as they move between pages. Smaller screens use compact compositions and a vertical timeline, while reduced-motion preferences provide a readable version of the complete story.

The visual language carries through the shop, product pages and supporting pages: warm paper, forest green, generous serif headings and clear, quiet controls.

## Run the website locally

Use Node.js 22 and run these commands from the repository root:

```sh
npm ci
npm run dev:frontend
```

Open the local address printed in the terminal. To check the production build:

```sh
npm run build --workspace frontend
npm run start --workspace frontend
```

The frontend uses Next.js 16, React 19, GSAP and Motion. Styling lives in CSS Modules and shared theme variables. Fonts and story assets are served with the site.

## Publishing to GitHub Pages

Each push to `main` builds the static storefront, runs the motion checks and publishes the result to GitHub Pages. To create the same export locally:

```sh
npm run build:pages --workspace frontend
```

The exported files are in `frontend/.pages-build/out`. The build uses `/Skardu_Spring/` as the local default; the deployment workflow takes the path from the repository name.

GitHub Pages serves static files. Checkout opens a WhatsApp order-request draft for the shopper to review and send. The team confirms availability, delivery and payment, and the cart remains available until the shopper decides what to do next. Newsletter enquiries use an email link.

Automatic order processing, email delivery and the assistant need a server deployment. The full Next.js application keeps its API routes, and the repository also includes the Express backend. Deployment options and the optional API origin are documented in [the Pages notes](docs/GITHUB_PAGES.md).

## Check the motion

The browser checks cover all five chapters, forward and reverse scrolling, ordinary mouse-wheel scrolling, chapter buttons, editorial movement, the regional timeline, page navigation, cart interactions, viewport changes and reduced motion.

```sh
npx playwright install chromium
npm run build:pages --workspace frontend
npm run test:motion --workspace frontend
```

If a motion check fails during deployment, its screenshots and trace are saved with the GitHub Actions run for review.

## License

This project uses the [MIT License](LICENSE). The bundled fonts retain their accompanying Open Font License files.
