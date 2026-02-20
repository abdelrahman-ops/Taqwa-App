# تقوى Client (PWA)

Frontend for the **تقوى** app, built with React, TypeScript, Vite, and Tailwind CSS.

## Overview

The client is a mobile-first Progressive Web App (PWA) for tracking daily worship habits:
- Fasting
- Prayers
- Quran reading
- Azkar
- Extra good deeds

It supports Arabic/English localization and installable app behavior on supported browsers.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- vite-plugin-pwa

## Requirements

- Node.js 18+
- npm 9+

## Install

From the `client` directory:

```bash
npm install
```

## Run (Development)

```bash
npm run dev
```

Default dev URL:
- `http://localhost:3000`

The Vite dev server proxies API calls from `/api` to:
- `http://localhost:5000`

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## PWA Notes

- Uses `vite-plugin-pwa` with `autoUpdate` service worker registration.
- Includes standard and maskable icons.
- Manifest is configured in `vite.config.ts`.
- Supports standalone display on mobile when installed.

## Data Behavior

- Stores session/auth token in localStorage.
- Uses local-first behavior with backend sync when authenticated.

## Key Folders

```text
src/
  components/
  context/
  data/
  i18n/
  pages/
  services/
  types/
public/
  icons/
```
