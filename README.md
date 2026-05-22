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

- **Frontend:** Next.js 15, React, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + token blacklist

## Getting Started

### Prerequisites

- Node.js 18+
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

Create a `.env` file in `/backend` based on the required variables in `backend/src/config/env.ts`.

### Running the App

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from root)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure