# Flower App v2 🌸

A romantic, animated flower web application built with React, TypeScript, and GSAP. Watch a flower bloom as you scroll, accompanied by falling petals, a heartfelt message, and a bilingual (English / Chinese) experience.

## Features

- **Animated Flower Growth** — An SVG flower grows stage-by-stage (stem → leaves → petals → center) driven by GSAP animations as the user scrolls.
- **Fluid Particle Background** — A canvas-based fluid blob background that reacts to mouse movement.
- **Falling Petals** — Heart-shaped petals drift down the screen once the flower is planted.
- **Message Card** — A 3-D unfolding card with a typewriter effect reveals a personal message.
- **Bilingual Support** — Toggle between English (EN) and Chinese (中文); the chosen language is persisted in `localStorage`.
- **Celebration Confetti** — Accepting the bouquet triggers a confetti explosion of coloured petals.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Animations | GSAP 3 (ScrollTrigger) |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Icons | Lucide React |

## Project Structure

```
src/
├── App.tsx              # Root component — sections, language toggle, animations
├── index.css            # Global styles, custom fonts, animation keyframes
├── main.tsx             # Entry point
└── components/
    ├── Flower.tsx        # SVG flower with GSAP growth & scroll milestones
    ├── FluidBackground.tsx  # Canvas particle fluid background
    ├── FallingPetals.tsx    # Canvas falling heart-petal effect
    ├── MessageCard.tsx      # 3-D card with typewriter message
    └── ui/               # shadcn/ui component library
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Customisation

- **Message text** — Edit the `copy` object in `src/App.tsx` to change any displayed text in either language.
- **Flower colours** — Adjust the SVG gradient definitions inside `src/components/Flower.tsx`.
- **Background colours** — Modify the `colors` array in `src/components/FluidBackground.tsx`.
