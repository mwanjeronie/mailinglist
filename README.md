# Events Mailing List Platform

A complete, production-ready mailing list platform for managing event subscriptions with sophisticated admin features and proper unsubscribe logic.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black)

**🌐 Live:** [maillist.winjo.xyz](https://maillist.winjo.xyz) | **🔗 Vercel:** [mailinglist-amber.vercel.app](https://mailinglist-amber.vercel.app)

> **🚀 Want to Deploy?** → **[START HERE](./START_HERE.md)** - Your quick start guide!  
> **📚 Looking Around?** → [Documentation Index](./DOCUMENTATION_INDEX.md) for all guides  
> **🌐 Custom Domain?** → [Custom Domain Setup Guide](./CUSTOM_DOMAIN_SETUP.md)

## Features at a Glance

✅ **Beautiful Mailing List Signup**
- Email subscription with validation
- 6 event type selections
- 8 topic selections
- Real-time form feedback

✅ **Suggestion System**
- Users suggest new event types
- Users suggest new topics
- Optional descriptions
- All stored for admin review

✅ **Secure Unsubscribe**
- Token-based verification
- Soft delete (data preservation)
- Prevents unauthorized unsubscribes
- Graceful error handling

✅ **Powerful Admin Dashboard**
- Password-protected access
- Real-time subscriber table
- Multi-filter capabilities (status, types, topics)
- CSV export with filters
- Clean, intuitive interface

✅ **Enterprise-Grade Security**
- Token-based authentication
- Server-side validation
- Database constraints
- Crypto-secure tokens
- Soft deletes for data integrity

## Quick Links

### 🚀 Deployment (Start Here!)
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment (15 min)
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Printable task list
- **[Quick Deploy](./QUICK_DEPLOY.md)** - Fast reference for updates

### 📖 Documentation
- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Navigate all docs easily
- **[Features](./FEATURES.md)** - Complete feature documentation
- **[Architecture](./ARCHITECTURE.md)** - System design & data flow
- **[Setup Guide](./SETUP.md)** - Detailed setup instructions
- **[Quick Start](./QUICKSTART.md)** - Get running in 5 minutes

### 🔄 Migration & Changes
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Newsletter → mailing list migration
- **[Changes Summary](./CHANGES_SUMMARY.md)** - Complete change log

## What's Included

### Pages
- **Homepage** (`/`) - Mailing list signup form
- **Suggestions** (`/suggest`) - Submit event types and topics
- **Unsubscribe** (`/unsubscribe`) - Token-verified unsubscribe
- **Admin** (`/admin`) - Subscriber management dashboard

### API Endpoints
- **POST /api/mailinglist** - Subscribe to mailing list
- **POST /api/suggestions** - Submit suggestions
- **POST /api/unsubscribe** - Unsubscribe with token
- **GET /api/admin/subscribers** - Admin data access

### Database Tables
- `mailinglist_subscribers` - Subscriber data with tokens
- `event_type_suggestions` - Event type suggestions
- `topic_suggestions` - Topic suggestions

### Components
- `MailingListForm` - Signup form component
- `SuggestionForm` - Suggestion form component
- `AdminDashboard` - Admin interface component

### Configuration
- `lib/mailinglist-config.ts` - Easy event types & topics management

## Technology Stack

- **Framework**: Next.js 16 with React 19.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Complete Deployment (First Time Users)

📖 **Follow the [Step-by-Step Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete walkthrough for deploying to production (10-15 minutes)

### Quick Deploy (Experienced Users)

⚡ **Use the [Quick Deploy Reference](./QUICK_DEPLOY.md)** - Fast commands and reference

### Quick Summary

1. **Create Supabase project** → Run `scripts/setup-mailinglist.sql`
2. **Push to GitHub** → Connect to Vercel
3. **Set 3 environment variables** in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
4. **Deploy** → Test at your-app.vercel.app

**Detailed instructions**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## File Structure

```
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   │
│   ├── suggest/
│   │   └── page.tsx          # Suggestion form
│   │
│   ├── unsubscribe/
│   │   ├── page.tsx          # Unsubscribe page
│   │   └── layout.tsx        # Suspense wrapper
│   │
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   │
│   └── api/
│       ├── mailinglist/
│       │   └── route.ts      # Signup endpoint
│       ├── suggestions/
│       │   └── route.ts      # Suggestions endpoint
│       ├── unsubscribe/
│       │   └── route.ts      # Unsubscribe endpoint
│       └── admin/
│           └── subscribers/
│               └── route.ts  # Admin endpoint
│
├── components/
│   ├── mailinglist-form.tsx  # Signup form
│   ├── suggestion-form.tsx   # Suggestion form
│   ├── admin-dashboard.tsx   # Admin interface
│   └── ui/                   # shadcn/ui components
│
├── lib/
│   ├── mailinglist-config.ts # Event types & topics
│   └── utils.ts              # Utility functions
│
├── public/                   # Static assets
│
├── scripts/
│   ├── setup-mailinglist.sql # Database setup
│   └── migrate-newsletter-to-mailinglist.sql # Migration script
│
└── docs/
    ├── README.md             # This file
    ├── QUICKSTART.md         # Quick start guide
    ├── SETUP.md              # Setup instructions
    ├── FEATURES.md           # Feature details
    ├── ARCHITECTURE.md       # System design
    └── DEPLOYMENT.md         # Deployment checklist
```

## Usage Examples

### Add a Subscriber
```bash
curl -X POST https://yourdomain.com/api/mailinglist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "event_types": ["Conferences", "Workshops"],
    "topics": ["Technology", "AI & ML"]
  }'
```

### Get All Subscribers (Admin)
```bash
curl -X GET https://yourdomain.com/api/admin/subscribers \
  -H "Authorization: Bearer your-admin-password"
```

### Unsubscribe
```bash
curl -X POST https://yourdomain.com/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"token": "subscriber-token"}'
```

## Customization

### Change Event Types & Topics
Edit `lib/mailinglist-config.ts`:
```typescript
export const EVENT_TYPES = [
  'Your Event Type 1',
  'Your Event Type 2',
  // ...
];

export const TOPICS = [
  'Your Topic 1',
  'Your Topic 2',
  // ...
];
```

### Change Colors & Styling
Edit Tailwind classes in component files:
- `components/mailinglist-form.tsx`
- `components/suggestion-form.tsx`
- `components/admin-dashboard.tsx`
- `app/page.tsx`

### Add More Admin Features
Extend `AdminDashboard` component:
- Add new columns to table
- Add new filter types
- Add bulk actions
- Add subscriber search

## Database Schema

### mailinglist_subscribers
```sql
CREATE TABLE mailinglist_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  event_types TEXT[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}',
  unsubscribe_token VARCHAR(64) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes
- `idx_mailinglist_email` on email column
- `idx_mailinglist_token` on unsubscribe_token column

## Security Features

1. **Token-Based Unsubscribe**
   - Cryptographically secure 64-char tokens
   - One-time use validation
   - Prevents unauthorized unsubscribes

2. **Admin Authentication**
   - Bearer token in Authorization header
   - Environment variable protected
   - Never exposed in client code

3. **Input Validation**
   - Client-side form validation
   - Server-side validation on all endpoints
   - Email format verification
   - Selection requirement checks

4. **Database Security**
   - UNIQUE constraints
   - NOT NULL constraints
   - INDEXED columns
   - Soft deletes (no data loss)

5. **Data Privacy**
   - Soft delete (marks as inactive)
   - Preserved subscriber data
   - Clear unsubscribe audit trail

## Performance

- **Database**: Indexed queries on email & token
- **Frontend**: Optimized React components
- **CSV Export**: Client-side generation
- **Load Time**: < 3 seconds (with good connection)
- **Scalability**: Handles thousands of subscribers

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## API Response Formats

### Success (201/200)
```json
{
  "message": "Successfully subscribed to mailing list!",
  "data": { ... }
}
```

### Error (400/500)
```json
{
  "error": "Error message explaining what went wrong"
}
```

## Error Handling

- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Authentication failed
- **404 Not Found**: Resource not found
- **500 Server Error**: Database or server issue

All errors include descriptive messages.

## Monitoring & Logging

### What to Monitor
- Subscription rate
- Unsubscribe rate
- Suggestion submissions
- Admin access attempts
- Error rates
- API response times

### Logging
Enable in Vercel Analytics dashboard to track:
- Page views
- API calls
- Error rates
- User interactions

## Support & Troubleshooting

### Common Issues

**"This email is already subscribed"**
- User exists in database
- They can unsubscribe and resubscribe
- Or contact support to update preferences

**Admin "401 Unauthorized"**
- Check password is correct
- Verify ADMIN_PASSWORD is set in Vercel
- Wait 1-2 minutes for deployment

**Unsubscribe link doesn't work**
- Verify token is correct
- Check token exists in database
- Ensure URL format is correct

See **SETUP.md** and **DEPLOYMENT.md** for more troubleshooting.

## Future Enhancement Ideas

- Email confirmation flow
- Subscriber preference management
- Email scheduling
- Email templates
- Campaign analytics
- Segment-based campaigns
- A/B testing
- Bulk subscriber import

## Contributing

Feel free to:
- Extend functionality
- Improve UI/UX
- Add new features
- Fix bugs
- Improve documentation

## License

MIT License - see LICENSE file for details

## Support

- **Docs**: See documentation files
- **Issues**: Check GitHub issues
- **Vercel Help**: vercel.com/help
- **Supabase Docs**: supabase.com/docs

---

## Next Steps

1. **Deploy**: Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (first time)
2. **Quick Reference**: Use [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) (updates)
3. **Customize**: Edit `lib/mailinglist-config.ts`
4. **Learn**: Read [FEATURES.md](./FEATURES.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)
5. **Monitor**: Track subscriber metrics in admin dashboard

**Questions?** Check the comprehensive documentation files included.

---

Made with ❤️ for event organizers and mailing list managers.

**Current Version**: 1.0.0
**Last Updated**: February 2026
**Status**: Production Ready ✅
