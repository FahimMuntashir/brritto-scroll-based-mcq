# Brritto Scroll-Based MCQ

A scroll-based Multiple Choice Question (MCQ) learning app built with React, TypeScript, and Vite. Designed for an intuitive, mobile-first study experience.

## Features

- **Scroll-based question feed** — browse questions by scrolling through a continuous feed
- **Filters** — toggle visibility of options, answers, explanations, and analytics per question
- **Search** — search questions by subject keyword
- **Favourites** — bookmark questions for later review
- **Mistake log** — automatically tracks incorrectly answered questions
- **Session stats** — view your performance summary at the end of a session
- **Doubt modal** — flag questions you're unsure about
- **Text-to-speech** — listen to questions read aloud
- **Pagination** — navigate through questions in pages of 10
- **Dark/light mode** — adapts to system theme

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Zustand](https://zustand-demo.pmnd.rs/) (via `useMCQStore`) — state management

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ or [Bun](https://bun.sh/)

### Install dependencies

```bash
npm install
# or
bun install
```

### Run development server

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── mcq/          # MCQ-specific components (QuestionCard, FilterDrawer, etc.)
│   └── ui/           # shadcn/ui base components
├── data/
│   └── questions.ts  # Question data
├── hooks/
│   └── useMCQStore.ts # Global state store
├── pages/
│   └── Index.tsx     # Main question feed page
└── types/
    └── mcq.ts        # TypeScript types
```

## License

MIT
