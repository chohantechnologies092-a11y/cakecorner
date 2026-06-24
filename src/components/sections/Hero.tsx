import Link from "next/link";
import styles from "./Hero.module.css";
import Image from "next/image";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
      >
        <source src="https://res.cloudinary.com/dk1t8foja/video/upload/v1782215603/create_a_video_in_which_youo_gmg5zk.mp4" type="video/mp4" />
      </video>
      <div className={styles.videoOverlay}></div>

      {/* Decorative Background Elements */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className="container" style={{ position: "relative", zIndex: 20, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div className={styles.splitLayout}>

          <div className={styles.heroLeft}>

            <h2 className={styles.title}>
              Make Your <span className={styles.highlight}>Moments</span> Sweeter
            </h2>
            <p className={styles.subtitle}>
              Handcrafted cakes and pastries for every celebration. <br />
              Made with premium ingredients and lots of love.
            </p>
            <div className={styles.btnGroup}>
              <Link href="/shop" className={styles.btnSolid}>
                Order Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "8px" }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
              <Link href="/shop" className={styles.btnOutline}>
                Our Menu
              </Link>
            </div>


          </div>

          <div className={styles.heroRight}>
            <div className={styles.imageContainer}>
              <div className={styles.imageBackdrop}></div>
              <div className={styles.floatingCakeWrapper}>
                <Image
                  src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1050&auto=format&fit=crop"
                  alt="Delicious Pink Cake"
                  width={480}
                  height={480}
                  className={styles.mainImage}
                  priority
                  unoptimized
                />
              </div>
              {/* Decorative floating badges */}


            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
