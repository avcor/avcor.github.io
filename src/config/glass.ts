/**
 * The one place the liquid glass look is tuned. Every glass surface on the
 * site (nav bar, buttons, panels) reads these values through `GlassSurface`,
 * so changing a number here changes every glass surface at once.
 *
 * Colors and radii are not here: those stay in `theme.css` and in each
 * component's own CSS, per the project's theme rules. Cursor reaction is not
 * here either: every surface is pinned static, see `GlassSurface`.
 */
export const GLASS = {
  /** Strength of the edge refraction. 0 is flat glass, 100+ is a fish-eye. */
  displacementScale: 20,
  /** Frosting. The library maps this to blur(4px + value * 32px). */
  blurAmount: 0.01,
  /** Saturation of the refracted backdrop, in percent. */
  saturation: 50,
  /** Color fringing at the refracted edge. */
  aberrationIntensity: 0,
  /** Refraction model: 'standard' | 'polar' | 'prominent' | 'shader'. */
  mode: 'standard',
} as const
