# Step-by-Step Deployment Guide

**Complete guide to deploy your Events Mailing List Platform to production**

---

## Deployment Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PROCESS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Part 1: SUPABASE (Database)                               │
│  ├─ Create project (2 min)                                 │
│  ├─ Run SQL setup script (1 min)                          │
│  └─ Copy credentials (1 min)                              │
│                                                             │
│  Part 2: VERCEL (Frontend + API)                          │
│  ├─ Push code to GitHub (1 min)                           │
│  ├─ Import to Vercel (1 min)                              │
│  ├─ Add environment variables (2 min)                      │
│  └─ Deploy! (2-3 min)                                      │
│                                                             │
│  Part 3: VERIFY                                            │
│  ├─ Test subscription (1 min)                              │
│  ├─ Check admin dashboard (1 min)                         │
│  └─ Test all features (2 min)                             │
│                                                             │
│  ✅ TOTAL TIME: ~15 minutes                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before you begin, make sure you have:

- [ ] A GitHub account
- [ ] A Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] A Supabase account (sign up at [supabase.com](https://supabase.com))
- [ ] This codebase pushed to a GitHub repository

---

## Part 1: Database Setup (Supabase)

### Step 1.1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Fill in the details:
   - **Name**: `mailinglist` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Select "Free" tier to start
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be ready

### Step 1.2: Run Database Migration

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the contents of `scripts/setup-mailinglist.sql`:

```sql
-- Create mailinglist_subscribers table
CREATE TABLE mailinglist_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  event_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  unsubscribe_token VARCHAR(64) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_mailinglist_email ON mailinglist_subscribers(email);
CREATE INDEX idx_mailinglist_token ON mailinglist_subscribers(unsubscribe_token);

-- Create event_type_suggestions table
CREATE TABLE event_type_suggestions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  suggested_type VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topic_suggestions table
CREATE TABLE topic_suggestions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  suggested_topic VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
5. You should see: ✅ **"Success. No rows returned"**

### Step 1.3: Verify Tables Created

1. Click **"Table Editor"** in the left sidebar
2. You should see three tables:
   - ✅ `mailinglist_subscribers`
   - ✅ `event_type_suggestions`
   - ✅ `topic_suggestions`

### Step 1.4: Get Supabase Credentials

1. Click **"Settings"** (⚙️ icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll need two values:

   **Copy these somewhere safe:**
   
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - Found under "Project URL"
   
   - **Service Role Key** (secret!)
     - Found under "Project API keys" → `service_role` key
     - Click **"Reveal"** to see it
     - ⚠️ Keep this secret! Never commit to git!

---

## Part 2: Deploy to Vercel

### Step 2.1: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Mailing list platform"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2.2: Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your GitHub repository and click **"Import"**

### Step 2.3: Configure Project Settings

On the "Configure Project" screen:

1. **Framework Preset**: Should auto-detect as **"Next.js"** ✅
2. **Root Directory**: Leave as **"./"**
3. **Build Command**: Leave default (`next build`)
4. **Output Directory**: Leave default (`.next`)

**Don't click Deploy yet!** ⚠️

### Step 2.4: Add Environment Variables

Still on the same screen, scroll down to **"Environment Variables"**:

1. Click **"Add"** for the first variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL
   - Click checkbox for all environments (Production, Preview, Development)

2. Click **"Add"** for the second variable:
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Paste your Supabase Service Role Key
   - Click checkbox for all environments

3. Click **"Add"** for the third variable:
   - **Key**: `ADMIN_PASSWORD`
   - **Value**: Create a strong password for admin access (e.g., `MySecureAdmin2024!`)
   - Click checkbox for all environments

**You should have 3 environment variables total.**

### Step 2.5: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for the build to complete
3. You'll see: 🎉 **"Congratulations!"** when it's done

### Step 2.6: Get Your Live URL

1. Click **"Continue to Dashboard"**
2. At the top, you'll see your live URL (e.g., `your-project.vercel.app`)
3. Click the URL to visit your live site!

---

## Part 3: Verify Deployment

### Step 3.1: Test Homepage

1. Visit your Vercel URL
2. You should see:
   - ✅ "Never Miss an Event" heading
   - ✅ Email input field
   - ✅ Event type buttons
   - ✅ Topic buttons
   - ✅ "Subscribe to Mailing List" button

### Step 3.2: Test Subscription

1. Enter a test email (e.g., `test@example.com`)
2. Select at least one event type (e.g., "Conferences")
3. Select at least one topic (e.g., "Technology")
4. Click **"Subscribe to Mailing List"**
5. You should see: ✅ Green success message

### Step 3.3: Verify Data in Supabase

1. Go back to Supabase dashboard
2. Click **"Table Editor"**
3. Click **"mailinglist_subscribers"**
4. You should see your test email in the table ✅

### Step 3.4: Test Admin Dashboard

1. Visit: `https://your-project.vercel.app/admin`
2. Enter the admin password you set in Step 2.4
3. Click **"Access Dashboard"**
4. You should see:
   - ✅ Your test subscriber in the table
   - ✅ Filter options
   - ✅ Export CSV button

### Step 3.5: Test CSV Export

1. In the admin dashboard, click **"Export CSV"**
2. A CSV file should download
3. Open it - you should see your subscriber data

### Step 3.6: Test Unsubscribe (Manual)

1. In Supabase, go to **"Table Editor"** → **"mailinglist_subscribers"**
2. Find your test subscriber
3. Copy their `unsubscribe_token` value
4. Visit: `https://your-project.vercel.app/unsubscribe?token=PASTE_TOKEN_HERE`
5. You should see: ✅ "Unsubscribed" success message
6. Refresh Supabase table - `is_active` should now be `false`

### Step 3.7: Test Suggestions

1. Visit: `https://your-project.vercel.app/suggest`
2. Fill in the form:
   - Email: `test@example.com`
   - Select: "Event Type"
   - Name: "Hackathons"
   - Description: (optional)
3. Click **"Submit Suggestion"**
4. You should see: ✅ Green success message
5. In Supabase, check **"event_type_suggestions"** table - your suggestion should be there

---

## Part 4: Custom Domain (Optional)

### Step 4.1: Add Custom Domain

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Enter your domain (e.g., `events.yourdomain.com`)
4. Click **"Add"**

### Step 4.2: Configure DNS

Follow Vercel's instructions to add DNS records with your domain provider:

- Usually an **A record** or **CNAME record**
- Wait 5-60 minutes for DNS propagation

### Step 4.3: SSL Certificate

- Vercel automatically provisions SSL certificates
- Your site will be available at `https://yourdomain.com`

---

## Part 5: Post-Deployment Setup

### Step 5.1: Customize Event Types & Topics

1. In your code editor, open `lib/mailinglist-config.ts`
2. Edit the arrays:

```typescript
export const EVENT_TYPES = [
  'Your Custom Event Type 1',
  'Your Custom Event Type 2',
  // Add more...
];

export const TOPICS = [
  'Your Custom Topic 1',
  'Your Custom Topic 2',
  // Add more...
];
```

3. Save, commit, and push:

```bash
git add .
git commit -m "Customize event types and topics"
git push
```

4. Vercel auto-deploys in ~2 minutes

### Step 5.2: Set Up Email Service (Optional but Recommended)

To actually send emails to subscribers:

**Option A: SendGrid**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get API key
3. Add to Vercel environment variables: `SENDGRID_API_KEY`

**Option B: Mailgun**
1. Sign up at [mailgun.com](https://mailgun.com)
2. Get API key
3. Add to Vercel environment variables: `MAILGUN_API_KEY`

**Option C: Resend**
1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to Vercel environment variables: `RESEND_API_KEY`

Then create an email template that includes:
- Unsubscribe link: `https://yourdomain.com/unsubscribe?token=${subscriber.unsubscribe_token}`

### Step 5.3: Monitor Your Application

**In Vercel Dashboard:**
1. Click **"Analytics"** - See page views, performance
2. Click **"Logs"** - View real-time application logs
3. Click **"Speed Insights"** - Monitor performance

**In Supabase Dashboard:**
1. Click **"Database"** → **"Reports"** - See query performance
2. Click **"Table Editor"** - Monitor subscriber growth
3. Set up **"Database Webhooks"** for real-time notifications (optional)

---

## Part 6: Maintenance & Updates

### How to Update Your Application

```bash
# Make your changes in code
# Test locally if you have Node.js installed:
npm install
npm run dev
# Visit http://localhost:3000

# When ready, commit and push:
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys in ~2 minutes
```

### How to View Suggestions

1. Go to Supabase → **"Table Editor"**
2. View **"event_type_suggestions"** table
3. View **"topic_suggestions"** table
4. Review submissions and add popular ones to your config

### How to Backup Database

1. In Supabase, click **"Database"** → **"Backups"**
2. Daily backups are automatic on Free tier (7 days retention)
3. Pro tier: 30 days retention + point-in-time recovery

### How to Export All Subscribers

1. Go to Supabase → **"Table Editor"**
2. Click **"mailinglist_subscribers"**
3. Click **"..."** menu → **"Export to CSV"**

Or use the admin dashboard CSV export feature.

---

## Troubleshooting

### Issue: "Failed to subscribe"

**Possible causes:**
1. Environment variables not set correctly
   - Go to Vercel → Settings → Environment Variables
   - Verify all 3 variables are present
   - Redeploy: Deployments → ⋯ → Redeploy

2. Database not set up
   - Check Supabase → Table Editor
   - Verify `mailinglist_subscribers` table exists

3. Supabase credentials wrong
   - Verify Project URL and Service Role Key
   - Re-check in Supabase → Settings → API

### Issue: "Unauthorized" on Admin Page

**Solution:**
1. Verify `ADMIN_PASSWORD` is set in Vercel
2. Clear browser cache and try again
3. Wait 2 minutes after changing env vars, then redeploy

### Issue: Page Shows Build Errors

**Solution:**
1. Check Vercel deployment logs
2. Common issues:
   - Missing dependencies: `npm install` locally first
   - TypeScript errors: Fix in code editor
   - Build command wrong: Should be `next build`

### Issue: Unsubscribe Link Doesn't Work

**Solution:**
1. Verify token is correct (check Supabase table)
2. Check URL format: `/unsubscribe?token=XXX`
3. Check browser console for errors

### Issue: Vercel Domain Not Working

**Solution:**
1. DNS propagation can take up to 48 hours
2. Verify DNS records with your domain provider
3. Check Vercel → Settings → Domains for status

---

## Security Checklist

Before going live:

- [ ] `ADMIN_PASSWORD` is strong and secure
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not exposed in code
- [ ] Never commit `.env.local` to git
- [ ] `.gitignore` includes `.env*.local`
- [ ] Supabase Row Level Security enabled (optional but recommended)
- [ ] Admin page is password-protected
- [ ] Unsubscribe tokens are cryptographically secure

---

## Performance Optimization

### Enable Vercel Analytics

1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. Click **"Enable Analytics"**
4. Free tier: 2,500 events/month

### Enable Caching

1. In Vercel dashboard
2. Go to **Settings** → **Edge Functions**
3. Enable **"Edge Caching"** if available

### Optimize Images

If you add images later:
- Use Next.js `<Image>` component
- Store images in `/public` folder
- Vercel automatically optimizes them

---

## Cost Breakdown

### Free Tier Limits

**Vercel (Free):**
- 100GB bandwidth/month
- 100GB hours function execution
- Unlimited projects
- ✅ Perfect for starting out

**Supabase (Free):**
- 500MB database space
- 2GB bandwidth
- 50,000 monthly active users
- ✅ Enough for thousands of subscribers

### When to Upgrade

**Vercel Pro ($20/month):**
- When you exceed bandwidth
- Need faster builds
- Want team collaboration

**Supabase Pro ($25/month):**
- When you exceed 500MB database
- Need daily backups beyond 7 days
- Want better support

---

## Success Metrics to Track

1. **Subscriber Growth**
   - Total subscribers
   - Active vs. inactive
   - Growth rate (weekly/monthly)

2. **Event Type Popularity**
   - Which types get selected most
   - Use admin filters to analyze

3. **Topic Preferences**
   - Most popular topics
   - Topic combinations

4. **Engagement**
   - Subscription rate (visitors → subscribers)
   - Unsubscribe rate
   - Suggestion submissions

5. **Technical Metrics**
   - Page load time (Vercel Analytics)
   - API response times (Vercel Logs)
   - Error rates

---

## Next Steps

Now that you're deployed:

1. ✅ Share your URL with users
2. ✅ Start collecting subscribers
3. ✅ Monitor suggestions weekly
4. ✅ Set up email service to send campaigns
5. ✅ Track your metrics
6. ✅ Iterate based on user feedback

---

## Quick Reference

**Your URLs:**
- Homepage: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin`
- Suggestions: `https://your-project.vercel.app/suggest`
- Unsubscribe: `https://your-project.vercel.app/unsubscribe?token=XXX`

**Your Dashboards:**
- Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
- Supabase: [app.supabase.com](https://app.supabase.com)

**API Endpoints:**
- `POST /api/mailinglist` - Subscribe
- `POST /api/suggestions` - Submit suggestion
- `POST /api/unsubscribe` - Unsubscribe
- `GET /api/admin/subscribers` - Get all subscribers (requires auth)

---

## Support & Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

---

**🎉 Congratulations!** Your mailing list platform is now live!

Start building your community and tracking those event enthusiasts. 🚀
