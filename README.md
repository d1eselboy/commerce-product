# Drive Ads Commerce Manager 0.2

Internal web interface for managing Drive Ads advertising campaigns in the Yandex Drive ecosystem.

## Features

- **Campaign Management**: Create, edit, and manage advertising campaigns with auction-based weighted rotation
- **Creative Library**: Upload and manage creatives with support for multiple formats and surfaces
- **Real-time Analytics**: Dashboard with live metrics and performance tracking
- **Role-based Access**: Support for Commercial Managers, Analysts, and Admins
- **Multilingual Support**: Russian and English localization
- **OAuth2 Authentication**: Corporate SSO integration with PKCE flow

## Tech Stack

- **Frontend**: React 18 + TypeScript 5
- **UI Framework**: Material-UI v5 (Yandex Drive Design System)
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Charts**: Recharts
- **Internationalization**: i18next
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── store/              # Redux store and API
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization
└── utils/              # Utility functions
```

### Key Components

- **Dashboard**: Overview with metrics and charts
- **Campaign List**: Data grid with filtering and actions
- **Campaign Editor**: Step-by-step form for campaign creation/editing
- **Creative Library**: File upload and management
- **Live Logs**: Real-time event streaming

## API Integration

The frontend integrates with the backend auction system through REST APIs:

- `/api/v1/campaigns` - Campaign CRUD operations
- `/api/v1/creatives` - Creative file management
- `/api/v1/stats` - Analytics and reporting
- `/logs/ws` - WebSocket for live logs

## Authentication

Uses OAuth2 PKCE flow for secure authentication with corporate SSO. The auth flow redirects to `/auth/callback` for token exchange.

## Performance Requirements

- Lighthouse score ≥ 90 (desktop)
- Time to Interactive (TTI) ≤ 2s on 3G
- Support for 100+ active campaigns without degradation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Internal use only - Yandex Drive Ads team.