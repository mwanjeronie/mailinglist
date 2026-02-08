# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interfaces                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Homepage   │  │  Suggestion  │  │   Unsubscribe Page  │  │
│  │  Newsletter  │  │     Form     │  │   (Token Verify)    │  │
│  │   Signup     │  │ (New Types/  │  │                     │  │
│  │   (/ route) │  │  Topics)     │  │ (/unsubscribe)      │  │
│  │              │  │ (/suggest)   │  │                     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                     │              │
└─────────┼─────────────────┼─────────────────────┼──────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  /api/       │  │  /api/       │  │  /api/               │  │
│  │  newsletter  │  │  suggestions │  │  unsubscribe         │  │
│  │              │  │              │  │                      │  │
│  │ POST handler │  │ POST handler │  │ POST handler         │  │
│  │              │  │              │  │                      │  │
│  │ - Validate   │  │ - Validate   │  │ - Verify token       │  │
│  │ - Generate   │  │ - Insert     │  │ - Soft delete        │  │
│  │   token      │  │   suggestion │  │                      │  │
│  │ - Insert sub │  │              │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                     │              │
│         └────────────┬────────────────────────────┘              │
│                      │                                          │
│         ┌────────────▼──────────────┐                          │
│         │  /api/admin/subscribers   │                          │
│         │  GET handler              │                          │
│         │  - Password auth          │                          │
│         │  - Return all subscribers │                          │
│         └────────────┬──────────────┘                          │
│                      │                                          │
└──────────────────────┼──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase PostgreSQL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         newsletter_subscribers                         │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ id (PK)                                               │   │
│  │ email (UNIQUE, INDEXED)                              │   │
│  │ event_types (TEXT[])                                │   │
│  │ topics (TEXT[])                                      │   │
│  │ unsubscribe_token (UNIQUE, INDEXED)                 │   │
│  │ is_active (BOOLEAN)                                 │   │
│  │ created_at                                           │   │
│  │ updated_at                                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────┐         ┌────────────────────┐            │
│  │ event_type_    │         │ topic_suggestions  │            │
│  │ suggestions    │         │                    │            │
│  ├────────────────┤         ├────────────────────┤            │
│  │ id (PK)        │         │ id (PK)            │            │
│  │ email          │         │ email              │            │
│  │ suggested_type │         │ suggested_topic    │            │
│  │ description    │         │ description        │            │
│  │ created_at     │         │ created_at         │            │
│  └────────────────┘         └────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
App Structure:
─────────────

app/
├── page.tsx                          ← Homepage route
├── suggest/
│   └── page.tsx                      ← Suggestion form route
├── unsubscribe/
│   ├── layout.tsx                    ← Suspense boundary
│   └── page.tsx                      ← Unsubscribe route
├── admin/
│   └── page.tsx                      ← Admin dashboard route
│
└── api/
    ├── newsletter/route.ts           ← Signup endpoint
    ├── suggestions/route.ts          ← Suggestion endpoint
    ├── unsubscribe/route.ts          ← Unsubscribe endpoint
    │
    └── admin/
        └── subscribers/route.ts      ← Admin data endpoint

components/
├── newsletter-form.tsx               ← Reusable signup form
├── suggestion-form.tsx               ← Reusable suggestion form
└── admin-dashboard.tsx               ← Admin table & controls

lib/
└── newsletter-config.ts              ← Configuration (types/topics)
```

## Data Flow

### Signup Flow
```
User Input (Homepage)
        ↓
Newsletter Form Component
        ↓
    Validate (email, selections)
        ↓
    POST /api/newsletter
        ↓
    Server: Validate inputs
        ↓
    Generate unsubscribe token
        ↓
    Insert into Supabase
        ↓
    Return success
        ↓
    Show success message
        ↓
    Reset form
```

### Suggestion Flow
```
User Input (Suggestion Page)
        ↓
Suggestion Form Component
        ↓
    Validate (email, name)
        ↓
    POST /api/suggestions
        ↓
    Server: Validate & categorize
        ↓
    Insert into appropriate table
        ↓
    Return success
        ↓
    Show success message
        ↓
    Auto-reset after 3 seconds
```

### Unsubscribe Flow
```
Email Click (unsubscribe link)
        ↓
