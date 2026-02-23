# Event Submission Feature Setup

This guide explains how to set up the event submission feature where users can submit events for your weekly newsletter.

## Database Setup

### Step 1: Create the Database Table

Run the SQL script in your Supabase dashboard:

```bash
# The schema is in: supabase-schema-event-submissions.sql
```

Go to your Supabase dashboard → SQL Editor → New Query, then paste and run the contents of `supabase-schema-event-submissions.sql`.

### Step 2: Verify Table Creation

After running the SQL, verify the table was created:
- Go to Supabase Dashboard → Table Editor
- You should see a new table called `event_submissions`

## Feature Overview

### User Flow

1. Users visit your mailing list page (`/`)
2. At the bottom of the form, they see: "Have an event to share with our community? Submit your event →"
3. Clicking the link takes them to `/submit-event`
4. They fill out the event submission form with:
   - Their email and name
   - Event name, type, and topics
   - Event date, time, and location
   - Event description and URL
   - Optional: organization and image URL
5. Upon submission, the event goes into "pending" status

### Admin Flow

1. Admin logs into `/admin` with the admin password
2. The dashboard now has two tabs:
   - **Subscribers**: View and export subscribers (existing functionality)
   - **Event Submissions**: View and manage submitted events
3. On the Event Submissions tab, admins can:
   - View all submitted events with their details
   - Filter by status (pending, approved, rejected, published)
   - Click "View" to see full event details
   - Approve or reject pending events
   - Mark approved events as "published" after including them in the newsletter

### Event Statuses

- **Pending**: Just submitted, awaiting review
- **Approved**: Reviewed and approved, ready to be included in next newsletter
- **Rejected**: Not suitable for publication
- **Published**: Already included in a newsletter

## API Endpoints

### Event Submission (Public)
- **Endpoint**: `POST /api/events/submit`
- **Body**: Event details (see component for full schema)
- **Response**: Success or error message

### Admin Event Management
- **Endpoint**: `GET /api/admin/events`
- **Headers**: `Authorization: Bearer {ADMIN_PASSWORD}`
- **Response**: List of all event submissions

- **Endpoint**: `PATCH /api/admin/events`
- **Headers**: `Authorization: Bearer {ADMIN_PASSWORD}`
- **Body**: `{ id, status, adminNotes }`
- **Response**: Success or error message

## Files Created/Modified

### New Files
- `components/event-submission-form.tsx` - Event submission form component
- `app/submit-event/page.tsx` - Event submission page
- `app/api/events/submit/route.ts` - API route for submitting events
- `app/api/admin/events/route.ts` - API route for admin event management
- `supabase-schema-event-submissions.sql` - Database schema

### Modified Files
- `components/mailinglist-form.tsx` - Updated link to point to event submission
- `components/admin-dashboard.tsx` - Added tabs and event management UI

## Next Steps

1. Run the SQL schema in Supabase
2. Test the event submission form at `/submit-event`
3. Submit a test event
4. Login to admin dashboard and verify you can see and manage the event
5. Consider adding email notifications when events are approved/rejected
6. Build newsletter generation that pulls approved events

## Future Enhancements

- Email notifications to submitters when events are approved/rejected
- Email notifications to admin when new events are submitted
- Bulk approve/reject functionality
- Event editing capability
- Duplicate event detection
- Calendar integration
- Auto-publish on specific dates
- Analytics on which event types/topics are most submitted
