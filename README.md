# ShopVerse - Ecommerce Frontend

Modern React ecommerce storefront with admin dashboard.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Cart and auth state
- **React Hook Form** + **Zod** - Form validation
- **Stripe** - Checkout redirect
- **Axios** - HTTP client with JWT interceptors

## Prerequisites

- Node.js 18+
- Backend API running (see Ecommerce-backend README)

## Setup

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api/v1
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   ```

3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

App runs at `http://localhost:5173`

## Pages

### Storefront
| Route | Description |
|-------|-------------|
| `/` | Home - hero, categories, featured products |
| `/shop` | Product listing with search, filters, pagination |
| `/products/:slug` | Product detail with reviews |
| `/cart` | Shopping cart |
| `/checkout` | Shipping form + Stripe payment |
| `/login` / `/register` | Authentication |
| `/account` | Order history |

### Admin (requires admin role)
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with stats and low stock alerts |
| `/admin/products` | Product CRUD with image upload |
| `/admin/orders` | Order management and status updates |
| `/admin/categories` | Category management |
| `/admin/users` | User list |

## Default Admin Login

- **Email:** admin@store.com
- **Password:** Admin@123

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
