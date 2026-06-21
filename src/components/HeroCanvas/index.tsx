import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr  = Math.min(window.devicePixelRatio || 1, 2)
    let W = canvas.clientWidth
    let H = canvas.clientHeight

    const ctx = canvas.getContext('2d')!

    // Off-screen canvas — used for soft-edge name reveal compositing
    const revealCanvas = document.createElement('canvas')
    const rCtx = revealCanvas.getContext('2d')!

    // Layout vars (recomputed on resize)
    let fontSize = 0, lineH = 0, textX = 0, textY = 0, font = ''

    function setup() {
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      revealCanvas.width  = W
      revealCanvas.height = H

      fontSize = Math.min(W * 0.24, 320)
      lineH    = fontSize * 1.12
      textX    = W * 0.98
      textY    = H * 0.40
      font     = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
    }

    setup()

    // Raw + smoothed mouse positions
    const mouse  = { x: -9999, y: -9999 }
    const smooth = { x: -9999, y: -9999 }
    let raf = 0

    function draw() {
      // Spring-smooth the cursor position for a calm, unhurried glow
      smooth.x += (mouse.x - smooth.x) * 0.18
      smooth.y += (mouse.y - smooth.y) * 0.18

      ctx.clearRect(0, 0, W, H)

      const hasMouse = smooth.x > -100

      // ── Layer 1: ghost name — always present at ~4% ──────────────────────
      ctx.save()
      ctx.globalAlpha = 0.022
      ctx.fillStyle   = '#ffffff'
      ctx.textAlign   = 'right'
      ctx.font        = font
      ctx.fillText('ABHISHEK', textX, textY)
      ctx.fillText('VERMA',    textX, textY + lineH)
      ctx.restore()

      // ── Layer 2: cursor-reveal — name brightens under the CSS glow ──────
      //    Technique: draw a soft radial gradient as a luminance mask on the
      //    off-screen canvas, then composite the brighter name into that shape.
      if (hasMouse) {
        rCtx.clearRect(0, 0, W, H)

        // Step A — paint the radial soft mask (white center → transparent edge)
        const mask = rCtx.createRadialGradient(
          smooth.x, smooth.y, 0,
          smooth.x, smooth.y, 340,
        )
        mask.addColorStop(0,   'rgba(255,255,255,1)')
        mask.addColorStop(0.4, 'rgba(255,255,255,0.65)')
        mask.addColorStop(0.8, 'rgba(255,255,255,0.15)')
        mask.addColorStop(1,   'rgba(255,255,255,0)')
        rCtx.fillStyle = mask
        rCtx.fillRect(0, 0, W, H)

        // Step B — paint the bright name, clipped to that mask shape
        rCtx.globalCompositeOperation = 'source-in'
        rCtx.fillStyle = 'rgba(255,255,255,0.52)'
        rCtx.font      = font
        rCtx.textAlign = 'right'
        rCtx.fillText('ABHISHEK', textX, textY)
        rCtx.fillText('VERMA',    textX, textY + lineH)
        rCtx.globalCompositeOperation = 'source-over'

        // Step C — composite result onto main canvas
        ctx.drawImage(revealCanvas, 0, 0)
      }

      raf = requestAnimationFrame(draw)
    }

    // ── Events ───────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(raf)
        setup()
        raf = requestAnimationFrame(draw)
      }, 150)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize',    onResize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize',    onResize)
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.8 }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
