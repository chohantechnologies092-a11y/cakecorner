import Link from "next/link";
import styles from "./Hero.module.css";
import Image from "next/image";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Decorative Background Elements */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      
      <div className="container" style={{ position: "relative", zIndex: 20, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div className={styles.splitLayout}>
          
          <div className={styles.heroLeft}>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>✨</span>
              Baked fresh daily
            </span>
            <h2 className={styles.title}>
              Make Your <span className={styles.highlight}>Moments</span> Sweeter
            </h2>
            <p className={styles.subtitle}>
              Handcrafted cakes and pastries for every celebration. <br/>
              Made with premium ingredients and lots of love.
            </p>
            <div className={styles.btnGroup}>
              <Link href="/shop" className={styles.btnSolid}>
                Order Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: "8px"}}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
              <Link href="/shop" className={styles.btnOutline}>
                Our Menu
              </Link>
            </div>
            
            <div className={styles.trustBadge}>
              <div className={styles.avatars}>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
                <div className={styles.avatar}></div>
                <div className={styles.avatarIcon}>+</div>
              </div>
              <div className={styles.trustText}>
                <span className={styles.stars}>★★★★★</span>
                <p>Loved by <strong>2,000+</strong> customers</p>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
             <div className={styles.imageContainer}>
                <div className={styles.imageBackdrop}></div>
                <div className={styles.floatingCakeWrapper}>
                  <Image 
                    src="/cupcakes.png" 
                    alt="Delicious Cakes" 
                    width={480} 
                    height={480} 
                    className={styles.mainImage}
                    priority
                  />
                </div>
                {/* Decorative floating badges */}
                <div className={`${styles.floatingBadge} ${styles.badge1}`}>
                  <span className={styles.badgeEmoji}>🍓</span>
                  <div className={styles.badgeText}>
                    <strong>Fresh</strong>
                    <span>Berries</span>
                  </div>
                </div>
                <div className={`${styles.floatingBadge} ${styles.badge2}`}>
                  <span className={styles.badgeEmoji}>💯</span>
                  <div className={styles.badgeText}>
                    <strong>Premium</strong>
                    <span>Quality</span>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>

    </section>
  );
}
