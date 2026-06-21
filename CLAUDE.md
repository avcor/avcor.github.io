# CLAUDE.md — React Website Project Guidelines

## Project Overview

This is a React website with a **locked dark theme**. There is no light/dark toggle. The theme system is designed so that the **color palette can be swapped easily** for testing different palettes without touching component code.

---

## Folder Structure

```
src/
├── assets/               # Static assets (images, icons, fonts)
├── components/           # Reusable UI components
│   └── ComponentName/
│       ├── index.tsx
│       └── ComponentName.module.css
├── layouts/              # Page layout wrappers (e.g., MainLayout)
│   └── LayoutName/
│       ├── index.tsx
│       └── LayoutName.module.css
├── pages/                # Route-level page components
│   └── PageName/
│       ├── index.tsx
│       └── PageName.module.css
├── hooks/                # Custom React hooks
├── context/              # React context providers
├── services/             # API calls, external service integrations
├── utils/                # Pure utility/helper functions
├── types/                # Shared TypeScript types and interfaces
├── styles/
│   ├── theme.css         # Color palette CSS variables (THE ONLY FILE TO EDIT FOR PALETTE SWAPS)
│   ├── global.css        # Global resets and base styles
│   └── typography.css    # Font sizes, weights, line heights
└── App.tsx
```

---

## Theme System

### Core Rule
**All colors must use CSS custom properties defined in `src/styles/theme.css`.** Never hardcode hex, rgb, or hsl color values in component files or module CSS files.

### theme.css Structure

`src/styles/theme.css` is the single source of truth for the active palette. To test a different palette, only this file changes.

```css
/* src/styles/theme.css */
:root {
  /* --- ACTIVE PALETTE: Android Green --- */

  /* Backgrounds */
  --color-bg-base:        #0d1117;   /* Page background */
  --color-bg-surface:     #161b22;   /* Cards, panels */
  --color-bg-elevated:    #1c2128;   /* Modals, dropdowns */
  --color-bg-subtle:      #21262d;   /* Hover states, dividers */

  /* Brand / Primary */
  --color-primary:        #3ddc84;   /* Android green — main accent */
  --color-primary-dim:    #2ea86a;   /* Pressed / active state */
  --color-primary-faint:  #1a3d2e;   /* Subtle tint backgrounds */

  /* Text */
  --color-text-primary:   #e6edf3;   /* Main body text */
  --color-text-secondary: #8b949e;   /* Muted / helper text */
  --color-text-disabled:  #484f58;   /* Disabled state */
  --color-text-inverse:   #0d1117;   /* Text on primary-colored backgrounds */

  /* Borders */
  --color-border:         #30363d;   /* Default border */
  --color-border-muted:   #21262d;   /* Subtle border */

  /* Semantic */
  --color-success:        #3ddc84;
  --color-warning:        #e3b341;
  --color-error:          #f85149;
  --color-info:           #58a6ff;

  /* Shadows */
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md:  0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg:  0 8px 24px rgba(0, 0, 0, 0.6);
}
```

### Usage in Component CSS

```css
/* Good */
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.button {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

/* Bad — never do this */
.card {
  background: #161b22;
  color: #e6edf3;
}
```

---

## Coding Guidelines

### Language & Tooling
- TypeScript with strict mode enabled
- React functional components only — no class components
- CSS Modules for component-scoped styles (`.module.css`)
- No inline styles except for dynamic values that cannot be expressed in CSS

### Component Rules
- One component per file
- Component folder = component name in PascalCase
- Export the component as default from `index.tsx`
- Keep components focused — if a component exceeds ~150 lines, consider splitting
- Props interface defined in the same file, named `<ComponentName>Props`

```tsx
// src/components/Button/index.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
}

export default function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

### Hooks
- Custom hooks go in `src/hooks/`, named `use<HookName>.ts`
- Hooks must not contain JSX — keep logic and UI separate

### File Naming
| Item | Convention |
|---|---|
| Components / Pages / Layouts | `PascalCase` folder + `index.tsx` |
| Hooks | `camelCase` — `useMyHook.ts` |
| Utils / Services | `camelCase` — `formatDate.ts` |
| Types | `camelCase` — `user.types.ts` |
| CSS Modules | `ComponentName.module.css` |
| Global styles | `lowercase.css` |

### Imports Order (enforce consistently)
1. React and React-related packages
2. Third-party libraries
3. Internal absolute imports (`@/components/...`)
4. Relative imports (`./`, `../`)
5. CSS module import (always last)

### State Management
- Local state: `useState` / `useReducer`
- Shared state: React Context in `src/context/`
- No external state library unless complexity clearly demands it

### No-Nos
- No hardcoded colors anywhere outside `theme.css`
- No `any` type in TypeScript unless absolutely unavoidable (add a comment explaining why)
- No default exports from `utils/`, `hooks/`, `services/` — use named exports
- No business logic inside page components — delegate to hooks or services

---

## Swapping the Color Palette

To test a new palette:
1. Open `src/styles/theme.css`
2. Replace the variable values under `:root` with the new palette
3. Nothing else changes

Optionally, keep palette presets in a `src/styles/palettes/` folder and copy-paste the desired one into `theme.css`:

```
src/styles/palettes/
├── palette-android-green.css   <- current
├── palette-neon-blue.css
└── palette-deep-purple.css
```

---

## Current Active Palette

**Android Green (Dark)**
- Primary accent: `#3ddc84` (Android brand green)
- Base background: `#0d1117`
- All values defined in `src/styles/theme.css`
