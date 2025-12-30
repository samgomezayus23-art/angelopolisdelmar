# Cartagena Tourist Rentals - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Supabase account
- Stripe account

## Setup Steps

### 1. Install Dependencies
```bash
cd /Users/samgom23/.gemini/antigravity/scratch/cartagena-rentals
npm install
```

### 2. Configure Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Get your project URL and keys from Settings > API

### 3. Configure Stripe
1. Get your API keys from [stripe.com/dashboard/apikeys](https://dashboard.stripe.com/apikeys)
2. Use test keys for development

### 4. Environment Variables
Create a `.env.local` file (use `env.example` as template):
```bash
cp env.example .env.local
```

Fill in your actual values:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Adding Your First Property

1. Go to your Supabase dashboard
2. Open the `properties` table
3. Insert a new row with:
   - name: "Beautiful Cartagena Apartment"
   - description: "Stunning apartment in the historic center"
   - max_guests: 4
   - bedrooms: 2
   - bathrooms: 2
   - base_price: 150
   - cleaning_fee: 50
   - is_active: true

## iCal Synchronization (Optional)

To sync with Airbnb:
1. Get your iCal URL from Airbnb (Calendar > Availability Settings > Export Calendar)
2. In Supabase, add a row to `ical_feeds` table:
   - property_id: (your property ID)
   - platform: "airbnb"
   - feed_url: (your iCal URL)
   - sync_enabled: true
3. Use the Admin panel to trigger sync

## Testing Payments

Use Stripe test card:
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

## Project Structure

```
cartagena-rentals/
├── app/
│   ├── api/              # API routes
│   ├── properties/       # Property pages
│   ├── booking/          # Booking checkout
│   ├── admin/            # Admin dashboard
│   └── page.tsx          # Landing page
├── components/           # Reusable components
├── lib/                  # Utilities and services
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe client
│   ├── booking-engine.ts # Booking logic
│   └── ical-sync.ts      # iCal synchronization
└── supabase-schema.sql   # Database schema
```

## Next Steps

1. Add real property images
2. Configure iCal feeds for Airbnb sync
3. Set up automated sync (cron job or Supabase Edge Functions)
4. Add email notifications
5. Deploy to production (Vercel recommended)
