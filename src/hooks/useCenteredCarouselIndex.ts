import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/** Tracks which direct child of `trackRef` sits closest to the horizontal
 *  center of a scrollable carousel track, updating as the user scrolls. */
export function useCenteredCarouselIndex(trackRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const [centeredIndex, setCenteredIndex] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!enabled || !track) return

    let raf = 0

    const updateCentered = () => {
      const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2
      let closestIndex = 0
      let closestDistance = Infinity

      Array.from(track.children).forEach((child, i) => {
        const rect = (child as HTMLElement).getBoundingClientRect()
        const distance = Math.abs(rect.left + rect.width / 2 - trackCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      })

      setCenteredIndex(closestIndex)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateCentered)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [trackRef, enabled])

  return [centeredIndex, setCenteredIndex] as const
}
