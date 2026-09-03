import styles from './CodeBlock.module.css'

interface CodeBlockProps {
  code: string
  filename?: string
}

/**
 * Restrained, near-monochrome code display. No external highlighter, the only
 * distinction drawn is comments (dimmed) vs. code (default), which reads calmer
 * than rainbow syntax and matches the site's minimal grammar. Self-contained.
 */
export default function CodeBlock({ code, filename }: CodeBlockProps) {
  const lines = code.replace(/\n$/, '').split('\n')

  return (
    <div className={styles.block}>
      {filename && (
        <div className={styles.header}>
          <span className={styles.dot} />
          <span className={styles.filename}>{filename}</span>
        </div>
      )}

      <pre className={styles.pre}>
        <code>
          {lines.map((line, i) => {
            const commentAt = line.indexOf('//')
            const code = commentAt >= 0 ? line.slice(0, commentAt) : line
            const comment = commentAt >= 0 ? line.slice(commentAt) : ''

            return (
              <span key={i} className={styles.line}>
                {code}
                {comment && <span className={styles.comment}>{comment}</span>}
                {'\n'}
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
}
