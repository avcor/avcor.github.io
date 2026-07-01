import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  metric: string
  metricPrefix?: string  // e.g. "4s →" for transform metrics
  title: string
  description: string
  delay?: number
}

function getMetricFontSize(metric: string, prefix?: string): string {
  const total = (prefix ? prefix.length + 1 : 0) + metric.length
  if (total <= 3) return '2.4rem'
  if (total <= 5) return '2rem'
  if (total <= 8) return '1.55rem'
  if (total <= 11) return '1.25rem'
  return '1.05rem'
}

export default function MetricCard({
  icon: Icon,
  metric,
  metricPrefix,
  title,
  description,
  delay = 0,
}: MetricCardProps) {
  const fontSize = getMetricFontSize(metric, metricPrefix)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="relative group cursor-default overflow-hidden"
      style={{
        background: '#0B0E11',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 20%, rgba(91,255,106,0.07) 0%, transparent 65%)',
        }}
      />
      {/* Hover border */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ border: '1px solid rgba(91,255,106,0.2)', borderRadius: '14px' }}
      />

      {/* ── Icon + Metric (horizontal row) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Circular icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: '1.5px solid rgba(91,255,106,0.35)',
            background: 'rgba(91,255,106,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={21} color="#5BFF6A" strokeWidth={1.5} />
        </div>

        {/* Metric value */}
        <div style={{ fontSize, fontWeight: 600, lineHeight: 1.18, minWidth: 0 }}>
          {metricPrefix && (
            <span
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontWeight: 400,
                marginRight: '0.3em',
              }}
            >
              {metricPrefix}
            </span>
          )}
          <span style={{ color: '#5BFF6A' }}>{metric}</span>
        </div>
      </div>

      {/* ── Title ── */}
      <div
        style={{
          fontSize: '0.87rem',
          fontWeight: 600,
          color: '#FFFFFF',
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>

      {/* ── Description ── */}
      <div
        style={{
          fontSize: '0.74rem',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.42)',
          lineHeight: 1.62,
        }}
      >
        {description}
      </div>
    </motion.div>
  )
}
