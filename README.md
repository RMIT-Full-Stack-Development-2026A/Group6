# TicTacToang - RMIT Fullstack Group 6

An online multiplayer Tic Tac Toe game built with Next.js and Node.js/Express.

## Features

- Different Board Sizes (10x10, 15x15)
- Bot opponents (Easy, Medium, Hard)
- User authentication with JWT
- Premium subscription via Stripe
- Game history and replay system
- Admin dashboard for user and game room management

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** Node.js, Express 5, TypeScript
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + token blacklist

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (for frontend workspace)
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd Group6-main

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside `/backend` with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000
```

`MONGODB_URI` and `JWT_SECRET` are required — the server will refuse to start without them.

### Seeding the Database

To populate the database with initial subscription plans and a default admin account:

```bash
cd backend
npm run seed
```

### Running the App

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from root)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
The backend runs on [http://localhost:5000](http://localhost:5000).

---

## Project Structure

```
Group6-main/
├── backend/
│   └── src/
│       ├── config/         # DB connection, env validation, seed script
│       ├── controllers/    # Route handler classes (thin layer over services)
│       ├── middleware/     # Auth, role, premium, rate limiter guards
│       ├── models/         # Mongoose schemas
│       ├── repositories/   # All direct DB queries
│       ├── routes/         # Express route definitions
│       ├── services/       # Business logic
│       └── types/          # Shared TypeScript types
└── frontend/
    └── src/
        ├── app/            # Next.js App Router pages and layouts
        ├── components/     # React components grouped by feature
        ├── context/        # Game and selection React contexts
        ├── hooks/          # Custom React hooks
        ├── services/       # Frontend API call helpers
        ├── types/          # Shared frontend TypeScript types
        └── utils/          # Validators and utility functions
```

---

## API Routes

All backend routes are prefixed with `/api`.

| Prefix                       | Description                                     |
|------------------------------|-------------------------------------------------|
| `/api/auth`                  | Register, login, logout                         |
| `/api/users`                 | Profile, avatar, password change, stats         |
| `/api/games`                 | Create, fetch, update, delete games             |
| `/api/games/:id/moves`       | Full move list for replay (premium only)        |
| `/api/games/:gameId/bot-moves` | Submit finished bot game moves                |
| `/api/bots`                  | Request a bot move for a given difficulty       |
| `/api/subscriptions`         | Subscription plan CRUD (admin)                  |
| `/api/payments`              | Upgrade to Pro, cancel subscription             |
| `/api/admin`                 | User management — list, deactivate, reactivate  |

> **Note:** `/api/admin` routes are defined in `admin.routes.ts` but are not yet mounted in `server.ts`. To enable them, add these two lines to `backend/src/server.ts`:
> ```ts
> import adminRoutes from './routes/admin.routes';
> app.use('/api/admin', adminRoutes);
> ```

Health check: `GET /health`
DB status: `GET /api/db-status`

---

## Middleware

- **auth.middleware** — verifies the JWT on protected routes
- **role.middleware** — restricts routes to admin users
- **premium.middleware** — restricts routes to users with an active subscription
- **rateLimiter.middleware** — rate limits login and signup endpoints to prevent brute force

---

## Available Scripts

### Backend (`/backend`)

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start dev server with hot reload     |
| `npm run build` | Compile TypeScript to `/dist`        |
| `npm run start` | Run compiled production build        |
| `npm run seed`  | Seed database with default data      |

### Frontend (root)

| Command       | Description                   |
|---------------|-------------------------------|
| `pnpm dev`    | Start Next.js dev server      |
| `pnpm build`  | Build for production          |
| `pnpm start`  | Start production server       |
| `pnpm lint`   | Run ESLint                    |