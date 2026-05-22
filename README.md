# TicTacToang - RMIT Fullstack Group 6

An online multiplayer Tic Tac Toe game built with Next.js and Node.js/Express.

**GitHub Repository:** [https://github.com/RMIT-Full-Stack-Development-2026A/Group6](https://github.com/RMIT-Full-Stack-Development-2026A/Group6)

---

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

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (for frontend workspace)
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/RMIT-Full-Stack-Development-2026A/Group6
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
BASE_URL=your_domain_url
```

`MONGODB_URI`, `BASE_URL` and `JWT_SECRET` are required — the server will refuse to start without them.
For `BASE_URL`, if you want to run the application locally, set this param as `http://localhost:5000`

Create a `.env` file inside the root `/` (frontend) with the following variable:

```env
NEXT_PUBLIC_API_BASE_URL=your_domain_url
```

For `NEXT_PUBLIC_API_BASE_URL`, set this to the same value as `BASE_URL` above.

### Seeding the Database

To populate the database with initial subscription plans and a default admin account:

```bash
cd backend
npm run seed
```

### Running the App (Dev mode)

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from root)
pnpm dev
```

### Running the App (Deploy mode)

```bash
# From root location
# Build and run frontend
pnpm run build
pnpm run start

# Build and run backend
cd ./backend
pnpm run build
pnpm run start
```

If the terminal returns errors regarding build script, run `pnpm accept-builds`

Open [http://localhost:3000](http://localhost:3000) to view the app.
The backend runs on [http://localhost:5000](http://localhost:5000).

---

## Demo Accounts

> **Note:** These accounts are available after running `npm run seed` in the `/backend` directory.

| Role      | Email                        | Password      | Status      |
|-----------|------------------------------|---------------|-------------|
| Admin     | admin@tictactoang.com        | Admin@123     | Active      |
| Player A  | alice@tictactoang.com        | Alice@123     | Premium     |
| Player B  | bob@tictactoang.com          | Bob@1234      | Free        |
| Inactive  | charlie@tictactoang.com      | Charlie@123   | Deactivated |

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

---

## Team Contributions

| Member | Student ID | Role | Assigned Tasks | Contribution Score |
|--------|------------|------|----------------|--------------------|
| Hung Cao Van Viet | s4117172 | Project Manager | Frontend templates, frontend folder structure, implemented bots, created various diagrams, set up cloud hosting, managed goals and deadlines for the team, many QOL updates | 5 / 5 |
| Johnny Tran | s4071162 | Member | Data model, backend folder structure, profile manager, playfield, play logic, testing, database seeding, majority of backend development, responsive pages | 5 / 5 |
| Hoc Tran Nguyen Bao | s4038330 | Member | Login and signup, token validation, wireframes, admin dashboard, subscription services, part of frontend folder structure, basic CRUD operations | 5 / 5 |
