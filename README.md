# VYOM OS

A futuristic browser-based WebOS inspired by mission control systems and AI assistants like JARVIS. Built with React, Tailwind CSS, and Framer Motion.

![VYOM OS](https://img.shields.io/badge/VYOM-OS-00e5ff?style=for-the-badge)

## Features

### Desktop Environment
- Draggable, resizable windows with glassmorphism styling
- Taskbar with running apps, system clock, and quick launcher
- Desktop icons with smooth animations
- Window snapping (left/right split-screen)
- Notification system for app events

### Built-in Apps
- **📝 Notes** — Text editor with localStorage auto-save
- **⬛ Terminal** — Command simulator (`help`, `neofetch`, `status`, `clear`, `matrix`)
- **📊 Mission Dashboard** — Real-time CPU, memory, and network charts (simulated)
- **⚙️ Settings** — Toggle dark mode, animations, and view system info
- **🤖 VYOM AI** — Chat assistant that responds to queries and triggers system commands

### Voice Control
- Microphone button using the Web Speech API
- Say commands like "Open notes", "Open terminal", or ask VYOM questions
- Visual feedback with pulse animation while listening

### Login Screen
- Terminal-style boot sequence with VYOM branding
- Password: `vyom` (or leave empty)

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** with custom design tokens (neon cyan/purple palette)
- **Framer Motion** for animations
- **Recharts** for dashboard visualizations
- **Web Speech API** for voice control

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Design

Dark theme with neon blue/cyan highlights, inspired by space tech and NASA/ISRO dashboards. Uses glassmorphism, scan-line effects, and glow animations for a futuristic feel.

## License

MIT
