# Quick Start Guide

Get your events newsletter up and running in 5 minutes.

## Step 1: Set Admin Password (2 minutes)

1. Open your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: Choose a strong password (e.g., `MyNewsletterAdmin2024!`)
5. Click **Save**

That's it! Your app is ready.

## Step 2: Test Locally (Optional)

If you want to test before deploying:

```bash
# Copy environment variable to .env.local
echo "ADMIN_PASSWORD=YOUR_PASSWORD_HERE" >> .env.local

# Run development server
npm run dev

# Visit http://localhost:3000
```

## Step 3: Test the App

### Test Signup
1. Go to `http://your-domain.vercel.app/`
2. Enter your email
3. Select event types and topics
4. Click "Subscribe to Newsletter"
5. You should see a success message

### Test Admin Dashboard
1. Go to `http://your-domain.vercel.app/admin`
2. Enter your `ADMIN_PASSWORD`
3. You should see the dashboard with subscribers

### Test Suggestion Form
1. On homepage, click "Suggest one →"
2. Fill out the suggestion form
3. Submit and verify success message

## Step 4: Send Unsubscribe Links

Your unsubscribe links will be in the format:
```
https://your-domain.vercel.app/unsubscribe?token=SUBSCRIBER_TOKEN
```

To get a subscriber's token:

1. Access admin dashboard (`/admin`)
2. The token is stored in the database (not visible in UI)
3. You can query it manually from Supabase dashboard

**To send via email service:**
- Create email template with link: `{unsubscribeUrl}?token={token}`
- Include this in your newsletter emails

## Step 5: Customize Event Types & Topics (Optional)

Want to change what events/topics you offer?

1. Open `lib/newsletter-config.ts`
2. Edit the arrays:
   ```typescript
   export const EVENT_TYPES = [
     'Your Event Type 1',
     'Your Event Type 2',
     // Add more...
   ];

   export const TOPICS = [
     'Your Topic 1',
     'Your Topic 2',
     // Add more...
   ];
   ```
3. Save and deploy

Changes will appear everywhere:
- Homepage form
- Admin filters
- CSV exports
- All validations

## Common Tasks

### Export Subscriber List

1. Go to `/admin`
2. Login with your password
3. (Optional) Apply filters
4. Click **Export CSV (X)**
5. File downloads with today's date

### View Suggestions

1. Open Supabase dashboard
2. Go to `event_type_suggestions` table
3. And `topic_suggestions` table
4. Review submissions from users

### Unsubscribe Someone

1. In Supabase dashboard
2. Find their row in `newsletter_subscribers`
3. Set `is_active` to `false`
4. They won't receive emails anymore

### Re-Subscribe Someone

1. Set their `is_active` back to `true`
2. Or generate a new unsubscribe token
3. They can use the signup form to update preferences

## Troubleshooting

### "This email is already subscribed"
**Solution**: User is already in database. They can:
- Unsubscribe first, then resubscribe
- Contact you to update preferences

### Admin dashboard shows 401 Unauthorized
**Solution**: 
1. Check your password is correct (case-sensitive)
2. Verify `ADMIN_PASSWORD` is set in Vercel environment variables
3. Wait 1-2 minutes for changes to deploy

### CSV export is empty
**Solution**:
1. Check "Showing X of Y subscribers" count
2. Apply filters that match some subscribers
3. Try exporting with no filters first

### Unsubscribe link doesn't work
**Solution**:
1. Verify the token is correct
2. Check token exists in database
3. Ensure URL is exactly: `/unsubscribe?token=XXX` (lowercase 'token')

### No data appears in admin dashboard
**Solution**:
1. Check subscribers exist in Supabase
2. Verify your password is correct
3. Try refreshing the page
4. Check browser console for errors

## API Usage

Need to integrate with your own system?

### Add Subscriber Programmatically
```bash
curl -X POST https://your-domain.vercel.app/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "event_types": ["Conferences", "Workshops"],
    "topics": ["Technology", "Business"]
  }'
```

### Get All Subscribers
```bash
curl -X GET https://your-domain.vercel.app/api/admin/subscribers \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD"
```

### Unsubscribe Programmatically
```bash
curl -X POST https://your-domain.vercel.app/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_HERE"
  }'
```

## Next Steps

1. **Monitor usage**: Check Vercel analytics
2. **Review suggestions**: Check Supabase for user suggestions
3. **Send emails**: Integrate with your email service (Mailgun, SendGrid, etc.)
4. **Customize design**: Edit colors/fonts in component files
5. **Add more features**: See FEATURES.md for possible enhancements

## Need Help?

- **Setup issues**: Check SETUP.md
- **Features overview**: Read FEATURES.md  
- **Deployment help**: See DEPLOYMENT.md
- **API docs**: Check route handlers in `app/api/`

## Files Overview

```
/app
  /admin           - Admin dashboard
  /suggest         - Suggestion form page
  /unsubscribe     - Unsubscribe page
  /api
    /newsletter    - Signup endpoint
    /suggestions   - Suggestion endpoint
    /unsubscribe   - Unsubscribe endpoint
    /admin         - Admin data endpoint

/components
  newsletter-form.tsx      - Signup form
  suggestion-form.tsx      - Suggestion form
  admin-dashboard.tsx      - Admin interface

/lib
  newsletter-config.ts     - Event types & topics

SETUP.md           - Full setup guide
FEATURES.md        - Feature documentation
DEPLOYMENT.md      - Deployment checklist
QUICKSTART.md      - This file!
```

---

**You're all set!** 🚀

Your newsletter is ready to accept subscribers. Share the homepage URL and start collecting interested users.
