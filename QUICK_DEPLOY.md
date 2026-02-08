# Quick Deploy Reference

**Fast reference for deploying your mailing list platform**

---

## 🚀 Quick Start (First Time)

### 1. Supabase Setup (5 minutes)

```bash
1. Go to supabase.com → Create new project
2. Copy Project URL and Service Role Key
3. Run SQL in SQL Editor:
```

```sql
-- Copy from scripts/setup-mailinglist.sql
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

CREATE INDEX idx_mailinglist_email ON mailinglist_subscribers(email);
CREATE INDEX idx_mailinglist_token ON mailinglist_subscribers(unsubscribe_token);

CREATE TABLE event_type_suggestions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  suggested_type VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE topic_suggestions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  suggested_topic VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Ready to deploy"
git push origin main
```

### 3. Vercel Setup (3 minutes)

```bash
1. Go to vercel.com → Import project from GitHub
2. Add 3 environment variables:
   - NEXT_PUBLIC_SUPABASE_URL = [from Supabase]
   - SUPABASE_SERVICE_ROLE_KEY = [from Supabase]
   - ADMIN_PASSWORD = [create a strong password]
3. Click Deploy
```

### 4. Test (2 minutes)

```bash
1. Visit your-app.vercel.app
2. Subscribe with test email
3. Check admin at your-app.vercel.app/admin
4. Verify in Supabase table
```

**Done! 🎉**

---

## 🔄 Update After Changes

```bash
# Make changes in code editor
git add .
git commit -m "Your change description"
git push

# Vercel auto-deploys in ~2 minutes
```

---

## 📊 Common Tasks

### View Subscribers
```
Vercel URL: /admin
Password: [your ADMIN_PASSWORD]
```

### Export CSV
```
Admin dashboard → Export CSV button
```

### Check Suggestions
```
Supabase → Table Editor → event_type_suggestions
Supabase → Table Editor → topic_suggestions
```

### Customize Options
```
Edit: lib/mailinglist-config.ts
Push to git → auto-deploys
```

---

## 🔧 Environment Variables

**Location**: Vercel Dashboard → Project → Settings → Environment Variables

**Required:**
| Variable | Example | Where to Get |
|----------|---------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJh...` | Supabase → Settings → API → service_role |
| `ADMIN_PASSWORD` | `MySecure2024!` | Create your own (keep it secret!) |

**After changing env vars:**
```
Vercel → Deployments → ⋯ → Redeploy
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to subscribe" | Check env vars in Vercel, then redeploy |
| "Unauthorized" admin | Check ADMIN_PASSWORD is set, clear browser cache |
| Database error | Verify tables exist in Supabase |
| Build fails | Check Vercel logs for errors |
| Unsubscribe fails | Check token is correct in URL |

---

## 📍 Important URLs

**Your Application:**
- Homepage: `https://[your-app].vercel.app`
- Admin: `https://[your-app].vercel.app/admin`
- Suggest: `https://[your-app].vercel.app/suggest`

**Dashboards:**
- Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com

**Documentation:**
- Full Guide: See `DEPLOYMENT_GUIDE.md`
- Migration: See `MIGRATION_GUIDE.md`

---

## 📱 API Endpoints

```bash
# Subscribe
POST /api/mailinglist
Body: { email, event_types: [], topics: [] }

# Suggest
POST /api/suggestions
Body: { email, type, name, description }

# Unsubscribe
POST /api/unsubscribe
Body: { token }

# Admin (requires auth header)
GET /api/admin/subscribers
Header: Authorization: Bearer [ADMIN_PASSWORD]
```

---

## 🎯 Testing Checklist

- [ ] Can subscribe from homepage
- [ ] Data appears in Supabase
- [ ] Admin login works
- [ ] Subscribers show in admin
- [ ] CSV export works
- [ ] Unsubscribe works
- [ ] Suggestions form works

---

## 💡 Pro Tips

1. **Monitor logs**: Vercel → Logs (real-time)
2. **Check analytics**: Vercel → Analytics
3. **Backup database**: Automatic in Supabase (Free: 7 days)
4. **Custom domain**: Vercel → Settings → Domains
5. **Review suggestions**: Weekly check in Supabase

---

## 🔒 Security Reminder

- ✅ Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- ✅ Never commit `.env.local` to git
- ✅ Use strong `ADMIN_PASSWORD`
- ✅ Check `.gitignore` includes `.env*.local`

---

## 💰 Cost (Free Tier)

**Vercel Free:**
- 100GB bandwidth/month
- Unlimited projects
- Auto SSL

**Supabase Free:**
- 500MB database
- 2GB bandwidth
- 50K monthly users

**Good for:** Thousands of subscribers

**Need more?** Upgrade when limits reached

---

## ⚡ Speed Reference

| Task | Time |
|------|------|
| First deploy | ~10 min |
| Code update | ~2 min |
| Environment var change | ~2 min + redeploy |
| Database query | < 1 sec |
| Build time | ~2 min |

---

**Need detailed help?** → See `DEPLOYMENT_GUIDE.md`

**Questions?** Check troubleshooting section above
