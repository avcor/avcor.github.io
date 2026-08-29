# CLAUDE.md — React Website Project Guidelines

## Project Overview

This is a React website with a **locked dark theme**. There is no light/dark toggle. The theme system is designed so that the **color palette can be swapped easily** for testing different palettes without touching component code.

The UI must work correctly at all screen sizes — mobile, tablet, and desktop — using a **mobile-first** approach.

---

## Folder Structure

```
src/
├── assets/               # Static assets (images, icons, fonts)
├── components/           # Reusable, shared UI primitives only
│   └── ComponentName/
│       ├── index.tsx
│       └── ComponentName.module.css
├── features/             # Feature-scoped components (compose screen sections)
│   └── FeatureName/
│       ├── index.tsx
│       ├── FeatureSection.tsx
│       └── FeatureName.module.css
├── layouts/              # Page layout wrappers (e.g., MainLayout)
│   └── LayoutName/
│       ├── index.tsx
│       └── LayoutName.module.css
├── pages/                # Route-level page components — composition only, no logic
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
│   ├── breakpoints.css   # Breakpoint custom properties and media query tokens
│   ├── global.css        # Global resets and base styles
│   └── typography.css    # Font sizes, weights, line heights
└── App.tsx
```

---

## Theme System

### Core Rule
**All colors must use CSS custom properties defined in `src/styles/theme.css`.** Never hardcode any color values (hex or otherwise) in component files or module CSS files. Only hex codes are permitted in `theme.css` itself — no `rgb()`, `hsl()`, or `rgba()`.

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
  --shadow-sm:  0 1px 3px #00000066;
  --shadow-md:  0 4px 12px #00000080;
  --shadow-lg:  0 8px 24px #00000099;
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

### Swapping the Color Palette

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

## Responsive Design

### Mobile-First Approach
Write base styles targeting **mobile (360px)** first. Use `min-width` media queries to progressively enhance for larger screens. Never write desktop-only styles and then override for mobile.

### Breakpoints

Define breakpoints once in `src/styles/breakpoints.css` and reference them everywhere:

```css
/* src/styles/breakpoints.css */
:root {
  --bp-sm:  640px;   /* Large phones, landscape */
  --bp-md:  768px;   /* Tablets */
  --bp-lg:  1024px;  /* Small desktops / laptops */
  --bp-xl:  1280px;  /* Standard desktop */
  --bp-2xl: 1536px;  /* Large screens */
}
```

```css
/* Usage in module CSS */
.grid {
  display: grid;
  grid-template-columns: 1fr;          /* mobile: single column */
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Layout Rules
- Use **CSS Grid** for page-level and section-level layouts.
- Use **Flexbox** for component-level alignment (rows, nav bars, button groups).
- Use `rem` for typography and spacing. Use `%` or `fr` for fluid widths. Avoid fixed `px` widths on layout containers.
- Never rely on `overflow: hidden` or `position: fixed` to mask layout issues — fix the root cause.
- Touch targets (buttons, links, inputs) must be at least **44×44px** on mobile.

### Mandatory Breakpoint Check
Every new screen or feature component must be visually verified at:
| Label | Width |
|---|---|
| Mobile S | 360px |
| Mobile L | 425px |
| Tablet | 768px |
| Desktop | 1280px |

---

## Component Architecture

### Single Responsibility — Decompose Screens
A page component is a **composition root only** — it assembles layout and feature sections. It contains no logic, no data fetching, and no direct JSX beyond layout structure.

```tsx
// pages/Home/index.tsx — composition only
export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesGrid />
      <TestimonialsCarousel />
      <ContactForm />
    </MainLayout>
  );
}
```

Each section is its own component. Each interactive element within a section is its own component.

### Component Size Limit
- **Hard limit: 150 lines per component file.** If exceeded, extract sub-components.
- If a component has more than **5 responsibilities** visible in its JSX, it needs to be split.

### Presentational vs. Container Components
| Type | Responsibility | Location |
|---|---|---|
| Presentational | Renders UI from props only | `src/components/` or co-located in feature |
| Container | Fetches data, holds state, calls hooks | `src/features/` or `src/pages/` |

Never mix data-fetching and rendering in the same component.

```tsx
// Bad — mixing concerns
function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch(`/users/${userId}`).then(...) }, [userId]);
  return <div className={styles.card}>{user?.name}</div>;
}

// Good — separated
function UserCard({ name, avatarUrl }: UserCardProps) {
  return <div className={styles.card}><img src={avatarUrl} />{name}</div>;
}

