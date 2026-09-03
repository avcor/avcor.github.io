import { useMemo, useState } from 'react'
import type { DeepDivePanel } from '../components/ArchitectureDiagram/types'

/**
 * Tracks which deep-dive panel a gallery's architecture map has selected and
 * resolves it to the panel object. Falls back to the first panel when the id
 * matches nothing, so the map and detail view can never render empty.
 */
export function usePanelSelection(panels: DeepDivePanel[], initialId: string) {
  const [selected, setSelected] = useState(initialId)

  const selectedPanel = useMemo(
    () => panels.find((p) => p.id === selected) ?? panels[0],
    [panels, selected],
  )

  return { selected, setSelected, selectedPanel }
}
