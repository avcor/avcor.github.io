/** CSS-style cubic-bezier easing: maps linear time 0–1 to eased progress
 *  0–1, solving for t by bisection. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const bezierPoint = (t: number, p1: number, p2: number) =>
    3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t

  return (t: number) => {
    let lo = 0
    let hi = 1
    let mid = t
    for (let i = 0; i < 8; i++) {
      mid = (lo + hi) / 2
      const x = bezierPoint(mid, x1, x2)
      if (x < t) lo = mid
      else hi = mid
    }
    return bezierPoint(mid, y1, y2)
  }
}