// Container hook handles data
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { fetchUser(userId).then(setUser) }, [userId]);
  return user;
}
```

---

## SOLID Principles

### S — Single Responsibility
Every component, hook, and utility does **one thing**.
- A `Button` component renders a button — it does not handle routing or analytics.
- A `useFormValidation` hook validates — it does not submit.
- A `userService.ts` handles user API calls — it does not format dates.

### O — Open/Closed
Components must be **extensible via props and composition**, not by modifying internals.

```tsx
// Open for extension via variant prop and children — closed for modification
interface CardProps {
  variant?: 'default' | 'featured' | 'compact';
  children: React.ReactNode;
  className?: string;
}
```

Use the `children` prop, render props, and compound components to allow consumers to extend behavior without editing the base component.

### L — Liskov Substitution
Component variants must be **drop-in replacements** for the base.

```tsx
// PrimaryButton, GhostButton, DangerButton — all accept the same ButtonProps
// Any code expecting a Button can use any variant without changes
```

Never add required props to a variant that the base doesn't have. Variants extend — they do not break the contract.

### I — Interface Segregation
Keep prop interfaces **narrow and focused**. Do not pass large objects into components when only one or two fields are needed.

```tsx
// Bad — component depends on the entire User object
function Avatar({ user }: { user: User }) {
  return <img src={user.avatarUrl} alt={user.displayName} />;
}

// Good — component depends only on what it needs
function Avatar({ avatarUrl, displayName }: { avatarUrl: string; displayName: string }) {
  return <img src={avatarUrl} alt={displayName} />;
}
```

### D — Dependency Inversion
Components depend on **abstractions (callbacks, context, interfaces)**, not on concrete implementations.

```tsx
// Bad — component imports and calls a specific API function directly
import { fetchUser } from '@/services/userService';

// Good — component receives data via props or context; the hook/container owns the dependency
function ProfilePage() {
  const user = useCurrentUser(); // hook abstracts the data source
  return <UserProfile user={user} />;
}
```

---

## DRY Principles

- Any logic or JSX that appears **more than once** must be extracted into a shared hook, utility, or component.
- Shared UI patterns (empty states, loading skeletons, error banners) live in `src/components/` and are reused — never duplicated per-page.
- API call logic belongs in `src/services/` or custom hooks in `src/hooks/` — never written inline in a component more than once.
- Repeated CSS patterns (card base, flex centering, truncated text) are extracted to utility classes in `global.css` or shared mixins.
- If you find yourself copy-pasting code, stop and refactor first.

---

## Coding Guidelines

### Language & Tooling
- TypeScript with strict mode enabled — no `any` type
- React functional components only — no class components
- CSS Modules for component-scoped styles (`.module.css`)
- No inline styles except for truly dynamic values (e.g., a runtime-calculated `translateX`)

### Component Rules
- One component per file
- Component folder = component name in PascalCase
- Export the component as default from `index.tsx`
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
- Hooks must not contain JSX — keep logic and UI strictly separate
- Shared logic used in more than one component must live in a hook

### File Naming
| Item | Convention |
|---|---|
| Components / Pages / Layouts / Features | `PascalCase` folder + `index.tsx` |
| Hooks | `camelCase` — `useMyHook.ts` |
| Utils / Services | `camelCase` — `formatDate.ts` |
| Types | `camelCase` — `user.types.ts` |
| CSS Modules | `ComponentName.module.css` |
| Global styles | `lowercase.css` |

### Imports Order
1. React and React-related packages
2. Third-party libraries
3. Internal absolute imports (`@/components/...`)
4. Relative imports (`./`, `../`)
5. CSS module import (always last)

### State Management
- Local state: `useState` / `useReducer`
- Shared state: React Context in `src/context/`
- No external state library unless complexity clearly demands it

---

## Hard Rules (Non-Negotiable)

| Rule | Why |
|---|---|
| No hardcoded colors outside `theme.css` | Palette swaps must require zero component changes |
| No `any` in TypeScript | Type safety is not optional |
| No default exports from `utils/`, `hooks/`, `services/` | Named exports are tree-shakeable and easier to trace |
| No business logic in page components | Pages compose — hooks and services act |
| No copy-pasted JSX or logic | Duplication creates drift and bugs |
| No fixed pixel widths on layout containers | Layouts must flex to screen size |
| No magic numbers for colors, spacing, or breakpoints | All tokens live in `theme.css` / `breakpoints.css` |

---

## Writing Style

Never use the em dash (`—`) in any written content: case study copy, prose in `deepDiveData.ts`/`lifecycleMapData.ts` panels, comments, commit messages, or any user-facing text. Use a period, comma, colon, or parentheses instead.

---

## Claude Code Permissions

See [`PERMISSIONS.md`](./PERMISSIONS.md) for the list of read-only commands
pre-approved in `.claude/settings.json` so Claude doesn't re-prompt for them
every session.
