# Custom Domain Setup: maillist.winjo.xyz

## ✅ Domain Added to Vercel

Your subdomain `maillist.winjo.xyz` has been successfully added to your Vercel project. Now you need to configure DNS.

---

## 🌐 DNS Configuration Required

### Option A: Add A Record (Recommended)

Add the following DNS record at **Porkbun** (your DNS provider):

```
Type: A
Host: maillist
Value: 76.76.21.21
TTL: 600 (or default)
```

### Step-by-Step Instructions for Porkbun:

1. **Log in to Porkbun**: Go to [porkbun.com](https://porkbun.com) and sign in
2. **Navigate to DNS**: 
   - Go to your domain list
   - Click on `winjo.xyz`
   - Click on "DNS" or "DNS Records"
3. **Add New Record**:
   - Click "Add Record" or similar button
   - **Type**: Select `A`
   - **Host/Name**: Enter `maillist`
   - **Answer/Value**: Enter `76.76.21.21`
   - **TTL**: Leave default (or set to 600)
4. **Save**: Click "Save" or "Add"
5. **Wait**: DNS propagation takes 5-30 minutes (sometimes up to 48 hours)

---

## 🔍 Verification

### Check DNS Propagation:

```bash
# After adding the DNS record, check if it's configured:
dig maillist.winjo.xyz

# Or use online tools:
# https://dnschecker.org/#A/maillist.winjo.xyz
```

### Check Vercel Status:

```bash
# Check domain verification status:
vercel domains inspect maillist.winjo.xyz

# View all project domains:
vercel domains ls
```

### Test the Domain:

Once DNS propagates, visit:
- **https://maillist.winjo.xyz** (your mailing list app)
- **https://maillist.winjo.xyz/admin** (admin dashboard)

---

## 🔄 Alternative: Use Vercel Nameservers (Option B)

If you prefer to manage DNS through Vercel:

1. **Change nameservers at Porkbun** to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
2. **Wait** for nameserver propagation (can take 24-48 hours)
3. **Vercel** will automatically configure all DNS records

**Note**: This gives Vercel full DNS control for `winjo.xyz` domain.

---

## 📧 Verification Email

Vercel will send you an email when:
- DNS is detected and verified ✅
- SSL certificate is provisioned ✅

---

## 🚨 Troubleshooting

### If domain doesn't work after 30 minutes:

1. **Verify DNS record is correct**:
   ```bash
   dig maillist.winjo.xyz +short
   ```
   Should return: `76.76.21.21`

2. **Check for typos**:
   - Host should be exactly: `maillist` (not `maillist.winjo.xyz`)
   - IP should be exactly: `76.76.21.21`

3. **Clear DNS cache**:
   ```bash
   # On Linux:
   sudo systemd-resolve --flush-caches
   
   # Or try in incognito browser
   ```

4. **Check Vercel status**:
   ```bash
   vercel domains inspect maillist.winjo.xyz
   ```

---

## 📝 Summary

- ✅ Domain `maillist.winjo.xyz` added to Vercel project
- ⏳ **Action Required**: Add A record at Porkbun
- 🕐 **Wait Time**: 5-30 minutes for DNS propagation
- 📧 **Email**: You'll receive confirmation when ready
- 🔗 **Final URL**: https://maillist.winjo.xyz