Browser: GET /unsubscribe?token=XXX
        ↓
    React: Extract token
        ↓
    POST /api/unsubscribe
        ↓
    Server: Validate token
        ↓
    Find subscriber by token
        ↓
    Set is_active = false
        ↓
    Return success
        ↓
    Show confirmation
        ↓
    User can return home
```

### Admin Dashboard Flow
```
Visit /admin page
        ↓
Show password form
        ↓
User enters password
        ↓
    POST request with Bearer token
        ↓
    Server: Validate password
        ↓
    GET all subscribers
        ↓
    Return full dataset
        ↓
Display in React component
        ↓
User applies filters
        ↓
    React: Filter in-memory
        ↓
Display filtered results
        ↓
User clicks Export
        ↓
    React: Generate CSV
        ↓
    Browser: Download file
```

## Security Layers

### Layer 1: Client-Side Validation
```
Email Form:
- Email regex validation
- Selection requirement checks
- Real-time error display

Prevents obvious errors before API call
```

### Layer 2: Server-Side Validation
```
All API endpoints validate:
- Email format
- Required fields presence
- Type checking
- Business logic rules
```

### Layer 3: Database Constraints
```
- UNIQUE constraint on email
- UNIQUE constraint on unsubscribe_token
- NOT NULL constraints on required fields
- INDEXED fields for performance
```

### Layer 4: Authentication
```
Admin endpoints require:
- Bearer token in Authorization header
- Token matches ADMIN_PASSWORD env var
- Prevents unauthorized access
```

### Layer 5: Token Security
```
Unsubscribe tokens:
- Generated using crypto.randomBytes(32)
- 64-character hex string
- Unique per subscriber
- Validated before processing
- Prevents token reuse
```

## Performance Optimizations

```
Database:
├── Indexes on frequently queried columns
│   ├── email (for duplicate checking)
│   └── unsubscribe_token (for unsubscribe)
│
├── Array fields (event_types, topics)
│   ├── Efficient storage
│   ├── Easy filtering in admin
│   └── Simple CSV export
│
└── Soft deletes (is_active flag)
    ├── Preserve data
    ├── No data loss
    └── Quick deactivation

Frontend:
├── Component memoization
├── Form state optimization
├── CSV generation (client-side)
├── Minimal re-renders
└── No infinite loops
```

## Error Handling Strategy

```
Validation Errors:
├── Client shows form errors immediately
├── Server validates anyway
└── API returns clear error messages

Database Errors:
├── Duplicate email → "Already subscribed"
├── Unique constraint → "Email in use"
└── Other errors → "Try again" message

Network Errors:
├── Connection timeouts → "Network error"
├── Invalid response → "Something went wrong"
└── CORS issues → Handled by Next.js

Authentication Errors:
├── Wrong password → "Invalid password"
├── Missing token → "Unauthorized"
└── Token expired → "Session ended"
```

## Scalability Considerations

```
Current Design Supports:
├── Thousands of subscribers (Supabase can handle)
├── Real-time filtering (in-memory on client)
├── CSV exports up to reasonable size
├── Multiple admin users (same password)
├── High request volume (Vercel serverless)

Future Scaling:
├── Server-side filtering for large datasets
├── Pagination for admin table
├── Caching with Redis/Edge
├── Rate limiting on API endpoints
├── Database read replicas
├── CDN for static content
```

## Technology Stack

```
Frontend:
├── React 19.2 (Server & Client Components)
├── Next.js 16 (App Router)
├── TypeScript
├── Tailwind CSS
├── Lucide Icons
└── SWR (not used, but available)

Backend:
├── Next.js API Routes
├── Node.js (Vercel runtime)
└── crypto module (token generation)

Database:
├── Supabase (PostgreSQL)
└── Prisma/Raw SQL (not needed, direct queries)

Deployment:
├── Vercel (serverless)
├── Git integration
└── Automatic CI/CD
```

## Environment Variables Required

```
.env.local (development):
├── NEXT_PUBLIC_SUPABASE_URL
├── SUPABASE_SERVICE_ROLE_KEY
└── ADMIN_PASSWORD

Vercel (production):
└── ADMIN_PASSWORD
    (Supabase URL/Key auto-injected)
```

---

This architecture is designed for:
- ✅ Simplicity (easy to understand)
- ✅ Security (multiple validation layers)
- ✅ Scalability (can grow with business)
- ✅ Maintainability (clear structure)
- ✅ Performance (optimized queries)
