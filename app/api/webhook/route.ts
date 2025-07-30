import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint is accessible",
    timestamp: new Date().toISOString(),
    environment: {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = (await headers()).get("stripe-signature");
    
    if (!signature) {
      console.error("Missing Stripe signature");
      return new Response("Missing Stripe signature", { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
      return new Response("Missing webhook secret", { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody, 
        signature, 
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return new Response("Invalid Stripe signature", { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (!metadata || !metadata.userId || !metadata.cartItems) {
        console.error("Missing metadata in session");
        return new Response("Missing required metadata", { status: 400 });
      }

      const userId = metadata.userId;
      const cartItems = JSON.parse(metadata.cartItems);
      const amount = (session.amount_total || 0) / 100; // Convert cents to dollars

      // Create order with order items
      const order = await prisma.order.create({
        data: {
          userId,
          amount,
          paymentIntentId: session.payment_intent as string,
          items: {
            create: cartItems.map((item: any) => ({
              menuItemId: item.id,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      console.log(`Order ${order.id} created successfully for user ${userId}`);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook error", { status: 500 });
  }
}