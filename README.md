# FamQuest

Transform the mundane chaos of household management into a shared, cooperative epic adventure.

## Overview

FamQuest is a web application that transforms household chores, personal goals, and family organization into a cooperative Dark Fantasy RPG. Built on a "Calm Tech" philosophy, it uses an AI "Guild Master" to guide families through their monthly quest cycles.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: n8n (via webhooks and cookies)
- **Backend Logic**: n8n (via API integration)
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- n8n instance (for backend logic)

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
Create a `.env` file in the root directory with:
```env
# n8n Integration
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/orchestrator"
N8N_AUTH_REGISTER_LOGIN_URL="https://your-n8n-instance.com/webhook/auth-login"
N8N_AUTH_LOGOUT_URL="http://localhost:5678/webhook/auth-logout"
N8N_AUTH_ME_WEBHOOK_URL="https://your-n8n-instance.com/webhook/auth-me"
```

**Hinweis:** 
- Alle Datenbankoperationen und Authentifizierung laufen über n8n
- Das Frontend kommuniziert nur über API-Routen mit n8n
- Keine direkte Datenbankverbindung im Frontend erforderlich
- Authentifizierung erfolgt über Cookies (Token wird serverseitig gesetzt)

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
famquest-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── dashboard/         # Main interface (protected)
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base components
│   ├── features/         # Feature-specific components
│   └── providers/        # Context providers
├── lib/                  # Utilities & configuration
├── types/                # TypeScript definitions
└── public/              # Static assets
```

## Features

### Dashboard Tabs

1. **Guild Master (Chat)**: Interactive chat interface with the AI Guild Master
   - Real-time streaming responses
   - Integration with n8n webhook
   - Quest completion and creation

2. **Quest Board**: View and manage quests
   - Daily Rituals (marked with ✨)
   - Active Quests
   - Completed Quests
   - Pending Verification

3. **Boss Battle**: Monthly cooperative challenge
   - Boss illustration and theme
   - HP tracking
   - Requirements and progress
   - Stage and quest completion tracking

## Design System

### Colors

- **Primary**: Midnight Blue (#0B1220), Deep Teal (#102A36), Arcane Violet (#6E6AF6)
- **Accents**: Ancient Gold (#E0A96D), Warm Copper (#C9824A), Soft Cyan (#7DD3FC)
- **Functional**: Success Glow (#5EEAD4), Warning Ember (#F590EB), Danger Rune (#EF4444)

### Typography

- **Headers**: Cinzel (Epic Serif)
- **Body**: Inter (Clean Sans-serif)

## API Routes

- `/api/auth/login` - User login (forwards to n8n)
- `/api/auth/register` - User registration (forwards to n8n)
- `/api/auth/logout` - User logout (forwards to n8n, deletes cookie)
- `/api/auth/me` - Get current user data (validates token from cookie)
- `/api/orchestrator` - Bridge to n8n webhook
- `/api/user` - Get current user data
- `/api/quests` - Get user's quests
- `/api/boss` - Get boss battle data

## n8n Integration

The `/api/orchestrator` endpoint forwards user messages to your n8n webhook. The payload includes:
- User message
- User ID, email, name
- Current stage and XP
- Family ID
- Image data (for photo verification)

The n8n workflow should return:
- Guild Master response message
- Updated quests (if applicable)
- Quest update flag

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

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]

