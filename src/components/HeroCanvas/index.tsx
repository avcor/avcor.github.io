import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Particle {
  x: number         // current visual x
  y: number         // current visual y
  homeX: number     // base drift origin x
  homeY: number     // base drift origin y
  targetX: number   // letter pixel position x
  targetY: number   // letter pixel position y
  phase: number     // oscillation phase offset
  size: number      // point radius (px)
  progress: number  // 0 = at home, 1 = at target
  hasTarget: boolean
  baseAlpha: number
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 1300
const REVEAL_RADIUS  = 140   // cursor influence radius (CSS px)
const LERP_IN        = 0.022 // progress speed toward text
const LERP_OUT       = 0.006 // progress speed back home

// ─── Helpers ─────────────────────────────────────────────────────────────────

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function sampleTextPixels(
  W: number, H: number,
  fontSize: number,
  textX: number, textY: number,
  lineH: number,
): { x: number; y: number }[] {
  const off = document.createElement('canvas')
  off.width  = W
  off.height = H
  const c = off.getContext('2d')!
  c.fillStyle = 'white'
  c.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
  c.fillText('ABHISHEK', textX, textY)
  c.fillText('VERMA',    textX, textY + lineH)

  const data  = c.getImageData(0, 0, W, H).data
  const pixels: { x: number; y: number }[] = []
  const step = 5
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 120) pixels.push({ x, y })
    }
  }
  // Fisher-Yates shuffle so particles map to letters randomly
  for (let i = pixels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pixels[i], pixels[j]] = [pixels[j], pixels[i]]
  }
  return pixels
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Setup canvas size ──────────────────────────────────────────────────
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = canvas.clientWidth
    let H = canvas.clientHeight
    canvas.width  = W * dpr
    canvas.height = H * dpr

    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    // ── Shared mutable state ───────────────────────────────────────────────
    const state = {
      particles: [] as Particle[],
      mouse: { x: -9999, y: -9999 },
      time: 0,
    }

    // ── Text position constants (recomputed on resize) ─────────────────────
    let fontSize = 0
    let lineH    = 0
    let textX    = 0
    let textY    = 0

    function computeLayout() {
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      fontSize = Math.min(W * 0.088, 115)
      lineH    = fontSize * 1.15
      textX    = W * 0.38
      textY    = H * 0.44
    }

    // ── Particle initialisation ────────────────────────────────────────────
    function init() {
      computeLayout()

      const pixels = sampleTextPixels(W, H, fontSize, textX, textY, lineH)
      const rightStart = W * 0.36

      state.particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const homeX    = rightStart + Math.random() * (W - rightStart)
        const homeY    = Math.random() * H
        const hasTarget = i < pixels.length
        return {
          x: homeX,  y: homeY,
          homeX,      homeY,
          targetX: hasTarget ? pixels[i].x : homeX,
          targetY: hasTarget ? pixels[i].y : homeY,
          phase:   Math.random() * Math.PI * 2,
          size:    0.7 + Math.random() * 1.1,
          progress: 0,
          hasTarget,
          baseAlpha: 0.08 + Math.random() * 0.14,
        }
      })
    }

    // ── Draw loop ─────────────────────────────────────────────────────────
    let raf = 0

    function draw() {
      const { particles, mouse, time } = state

      ctx.clearRect(0, 0, W, H)

      // Ghost name — barely visible background hint
      ctx.save()
      ctx.globalAlpha = 0.035
      ctx.fillStyle   = '#ffffff'
      ctx.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
      ctx.fillText('ABHISHEK', textX, textY)
      ctx.fillText('VERMA',    textX, textY + lineH)
      ctx.restore()

      // Atmospheric cursor glow (only in right half)
      if (mouse.x > W * 0.3) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 260)
        g.addColorStop(0,   'rgba(61,220,132,0.06)')
        g.addColorStop(0.45,'rgba(61,220,132,0.02)')
        g.addColorStop(1,   'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      }

      // Particles
      for (const p of particles) {
        // Influence = how close the cursor is to this particle's TEXT position
        const tdx = mouse.x - p.targetX
        const tdy = mouse.y - p.targetY
        const targetDist = Math.sqrt(tdx * tdx + tdy * tdy)
        const influence = p.hasTarget
          ? Math.max(0, 1 - targetDist / REVEAL_RADIUS)
          : 0

        // Progress ramp
        if (influence > 0.01) {
          p.progress = Math.min(1, p.progress + LERP_IN  * influence)
        } else {
          p.progress = Math.max(0, p.progress - LERP_OUT)
        }

        const ease = easeInOutCubic(p.progress)

        // Gentle oscillation around home
        const ox = p.homeX + Math.sin(time * 0.19 + p.phase)        * 3.8
        const oy = p.homeY + Math.cos(time * 0.15 + p.phase * 1.38) * 3.8

        // Visual position
        p.x = ox + (p.targetX - ox) * ease
        p.y = oy + (p.targetY - oy) * ease

        // Alpha & colour
        const alpha = p.baseAlpha + ease * 0.62
        ctx.globalAlpha = alpha
        ctx.fillStyle   = ease > 0.4
          ? `rgb(${Math.round(61 + ease * 30)},${Math.round(220 + ease * 18)},${Math.round(132 + ease * 28)})`
          : '#3DDC84'

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      state.time += 0.0075
      raf = requestAnimationFrame(draw)
    }

    // ── Event listeners ───────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      state.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(raf)
        init()
        raf = requestAnimationFrame(draw)
      }, 120)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize',    onResize)

    init()
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
      transition={{ duration: 1.4, delay: 0.6 }}
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
