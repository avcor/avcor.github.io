import Nav from '../../components/Nav'
import IndexLeftPanel from './IndexLeftPanel'
import styles from './IndexPage.module.css'

export default function IndexPage() {
  return (
    <section id="index" className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>AV</span>
        <Nav />
      </header>

      <div className={styles.content}>
        <IndexLeftPanel />
        <div className={styles.rightColumn} />
      </div>
    </section>
  )
}
