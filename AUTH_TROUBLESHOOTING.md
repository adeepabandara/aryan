# Authentication Error Troubleshooting

## Error Details
- **Error Type**: ClientFetchError  
- **Message**: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
- **Source**: NextAuth.js trying to fetch session data

## Root Cause
This error occurs when the NextAuth API routes return HTML (likely a 404 or error page) instead of JSON. This can happen when:
1. API routes aren't properly configured
2. Runtime incompatibility (Edge vs Node.js)
3. Session provider trying to fetch before routes are ready

## Fixes Applied

### 1. Added Runtime Configuration ✅
- Added `export const runtime = "nodejs"` to the auth API route
- This ensures the route runs in Node.js runtime (not Edge)

### 2. Updated Auth Configuration ✅
- Added `basePath: "/api/auth"` to NextAuth config
- Simplified `authorized()` callback to avoid redirect loops
- Removed complex redirect logic that might cause issues

### 3. Fixed Session Provider ✅
- Changed layout from client-side only `SessionProvider`
- Now fetches session on server with `await auth()`
- Passes session as prop to `SessionProvider`

### 4. Updated bcryptjs ✅
- Replaced `bcrypt` with `bcryptjs` for Edge Runtime compatibility
- Updated all imports in `lib/auth.ts` and `prisma/seed.ts`

## Testing Steps

### 1. Clear Browser Data
```bash
# In browser DevTools
1. Open DevTools (Cmd+Option+I)
2. Go to Application tab
3. Clear all site data
4. Close and reopen browser
```

### 2. Test Login Flow
1. Navigate to http://localhost:3000
2. Should redirect to /login
3. Enter credentials:
   - Email: admin@aryanproducts.com
   - Password: admin123
4. Click "Sign in"
5. Should redirect to /dashboard

### 3. Check Network Tab
In DevTools → Network:
- Look for `/api/auth/callback/credentials` (should be 200)
- Look for `/api/auth/session` (should be 200)
- If any return HTML instead of JSON, that's the problem

## Alternative Solutions

### If Error Persists

#### Option 1: Disable Session Provider Temporarily
Try removing SessionProvider to test if auth routes work:

```tsx
// In app/layout.tsx
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}  {/* Remove SessionProvider temporarily */}
      </body>
    </html>
  )
}
```

Then test by accessing: http://localhost:3000/api/auth/session
- Should return JSON (even if empty): `{}`
- If returns HTML, the API route isn't working

#### Option 2: Check Environment Variables
```bash
# Verify these are set correctly
cat .env | grep NEXTAUTH
```

Should show:
```
NEXTAUTH_SECRET="YV/+wZxjjmUI3VUhugbmGLXM8cK561D2zwt1UX3aZWA="
NEXTAUTH_URL="http://localhost:3000"
```

#### Option 3: Regenerate Prisma Client
```bash
npx prisma generate
npm run dev
```

#### Option 4: Check Database Connection
```bash
npx prisma db push
npx prisma studio  # Opens database viewer
```

Verify:
- Users table exists
- Admin user exists with hashed password

## Current Configuration Files

### `/app/api/auth/[...nextauth]/route.ts`
```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
export const runtime = "nodejs"  // Ensures Node.js runtime
```

### `/lib/auth.ts` (Key Parts)
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  basePath: "/api/auth",  // Explicit base path
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // ... rest of config
})
```

### `/app/layout.tsx`
```typescript
export default async function RootLayout({ children }) {
  const session = await auth()  // Fetch on server
  
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>  {/* Pass session as prop */}
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

## Debugging Commands

### Test API Route Directly
```bash
# Test session endpoint
curl http://localhost:3000/api/auth/session

# Test providers endpoint  
curl http://localhost:3000/api/auth/providers

# Test CSRF endpoint
curl http://localhost:3000/api/auth/csrf
```

All should return JSON, not HTML.

### Check Server Logs
Watch terminal output when accessing auth routes:
```
GET /api/auth/session 200    # Good
GET /api/auth/session 404    # Bad - route not found
GET /api/auth/session 500    # Bad - server error
```

## Next Steps

1. **Clear browser cache completely**
2. **Restart dev server**: Kill and restart `npm run dev`
3. **Test auth API directly**: Use curl commands above
4. **Check browser console**: Look for specific error messages
5. **Check Network tab**: Verify endpoints return JSON

## Success Indicators

✅ `/api/auth/session` returns JSON
✅ Login redirects to dashboard
✅ Session persists after refresh
✅ Logout clears session
✅ Protected routes redirect to login when not authenticated

## If Nothing Works

Consider switching to a simpler auth setup temporarily:
1. Remove middleware
2. Test basic login without route protection
3. Add protection back gradually
4. Or switch to a different auth library (Lucia, Clerk, etc.)
