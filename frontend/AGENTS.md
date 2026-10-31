# SUBIDHA — Project Instructions

## Project Overview

SUBIDHA is a responsive essential-services and logistics platform with customer and business interfaces.

The frontend uses:
- React
- TypeScript
- Vite
- React Native Web for compatible cross-platform components
- React Router for client-side navigation
- React Hook Form and Zod for form handling and validation
- Lucide React Native for icons

## Development Commands

Run these commands from the frontend project root:

```bash
npm run dev
npm run build
npm run typecheck
npm run preview
```

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build in `dist/`.
- `npm run typecheck` checks TypeScript types.
- `npm run preview` serves the production build locally.

## Project Structure

- `index.html` — web application HTML entry point
- `src/main.tsx` — React application entry point
- `src/WebApp.tsx` — top-level application component
- `src/global.css` — global styles
- `src/routes/` — React Router configuration and route constants
- `src/app/` — public pages, authentication pages, customer pages, and business pages
- `src/components/` — shared UI and layout components
- `src/context/` — application state and theme contexts
- `src/services/` — authentication, API configuration, and service logic
- `vite.config.ts` — Vite configuration

Preserve the existing structure unless a change is necessary.

## Coding Guidelines

1. Use TypeScript and React function components.
2. Use React Router for navigation.
3. Prefer existing route constants from `src/routes/` over hardcoded paths.
4. Reuse existing components, contexts, hooks, and services.
5. Keep components responsive and compatible with React Native Web where applicable.
6. Maintain the existing light and dark themes.
7. Use neutral backgrounds, muted sage-green accents, rounded cards, and restrained shadows.
8. Keep forms accessible and provide useful validation and error messages.
9. Avoid unnecessary dependencies and large rewrites.
10. Preserve existing application features unless a change is explicitly requested.

## API and Authentication

- API configuration is maintained in `src/services/api.config.ts`.
- Use Vite environment variables through `import.meta.env`.
- Keep mock services clearly separated from real API integrations.
- Never commit real API keys, passwords, tokens, or other secrets.

## Build and Deployment

- Vite production output is generated in `dist/`.
- The GitHub Actions workflow builds the frontend and deploys `dist/` to GitHub Pages.
- The Vite base path must match the deployment URL.
- Do not commit generated build output or `node_modules/`.
- Keep `package.json` and `package-lock.json` consistent.

## Maintenance Rules

- Keep the frontend configuration compatible with Vite and React Router.
- Do not recreate deleted scaffold scripts unless a replacement is explicitly required.
- Check existing imports and references before deleting files.
- Complete planned source edits before running builds or tests when requested.
- Avoid modifying unrelated files during migration work.