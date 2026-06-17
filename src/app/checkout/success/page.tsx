"use client";

import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import styles from "../Checkout.module.css";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared && sessionId) {
      clearCart();
      setCleared(true);
    }
  }, [sessionId, cleared, clearCart]);

  return (
    <div className={styles.successState}>
      <span className={styles.successIcon}>🎉</span>
      <h1 className={styles.successTitle}>Payment Successful!</h1>
      <p className={styles.successDesc}>
        Thank you for your order! Your payment has been processed securely. 
        Our bakers will start preparing your sweet treats soon. We'll contact you via email for confirmation.
      </p>
      <Link href="/shop" className={styles.browseLink}>
        Continue Shopping
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "5rem" }}>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
