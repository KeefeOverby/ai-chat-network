// src/app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  if (request.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'AI Gibber Chat Premium',
              },
              unit_amount: 999, // $9.99
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${request.headers.get('origin')}/success`,
        cancel_url: `${request.headers.get('origin')}/cancel`,
      });
      return NextResponse.json({ id: session.id });
    } catch (err) {
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
}