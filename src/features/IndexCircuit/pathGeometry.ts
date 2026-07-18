export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Traces every vertex of an SVG path built only from M/L/H/V commands (as
 *  all circuit wires are), without needing curve math or a mounted DOM node. */
export function tracePathVertices(d: string): Point[] {
  const tokens = d.match(/[MLHV]|-?\d*\.?\d+/g) ?? []
  const vertices: Point[] = []
  let cx = 0
  let cy = 0

  for (let i = 0; i < tokens.length; ) {
    const command = tokens[i]
    if (command === 'M' || command === 'L') {
      cx = Number(tokens[i + 1])
      cy = Number(tokens[i + 2])
      vertices.push({ x: cx, y: cy })
      i += 3
    } else if (command === 'H') {
      cx = Number(tokens[i + 1])
      vertices.push({ x: cx, y: cy })
      i += 2
    } else if (command === 'V') {
      cy = Number(tokens[i + 1])
      vertices.push({ x: cx, y: cy })
      i += 2
    } else {
      i += 1
    }
  }

  return vertices
}
