/** Bowed connector between two projected points. */
export function arc(a: { x: number; y: number }, b: { x: number; y: number }, lift = 0.22) {
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  return `M${a.x.toFixed(2)},${a.y.toFixed(2)} Q${((a.x + b.x) / 2).toFixed(2)},${(
    (a.y + b.y) / 2 -
    d * lift
  ).toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)}`
}

export const smoothstep = (t: number) => t * t * (3 - 2 * t)

export function dotPath(cells: [number, number, number][], r: number) {
  const rr = r.toFixed(3)
  const dia = (r * 2).toFixed(3)
  let d = ''
  for (const [c, row] of cells) {
    d += `M${(c + 0.5 - r).toFixed(2)},${row + 0.5}a${rr},${rr} 0 1,0 ${dia},0a${rr},${rr} 0 1,0 -${dia},0`
  }
  return d
}
