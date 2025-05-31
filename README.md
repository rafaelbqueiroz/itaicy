# Itaicy Eco Lodge

## Setup Local Development

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Building for Production

1. Build the application:
```bash
pnpm build
```

2. Start production server:
```bash
pnpm start
```

## Environment Variables

Create a `.env` file in the root directory with:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript
- Database: PostgreSQL (via Drizzle ORM)
- UI Components: Radix UI + Tailwind CSS
- State Management: React Query
- Routing: Wouter

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` - Type check with TypeScript
- `pnpm db:push` - Push database schema changes
