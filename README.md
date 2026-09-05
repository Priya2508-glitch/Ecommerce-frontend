# ShopVerse - Ecommerce Frontend

Modern React ecommerce storefront with admin dashboard.

**Repository:** [github.com/srikanth13122002/Ecommerce-frontend](https://github.com/srikanth13122002/Ecommerce-frontend)

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** — Styling
- **React Router** — Client-side routing
- **TanStack Query** — Server state management
- **Zustand** — Cart and auth state
- **React Hook Form** + **Zod** — Form validation
- **Stripe** — Checkout redirect
- **Axios** — HTTP client with JWT interceptors

## Prerequisites

- Node.js 18+
- Backend API running (see [Ecommerce-Backend](https://github.com/srikanth13122002/Ecommerce-Backend))

## Local Setup

1. Copy environment file:

   ```bash
   cp .env.example .env
   ```

2. Update `.env`:

   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   ```

3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

App runs at `http://localhost:5173`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL (includes `/api/v1`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (`pk_test_...` or `pk_live_...`) |

> Vite embeds these at **build time**. Changing them requires a new build.

### Production example

```env
VITE_API_URL=https://api.your-domain.com/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Pages

### Storefront

| Route | Description |
|-------|-------------|
| `/` | Home — hero, categories, featured products |
| `/shop` | Product listing with search, filters, pagination |
| `/products/:slug` | Product detail with reviews |
| `/cart` | Shopping cart |
| `/checkout` | Shipping form + Stripe payment |
| `/login` / `/register` | Customer authentication |
| `/account` | Order history |

### Admin (requires admin role)

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard with stats and low stock alerts |
| `/admin/products` | Product CRUD with image upload |
| `/admin/orders` | Order management and status updates |
| `/admin/categories` | Category management |
| `/admin/users` | User list |

## Default Admin Login

After backend seed:

- **Email:** `admin@store.com`
- **Password:** `Admin@123`

Use `/admin/login` for admin access. Change the password before production.

## Production Deployment

This is a static SPA. Build once, then serve the `dist/` folder.

### Build

```bash
npm install
npm run build
```

Output is in `dist/`.

### Hosting requirements

1. **SPA fallback routing** — All routes must serve `index.html` so React Router works:

   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

2. **HTTPS** — Required for Stripe checkout in production.

3. **Backend CORS** — The backend `CORS_ORIGIN` must match this frontend URL exactly.

4. **Stripe redirect URLs** — Backend `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL` must point to this frontend domain.

### DevOps checklist

- [ ] Set `VITE_API_URL` and `VITE_STRIPE_PUBLISHABLE_KEY` before building
- [ ] Deploy `dist/` to static hosting (Vercel, Netlify, S3+CloudFront, Nginx, etc.)
- [ ] Configure SPA fallback for all routes
- [ ] Use Stripe live publishable key in production builds
- [ ] Verify checkout success/cancel pages load at `/checkout/success` and `/checkout/cancel`

### Related backend repo

The NestJS API lives in a separate repository:

[github.com/srikanth13122002/Ecommerce-Backend](https://github.com/srikanth13122002/Ecommerce-Backend)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
