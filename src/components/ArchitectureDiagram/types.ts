import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface MapNode {
  id: string
  /** Which deep-dive concern this node selects; omitted = decorative only. */
  panelId?: string
  label: string
  sub?: string
  rect: { x: number; y: number; w: number; h: number }
}

export interface MapConnector {
  id: string
  /** Path from one node edge to the next. */
  d: string
  /** Optional hand-drawn label on the arrow. */
  label?: string
  labelX?: number
  labelY?: number
  /** End marker: an arrowhead for state transitions, a dot for the plain
   *  pipeline continuation. Defaults to 'arrow'. */
  endMarker?: 'arrow' | 'dot'
}

export interface MapTitle {
  panelId: string
  label: string
  x: number
  y: number
}

/** A step in a flow-style proof: either a single node or a yes/no branch. */
export type FlowStep =
  | { type: 'node'; label: string; detail?: string }
  | {
      type: 'branch'
      condition: string
      yes: { label: string; detail?: string }
      no: { label: string; detail?: string }
    }

export type Proof =
  | { kind: 'code'; filename: string; code: string }
  | { kind: 'table'; columns: string[]; rows: string[][]; emphasizeCol: number }
  | { kind: 'flow'; steps: FlowStep[] }

export interface DeepDivePanel {
  id: string
  index: string
  eyebrow: string
  icon: LucideIcon
  /** Heading rendered as stacked lines; the line at accentIndex is green. */
  headingLines: string[]
  accentIndex: number
  impact: string
  problem: string
  decision: string
  insight: string
  watermark: string
  /** The proof artifact. Omitted for panels that instead set `guide`. */
  proof?: Proof
  /** Shown in place of a proof — orients the reader to the map itself. */
  guide?: string
  /** Tools that would surface this flaw (profilers, vitals dashboards, etc). */
  tags?: { icon: ReactNode; label: string }[]
}
