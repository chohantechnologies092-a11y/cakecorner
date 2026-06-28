import styles from "./About.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Cake Corner",
  description: "Welcome to Cake Corner, where every cake is made with passion, creativity, and a love for making life's sweetest moments unforgettable.",
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>About Us — Cake Corner</h1>
        <p className={styles.heroText}>
          Welcome to Cake Corner, where every cake is made with passion, creativity, and a love for making life’s sweetest moments unforgettable.
          <br /><br />
          At Cake Corner, we believe that cakes are more than just desserts — they are a part of celebrations, memories, and special occasions. Whether it’s a birthday, wedding, anniversary, baby shower, or simply a treat for yourself, our goal is to create cakes that look beautiful and taste even better.
        </p>
      </div>

      <div className={styles.contentWrapper}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <p className={styles.sectionText}>
            Cake Corner was created with a simple idea: to offer freshly made, high-quality cakes that can be personalised for every customer. We understand that every celebration is unique, which is why we specialise in customised cakes designed to match your theme, style, and taste preferences.
            <br /><br />
            From elegant celebration cakes to delicious cake slices for everyday enjoyment, each order is prepared with attention to detail and premium ingredients.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What We Offer</h2>
          <p className={styles.sectionText}>
            Every cake is carefully crafted to ensure the perfect balance of flavour, freshness, and presentation.
          </p>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🎨</div>
              <h3 className={styles.cardTitle}>Customised Cakes</h3>
              <p className={styles.cardText}>Tailored designs for all your special occasions.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🍰</div>
              <h3 className={styles.cardTitle}>Fresh Cake Slices</h3>
              <p className={styles.cardText}>Freshly baked slices for your everyday enjoyment.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>✨</div>
              <h3 className={styles.cardTitle}>Unique Designs</h3>
              <p className={styles.cardText}>Designs specifically tailored to your request and theme.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🍓</div>
              <h3 className={styles.cardTitle}>Quality Ingredients</h3>
              <p className={styles.cardText}>Premium ingredients and rich, homemade flavours.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🤝</div>
              <h3 className={styles.cardTitle}>Reliable Service</h3>
              <p className={styles.cardText}>A service you can trust for your most important events.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Promise</h2>
          <p className={styles.sectionText}>
            Your happiness is at the heart of everything we do, and nothing makes us happier than being part of your special moments. We are committed to:
          </p>
          <ul className={styles.promiseList}>
            <li className={styles.promiseItem}>
              <span className={styles.promiseIcon}>✔</span>
              Fresh baking for every order
            </li>
            <li className={styles.promiseItem}>
              <span className={styles.promiseIcon}>✔</span>
              High quality and hygiene standards
            </li>
            <li className={styles.promiseItem}>
              <span className={styles.promiseIcon}>✔</span>
              Friendly and helpful customer service
            </li>
            <li className={styles.promiseItem}>
              <span className={styles.promiseIcon}>✔</span>
              Making your celebrations stress-free and memorable
            </li>
          </ul>
        </section>

        <div className={styles.footer}>
          <h2 className={styles.footerTitle}>Celebrate With Us</h2>
          <p className={styles.footerText}>
            Whether you’re planning a big celebration or craving a sweet treat, Cake Corner is here to make your moments extra special — one slice at a time.
          </p>
          <p className={styles.footerThanks}>Thank you for choosing Cake Corner!</p>
        </div>
      </div>
    </div>
  );
}
