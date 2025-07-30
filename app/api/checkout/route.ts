import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || '',
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects the amount in cents
        },
        quantity: item.quantity,
      })),
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        userId: userId,
        cartItems: JSON.stringify(cartItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: "Failed to create checkout session" }, 
      { status: 500 }
    );
  }
}
