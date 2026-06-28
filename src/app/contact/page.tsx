import styles from "./Contact.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Cake Corner",
  description: "Get in touch with Cake Corner. We'd love to hear from you!",
};

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Get in Touch</h1>
        <p className={styles.heroText}>
          Have a question about a custom order, or just want to say hi? We’d love to hear from you. Fill out the form below or reach out to us directly.
        </p>
      </div>

      <div className={styles.contentWrapper}>
        {/* Contact Information */}
        <section className={styles.infoSection}>
          <h2 className={styles.infoTitle}>Contact Information</h2>
          
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>🏢</div>
            <div className={styles.infoContent}>
              <h3>Trade Name</h3>
              <p>CAKE CORNER</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>📍</div>
            <div className={styles.infoContent}>
              <h3>Physical Address</h3>
              <p>145 Ladypool Road<br />Birmingham B12 8LH<br />United Kingdom</p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>📞</div>
            <div className={styles.infoContent}>
              <h3>Phone Number</h3>
              <p><a href="tel:01212473840">0121 247 38 40</a></p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>✉️</div>
            <div className={styles.infoContent}>
              <h3>Email Address</h3>
              <p><a href="mailto:info@cakecornerwm.co.uk">info@cakecornerwm.co.uk</a></p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className={styles.formSection}>
          <h2 className={styles.formTitle}>Send a Message</h2>
          <p className={styles.formDesc}>We will get back to you as soon as possible.</p>
          
          <form action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input type="text" id="name" name="name" className={styles.input} placeholder="John Doe" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input type="email" id="email" name="email" className={styles.input} placeholder="john@example.com" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>Subject</label>
              <input type="text" id="subject" name="subject" className={styles.input} placeholder="Custom Cake Inquiry" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea id="message" name="message" className={styles.textarea} placeholder="How can we help you?" required></textarea>
            </div>
            
            <button type="submit" className={styles.submitBtn}>Send Message</button>
          </form>
        </section>
      </div>

      {/* Map Section */}
      <div className={styles.mapSection}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2430.7302484646274!2d-1.878950684195159!3d52.46604247980315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bca5c71bba7d%3A0xc31fa4c85671c6dc!2s145%20Ladypool%20Rd%2C%20Sparkbrook%2C%20Birmingham%20B12%208LH%2C%20UK!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Cake Corner Location"
        ></iframe>
      </div>
    </div>
  );
}
