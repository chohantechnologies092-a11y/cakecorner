"use client";

import { useActionState, useEffect, useState } from "react";
import { submitLead } from "./actions";
import styles from "./Contact.module.css";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await submitLead(formData);
    },
    null
  );

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setIsSuccess(true);
      // Reset form
      const form = document.getElementById("contactForm") as HTMLFormElement;
      if (form) form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }
  }, [state]);

  return (
    <form id="contactForm" action={formAction}>
      {isSuccess && (
        <div style={{ padding: "1rem", backgroundColor: "#ecfdf5", color: "#065f46", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid #10b981", fontWeight: "600" }}>
          Your message has been sent successfully! We will get back to you soon.
        </div>
      )}
      
      {state?.error && (
        <div style={{ padding: "1rem", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid #ef4444", fontWeight: "600" }}>
          {state.error}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Full Name</label>
        <input type="text" id="name" name="name" className={styles.input} placeholder="John Doe" required disabled={isPending} />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email Address</label>
        <input type="email" id="email" name="email" className={styles.input} placeholder="john@example.com" required disabled={isPending} />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>Subject</label>
        <input type="text" id="subject" name="subject" className={styles.input} placeholder="Custom Cake Inquiry" required disabled={isPending} />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea id="message" name="message" className={styles.textarea} placeholder="How can we help you?" required disabled={isPending}></textarea>
      </div>
      
      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
