# Deployment Checklist

## Pre-Deployment Configuration

### 1. Environment Variables
- [ ] Set `ADMIN_PASSWORD` in Vercel project settings
  - Navigate to Settings → Environment Variables
  - Add new variable: `ADMIN_PASSWORD`
  - Use a strong, secure password (minimum 12 characters)
  - Never commit to git

### 2. Supabase Setup
- [ ] Confirm Supabase integration is connected
- [ ] Verify database tables exist:
  - `newsletter_subscribers`
  - `event_type_suggestions`
  - `topic_suggestions`
- [ ] Confirm indexes exist on `email` and `unsubscribe_token`

### 3. Configuration Review
- [ ] Review event types in `lib/newsletter-config.ts`
- [ ] Review topics in `lib/newsletter-config.ts`
- [ ] Ensure they match your business needs

## Testing Checklist

### Signup Flow
- [ ] Navigate to `/` (homepage)
- [ ] Form displays correctly
- [ ] Email validation works (try invalid email)
- [ ] Event type selection works (select/deselect)
- [ ] Topic selection works (select/deselect)
- [ ] Cannot submit without selections
- [ ] Success message shows on valid submission
- [ ] Cannot submit duplicate email (check after first)
- [ ] Form resets after successful submission

### Suggestion Flow
- [ ] Navigate to `/suggest` from homepage
- [ ] Both suggestion types work (Event Type & Topic)
- [ ] Email validation works
- [ ] Cannot submit without required fields
- [ ] Success message displays
- [ ] Can navigate back to homepage

### Unsubscribe Flow
- [ ] Create test subscriber in database
- [ ] Copy their unsubscribe token
- [ ] Visit `/unsubscribe?token=YOUR_TOKEN`
- [ ] Confirm unsubscribe works
- [ ] Status changes to inactive in database
- [ ] Visit with invalid token - shows error
- [ ] Visit without token - shows invalid message

### Admin Dashboard
- [ ] Navigate to `/admin`
- [ ] Wrong password shows error
- [ ] Correct password grants access
- [ ] All subscribers display in table
- [ ] Can filter by status (Active/Inactive)
- [ ] Can filter by event types
- [ ] Can filter by topics
- [ ] Multiple filters work together
- [ ] CSV export works with filters
- [ ] Logout button works
- [ ] After logout, cannot access without password

## Performance Testing

- [ ] Page load time is acceptable (<3s)
- [ ] No 404 errors in browser console
- [ ] No unhandled promise rejections
- [ ] Database queries complete quickly
- [ ] CSV export doesn't timeout on large datasets
- [ ] Images load properly

## Security Testing

- [ ] Admin password is not visible in client-side code
- [ ] Cannot access `/admin` without password
- [ ] Cannot modify API requests to bypass auth
- [ ] Unsubscribe token is cryptographically random
- [ ] Email addresses are validated server-side
- [ ] No SQL injection vulnerabilities in API

## Cross-Browser Testing

- [ ] Chrome/Edge desktop
- [ ] Firefox desktop
- [ ] Safari desktop
- [ ] Chrome mobile
- [ ] Safari iOS
- [ ] Samsung Internet Android

## Accessibility Testing

- [ ] All form inputs have labels
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible
- [ ] Error messages are clear
- [ ] Loading states are indicated

## Final Checks

### Code Quality
- [ ] No console.log statements in production code
- [ ] No commented-out code
- [ ] TypeScript has no errors
- [ ] No unused imports
- [ ] All API errors are handled

### Documentation
- [ ] SETUP.md is accurate
- [ ] FEATURES.md describes all features
- [ ] Event types/topics in config match descriptions
- [ ] API documentation is complete

### Data
- [ ] Database migration scripts work
- [ ] Can create new subscribers
- [ ] Can view admin data
- [ ] Can export to CSV
- [ ] Old data imports correctly (if applicable)

## Deployment Steps

1. **Verify all tests pass**
   ```
   npm run build
   npm run lint
   ```

2. **Set environment variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add `ADMIN_PASSWORD`

3. **Deploy to production**
   - Push to main branch (if using Git integration)
   - Or use Vercel Deploy button
   - Wait for build to complete

4. **Post-Deployment Verification**
   - [ ] Visit homepage - loads without errors
   - [ ] Try signup flow end-to-end
   - [ ] Test admin access with password
   - [ ] Check error logs in Vercel
   - [ ] Monitor database performance

## Rollback Plan

If issues occur after deployment:

1. **For minor issues**
   - Fix code locally
   - Run tests
   - Push new version

2. **For critical issues**
   - Revert to previous deployment via Vercel dashboard
   - Investigate issue
   - Deploy fix separately

## Monitoring

After deployment, monitor:

- [ ] Error rates (Vercel Analytics)
- [ ] Database performance (Supabase Dashboard)
- [ ] API response times
- [ ] Failed subscriptions
- [ ] Admin access attempts

## Data Backup

Before going live:

- [ ] Export any existing subscriber data
- [ ] Create Supabase backup
- [ ] Store backup in secure location
- [ ] Document backup procedure

## Support & Maintenance

### Regular Tasks
- Review suggestions weekly
- Export subscriber lists monthly
- Check error logs weekly
- Monitor unsubscribe rates

### Emergency Contacts
- Vercel Support: vercel.com/help
- Supabase Support: supabase.com/support
- Your admin contact: [Add your contact]

## Success Metrics

Track these after launch:

- [ ] Subscription rate (emails/week)
- [ ] Unsubscribe rate
- [ ] Admin usage frequency
- [ ] Suggestion submission rate
- [ ] Error rate
- [ ] Average page load time

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Notes**: _______________
