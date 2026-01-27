# Vercel Deployment - Step-by-Step Instructions

**Your frontend is deployed at**: https://sales-crm-sigma-eosin.vercel.app/

This guide will get your API routes working with Twilio in production.

---

## 🔧 Immediate Next Steps (Do This Now)

### Step 1: Install Dependencies
```bash
cd /Users/archerterminez/Desktop/REPOSITORY/SalesCRM\ -\ Amber/SalesCRM
npm install
```

This installs `twilio` and `@vercel/node` which are now required.

### Step 2: Deploy to Vercel

**Option A: Via Git** (Recommended)
```bash
git add .
git commit -m "Add Vercel API routes for Twilio integration"
git push origin main
# Vercel auto-deploys when you push to main
```

**Option B: Via Vercel CLI**
```bash
npm install -g vercel  # If not already installed
vercel deploy --prod
```

Wait for deployment to complete. You'll see:
```
✓ Deployed to production. Run `vercel --prod` to see the latest deployment.
```

### Step 3: Verify Deployment

Go to **Vercel Dashboard** → Your Project → **Deployments**

You should see a new deployment. Click it to view:
- ✅ `api/twilio/token.ts`
- ✅ `api/twiml/voice.ts`
- ✅ `api/incoming-sms.ts`

---

## 🌐 Twilio Configuration (Critical!)

These URLs **must** be updated in Twilio for calls and SMS to work.

### Update TwiML App for Voice Calls

1. Go to: https://console.twilio.com
2. Navigate to **Voice** → **TwiML Apps**
3. Click your app (SID: `AP98540848b18d4faec6117d927e02fbcf`)
4. Update **Voice Configuration**:

| Field | Value |
|-------|-------|
| Request URL | `https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice` |
| HTTP Method | `POST` |
| Fallback URL | (leave empty) |

5. Click **Save**

### Update Webhook for Incoming SMS

1. In Twilio Console, go to **Phone Numbers** → **Manage Numbers**
2. Click your number: `+61468165521`
3. Scroll to **Messaging** section
4. Update **Webhook**:

| Field | Value |
|-------|-------|
| Webhook URL | `https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms` |
| HTTP Method | `POST` |

5. Click **Save**

---

## 🔐 Environment Variables in Vercel

Your environment variables should already be set. Verify:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Check that these are present:

```
✓ TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
✓ TWILIO_AUTH_TOKEN = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
✓ TWILIO_API_KEY = SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
✓ TWILIO_API_SECRET = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
✓ TWILIO_PHONE_NUMBER = +61468165521
✓ TWILIO_TWIML_APP_SID = AP98540848b18d4faec6117d927e02fbcf
✓ VITE_SUPABASE_URL = https://isdogcsgykvplppezpos.supabase.co
✓ VITE_SUPABASE_ANON_KEY = [your-key]
✓ SUPABASE_SERVICE_ROLE_KEY = [your-key]
```

If any are missing, add them. They should be marked as "Production" environment.

---

## 🧪 Testing the API Routes

### Test 1: Token Generation

```bash
curl "https://sales-crm-sigma-eosin.vercel.app/api/twilio/token?identity=test-user"
```

**Expected Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "identity": "test_user",
  "expiresIn": 3600
}
```

### Test 2: Voice TwiML

```bash
curl -X POST "https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice" \
  -H "Content-Type: application/json" \
  -d '{"to":"+61234567890"}'
```

**Expected Response** (200 OK, Content-Type: application/xml):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="+61468165521">
    <Number>+61234567890</Number>
  </Dial>
</Response>
```

### Test 3: SMS Webhook

```bash
curl -X POST "https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=%2B61234567890&To=%2B61468165521&Body=Test+Message&MessageSid=SM123456&AccountSid=AC123"
```

