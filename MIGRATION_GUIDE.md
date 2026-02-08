# Migration Guide: Newsletter → Mailing List

This document outlines all changes made to rename "newsletter" to "mailing list" throughout the application.

## Changes Made

### 1. **Component Files**
- ✅ `components/newsletter-form.tsx` → `components/mailinglist-form.tsx`
  - Component renamed from `NewsletterForm` to `MailingListForm`
  - Updated button text: "Subscribe to Mailing List"
  - Updated import from `newsletter-config.ts` to `mailinglist-config.ts`
  - Updated API endpoint: `/api/newsletter` → `/api/mailinglist`

### 2. **Configuration Files**
- ✅ `lib/newsletter-config.ts` → `lib/mailinglist-config.ts`
  - File renamed, content unchanged
  
### 3. **API Routes**
- ✅ `app/api/newsletter/route.ts` → `app/api/mailinglist/route.ts`
  - Updated database table reference: `newsletter_subscribers` → `mailinglist_subscribers`
  - Updated success message: "Successfully subscribed to mailing list!"
  - Updated error logging references

- ✅ `app/api/unsubscribe/route.ts`
  - Updated database table reference: `newsletter_subscribers` → `mailinglist_subscribers`

- ✅ `app/api/admin/subscribers/route.ts`
  - Updated database table reference: `newsletter_subscribers` → `mailinglist_subscribers`

### 4. **Page Components**
- ✅ `app/page.tsx`
  - Updated import: `NewsletterForm` → `MailingListForm`
  - Updated metadata title: "Events Mailing List"
  - Updated description: "mailing list" instead of "newsletter"

- ✅ `app/admin/page.tsx`
  - Updated title: "Mailing List Admin"
  - Updated back link: "Back to Mailing List"

- ✅ `app/unsubscribe/page.tsx`
  - Updated text: "Unsubscribing you from our mailing list"

### 5. **Other Components**
- ✅ `components/suggestion-form.tsx`
  - Updated back link: "Back to Mailing List"

- ✅ `components/admin-dashboard.tsx`
  - Updated import: `newsletter-config` → `mailinglist-config`

### 6. **Database Scripts**
- ✅ Created `scripts/setup-mailinglist.sql` - New setup script with updated table names
- ✅ Created `scripts/migrate-newsletter-to-mailinglist.sql` - Migration script for existing databases
- ⚠️  Legacy files kept for reference:
  - `scripts/setup-newsletter.sql` (old version)
  - `scripts/add-features.sql` (old version)

### 7. **Documentation Files**
All documentation has been updated:
- ✅ `README.md` - All references updated
- ✅ `SETUP.md` - All references updated
- ✅ `FEATURES.md` - All references updated
- ✅ `ARCHITECTURE.md` - All references updated
- ✅ `DEPLOYMENT.md` - All references updated
- ✅ `QUICKSTART.md` - All references updated
- ✅ `COMPLETION_REPORT.md` - All references updated

## Database Migration Required

### If You Have NO Existing Data
Simply run the new setup script:
```sql
-- In Supabase SQL Editor, run:
scripts/setup-mailinglist.sql
```

### If You Have Existing Data in `newsletter_subscribers`
Run the migration script to rename the table:
```sql
-- In Supabase SQL Editor, run:
scripts/migrate-newsletter-to-mailinglist.sql
```

This will:
1. Rename `newsletter_subscribers` → `mailinglist_subscribers`
2. Rename `idx_newsletter_email` → `idx_mailinglist_email`
3. Rename `idx_newsletter_token` → `idx_mailinglist_token`

**All existing data will be preserved.**

## Verification Checklist

After migration, verify these work:

- [ ] Homepage loads with mailing list form
- [ ] Can subscribe with email
- [ ] Admin dashboard loads
- [ ] Admin can view subscribers
- [ ] CSV export works
- [ ] Unsubscribe links work
- [ ] Suggestion form works

## API Endpoint Changes

### Old Endpoints (No Longer Work)
- ❌ `POST /api/newsletter` 

### New Endpoints
- ✅ `POST /api/mailinglist` - Subscribe to mailing list
- ✅ `POST /api/suggestions` - (unchanged)
- ✅ `POST /api/unsubscribe` - (unchanged)
- ✅ `GET /api/admin/subscribers` - (unchanged)

## Breaking Changes

1. **API endpoint changed**: Any external integrations calling `/api/newsletter` must update to `/api/mailinglist`
2. **Database table renamed**: Direct SQL queries must use `mailinglist_subscribers` instead of `newsletter_subscribers`
3. **Component imports**: If you have custom code importing `NewsletterForm`, update to `MailingListForm`
4. **Config imports**: If you have custom code importing from `newsletter-config`, update to `mailinglist-config`

## No Changes Required For

- Environment variables (still the same)
- Unsubscribe tokens (still work)
- User data (preserved in migration)
- Admin authentication (still uses `ADMIN_PASSWORD`)
- Suggestion tables (unchanged)

## Rollback (If Needed)

If you need to rollback:

```sql
-- Rename table back
ALTER TABLE mailinglist_subscribers RENAME TO newsletter_subscribers;

-- Rename indexes back
ALTER INDEX idx_mailinglist_email RENAME TO idx_newsletter_email;
ALTER INDEX idx_mailinglist_token RENAME TO idx_newsletter_token;
```

Then restore the old code from git history.

## Summary

- **Code changes**: Complete ✅
- **Documentation**: Complete ✅
- **Database migration**: Required (run migration script) ⚠️
- **Testing**: Recommended after migration ✅

All terminology has been consistently updated from "newsletter" to "mailing list" throughout the application.
