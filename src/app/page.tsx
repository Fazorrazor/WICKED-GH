import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>WICKED GH</h1>
          <p className={styles.subtitle}>FW26 COLLECTION</p>
          <button className={styles.enterButton}>ENTER SHOWROOM</button>
        </div>
      </div>
    </main>
  );
}
