import { CornerDownRight } from 'lucide-react'
import CodeBlock from '../../components/CodeBlock'
import type { Proof } from './deepDiveData'
import styles from './PanelProof.module.css'

interface PanelProofProps {
  proof: Proof
}

export default function PanelProof({ proof }: PanelProofProps) {
  if (proof.kind === 'code') {
    return <CodeBlock code={proof.code} filename={proof.filename} />
  }

  if (proof.kind === 'table') {
    return (
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              {proof.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proof.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={i === proof.emphasizeCol ? styles.emphasis : undefined}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={styles.flowCard}>
      {proof.steps.map((step, i) => {
        if (step.type === 'node') {
          return (
            <div key={i} className={styles.node}>
              <span className={styles.nodeLabel}>{step.label}</span>
              {step.detail && <span className={styles.nodeDetail}>{step.detail}</span>}
            </div>
          )
        }

        return (
          <div key={i} className={styles.branch}>
            <div className={styles.condition}>{step.condition}</div>
            <div className={styles.arms}>
              {[
                { tag: 'yes', arm: step.yes },
                { tag: 'no', arm: step.no },
              ].map(({ tag, arm }) => (
                <div key={tag} className={styles.arm} data-arm={tag}>
                  <span className={styles.armTag}>
                    <CornerDownRight size={12} strokeWidth={2} />
                    {tag}
                  </span>
                  <span className={styles.armLabel}>{arm.label}</span>
                  {arm.detail && <span className={styles.armDetail}>{arm.detail}</span>}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
