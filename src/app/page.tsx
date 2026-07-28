import styles from "./page.module.css";
import Showroom from "@/components/Showroom/Showroom";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>WICKED GH</h1>
            <p className={styles.subtitle}>FW26 COLLECTION</p>
            <a href="#showroom" className={styles.enterButton}>ENTER SHOWROOM</a>
          </div>
        </div>
      </main>
      <Showroom />
    </>
  );
}
