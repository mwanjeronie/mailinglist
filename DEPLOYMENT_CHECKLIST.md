# Deployment Checklist

**Print or check off as you deploy**

---

## ☑️ Pre-Deployment

- [ ] Have GitHub account
- [ ] Have Vercel account
- [ ] Have Supabase account
- [ ] Code is ready to deploy
- [ ] Reviewed customization needs

---

## ☑️ Part 1: Supabase Setup

- [ ] Created Supabase project
- [ ] Saved database password
- [ ] Opened SQL Editor
- [ ] Ran `setup-mailinglist.sql` script
- [ ] Verified 3 tables created:
  - [ ] `mailinglist_subscribers`
  - [ ] `event_type_suggestions`
  - [ ] `topic_suggestions`
- [ ] Copied Project URL
- [ ] Copied Service Role Key
- [ ] Saved credentials securely

---

## ☑️ Part 2: GitHub

- [ ] Initialized git repository
- [ ] Added all files
- [ ] Committed changes
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Verified code appears on GitHub

---

## ☑️ Part 3: Vercel Setup

- [ ] Logged into Vercel
- [ ] Clicked "Add New Project"
- [ ] Imported GitHub repository
- [ ] Verified Framework: Next.js
- [ ] Added environment variable: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added environment variable: `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Added environment variable: `ADMIN_PASSWORD`
- [ ] Selected all environments for each variable
- [ ] Clicked Deploy
- [ ] Waited for build to complete
- [ ] Build succeeded ✅
- [ ] Copied live URL

---

## ☑️ Part 4: Testing

### Homepage Test
- [ ] Visited homepage URL
- [ ] Page loads correctly
- [ ] Form displays
- [ ] Event types show
- [ ] Topics show

### Subscription Test
- [ ] Entered test email
- [ ] Selected event type
- [ ] Selected topic
- [ ] Clicked subscribe
- [ ] Success message appeared
- [ ] Verified in Supabase table

### Admin Test
- [ ] Visited `/admin`
- [ ] Entered admin password
- [ ] Login successful
- [ ] Subscriber table shows
- [ ] Test subscriber visible
- [ ] Filters work
- [ ] CSV export works

### Unsubscribe Test
- [ ] Got unsubscribe token from Supabase
- [ ] Visited unsubscribe URL with token
- [ ] Success message appeared
- [ ] Status changed to inactive in database

### Suggestions Test
- [ ] Visited `/suggest`
- [ ] Form displays
- [ ] Filled form
- [ ] Submitted successfully
- [ ] Verified in Supabase

---

## ☑️ Part 5: Post-Deployment

### Configuration
- [ ] Customized event types (if needed)
- [ ] Customized topics (if needed)
- [ ] Committed and pushed changes
- [ ] Verified auto-deploy worked

### Documentation
- [ ] Noted live URL
- [ ] Saved admin password
- [ ] Bookmarked Vercel dashboard
- [ ] Bookmarked Supabase dashboard

### Monitoring Setup
- [ ] Enabled Vercel Analytics
- [ ] Checked Vercel Logs
- [ ] Reviewed Supabase metrics

---

## ☑️ Optional Enhancements

- [ ] Added custom domain
- [ ] Configured DNS
- [ ] SSL certificate active
- [ ] Set up email service (SendGrid/Mailgun/Resend)
- [ ] Created email template
- [ ] Added unsubscribe link to emails
- [ ] Set up monitoring alerts

---

## ☑️ Security Review

- [ ] `ADMIN_PASSWORD` is strong
- [ ] Service role key not exposed
- [ ] `.env.local` not committed
- [ ] `.gitignore` includes env files
- [ ] Admin page password-protected
- [ ] Tested unauthorized access (should fail)

---

## ☑️ Launch Readiness

- [ ] All features tested
- [ ] No console errors
- [ ] Mobile responsive checked
- [ ] Different browsers tested
- [ ] Loading states work
- [ ] Error messages are clear
- [ ] Success messages work
- [ ] Data validates correctly

---

## 🎯 Success Metrics to Track

Set up tracking for:
- [ ] Total subscribers
- [ ] Daily/weekly signups
- [ ] Event type popularity
- [ ] Topic preferences
- [ ] Unsubscribe rate
- [ ] Suggestion submissions
- [ ] Page performance

---

## 📞 Support Resources

Have these bookmarked:
- [ ] Vercel Dashboard: vercel.com/dashboard
- [ ] Supabase Dashboard: app.supabase.com
- [ ] GitHub Repository: [your-repo-url]
- [ ] Deployment Guide: DEPLOYMENT_GUIDE.md
- [ ] Quick Reference: QUICK_DEPLOY.md

---

## 🚀 You're Live!

Once all items are checked:

- [ ] **Application is live and working** ✅
- [ ] **All features tested** ✅
- [ ] **Monitoring enabled** ✅
- [ ] **Documentation complete** ✅
- [ ] **Security verified** ✅

---

## Next Actions

Now that you're deployed:

1. Share your URL with users
2. Start collecting subscribers
3. Review suggestions weekly
4. Monitor analytics daily
5. Plan email campaigns
6. Gather user feedback
7. Iterate and improve

---

**Deployment Date**: _______________

**Live URL**: _______________

**Admin Password**: (stored securely)

**Notes**:
_____________________________________
_____________________________________
_____________________________________

---

✅ **Congratulations!** Your mailing list platform is live!
