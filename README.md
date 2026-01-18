# Event Flow

A modern full-stack event management web app. The frontend is a React + Vite application styled with Tailwind CSS and shadcn/ui components. The backend folder is reserved for API services.

## Features

- Responsive UI with Tailwind CSS
- Reusable UI components (accordion, dialog, dropdown, table, toast, etc.)
- Dashboard pages for analytics, users, tickets, and events
- Authentication pages (Login/Register)
- Event listing, details, and management flows

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- shadcn/ui components (Radix UI based)
- JavaScript with jsconfig setup

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm or npm
- Git

### Install dependencies

- Frontend
  - cd frontend
  - pnpm install

### Run the frontend (dev)
- cd frontend
- pnpm dev
- App will be available at http://localhost:5173

### Build
- cd frontend
- pnpm build
- Output in `frontend/dist`

### Preview production build
- cd frontend
- pnpm preview

## Project Structure

```
frontend/
  public/
  src/
    components/
      ui/ ... shadcn components
    pages/
      dashboard/ ... admin/user dashboards
    hooks/
    lib/
  package.json
backend/
README.md
```

## Scripts (frontend)

Common scripts in `frontend/package.json`:
- dev: Start Vite dev server
- build: Production build
- preview: Preview built app
- lint: Run ESLint

## Development Tips

- Components live in `src/components` and `src/components/ui`.
- Pages live in `src/pages`.
- Tailwind styles in `src/index.css` and `src/App.css`.
- Update `tailwind.config.ts` when adding design tokens or new paths.
- Use `hooks/use-toast.js` and `components/ui/toaster.jsx` for notifications.

## Contributing

1. Create a new branch:
   - git checkout -b feat/your-feature
2. Commit each file separately (recommended):
   - for f in $(git status --porcelain | awk '{print $2}'); do git add "$f"; git commit -m "Update $f"; done
3. Push and open a PR.

## License

This project is licensed under the MIT License.
