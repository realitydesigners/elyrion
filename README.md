# Elyrion Platform

A custom-built learning platform and community hub for bi-monthly classes, live streaming, and content archiving. Built to replace unreliable third-party platforms with a stable, purpose-built solution.

## Project Vision

Elyrion is designed as a "digital temple"—a central hub where members can:
- Access a central archive of knowledge (like a library)
- Specialize in specific fields of study (in different "rooms")
- Contribute their own experiences and learnings back into a "living archive"
- Participate in live streaming classes with interactive features

## Current Status

**Phase 1 (MVP) - COMPLETE** ✅
- User authentication with Supabase
- Subscription management with Stripe
- Live streaming with LiveKit (host and viewer)
- Real-time chat during live sessions
- Archive system with video comments
- Dashboard for subscription management
- Route protection and access control

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Live Streaming**: LiveKit
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Features Implemented

### Authentication & Authorization

- ✅ Supabase authentication integration
- ✅ Google OAuth sign-in
- ✅ Email magic link sign-in
- ✅ Protected routes with middleware
- ✅ Teacher role system (host route protection)
- ✅ Session management with cookie-based auth

**Protected Routes:**
- `/live` - Requires authentication + active subscription
- `/host` - Requires authentication + teacher role
- `/archive` - Requires authentication + active subscription
- `/dashboard` - Requires authentication
- `/pricing` - Requires authentication
- `/account` - Requires authentication

### Subscription Management

- ✅ Stripe Checkout integration
- ✅ Monthly ($29/mo) and Annual ($290/yr) plans
- ✅ Webhook handler for subscription events
- ✅ Subscription status tracking in database
- ✅ Billing portal integration for subscription management
- ✅ Automatic access control based on subscription status

**Subscription Flow:**
1. User signs in
2. User visits `/pricing` and selects a plan
3. Redirected to Stripe Checkout
4. After payment, redirected to `/dashboard`
5. Webhook creates subscription record
6. User gains access to `/live` and `/archive`

### Live Streaming

- ✅ LiveKit integration for video/audio streaming
- ✅ Host page (`/host`) with broadcasting controls
- ✅ Viewer page (`/live`) with video grid
- ✅ Screen sharing capability for hosts
- ✅ Camera and microphone controls
- ✅ **Audio publishing enabled for all users** - viewers can speak and be heard by everyone
- ✅ Real-time video/audio rendering

**Host Features:**
- Toggle microphone on/off
- Toggle camera on/off
- Screen sharing
- Copy viewer link
- Leave session

**Viewer Features:**
- Watch live stream
- Toggle microphone to speak (heard by all)
- Real-time chat
- View multiple video tracks (screen share + camera)

### Real-Time Chat

- ✅ Live chat during streaming sessions
- ✅ Supabase Realtime for instant message delivery
- ✅ Chat history persistence
- ✅ User identification in messages
- ✅ Auto-scroll to latest messages

### Archive System

- ✅ Archive listing page (`/archive`)
- ✅ Video detail pages with comments
- ✅ Persistent commenting on archived videos
- ✅ Real-time comment updates
- ✅ Topic categorization (prepared for future use)

### Dashboard

- ✅ Subscription status display
- ✅ Plan information and renewal date
- ✅ Quick access to live classes
- ✅ Links to archive and other features
- ✅ Success message after payment
- ✅ Clear call-to-action for subscription if inactive

## Database Schema

### Tables

**`videos`**
- Stores video metadata
- Fields: `id`, `title`, `topic`, `created_at`

**`chat_messages`**
- Live chat messages during streaming
- Fields: `id`, `room`, `user_id`, `user_name`, `message`, `created_at`

**`video_comments`**
- Comments on archived videos
- Fields: `id`, `video_id`, `user_id`, `user_name`, `comment`, `created_at`

**`subscriptions`**
- User subscription records
- Fields: `id`, `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `status`, `plan_type`, `current_period_end`, `created_at`, `updated_at`

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Users can read public content
- Users can write their own data
- Subscriptions are user-specific

## API Routes

### Authentication
- `GET /api/auth/callback` - OAuth callback handler

### Stripe
- `POST /api/checkout` - Create Stripe Checkout session
- `POST /api/billing-portal` - Create Stripe Customer Portal session
- `POST /api/webhooks/stripe` - Handle Stripe webhook events

### LiveKit
- `GET /api/livekit/token` - Generate LiveKit access tokens
  - Query params: `role` (host/viewer), `room` (optional)
  - Requires authentication
  - Host role requires teacher email

## Environment Variables

Create a `.env.local` file with the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_ANNUAL=price_...

# LiveKit
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# Teacher Access
TEACHER_EMAILS=teacher1@example.com,teacher2@example.com

# Optional
NEXT_PUBLIC_SITE_URL=https://yourdomain.com (for production)
```

## Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Execute supabase/schema.sql in Supabase SQL Editor
```

This creates:
- All required tables
- Row Level Security policies
- Realtime subscriptions

### 2. Stripe Configuration

1. **Create Products & Prices:**
   - Go to Stripe Dashboard → Products
   - Create "Monthly Plan" - $29/month recurring
   - Create "Annual Plan" - $290/year recurring
   - Copy the Price IDs to your `.env.local`

2. **Set Up Webhook:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

3. **Test Mode:**
   - Use test API keys for development
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date, any CVC

### 3. LiveKit Setup

1. Set up a LiveKit server (cloud or self-hosted)
2. Get your server URL, API key, and secret
3. Add to environment variables

### 4. Install Dependencies

```bash
bun install
```

### 5. Run Development Server

```bash
bun dev
```

## Project Structure

```
elyrion/
├── src/
│   ├── app/
│   │   ├── (app)/              # Protected app routes
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── live/           # Live streaming viewer
│   │   │   ├── host/           # Live streaming host
│   │   │   ├── archive/        # Video archive
│   │   │   ├── pricing/        # Subscription plans
│   │   │   └── account/        # Account management
│   │   ├── (auth)/             # Auth routes
│   │   │   └── sign-in/        # Sign in page
│   │   └── api/                # API routes
│   │       ├── auth/           # Auth callbacks
│   │       ├── checkout/       # Stripe checkout
│   │       ├── billing-portal/ # Stripe portal
│   │       ├── webhooks/       # Stripe webhooks
│   │       └── livekit/       # LiveKit tokens
│   ├── components/            # React components
│   ├── lib/                    # Utilities
│   │   ├── auth.ts            # Auth helpers
│   │   └── supabase/          # Supabase clients
│   └── utils/                  # Helper functions
├── supabase/
│   └── schema.sql             # Database schema
├── middleware.ts              # Route protection
└── package.json
```

## User Flows

### New User Onboarding

1. User visits site → redirected to `/sign-in`
2. Signs in with Google or email
3. Redirected to `/dashboard`
4. Sees "No Active Subscription" message
5. Clicks "Subscribe Now" → goes to `/pricing`
6. Selects plan → redirected to Stripe Checkout
7. Completes payment → redirected to `/dashboard?session_id=...`
8. Webhook processes payment → subscription created
9. Dashboard shows active subscription
10. Can now access `/live` and `/archive`

### Joining a Live Class

1. User with active subscription visits `/live`
2. Middleware verifies subscription
3. LiveKit token generated
4. User connects to LiveKit room
5. Can see host's video/audio
6. Can toggle microphone to speak
7. Can participate in real-time chat
8. All participants hear each other's audio

### Hosting a Class

1. Teacher (email in `TEACHER_EMAILS`) visits `/host`
2. Middleware verifies teacher role
3. LiveKit token generated with publish permissions
4. Host can enable camera/microphone
5. Host can share screen
6. Host can copy viewer link to share
7. Viewers join via `/live` route

## Known Limitations & Future Work

### Phase 2 (Planned)
- [ ] Advanced content organization by topic
- [ ] Rich content uploads (PDFs, articles)
- [ ] User profiles with activity tracking
- [ ] Dedicated community forum
- [ ] Search functionality for archive

### Phase 3 (Future)
- [ ] User contribution system
- [ ] Advanced user roles (elevate members to teachers)
- [ ] Personalized onboarding based on interests
- [ ] Automatic recording and VOD processing
- [ ] Video player for archived content

### Current Limitations
- Archive page uses placeholder data (not connected to real videos)
- No automatic recording from LiveKit (manual setup required)
- Video player on archive detail page is placeholder
- No email notifications for upcoming classes
- No class scheduling system

## Development Notes

### Authentication
- Uses Supabase SSR for server-side auth
- Client-side uses Supabase client for real-time features
- Middleware protects routes at the edge
- Layouts provide additional server-side checks

### Subscription Status
- Checked in middleware for protected routes
- Cached in database, updated via webhooks
- Status: `active`, `canceled`, `past_due`, etc.

### LiveKit Integration
- All users (host and viewers) can publish audio
- Host can publish video and screen share
- Viewers can only publish audio (no video)
- Room name defaults to "elyrion-class" (can be customized)

## Testing

### Test Stripe Flow
1. Use test mode API keys
2. Use test card: `4242 4242 4242 4242`
3. Complete checkout
4. Verify webhook receives events
5. Check database for subscription record
6. Verify dashboard shows active subscription

### Test Live Streaming
1. Open `/host` as teacher
2. Enable camera/microphone
3. Open `/live` in another browser/incognito
4. Verify video/audio works
5. Test microphone toggle on viewer
6. Verify chat works

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy

### Environment Variables for Production
- Use `sk_live_...` for Stripe
- Use production LiveKit server
- Set `NEXT_PUBLIC_SITE_URL` to your domain
- Update webhook URL in Stripe dashboard

## Support & Maintenance

### Monitoring
- Check Stripe Dashboard for failed payments
- Monitor Supabase logs for auth issues
- Check LiveKit server status
- Review webhook delivery in Stripe

### Common Issues
- **Subscription not showing**: Check webhook delivery, verify database record
- **Can't access live route**: Verify subscription status in database
- **Host route blocked**: Verify email is in `TEACHER_EMAILS`
- **LiveKit connection fails**: Check API keys and server URL

## License

Private - All rights reserved

## Contact

For questions or issues, contact the development team.
