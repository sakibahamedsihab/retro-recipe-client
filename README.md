# 🍳 RecipeHub — Retro Recipe Client

Welcome to **RecipeHub** — a nostalgic, bold, and interactive recipe sharing platform built with a modern tech stack. The UI draws inspiration from **Neobrutalism** and classic retro design: vibrant colors, thick black borders, solid shadows, and Framer Motion animations.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Authentication:** Better Auth (credentials + Google OAuth)
- **Backend Sync:** JWT stored in HTTPOnly cookies via Express API
- **Payments:** Stripe Checkout (premium membership + recipe purchases)
- **Image Upload:** ImgBB
- **Theme:** Dark / Light mode toggle (`next-themes`)

---

## ✨ Features

### Public Pages
- **Home** — Banner, featured recipes, popular recipes, extra sections, Framer Motion animations
- **Browse Recipes** — Search, multi-category filter (MongoDB `$in`), server-side pagination
- **Recipe Details** — Like, favorite, report, Stripe purchase
- **Login / Register** — Credential auth + Google OAuth, redirect to intended route

### User Dashboard (Protected)
- **Overview** — Total recipes, favorites, likes received, premium badge
- **My Recipes** — View, edit, delete own recipes
- **Add Recipe** — ImgBB image upload, 2-recipe limit for free users, unlimited for premium
- **Favorites** — Saved recipes with remove option
- **Purchased Recipes** — Recipes bought via Stripe
- **Profile** — Update name and avatar

### Admin Dashboard
- **Overview** — Users, recipes, premium members, reports, revenue
- **Manage Users** — Block / unblock users
- **Manage Recipes** — Edit, delete, feature recipes (featured appear on home page)
- **Reports** — Dismiss or remove reported recipes
- **Transactions** — Payment history with user, amount, date, status, transaction ID

### Challenge Requirements
- ✅ Dark / Light theme toggle
- ✅ Category filter with MongoDB `$in` (multi-select)
- ✅ JWT in HTTPOnly cookies
- ✅ Server-side pagination
- ✅ Custom 404 page
- ✅ Loading states
- ✅ Fully responsive design
- ✅ Protected dashboard routes (auth guard)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas (or local MongoDB)
- Running Express backend (`retro-recipe-server`)
- Stripe account (for payments)
- ImgBB API key (for image uploads)
- Google OAuth credentials (optional, for Google login)

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Express API URL (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_APP_URL` | Next.js app URL (e.g. `http://localhost:3000`) |
| `MONGODB_URI` | MongoDB connection string for Better Auth |
| `AUTH_DB_NAME` | Database name for auth collections |
| `BETTER_AUTH_SECRET` | Random secret for Better Auth |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key for image uploads |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |

### 2. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Production Build

```bash
npm run build
npm start
```

Ensure `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_APP_URL` point to your deployed URLs. The backend `CLIENT_URL` must match your frontend origin for CORS.

---

## 📁 Directory Structure

```
retro-recipe-client/
├── public/
└── src/
    ├── app/
    │   ├── api/auth/          # Better Auth API route
    │   ├── dashboard/         # Protected user & admin pages
    │   ├── login/             # Login page
    │   ├── register/          # Registration page
    │   ├── recipes/           # Browse & detail pages
    │   ├── not-found.jsx      # Custom 404
    │   └── loading.jsx        # Global loading UI
    ├── components/
    │   ├── dashboard/         # Sidebar, auth guard
    │   ├── home/              # Home page sections
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── ThemeProvider.jsx
    │   └── ThemeToggle.jsx
    └── lib/
        ├── auth.js            # Better Auth server config
        └── auth-client.js     # Better Auth client
```

---

## 🔐 Authentication Flow

1. User signs in via Better Auth (email/password or Google)
2. Client syncs session to Express backend via `POST /api/jwt`
3. Backend issues JWT stored in HTTPOnly cookie
4. All protected API calls use `credentials: "include"`
5. Dashboard layout redirects unauthenticated users to `/login`

---

## 🚢 Deployment Notes

- Set all env vars in your hosting platform (Vercel, Netlify, etc.)
- Backend `CLIENT_URL` must exactly match your deployed frontend URL
- No page reload issues — App Router handles client-side navigation
- Private routes persist auth after refresh via Better Auth session + JWT cookie

---

## 📄 License

Built for educational purposes as part of the RecipeHub assignment.
