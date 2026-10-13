# GitHub Pages deployment

Live storefront: https://waqar-743.github.io/Skardu-Spring/

The `Deploy GitHub Pages` workflow builds and publishes the storefront on every push to `main`. In repository Settings → Pages, the source is **GitHub Actions**. The separate CI workflow validates the full server application.

## Build locally

```sh
npm ci
npm run build:pages --workspace frontend
```

The publishable files are in `frontend/.pages-build/out`. Serve them under `/Skardu-Spring/`, matching the build-time base path. Direct routes use directory indexes, including all six product pages. Public images and document links include the repository prefix.

The build script copies the application into an ignored staging directory, excluding server route handlers and proxy code. It does not change the server application's source or local configuration. The normal `npm run build --workspace frontend` and `npm run start --workspace frontend` still provide the complete Next.js application and APIs.

## Shopping and forms

GitHub Pages hosts static files; it cannot execute Next.js API routes, store orders or send email. With no API origin configured:

- Browsing, product details, wishlists, cart storage and scroll animations work in the browser.
- Checkout opens a WhatsApp order-request draft for the shopper to review and send. It retains the cart and never reports an order as confirmed or payment as received.
- Newsletter signup is replaced by an email contact link. The contact form opens an email draft. The server-backed assistant is hidden.

For automatic order processing, email and the assistant, deploy the full Next.js application to a Node-capable host. Alternatively, configure the repository Actions variable `NEXT_PUBLIC_API_ORIGIN` to an HTTPS host serving compatible `/api/orders`, `/api/contact`, `/api/newsletter` and `/api/chat` endpoints. That host must allow the Pages origin with CORS, validate requests and provide persistent storage. Rebuild Pages after changing the variable. Never put server credentials in public build variables.
