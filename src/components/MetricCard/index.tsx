import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import GlassBadge from '../GlassBadge'

interface MetricCardProps {
  icon: LucideIcon
  metric: string
  metricPrefix?: string
  title: string
  description: string
  delay?: number
}

export default function MetricCard({
  icon: Icon,
  metric,
  metricPrefix,
  title,
  description,
  delay = 0,
}: MetricCardProps) {

  return (
    // ── Outer wrapper — 1px gradient border (top-right bright → bottom-left dim) ──
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.012, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group cursor-default"
      style={{
        // Gradient stroke: bright top-left → dim top-right → nearly invisible bottom
        background: 'linear-gradient(135deg, rgba(160,255,210,0.18) 0%, rgba(120,255,180,0.08) 55%, rgba(80,255,150,0.03) 100%)',
        borderRadius: '22px',
        padding: '1px',
        boxShadow: 'none',
      }}
    >
      {/* ── Inner card — dark glass fill ── */}
      <div
        className="relative overflow-hidden h-full"
        style={{
          // Dark glass panel with upper-left ambient radial
          background: '#000000',
          borderRadius: '21px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          // Layer 1: main low-contrast inset stroke
          // Layer 2: inner glass highlight edge
          // Layer 4 bottom bloom: very soft center-bottom inset glow
          boxShadow: [
            'inset 0 0 0 1px rgba(110,255,170,0.10)',
            'inset 0 0 0 1px rgba(255,255,255,0.03)',
            'inset 0 1px 0 rgba(160,255,210,0.08)',
            'inset 0 -10px 24px rgba(80,255,150,0.025)',
          ].join(', '),
        }}
      >

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 25% 20%, rgba(92,255,157,0.05) 0%, transparent 65%)',
          }}
        />

        {/* ── Icon + Metric row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GlassBadge icon={Icon} size={52} color="#4ADE80" />

          <div style={{ fontSize: '1.45rem', fontWeight: 600, lineHeight: 1.2, minWidth: 0, flexShrink: 1 }}>
            {metricPrefix && (
              <span style={{ color: '#FFFFFF', fontWeight: 500, marginRight: '0.25em' }}>
                {metricPrefix}
              </span>
            )}
            <span style={{ color: '#5BFF6A' }}>{metric}</span>
          </div>
        </div>

        {/* ── Title ── */}
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.3 }}>
          {title}
        </div>

        {/* ── Description ── */}
        <div style={{ fontSize: '0.95rem', fontWeight: 400, color: '#82888B', lineHeight: 1.4 }}>
          {description}
        </div>
      </div>
    </motion.div>
  )
}
