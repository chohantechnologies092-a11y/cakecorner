import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

// Use a placeholder if no key provided, but checkout will fail at runtime until a real key is added
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Format items for Stripe Checkout
    const lineItems = order.items.map((item) => {
      // Calculate unit amount in cents/pence (since currency is usually minor units)
      // Assuming currency is GBP since we switched to £
      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.product.name,
            description: [item.size, item.flavor].filter(Boolean).join(" • ") || "Delicious Cake",
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // Check if total matches. Wait, order.total includes delivery!
    // Stripe calculates total automatically based on lineItems.
    // If there is a delivery fee in the order, we should add it as a line item.
    const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = order.total - itemsTotal;
    
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
      },
    });

    // Save Stripe Session ID to order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
