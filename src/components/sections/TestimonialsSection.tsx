import styles from "./TestimonialsSection.module.css";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Birthday Celebration",
    text: "The absolute best chocolate fudge cake I have ever had! The sponge was unbelievably moist and the frosting was just right. Everyone at the party was asking where we got it.",
    rating: 5,
    avatarUrl: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: 2,
    name: "Michael Thompson",
    role: "Wedding Anniversary",
    text: "Cake Corner made our 10th anniversary incredibly special. The custom red velvet tier cake was stunningly beautiful and tasted even better. Highly recommend their service!",
    rating: 5,
    avatarUrl: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Aisha Malik",
    role: "Regular Customer",
    text: "I order cupcakes from here every weekend for my kids. They are always fresh, beautifully decorated, and delivered right on time. The best bakery in town, hands down.",
    rating: 5,
    avatarUrl: "https://i.pravatar.cc/150?img=5"
  }
];

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Happy Customers</span>
          <h2 className={styles.title}>What People Are Saying</h2>
        </div>

        <div className={styles.grid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.quoteIcon}>"</div>
              <div className={styles.stars}>
                {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
              </div>
              <p className={styles.text}>"{t.text}"</p>
              
              <div className={styles.authorWrapper}>
                <img src={t.avatarUrl} alt={t.name} className={styles.avatar} />
                <div className={styles.authorInfo}>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.role}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
