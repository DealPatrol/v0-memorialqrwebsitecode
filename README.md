# memorialqrwebsitecode

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/coles-projects-9e3181f8/v0-memorialqrwebsitecode-90)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/y6f7ywF0kMl)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/coles-projects-9e3181f8/v0-memorialqrwebsitecode-90](https://vercel.com/coles-projects-9e3181f8/v0-memorialqrwebsitecode-90)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/y6f7ywF0kMl](https://v0.app/chat/projects/y6f7ywF0kMl)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Local setup

1. Copy `.env.example` to `.env.local`
2. Fill in the Supabase, Stripe, Square, and Resend keys you actually use
3. Install deps with `corepack pnpm install`
4. Start dev with `NODE_ENV=development corepack pnpm dev`

### Notes

- `pnpm build` now succeeds even if email credentials are missing, but checkout and data-backed flows still need their real environment variables at runtime.
- Keep Stripe and Square in test or sandbox mode while validating checkout locally.
