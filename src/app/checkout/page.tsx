"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { createOrder, getAccessories } from "@/lib/actions";
import Link from "next/link";
import styles from "./Checkout.module.css";

export default function CheckoutPage() {
  const { items, total, clearCart, removeItem, updateQty, addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addons, setAddons] = useState<any[]>([]);
  const [orderType, setOrderType] = useState<"Delivery" | "Pickup">("Delivery");
  const [form, setForm] = useState({ customer: "", email: "", phone: "", address: "", notes: "" });

  useEffect(() => {
    getAccessories().then(data => setAddons(data)).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [deliveryArea, setDeliveryArea] = useState<"Birmingham" | "Outside">("Birmingham");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card">("Card");

  const DELIVERY_FEE = deliveryArea === "Birmingham" ? 5.00 : 0.00;
  const finalTotal = total + (orderType === "Delivery" ? DELIVERY_FEE : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    
    // Modify address/notes if Pickup
    const finalAddress = orderType === "Pickup" ? "Store Pickup" : form.address;
    let finalNotes = form.notes || "";
    
    if (orderType === "Pickup") {
      finalNotes = `[PICKUP ORDER]\n${finalNotes}`;
    } else if (orderType === "Delivery") {
      finalNotes = `[DELIVERY: ${deliveryArea}]\n${finalNotes}`;
    }

    try {
      const order = await createOrder({
        customer: form.customer,
        email: form.email,
        phone: form.phone,
        address: finalAddress,
        notes: finalNotes,
        deliveryFee: orderType === "Delivery" ? DELIVERY_FEE : 0,
        paymentMethod,
        items: items.map((i) => ({ 
          productId: i.productId, 
          quantity: i.quantity, 
          price: i.price,
          size: i.size || null,
          flavor: i.flavor || null,
          photoUrl: i.photoUrl || null
        })),
      });

      if (paymentMethod === "Card") {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id })
        });
        const data = await res.json();
        
        if (data.url) {
          clearCart(); // clear before redirect
          window.location.href = data.url;
          return;
        } else {
          throw new Error(data.error || "Failed to create Stripe session");
        }
      }

      // If Cash, just show success directly
      clearCart();
      setSuccess(true);
    } catch (err: any) {
      alert("Error: " + (err.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
        <div className={styles.successState}>
          <span className={styles.successIcon}>🎉</span>
          <h1 className={styles.successTitle}>Order Placed!</h1>
          <p className={styles.successDesc}>
            Thank you for your order! We've received it and our bakers will start preparing your sweet treats soon. We'll contact you via email for confirmation.
          </p>
          <Link href="/shop" className={styles.browseLink}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      <main className={styles.container}>
        <h1 className={styles.pageTitle}>Secure Checkout</h1>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <Link href="/shop" className={styles.browseLink}>Browse our menu</Link>
          </div>
        ) : (
          <div className={styles.checkoutGrid}>
            
            {/* Customer Form */}
            <form onSubmit={handleSubmit} className={styles.formCard}>
              <h2 className={styles.sectionTitle}>1. Delivery & Pickup Details</h2>
              
              <div className={styles.orderTypeTabs}>
                <button type="button" onClick={() => setOrderType("Delivery")} className={`${styles.typeTab} ${orderType === "Delivery" ? styles.active : ""}`}>🚚 Delivery</button>
                <button type="button" onClick={() => setOrderType("Pickup")} className={`${styles.typeTab} ${orderType === "Pickup" ? styles.active : ""}`}>🏬 Store Pickup</button>
              </div>

              {orderType === "Pickup" && (
                <div className={styles.pickupInfoBox}>
                  <h4>Pickup from Store</h4>
                  <p>You will collect this order from our bakery.</p>
                </div>
              )}

              <div className={styles.formGroup}>
                
                <div className={styles.row}>
                  <div className={styles.inputField}>
                    <label className={styles.label}>Full Name *</label>
                    <input name="customer" required value={form.customer} onChange={handleChange} className={styles.input} placeholder="Jane Smith" />
                  </div>
                  <div className={styles.inputField}>
                    <label className={styles.label}>Email Address *</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange} className={styles.input} placeholder="jane@example.com" />
                  </div>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.label}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className={styles.input} placeholder="+44 7000 000000" />
                </div>

                {orderType === "Delivery" && (
                  <>
                    <div className={styles.inputField}>
                      <label className={styles.label}>Delivery Area *</label>
                      <select 
                        value={deliveryArea} 
                        onChange={(e) => setDeliveryArea(e.target.value as "Birmingham" | "Outside")}
                        className={styles.input}
                        required
                      >
                        <option value="Birmingham">Birmingham (£5.00)</option>
                        <option value="Outside">Outside Birmingham (We will contact you for fee)</option>
                      </select>
                    </div>

                    <div className={styles.inputField}>
                      <label className={styles.label}>Full Delivery Address *</label>
                      <input name="address" required value={form.address} onChange={handleChange} className={styles.input} placeholder="123 Bakery Lane, Birmingham" />
                    </div>
                  </>
                )}

                <div className={styles.inputField}>
                  <label className={styles.label}>Special Instructions (Optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} className={styles.input} placeholder="Any dietary requirements or delivery notes..." />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.label}>Payment Method *</label>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", background: paymentMethod === "Card" ? "#f0faf9" : "#f9f9f9", padding: "1rem", borderRadius: "8px", border: `1px solid ${paymentMethod === "Card" ? "var(--color-primary)" : "#ddd"}`, flex: 1 }}>
                      <input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === "Card"} onChange={() => setPaymentMethod("Card")} style={{ accentColor: "var(--color-primary)", width: "18px", height: "18px" }} />
                      <span style={{ fontWeight: 600 }}>💳 Pay via Card (Stripe)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", background: paymentMethod === "Cash" ? "#f0faf9" : "#f9f9f9", padding: "1rem", borderRadius: "8px", border: `1px solid ${paymentMethod === "Cash" ? "var(--color-primary)" : "#ddd"}`, flex: 1 }}>
                      <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === "Cash"} onChange={() => setPaymentMethod("Cash")} style={{ accentColor: "var(--color-primary)", width: "18px", height: "18px" }} />
                      <span style={{ fontWeight: 600 }}>💵 {orderType === "Delivery" ? "Cash on Delivery" : "Pay at Store"}</span>
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? "Processing Order..." : `Complete Order — £${finalTotal.toFixed(2)}`}
                </button>

              </div>
            </form>

            {/* Order Summary */}
            <div className={styles.summaryCard}>
              <h2 className={styles.sectionTitle}>2. Order Summary</h2>
              <div className={styles.cartItems}>
                {items.map((item) => (
                  <div key={item.cartItemId} className={styles.cartItem}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                    ) : (
                      <div className={styles.itemImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎂</div>
                    )}
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      {(item.size || item.flavor) && (
                        <p className={styles.itemMeta}>
                          {item.size} {item.size && item.flavor ? "•" : ""} {item.flavor}
                        </p>
                      )}
                      <div className={styles.qtyWrapper}>
                        <div className={styles.qtyControls}>
                          <button type="button" className={styles.qtyBtn} onClick={() => updateQty(item.cartItemId, item.quantity - 1)}>-</button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button type="button" className={styles.qtyBtn} onClick={() => updateQty(item.cartItemId, item.quantity + 1)}>+</button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeItem(item.cartItemId)} 
                          className={styles.removeBtn}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className={styles.itemPrice}>£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
                {orderType === "Delivery" && (
                  <div className={styles.totalRow}>
                    <span>Delivery Fee</span>
                    <span>{deliveryArea === "Birmingham" ? "£5.00" : "TBD"}</span>
                  </div>
                )}
                <div className={`${styles.totalRow} ${styles.final}`}>
                  <span>Total</span>
                  <span className={styles.finalPrice}>£{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add-ons Section placed outside and below the checkoutGrid */}
        {items.length > 0 && addons.length > 0 && (
          <div className={styles.addonsSection}>
            <h3 className={styles.addonsTitle}>Add-ons & Accessories</h3>
            <div className={styles.addonsList}>
              {addons.map(addon => (
                <div key={addon.id} className={styles.addonItem}>
                  <img src={addon.imageUrl || "/placeholder.png"} alt={addon.name} className={styles.addonImg} />
                  <div className={styles.addonInfo}>
                    <h4 className={styles.addonName}>{addon.name}</h4>
                    <span className={styles.addonPrice}>£{addon.price.toFixed(2)}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => addItem({ productId: addon.id, name: addon.name, price: addon.price, imageUrl: addon.imageUrl })} 
                    className={styles.addonAddBtn}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
