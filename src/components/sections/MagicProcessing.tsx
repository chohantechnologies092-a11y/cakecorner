import Image from 'next/image';
import styles from './MagicProcessing.module.css';

export default function MagicProcessing() {
  return (
    <section className={styles.section}>
      <div className={styles.bgWrapper}>
        <Image src="/hero-bg.png" alt="Background" fill className={styles.bgImage} />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className={styles.subtitle}>Made with love</span>
          <h2 className={styles.title}>The Magic Process</h2>
          <p className={styles.desc}>
            Every cake is baked from scratch daily using only the finest ingredients. 
            We put our heart and soul into every detail to ensure your celebration is perfect.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🌾</div>
              <span>Premium Flour</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🥚</div>
              <span>Fresh Eggs</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🧈</div>
              <span>Real Butter</span>
            </div>
          </div>
          <button className={styles.btnSolid}>Discover More</button>
        </div>
      </div>
    </section>
  );
}
