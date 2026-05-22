import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: '2023-10-16',
  }
);

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['1 scan/day', 'Basic risk assessment'],
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    features: ['Unlimited scans', 'Advanced analytics', 'Detailed reports', 'Priority support'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 49.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    features: ['All Pro features', 'API access', 'Custom integrations', 'Dedicated support'],
  },
};
