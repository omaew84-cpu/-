# Privacy Intelligence SaaS

🔐 Real-time privacy intelligence platform with viral growth engine, Stripe billing, and comprehensive growth analytics.

## Features

### 🔍 Core Product
- **WebRTC Leak Detection** - Detects IP leaks through WebRTC
- **DNS Leak Detection** - Identifies DNS exposure
- **VPN Detection** - Determines if VPN/proxy is active
- **Device Fingerprinting** - Creates unique device fingerprints
- **Risk Scoring** - AI-powered risk assessment (0-100)

### 🚀 Growth Engine
- **Viral Sharing** - Native share, Twitter, Email integration
- **Referral System** - Track and incentivize referrals
- **Viral Coefficient** - K-factor tracking for growth metrics

### 💳 Monetization
- **Stripe Integration** - Subscription billing
- **Multiple Plans** - Free, Pro, Enterprise
- **Webhook Sync** - Real-time subscription management

### 📊 Analytics
- **Growth Dashboard** - Real-time metrics
- **User Tracking** - Total users, paid users, conversion rate
- **MRR Tracking** - Monthly recurring revenue
- **Viral Metrics** - Referral performance

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Billing**: Stripe
- **Analytics**: Recharts
- **Deployment**: Vercel

## Project Structure

```
privacy-intelligence-saas/
├── app/
│   ├── page.tsx           # Landing page with scan
│   └── dashboard.tsx      # Growth dashboard
├── components/ui/         # Reusable UI components
├── engine/
│   ├── scanEngine.ts      # WebRTC, DNS, VPN detection
│   ├── riskEngine.ts      # Risk scoring logic
│   └── viralEngine.ts     # Sharing & referral system
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── stripe.ts          # Stripe configuration
│   └── auth.ts            # Auth helpers
├── api/
│   ├── checkout.ts        # Stripe checkout endpoint
│   └── webhook.ts         # Stripe webhook handler
└── db/
    └── schema.sql         # Database schema
```

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Stripe account

### Installation

1. Clone repository
```bash
git clone <repo-url>
cd privacy-intelligence-saas
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your credentials:
- Supabase URL and keys
- Stripe publishable and secret keys
- Webhook secret

4. Initialize database
```bash
sqlx database create
sqlx migrate run
```

5. Run development server
```bash
npm run dev
```

Visit `http://localhost:3000`

## API Endpoints

### POST `/api/checkout`
Create Stripe checkout session

```json
{
  "planId": "price_...",
  "userId": "user_id"
}
```

### POST `/api/webhook`
Stripe webhook handler (auto-syncs subscriptions)

## Database Schema

### Tables
- `user_profiles` - User metadata
- `security_logs` - Scan results
- `subscriptions` - Billing status
- `referrals` - Viral loop tracking
- `growth_analytics` - Daily metrics
- `payment_events` - Payment audit trail

## Business Metrics

### Key Performance Indicators
- **Users**: Total registered users
- **MRR**: Monthly recurring revenue
- **Conversion Rate**: Free → Paid users
- **Viral Coefficient**: Referrals per user (K-factor)
- **Churn Rate**: Monthly inactive rate
- **LTV**: Customer lifetime value

## Growth Strategy

1. **Free Scan Hook** - Viral entry point
2. **Risk Shock** - Compelling result
3. **Share Incentive** - Native sharing
4. **Referral Loop** - K-factor > 1
5. **Premium Upsell** - Convert to paid
6. **Retention** - Keep users engaged

## Deployment

### Vercel (Frontend)
```bash
vercel deploy
```

### Supabase (Backend)
- Run migrations in Supabase dashboard
- Configure RLS policies
- Set up webhooks

## Future Enhancements

- [ ] AI anomaly detection
- [ ] Browser extension
- [ ] Mobile app
- [ ] Advanced API
- [ ] Team features
- [ ] Compliance reports

## License

MIT
