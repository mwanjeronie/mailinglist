# Security Guide

## 🔒 Environment Variables & Secrets Management

### Protected Files

The following files are **automatically excluded** from git:

```
.env.local          ← Your local development secrets
.env.production     ← Production secrets (pulled from Vercel)
.env.development    ← Development secrets
.env*.local         ← Any other local env files
```

### ✅ What's Safe to Commit

- ✅ `.env.example` - Template with placeholder values
- ✅ Code files importing from `process.env`
- ✅ Documentation mentioning environment variable names

### ❌ NEVER Commit These

- ❌ `.env.local` - Real secrets
- ❌ `.env.production` - Production credentials
- ❌ Any file containing real API keys, passwords, or tokens
- ❌ Supabase service role keys
- ❌ Admin passwords

---

## 🔐 Current Secrets

Your application uses these secret values:

### 1. `NEXT_PUBLIC_SUPABASE_URL`
- **Type**: Public (safe to expose)
- **Location**: Vercel environment variables
- **Example**: `https://xxxxx.supabase.co`

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type**: Public (safe to expose, limited permissions)
- **Location**: Vercel environment variables
- **Purpose**: Client-side database access (read-only)

### 3. `SUPABASE_SERVICE_ROLE_KEY` ⚠️
- **Type**: SECRET (full database access)
- **Location**: Vercel environment variables ONLY
- **Risk**: If exposed, anyone can read/write/delete all database data
- **Protection**: Server-side only, never exposed to browser

### 4. `ADMIN_PASSWORD` ⚠️
- **Type**: SECRET
- **Location**: Vercel environment variables ONLY
- **Purpose**: Admin dashboard authentication
- **Protection**: Server-side validation only

---

## 🛡️ Security Best Practices

### For Local Development

1. **Use `.env.local` for secrets**:
   ```bash
   # Create your local environment file
   cp .env.example .env.local
   # Add your real credentials
   ```

2. **Never commit secrets**:
   - Always check `git status` before committing
   - Use `git diff` to review changes
   - Verify `.gitignore` is working: `git check-ignore .env.local`

3. **Rotate secrets if exposed**:
   - If you accidentally commit secrets, rotate them immediately
   - Generate new Supabase keys in dashboard
   - Update Vercel environment variables
   - Change admin password

### For Production

1. **Store secrets in Vercel**:
   - Vercel Dashboard → Settings → Environment Variables
   - Add for all environments: Production, Preview, Development

2. **Use strong passwords**:
   - Minimum 16 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse passwords

3. **Limit access**:
   - Only give admin password to trusted team members
   - Use Vercel team roles to control deployment access
   - Enable 2FA on Vercel and Supabase accounts

---

## 🔍 How to Verify Your Secrets Are Safe

### Check Git Status

```bash
# Should NOT show .env.local or .env.production
git status

# Should return empty (files not tracked)
git ls-files | grep .env

# Should confirm files are ignored
git check-ignore .env.local .env.production
```

### Check Git History

```bash
# Should return empty (never committed)
git log --all --full-history -- .env.local
git log --all --full-history -- .env.production

# Search entire history for secrets
git log --all -p -S "SUPABASE_SERVICE_ROLE_KEY"
```

### Check Remote Repository

```bash
# List what's actually on GitHub
git ls-tree -r main --name-only | grep env
```

---

## 🚨 If Secrets Were Exposed

### Immediate Actions:

1. **Rotate ALL credentials immediately**:
   
   **Supabase:**
   - Dashboard → Settings → API
   - Click "Generate new service_role key"
   - Click "Generate new anon key"
   
   **Admin Password:**
   - Generate new password
   - Update in Vercel environment variables
   
   **Vercel:**
   - Environment Variables → Delete old values
   - Add new credentials
   - Redeploy

2. **Remove from Git history** (if committed):
   
   ```bash
   # Use BFG Repo Cleaner or git filter-repo
   # This is complex - consider creating a new repository instead
   ```

3. **Force push (if necessary)**:
   
   ```bash
   git push --force
   ```
   
   ⚠️ Only do this if you're the only contributor!

4. **Notify your team** (if applicable)

---

## 📋 Security Checklist

Before deploying or sharing code:

- [ ] `.env.local` is not tracked by git
- [ ] `.env.production` is not tracked by git
- [ ] `.gitignore` includes all env file patterns
- [ ] No secrets in code files
- [ ] No secrets in documentation
- [ ] Secrets are only in Vercel dashboard
- [ ] Admin password is strong (16+ chars)
- [ ] 2FA enabled on Vercel account
- [ ] 2FA enabled on Supabase account
- [ ] Team members know not to commit secrets

---

## 🎯 Recommended .gitignore Patterns

Your `.gitignore` should include:

```gitignore
# Environment files with secrets
.env*.local
.env.production
.env.development
.env.test

# But allow example templates
!.env.example
!.env.template

# Build outputs
.next/
out/
build/
dist/

# Dependencies
node_modules/

# Deployment
.vercel/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
*.log
npm-debug.log*
```

---

## 🔑 Secret Rotation Schedule

Recommended rotation schedule:

| Secret | Frequency | Trigger |
|--------|-----------|---------|
| Admin Password | Every 90 days | Regular rotation |
| Supabase Keys | When compromised | Security incident |
| All Secrets | Immediately | Team member leaves |
| All Secrets | Immediately | Potential exposure |

---

## 📞 Security Incident Response

If you suspect secrets were exposed:

1. **Act immediately** (don't wait)
2. **Rotate all credentials** (see above)
3. **Review access logs**:
   - Supabase: Dashboard → Logs
   - Vercel: Dashboard → Logs
4. **Check for unauthorized access**:
   - Unusual database activity
   - Unexpected deployments
   - Changed environment variables
5. **Document the incident**
6. **Update security practices**

---

## 🔒 Input Validation Security

### Frontend vs Backend Validation

**Critical Rule**: Always validate on BOTH frontend AND backend.

#### Current Validation Strategy

All API endpoints enforce server-side validation:

1. **Email Validation**:
   ```typescript
   if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
     return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
   }
   ```

2. **Required Fields Validation** (Subscription):
   ```typescript
   // Both event types AND topics are required
   if (!event_types || event_types.length === 0) {
     return NextResponse.json({ error: 'Please select at least one event type' }, { status: 400 });
   }
   if (!topics || topics.length === 0) {
     return NextResponse.json({ error: 'Please select at least one topic' }, { status: 400 });
   }
   ```

3. **Type Validation** (Suggestions):
   ```typescript
   if (type !== 'event-type' && type !== 'topic') {
     return NextResponse.json({ error: 'Invalid suggestion type' }, { status: 400 });
   }
   ```

#### Why Both Layers?

- **Frontend validation**: Better UX (instant feedback)
- **Backend validation**: Security (can't be bypassed)

⚠️ **Never trust client-side validation alone!**

---

## ✅ Current Status

Your repository is **SECURE**:

| File | Tracked by Git | Protected | Status |
|------|----------------|-----------|--------|
| `.env.local` | ❌ No | ✅ Yes | ✅ Safe |
| `.env.production` | ❌ No | ✅ Yes | ✅ Safe (deleted) |
| `.gitignore` | ✅ Yes | N/A | ✅ Updated |
| API Validation | N/A | ✅ Yes | ✅ Consistent with frontend |

**No secrets have been committed to your repository.** ✅
**All API endpoints have server-side validation.** ✅

---

## 📚 Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Vercel: Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase: Managing API Keys](https://supabase.com/docs/guides/api#managing-api-keys)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
