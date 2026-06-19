# 🍳 Retro Recipe Hub 

Welcome to **Retro Recipe Hub** – a nostalgic, bold, and interactive recipe sharing web application built with a modern tech stack. The user interface draws inspiration from **Neobrutalism** and classic retro design, utilizing vibrant color palettes, thick black borders, solid shadows, and snappy micro-animations.

---

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** CSS & TailwindCSS v4
- **Animations:** Framer Motion
- **Authentication:** Better Auth (Client-side sync with backend via HttpOnly JWT cookies)
- **Icons:** React Icons

---

## ✨ Features

### 👤 User Features
- **Interactive Recipe Browsing:** Search, filter by category, and navigate with pagination.
- **Recipe Detail View:** View ingredients, instructions, cooking time, and author.
- **Like & Favorite:** Toggle likes and add recipes to your favorite collection.
- **Flag & Report:** Report recipes that violate guidelines to flag them for admin review.
- **Recipe Management:** Add, view, edit (with image uploads via imgbb), and delete your own recipes.
- **Premium Upgrade:** Purchase a premium membership via Stripe checkout to unlock premium features and recipes.
- **Purchased Recipes:** View and access all premium recipes you have unlocked.
- **Profile Customization:** Edit your user profile details and upload custom avatars.

### 🛡️ Admin Features (Role-Based)
- **Security & Authorization Guard:** Custom middleware verification restricts dashboard management routes strictly to admins.
- **Overview Dashboard:** View site-wide analytics including total users, active recipes, premium members, pending reports, and total revenue.
- **User Moderation:** View user lists and block/unblock users violating community guidelines.
- **Recipe Moderation:** Search and delete any recipe from the platform.
- **Reports Moderation Queue:** Accept and process flagged reports to dismiss them or permanently remove violating recipes.

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### 1. Clone & Set Up Directory
Ensure you have the backend server running to handle authentication, payments, and data operations.

### 2. Environment Variables
Create a `.env` file in the root of the client directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience Retro Recipe Hub!

---

## 📁 Directory Structure

```
retro-recipe-client/
├── public/                 # Static assets
└── src/
    ├── app/                # Next.js App Router Pages
    │   ├── dashboard/      # User & Admin dashboards
    │   │   ├── admin/      # Admin moderation panel
    │   │   ├── profile/    # User profile editor
    │   │   └── ...         # My Recipes, Favorites, Purchases
    │   ├── login/          # Sign-in page
    │   ├── register/       # Sign-up page
    │   └── recipes/        # Recipe browse & detailed views
    ├── components/         # Reusable UI components (Sidebar, Navbar, Cards)
    └── lib/                # Auth client and utility functions
```
