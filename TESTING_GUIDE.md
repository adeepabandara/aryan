# Authentication Testing Guide

## Current Status ✅
- ✅ Development server running: http://localhost:3000
- ✅ NextAuth.js v5 configured with JWT sessions
- ✅ Route protection middleware active
- ✅ Database connected and seeded
- ✅ Password hashing with bcryptjs
- ✅ Session management configured (30-day expiry)

## Test Credentials
```
Email: admin@aryanproducts.com
Password: admin123
```

## Testing Steps

### 1. Initial Access Test
1. Open browser to: **http://localhost:3000**
2. **Expected:** Redirect to `/login` page
3. **Verify:** Login form is displayed with email and password fields

### 2. Login Flow Test
1. Enter credentials:
   - Email: `admin@aryanproducts.com`
   - Password: `admin123`
2. Click "Login" button
3. **Expected:** 
   - Loading state shows briefly
   - Redirect to `/dashboard`
   - Welcome message with user name appears
   - User menu shows in sidebar with email

### 3. Protected Routes Test
Test accessing different pages while logged in:

- `/dashboard` - Should display dashboard with KPI cards
- `/customers` - Should show customers list
- `/products` - Should show products list
- `/invoices` - Should show invoices list
- `/payments` - Should show payments list
- `/settings` - Should show settings page

**Expected:** All pages load successfully without redirects

### 4. Session Persistence Test
1. After logging in, refresh the page (Cmd+R)
2. **Expected:** 
   - Still logged in
   - No redirect to login
   - User menu still shows your info

### 5. Logout Test
1. Click the "Logout" button in sidebar (or user menu)
2. **Expected:**
   - Redirect to `/login` page
   - Session cleared
   - Cookie removed

### 6. Post-Logout Access Test
1. After logging out, try to access: `/dashboard`
2. **Expected:** Redirect back to `/login` page

### 7. Invalid Credentials Test
1. At login page, enter invalid credentials:
   - Email: `wrong@email.com`
   - Password: `wrongpass`
2. **Expected:**
   - Error message displayed: "Invalid email or password"
   - Stay on login page
   - No redirect

### 8. Empty Form Test
1. Try to submit login form with empty fields
2. **Expected:** Browser validation prevents submission

### 9. Direct URL Access Test (While Logged Out)
1. Ensure you're logged out
2. Try to access directly: `/invoices`, `/customers`, `/products`
3. **Expected:** All redirect to `/login`

### 10. Callback URL Test
1. Log out
2. Try to access: `http://localhost:3000/invoices`
3. **Expected:** Redirect to `/login?callbackUrl=/invoices`
4. Log in with valid credentials
5. **Expected:** Redirect back to `/invoices` after successful login

## API Endpoint Tests (Optional)

### Protected API Route Test
```bash
# Without authentication (should fail)
curl http://localhost:3000/api/me

# With authentication (need to copy session cookie from browser)
curl http://localhost:3000/api/me \
  -H "Cookie: authjs.session-token=YOUR_SESSION_TOKEN"
```

**Expected:**
- Without cookie: 401 Unauthorized
- With valid cookie: User data returned

## Developer Tools Inspection

### Check Cookies
1. Open DevTools (Cmd+Option+I)
2. Go to Application → Cookies → http://localhost:3000
3. **Expected:** 
   - After login: `authjs.session-token` cookie present
   - HttpOnly: ✅
   - Secure: ✅ (in production)
   - SameSite: Lax

### Check Network
1. Open DevTools → Network tab
2. Log in
3. **Expected:**
   - POST to `/api/auth/callback/credentials`
   - Response: 200 OK
   - Redirect to `/dashboard`

### Check Console
1. Open DevTools → Console tab
2. Navigate around the app
3. **Expected:** No error messages related to authentication

## Common Issues & Solutions

### Issue: "Invalid email or password" with correct credentials
**Solution:** 
- Check database has seeded data: `pnpm db:seed`
- Verify password is hashed correctly in database
- Check `.env` has correct DATABASE_URL

### Issue: Infinite redirect loop
**Solution:**
- Clear all cookies
- Check middleware.ts matcher config
- Verify NEXTAUTH_URL matches current URL

### Issue: Session not persisting after refresh
**Solution:**
- Check NEXTAUTH_SECRET is set in `.env`
- Verify cookies are enabled in browser
- Check for console errors

### Issue: "Module not found" errors
**Solution:**
- Already resolved: bcryptjs is used instead of bcrypt
- If persists: Delete `node_modules` and `.next`, run `pnpm install`

## Next Steps After Testing

### If All Tests Pass ✅
1. Proceed to implement API routes (see API_IMPLEMENTATION.md)
2. Connect frontend forms to backend APIs
3. Add data validation with Zod schemas
4. Implement error handling and loading states

### If Tests Fail ❌
1. Check browser console for errors
2. Check terminal for server errors
3. Verify database connection
4. Review `.env` configuration
5. Check Prisma client is generated

## Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens encrypted
- ✅ HTTP-only cookies (prevents XSS)
- ✅ CSRF protection (built into NextAuth)
- ✅ Route protection middleware
- ✅ Secure session management
- ✅ Environment variables not exposed to client
- ⏳ Rate limiting (to be implemented)
- ⏳ Email verification (to be implemented)
- ⏳ Password reset (to be implemented)

## Additional Test Users

If you need to test with more users, add them to the database:

```typescript
// Add to prisma/seed.ts
const user2 = await prisma.user.create({
  data: {
    email: "test@example.com",
    password: await bcrypt.hash("test123", 10),
    name: "Test User",
  },
});
```

Then run: `pnpm db:seed`

## Production Deployment Checklist

Before deploying to Vercel:
- [ ] All authentication tests pass locally
- [ ] Environment variables configured in Vercel
- [ ] NEXTAUTH_URL set to production domain
- [ ] Database migrations applied to production
- [ ] HTTPS enforced (Vercel handles this)
- [ ] Session expiry tested
- [ ] Logout tested in production
- [ ] Password reset flow implemented
