# FamQuest

Transform the mundane chaos of household management into a shared, cooperative epic adventure.

## Overview

FamQuest is a web application that transforms household chores, personal goals, and family organization into a cooperative Dark Fantasy RPG. Built on a "Calm Tech" philosophy, it uses an AI "Guild Master" to guide families through their monthly quest cycles.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: n8n (via webhooks and cookies)
- **Backend Logic**: n8n (all database operations and business logic)
- **Animations**: CSS animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- n8n instance (for backend logic and database operations)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd famquest-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following n8n webhook URLs:

```env
# n8n Webhook URLs
N8N_WEBHOOK_URL=http://localhost:5678/webhook/orchestrator
N8N_GUILDMASTER_URL=http://localhost:5678/webhook/guildmaster
N8N_GUILDMASTER_INTRO_URL=http://localhost:5678/webhook/guildmaster-intro
N8N_AUTH_LOGIN_URL=http://localhost:5678/webhook/auth-login
N8N_AUTH_REGISTER_URL=http://localhost:5678/webhook/auth-register
N8N_AUTH_LOGOUT_URL=http://localhost:5678/webhook/auth-logout
N8N_AUTH_ME_WEBHOOK_URL=http://localhost:5678/webhook/auth-me
N8N_QUEST_ACCEPT_URL=http://localhost:5678/webhook/quest-accept
N8N_MICROSTEP_TOGGLE_URL=http://localhost:5678/webhook/microstep-toggle
```

**Important Notes:**
- All database operations and authentication are handled by n8n
- The frontend communicates with n8n exclusively through API routes
- No direct database connection is required in the frontend
- Authentication is handled via cookies (token is set server-side)
- Update the URLs above to match your n8n instance configuration

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
famquest-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group (login, register)
│   ├── dashboard/         # Main interface (protected)
│   ├── api/               # API routes (proxies to n8n)
│   │   ├── auth/         # Authentication endpoints
│   │   ├── quests/        # Quest management endpoints
│   │   ├── microsteps/    # Microstep toggle endpoint
│   │   └── orchestrator/  # Main chat orchestrator
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (Button, Card, Tabs, etc.)
│   └── features/         # Feature-specific components
│       ├── avatar/       # Avatar display with XP animation
│       ├── chat/         # Chat interface and bubbles
│       ├── quests/       # Quest board and quest cards
│       └── boss/         # Boss battle component
├── lib/                  # Utilities & configuration
│   ├── api.ts           # API fetch utilities
│   ├── n8n.ts           # n8n webhook client
│   └── utils.ts          # Helper functions
├── types/                # TypeScript definitions
└── public/              # Static assets
```

## Features

### Dashboard Tabs

1. **Guild Master (Chat)**: Interactive chat interface with the AI Guild Master
   - Real-time responses from n8n webhook
   - Quest creation and management 
   - Intro message on first visit

2. **Quest Board**: View and manage quests
   - Available Quests (with filter and sort)
   - Active Quests (with filter and sort)
   - Completed Quests (collapsible accordion)
   - Quest cards with microsteps
   - Accept quest functionality
   - Microstep toggle functionality
   - XP gain animations

3. **Boss Battle**: Monthly cooperative challenge (Coming Soon)
   - Currently disabled
   - Will display boss illustration and theme
   - HP tracking and requirements

## Design System

### Colors

- **Primary**: Midnight Blue (#0B1220), Deep Teal (#102A36), Arcane Violet (#6E6AF6)
- **Accents**: Ancient Gold (#E0A96D), Warm Copper (#C9824A), Soft Cyan (#7DD3FC)
- **Functional**: Success Glow (#5EEAD4), Warning Ember (#F590EB), Danger Rune (#EF4444)

### Typography

- **Headers**: Cinzel (Epic Serif)
- **Body**: Inter (Clean Sans-serif)

## API Routes

All API routes act as proxies to n8n webhooks. The frontend never directly accesses the database.

### Authentication
- `POST /api/auth/login` - User login (forwards to n8n, sets cookie)
- `POST /api/auth/register` - User registration (forwards to n8n)
- `POST /api/auth/logout` - User logout (forwards to n8n, deletes cookie)
- `GET /api/auth/me` - Get current user data (validates token from cookie)

### Quests
- `GET /api/quests?userId=<id>` - Get user's quests (available, active, completed)
- `POST /api/quests/accept` - Accept an available quest

### Microsteps
- `POST /api/microsteps/toggle` - Toggle microstep completion status

### Chat & Orchestration
- `POST /api/orchestrator` - Main chat endpoint (forwards to n8n Guildmaster webhook)
- `POST /api/guildmaster/intro` - Get intro message from Guildmaster

### User Data
- `GET /api/user` - Get current user data

## n8n Integration

The frontend communicates with n8n exclusively through webhooks. All API routes forward requests to n8n and return the responses.

### Request Flow

1. Frontend makes request to Next.js API route
2. API route extracts authentication token from cookie
3. API route forwards request to n8n webhook with token
4. n8n processes request (database operations, business logic)
5. n8n returns response
6. API route forwards response to frontend

### Authentication

- Authentication token is stored in a cookie (`famquest_token`)
- Token is automatically sent with all requests (via `credentials: 'include'`)
- Token is validated by n8n on each request
- Middleware protects routes that require authentication

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Environment Variables

All n8n webhook URLs should be configured in `.env.local`:

- `N8N_GUILDMASTER_URL` - Main Guildmaster chat webhook
- `N8N_GUILDMASTER_INTRO_URL` - Intro message webhook
- `N8N_AUTH_LOGIN_URL` - Login webhook
- `N8N_AUTH_REGISTER_URL` - Registration webhook
- `N8N_AUTH_LOGOUT_URL` - Logout webhook
- `N8N_AUTH_ME_WEBHOOK_URL` - Get current user webhook
- `N8N_QUEST_ACCEPT_URL` - Accept quest webhook
- `N8N_MICROSTEP_TOGGLE_URL` - Toggle microstep webhook

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