**Expected Response** (200 OK):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>
```

---

## 📱 Testing in Your App

### Test 1: Load Application
1. Open https://sales-crm-sigma-eosin.vercel.app
2. Log in with: `admin@salescrm.com` / `password123`
3. Navigate to **Dialer** tab
4. Open **Developer Console** (F12)
5. Look for these logs:
   ```
   🔐 Requesting token for identity: [id]
   ✅ Token received successfully
   ✅ Twilio Device ready for calls
   ```

### Test 2: Make a Call
1. Select a lead from the sidebar
2. Phone number auto-populates in Dialer
3. Click **Call** button
4. Check browser console for connection logs
5. Your phone should ring within 5 seconds

### Test 3: Receive SMS
1. Text your Twilio number: +61468165521
2. Check Supabase: Table `sms_messages` should have new row
3. Message should appear in the app's message history

---

## 🔍 Debugging - Check Vercel Logs

If something isn't working, check the logs:

### Via Vercel Dashboard
1. Go to **Vercel Dashboard** → Your Project
2. Click **Deployments** → Latest deployment
3. Click **Logs** tab
4. See all requests to your API routes

### Via CLI
```bash
vercel logs                # Show logs
vercel logs --tail         # Follow logs in real-time
vercel logs /api/twilio/token  # Specific function
```

### Common Issues in Logs

**Issue**: `Error: TWILIO_API_KEY is not defined`
- **Solution**: Add `TWILIO_API_KEY` to Vercel environment variables

**Issue**: `Invalid JWT format - expected 3 parts`
- **Solution**: Backend token generation failed. Check logs for details.

**Issue**: `Error: WebRTC is not supported`
- **Solution**: This is a browser issue, not API route issue. Use Chrome/Firefox.

---

## 📊 Vercel Function Status

Check function status and metrics:

1. **Vercel Dashboard** → Your Project → **Functions**
2. You should see:
   - `api/twilio/token.ts` - Executions, memory usage, duration
   - `api/twiml/voice.ts` - Executions, memory usage, duration
   - `api/incoming-sms.ts` - Executions, memory usage, duration

Green status = Working ✅

---

## 🔗 Quick Reference URLs

**Production URLs** (after deployment):
```
Frontend:  https://sales-crm-sigma-eosin.vercel.app
Token API: https://sales-crm-sigma-eosin.vercel.app/api/twilio/token?identity=USER
Voice API: https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice
SMS API:   https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms
```

**Twilio Webhook URLs** (set in Twilio console):
```
Voice Request URL: https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice
SMS Webhook URL:   https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms
```

---

## ✅ Deployment Checklist

- [ ] Run `npm install` to install Twilio dependencies
- [ ] Deploy to Vercel (`git push` or `vercel deploy --prod`)
- [ ] Wait for deployment to complete
- [ ] Verify environment variables in Vercel dashboard
- [ ] Update TwiML App voice request URL in Twilio
- [ ] Update SMS webhook URL in Twilio
- [ ] Test token endpoint with curl
- [ ] Test voice endpoint with curl
- [ ] Test SMS endpoint with curl
- [ ] Open app and log in
- [ ] Check browser console for initialization logs
- [ ] Try making a test call
- [ ] Send test SMS to your number
- [ ] Check Vercel logs for any errors

---

## 🚀 You're Done!

Once all tests pass, your application is fully deployed on Vercel with serverless Twilio integration!

### What Changed
- ❌ Express backend on localhost:4000 (no longer needed)
- ✅ Vercel serverless functions (auto-scaling, no server to manage)
- ✅ Same domain = no CORS issues
- ✅ Environment variables managed in Vercel

### What Stayed the Same
- ✅ Frontend React/Vite app
- ✅ Supabase database
- ✅ Twilio Voice SDK in browser
- ✅ Dialer functionality

---

## 📞 Need Help?

1. **Check Vercel Logs**: `vercel logs` - most issues are visible there
2. **Check Browser Console**: F12 - shows frontend errors
3. **Check Twilio Logs**: Twilio console → Logs shows all API calls
4. **Review Documentation**:
   - `VERCEL_MIGRATION.md` - Full migration guide
   - `VERCEL_API_QUICK_REFERENCE.md` - API endpoint reference
   - `VERCEL_IMPLEMENTATION_SUMMARY.md` - What was delivered

---

**Next**: Deploy now with `git push origin main` or `vercel deploy --prod`! 🎉
