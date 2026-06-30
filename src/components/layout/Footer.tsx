"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>

          <div className={styles.brand}>
            <h2 className={styles.logoTitle}>Cake Corner</h2>
            <p className={styles.brandDesc}>
              Handcrafted with love, baked to perfection. Experience the magic of our premium pastries and custom cakes designed just for you.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Twitter">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3>Explore</h3>
            <ul className={styles.links}>
              <li><Link href="/shop" className={styles.link}>Our Menu</Link></li>
              <li><Link href="/shop?category=cakes" className={styles.link}>Custom Cakes</Link></li>
              <li><Link href="#" className={styles.link}>Special Offers</Link></li>

            </ul>
          </div>

          <div className={styles.column}>
            <h3>Company</h3>
            <ul className={styles.links}>
              <li><Link href="/about" className={styles.link}>About Us</Link></li>
              <li><Link href="/contact" className={styles.link}>Contact</Link></li>
              <li><Link href="/blog" className={styles.link}>Blog</Link></li>
              <li><Link href="#" className={styles.link}>Careers</Link></li>

            </ul>
          </div>

          <div className={styles.column}>
            <h3>Newsletter</h3>
            <div className={styles.newsletter}>
              <p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className={styles.input} required />
                <button type="submit" className={styles.submitBtn}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          </div>

        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} Cake Corner. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="#" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="#" className={styles.legalLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
