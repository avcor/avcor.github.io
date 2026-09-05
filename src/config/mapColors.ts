/** Named dot-color presets for DottedWorldMap, each pointing at a theme.css
 *  token so callers pick a name instead of writing var(--color-...) by hand. */
export const MAP_DOT_COLORS = {
  faint: 'var(--color-white-a12)',
  muted: 'var(--color-white-a25)',
  bright: 'var(--color-map-dot-bright)',
  primary: 'var(--color-primary)',
  brightGreen: 'var(--color-glow)',
  mapAccent: 'var(--color-map-accent)',
} as const

export type MapDotColorName = keyof typeof MAP_DOT_COLORS
