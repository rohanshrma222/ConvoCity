# ConvoCity

![ConvoCity Preview](./apps/web/public/assets/preview.png)

ConvoCity is a modern, remote-first spatial collaboration platform designed to redefine presence. Through high-fidelity virtual studio environments, teams can connect organically, hold spontaneous conversations, and collaborate beyond standard grid meetings. Built with a stunning neumorphic design system and real-time multiplayer capabilities, ConvoCity turns the world into your studio.

## Project Architecture

This repository is built as a complete monorepo using **Turborepo** to structure apps and packages efficiently.

### Technologies Used
- **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Engine & Spatial Environment:** [Phaser](https://phaser.io/) (2D WebGL/Canvas game engine for virtual rooms)
- **Real-Time Media:** [LiveKit](https://livekit.io/) (Ultra-low latency audio and video WebRTC infrastructure)
- **Styling:** CSS & TailwindCSS (Neumorphic aesthetic, custom glassmorphism components)
- **Monorepo Management:** [Turborepo](https://turborepo.org)
- **Package Manager:** `pnpm`

### Directory Structure

- `apps/web`: The core Next.js application, including the marketing dashboard, authentication system, and spatial rooms (`/v1/space`).
- `packages/`: (If expanded) Reusable internal packages like UI components (`@repo/ui`), configurations, and shared typing.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- `pnpm` (v9+)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rohanshrma222/ConvoCity.git
   cd ConvoCity
   ```

2. **Install dependencies:**
   Using pnpm to install all workspace dependencies.
   ```bash
   pnpm install
   ```

### Running the Project

To start the development server for all apps in the Turborepo simultaneously:

```bash
pnpm run dev
```

Since this uses Turborepo, the `dev` script automatically runs development environments for all linked apps (e.g., the Next.js `web` app).

The local application will typically be accessible at:
- Web App: `http://localhost:3000`

### Workspace Scripts

- `pnpm run build`: Build all applications and packages.
- `pnpm run lint`: Run ESLint across all code logic.
- `pnpm run check-types`: Check TypeScript typings internally.
- `pnpm run format`: Automatically format matching code with Prettier.

## Features

- **Spatial Proximity Chat:** Walk closer to avatars to hear them, replicating physical office acoustics using LiveKit SDK.
- **Premium User Context:** A highly refined authentic "light spatial" aesthetic with custom shaders and shadow styling.
- **Instant Connect:** Easily generate and share entry codes (`inviteCode`) for your team to join your room without heavy downloads. 

## Credits & Licensing

Created by Rohanshrma222.
© 2026 ConvoCity Inc. All rights reserved.
