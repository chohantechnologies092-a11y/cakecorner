import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "Paid",
          status: "Processing" // Move from Pending to Processing
        },
      });
      console.log(`Order ${orderId} marked as Paid via Stripe.`);
    }
  }

  return NextResponse.json({ received: true });
}
