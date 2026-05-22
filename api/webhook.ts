import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerClient } from '@/lib/supabase';

const supabase = getServerClient();

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        // Get customer metadata
        const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer.metadata as any).userId;

        // Update subscription in DB
        const planId = subscription.items.data[0].price.id;
        const planMap: { [key: string]: string } = {
          [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!]: 'pro',
          [process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!]: 'enterprise',
        };

        await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            plan: planMap[planId] || 'free',
            status: subscription.status === 'active' ? 'active' : 'inactive',
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
          },
          { onConflict: 'user_id' }
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer.metadata as any).userId;

        await supabase
          .from('subscriptions')
          .update({ status: 'inactive' })
          .eq('user_id', userId);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as any;
        const customerId = charge.customer;

        const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer.metadata as any).userId;

        await supabase.from('payment_events').insert([
          {
            user_id: userId,
            stripe_event_id: event.id,
            event_type: 'charge.succeeded',
            amount: charge.amount / 100,
            currency: charge.currency.toUpperCase(),
            status: 'success',
            metadata: charge.metadata,
          },
        ]);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
