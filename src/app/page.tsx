import Link from 'next/link'
import styles from './page.module.scss'

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Добро пожаловать, вы в системе HZ</h1>
          <div className={styles.cta}>
            <Link href="/example" className={styles.btnPrimary}>
              Начать
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

