# Events Newsletter Setup Guide

## Overview

This is a complete events newsletter application with:
- Email signup form with event type and topic filtering
- Suggestion form for new event types and topics
- Admin dashboard with CSV export capabilities
- Proper unsubscribe mechanism with token-based verification

## Environment Variables

You need to set one environment variable in your Vercel project:

### ADMIN_PASSWORD
The password needed to access the admin dashboard at `/admin`. Choose a strong, secure password.

**To add it:**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add a new variable named `ADMIN_PASSWORD` with your chosen password

## Database Setup

The database schema is automatically created by running the migration scripts:
- `scripts/setup-newsletter.sql` - Creates initial tables
- `scripts/add-features.sql` - Adds additional tables for suggestions and unsubscribe tokens

These scripts have already been executed.

## Database Tables

### newsletter_subscribers
- `id` - Unique identifier
- `email` - Subscriber email (unique)
- `event_types` - Array of selected event types
- `topics` - Array of selected topics
- `unsubscribe_token` - Token for secure unsubscribe links
- `is_active` - Boolean flag (true = subscribed, false = unsubscribed)
- `created_at` - Subscription timestamp
- `updated_at` - Last update timestamp

### event_type_suggestions
- `id` - Unique identifier
- `email` - Suggester's email
- `suggested_type` - The event type being suggested
- `description` - Optional description
- `created_at` - Submission timestamp

### topic_suggestions
- `id` - Unique identifier
- `email` - Suggester's email
- `suggested_topic` - The topic being suggested
- `description` - Optional description
- `created_at` - Submission timestamp

## Features

### Public Pages

#### Homepage (`/`)
- Email subscription form
- Event type selection (6 options)
- Topic selection (8 options)
- Email validation and duplicate prevention
- Success/error messaging

#### Suggestions (`/suggest`)
- Suggest new event types or topics
- Provide descriptions for suggestions
- All suggestions logged for admin review

#### Unsubscribe (`/unsubscribe?token=xyz`)
- Secure unsubscribe link (sent in emails)
- Token-based verification
- Soft delete (marks as inactive rather than removing)

### Admin Pages

#### Admin Dashboard (`/admin`)
- Password-protected access
- View all subscribers
- Filter by:
  - Status (Active/Inactive)
  - Event types (multiple selection)
  - Topics (multiple selection)
- Export filtered subscribers to CSV
- Real-time subscriber count

## How to Use

### For Subscribers

1. **Subscribe to Newsletter**
   - Visit homepage
   - Enter email
   - Select event types and topics
   - Submit

2. **Suggest New Options**
   - Click "Suggest one →" on homepage
   - Visit `/suggest`
   - Provide suggestion details

3. **Unsubscribe**
   - Click unsubscribe link in email
   - Token automatically validates subscription
   - Marked as inactive (can resubscribe)

### For Admins

1. **Access Dashboard**
   - Visit `/admin`
   - Enter your `ADMIN_PASSWORD`
   - View all subscriber data

2. **Filter Subscribers**
   - Select filters on left sidebar
   - View real-time results
   - Clear filters with "Clear Filters" button

3. **Export Data**
   - Apply filters (optional)
   - Click "Export CSV (X)" button
   - CSV downloads with current date

## CSV Export Format

The CSV export includes:
- Email
- Event Types (semicolon-separated)
- Topics (semicolon-separated)
- Subscription Date
- Status (Active/Inactive)

Example:
```
"Email","Event Types","Topics","Subscribed Date","Status"
"user@example.com","Conferences;Workshops","Technology;AI & ML","2/8/2026","Active"
```

## API Routes

### POST /api/newsletter
Subscribe to newsletter
- Body: `{ email, event_types: [], topics: [] }`
- Returns: `{ message, data }`

### POST /api/suggestions
Submit suggestion for event type or topic
- Body: `{ email, type: 'event-type' | 'topic', name, description }`
- Returns: `{ message }`

### POST /api/unsubscribe
Unsubscribe using token
- Body: `{ token }`
- Returns: `{ message }`

### GET /api/admin/subscribers
Fetch all subscribers (requires Bearer token auth)
- Headers: `{ Authorization: 'Bearer YOUR_ADMIN_PASSWORD' }`
- Returns: `{ data: [] }`

## Security Notes

1. **Admin Password**: Never share your `ADMIN_PASSWORD` - it's sent in the Authorization header
2. **Unsubscribe Tokens**: 64-character hex tokens generated using crypto.randomBytes
3. **Email Validation**: Basic regex validation on client and server
4. **Soft Deletes**: Inactive subscribers are marked but not deleted (data retention)

## Event Types

Currently available:
- Conferences
- Workshops
- Webinars
- Networking Events
- Summits
- Meetups

Add more in `components/newsletter-form.tsx` → `EVENT_TYPES` array

## Topics

Currently available:
- Technology
- Business
- Design
- Marketing
- Product
- Startups
- AI & ML
- Web Development

Add more in `components/newsletter-form.tsx` → `TOPICS` array

## Troubleshooting

### "This email is already subscribed"
- User is already in the database
- They can unsubscribe and resubscribe
- Check admin dashboard for duplicate emails

### Admin dashboard shows 401 Unauthorized
- Verify `ADMIN_PASSWORD` is set in environment variables
- Check that the password matches exactly
- No extra spaces or characters

### CSV exports but looks empty
- Apply filters that have matching subscribers
- Check "Showing X of Y subscribers" at the top
- Ensure at least one subscriber matches your filter

## Deployment Checklist

- [ ] Set `ADMIN_PASSWORD` environment variable
- [ ] Verify Supabase connection
- [ ] Test newsletter signup flow
- [ ] Test admin dashboard access
- [ ] Test unsubscribe flow
- [ ] Test CSV export
- [ ] Review suggestion form
