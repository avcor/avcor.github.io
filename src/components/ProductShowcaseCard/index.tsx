import type { CSSProperties, ReactNode } from 'react'

export interface ProductShowcaseCardProps {
  eyebrowIcon?: ReactNode
  title?: string
  description?: string
  ctaLabel?: string
  onCtaClick?: () => void
  screenshotSrc?: string
  screenshotAlt?: string
  accent?: string
  screenshotWidth?: number
}

function CubeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

export default function ProductShowcaseCard({
  eyebrowIcon,
  title = 'Product Delivered',
  description = 'Production screens built on top of the Flutter platform.',
  ctaLabel = 'View full screen',
  onCtaClick,
  screenshotSrc = '',
  screenshotAlt = 'Product screenshot',
  accent = '#7ee787',
  screenshotWidth = 288,
}: ProductShowcaseCardProps) {
  const hasScreenshot = screenshotSrc.trim().length > 0

  return (
    <div className="psc-card" style={{ '--psc-accent': accent } as CSSProperties}>
      <style>{`
        .psc-card {
          position: relative;
          width: 100%;
          max-width: 900px;
          background:
            radial-gradient(120% 90% at 92% 45%, color-mix(in srgb, var(--psc-accent) 10%, transparent), transparent 55%),
            radial-gradient(90% 120% at 0% 100%, color-mix(in srgb, var(--psc-accent) 5%, transparent), transparent 50%),
            #0c0f0d;
          border: 1px solid #1c2420;
          border-radius: 24px;
          padding: 56px 40px 0 48px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          overflow: hidden;
          color: #f3f5f4;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .psc-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(color-mix(in srgb, var(--psc-accent) 10%, transparent) 1px, transparent 1px);
          background-size: 22px 22px;
          -webkit-mask-image: linear-gradient(120deg, transparent 45%, black 100%);
          mask-image: linear-gradient(120deg, transparent 45%, black 100%);
          opacity: 0.5;
          pointer-events: none;
        }

        .psc-left {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          max-width: 340px;
          padding-top: 6px;
          padding-bottom: 44px;
        }

        .psc-badge {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: radial-gradient(80% 80% at 50% 30%, color-mix(in srgb, var(--psc-accent) 22%, transparent), color-mix(in srgb, var(--psc-accent) 4%, transparent));
          border: 1px solid color-mix(in srgb, var(--psc-accent) 28%, transparent);
          color: var(--psc-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 40px color-mix(in srgb, var(--psc-accent) 15%, transparent);
          margin-bottom: 26px;
          flex-shrink: 0;
        }

        .psc-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0;
        }

        .psc-rule {
          width: 34px;
          height: 3px;
          border-radius: 2px;
          background: var(--psc-accent);
          margin: 14px 0 26px;
        }

        .psc-description {
          font-size: 19px;
          line-height: 1.55;
          color: #8a938e;
          font-weight: 400;
          margin: 0;
        }

        .psc-cta {
          margin-top: auto;
          padding-top: 48px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--psc-accent);
          font-size: 16px;
          font-weight: 600;
          font-family: inherit;
          background: none;
          border: none;
          cursor: pointer;
          width: fit-content;
          border-radius: 4px;
        }

        .psc-cta:focus-visible {
          outline: 2px solid var(--psc-accent);
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: no-preference) {
          .psc-cta {
            transition: gap 0.2s ease, opacity 0.2s ease;
          }
        }

        .psc-cta:hover {
          gap: 14px;
          opacity: 0.85;
        }

        .psc-shot {
          position: relative;
          z-index: 2;
          align-self: end;
          margin-bottom: -92px;
        }

        .psc-shot-img {
          display: block;
          width: 100%;
          height: auto;
          filter:
            drop-shadow(0 30px 60px rgba(0, 0, 0, 0.6))
            drop-shadow(0 0 40px color-mix(in srgb, var(--psc-accent) 6%, transparent));
        }

        .psc-shot-empty {
          height: 500px;
          border: 1.5px dashed #1c2420;
          border-radius: 40px 40px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #8a938e;
          font-size: 13px;
          padding: 24px;
        }

        @media (max-width: 720px) {
          .psc-card {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
            padding: 44px 26px 0;
          }

          .psc-left {
            align-items: center;
            max-width: 100%;
            padding-bottom: 0;
          }

          .psc-rule {
            margin-left: auto;
            margin-right: auto;
          }

          .psc-cta {
            padding-top: 34px;
          }

          .psc-shot {
            width: 100% !important;
            max-width: 288px;
            margin-top: 34px;
            margin-bottom: -40px;
          }
        }
      `}</style>

      <div className="psc-left">
        <div className="psc-badge">{eyebrowIcon ?? <CubeIcon />}</div>

        <h1 className="psc-title">{title}</h1>
        <div className="psc-rule" />
        <p className="psc-description">{description}</p>

        <button type="button" className="psc-cta" onClick={onCtaClick}>
          {ctaLabel}
          <ExpandIcon />
        </button>
      </div>

      <div
        className={`psc-shot${hasScreenshot ? '' : ' psc-shot-empty'}`}
        style={{ width: `${screenshotWidth}px` }}
      >
        {hasScreenshot ? (
          <img src={screenshotSrc} alt={screenshotAlt} className="psc-shot-img" />
        ) : (
          <span>Drop your phone screenshot here</span>
        )}
      </div>
    </div>
  )
}

export function ProductShowcaseCardDemo() {
  return (
    <div
      style={{
        background: '#050706',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <ProductShowcaseCard screenshotSrc="" />
    </div>
  )
}
