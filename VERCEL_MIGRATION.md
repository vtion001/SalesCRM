# Vercel API Routes Migration Guide

## Overview

This guide covers the migration from Express.js backend (`localhost:4000`) to **Vercel Serverless Functions** (API Routes). Your SalesCRM application is now running as a Vite/React SPA deployed on Vercel with serverless backend functions.

---

## ✅ What Was Changed

### 1. **Backend API Routes Created**
Three new Vercel API Routes have been created in the `/api` directory:

#### **`/api/twilio/token.ts`** - Token Generation
- **Method**: GET (or POST)
- **Path**: `/api/twilio/token?identity=user123`
- **Purpose**: Generates Twilio Access Token with Voice grant
- **Returns**: `{ token: "jwt...", identity: "user123", expiresIn: 3600 }`
- **Replaces**: `POST http://localhost:4000/token`

#### **`/api/twiml/voice.ts`** - Voice TwiML Handler
- **Method**: POST
- **Path**: `/api/twiml/voice`
- **Purpose**: Handles incoming/outgoing call TwiML responses
- **Query Params**: `to` (number to dial), `from` (caller ID)
- **Returns**: XML TwiML response
- **Replaces**: `POST http://localhost:4000/voice`

#### **`/api/incoming-sms.ts`** - SMS Webhook Handler
- **Method**: POST
- **Path**: `/api/incoming-sms`
- **Purpose**: Receives incoming SMS from Twilio, stores in Supabase
- **Returns**: Empty TwiML response (`200 OK`)
- **Replaces**: `POST http://localhost:4000/incoming-sms`

### 2. **Frontend Service Updated**
**File**: `services/twilioService.ts`

**Changes**:
- Removed hardcoded `BACKEND_URL` references
- Updated `getAccessToken()` to use `/api/twilio/token` (GET request)
- Uses relative paths (`/api/...`) for Vercel domain
- Maintains all error handling and validation logic

---

## 📋 Step-by-Step Migration

### Step 1: Deploy to Vercel

Ensure your project is deployed to Vercel:

```bash
# If not already done
vercel deploy --prod
```

Or if using GitHub integration:
- Push to main branch
- Vercel automatically deploys

**Your production URL** should be something like:
```
https://sales-crm-sigma-eosin.vercel.app
```

### Step 2: Set Environment Variables in Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Ensure these are set (they should already be):

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+61468165521
TWILIO_TWIML_APP_SID=AP98540848b18d4faec6117d927e02fbcf
VITE_SUPABASE_URL=https://isdogcsgykvplppezpos.supabase.co
VITE_SUPABASE_ANON_KEY=[your-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

### Step 3: Update Twilio TwiML App Configuration

This is the **CRITICAL** step for incoming calls and SMS to work.

#### **For Voice Calls**:

1. Go to **Twilio Console** → **Voice** → **TwiML Apps**
2. Click on your TwiML App (SID: `AP98540848b18d4faec6117d927e02fbcf`)
3. Update the **Voice Configuration**:

**Request URL** (for incoming calls):
```
https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice
```

**HTTP Method**: POST

#### **For SMS**:

1. In the same Twilio console, go to **Messaging** → **Services**
2. Find your phone number (`+61468165521`)
3. Update the **Incoming Messages** configuration:

**Request URL**:
```
https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms
```

**HTTP Method**: POST

**Alternative** - If using phone number directly (not service):
1. Go to **Phone Numbers** → Your Number (`+61468165521`)
2. Scroll to **Messaging** section
3. Update **Webhook URL**:
```
https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms
```

### Step 4: Verify API Routes are Accessible

Test each endpoint:

#### **Test Token Generation**:
```bash
curl https://sales-crm-sigma-eosin.vercel.app/api/twilio/token?identity=test-user
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "identity": "test_user",
  "expiresIn": 3600
}
```

#### **Test Voice TwiML**:
```bash
curl -X POST https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice \
  -H "Content-Type: application/json" \
  -d '{"to":"+61468165521"}'
```

Expected response:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="+61468165521">
    <Number>+61468165521</Number>
  </Dial>
</Response>
```

---

## 🔍 Testing Checklist

- [ ] **Frontend loads**: https://sales-crm-sigma-eosin.vercel.app
- [ ] **Token endpoint responds**: `/api/twilio/token?identity=test`
- [ ] **Voice TwiML endpoint responds**: POST to `/api/twiml/voice`
- [ ] **SMS webhook endpoint responds**: POST to `/api/incoming-sms`
- [ ] **Browser console logs show**:
  ```
  🔐 Requesting token for identity: [your-identity]
  ✅ Token received successfully
  ✅ Twilio Device ready for calls
  ```
- [ ] **No CORS errors** in browser console
- [ ] **Can make outgoing call** from Dialer
- [ ] **Can receive incoming SMS** (check Supabase database)

---

## 📊 Architecture Comparison

### **Before (Express.js)**
```
Browser (localhost:3005)
    ↓
Express Backend (localhost:4000)
    ↓
Twilio API
```

### **After (Vercel Serverless)**
```
Browser (Vercel domain)
    ↓
Vercel API Routes (/api/*)
    ↓
Twilio API
```

**Advantages**:
- ✅ No separate backend server to manage
- ✅ Auto-scaling via Vercel infrastructure
- ✅ Same domain = no CORS issues
- ✅ Environment variables managed in Vercel dashboard
- ✅ Automatic SSL/TLS certificates

---

## 🔐 Security Considerations

### **What's Secure**:
- ✅ Twilio credentials are server-side only (in Vercel env vars)
- ✅ API routes are protected by Vercel's infrastructure
- ✅ JWT tokens are generated server-side and never exposed

### **What's Open (CORS)**:
- API routes have `Access-Control-Allow-Origin: *`
- This is **intentional** to allow browser requests
- Consider restricting to your Vercel domain in production:

**Optional**: Update CORS in `/api/twilio/token.ts`:
```typescript
res.setHeader('Access-Control-Allow-Origin', 'https://sales-crm-sigma-eosin.vercel.app');
```

---

## 🐛 Troubleshooting

### **Token Endpoint Returns 500 Error**

**Check**:
1. Environment variables are set in Vercel
2. Twilio credentials are correct
3. Redeploy: `vercel deploy --prod`

**Debug**:
```bash
# Check logs in Vercel dashboard
vercel logs [function-name]
```

### **CORS Errors in Browser Console**

**Solution**:
- API routes already have CORS headers set
- If still getting CORS errors, check browser network tab
- Ensure request URL is correct (relative path, not localhost)

### **Incoming Calls Not Being Received**

**Check**:
1. TwiML App Request URL is updated to Vercel domain
2. Request URL is correct: `https://[your-domain]/api/twiml/voice`
3. Twilio webhook is hitting the correct endpoint (check Vercel logs)

### **SMS Not Storing in Supabase**

**Check**:
1. `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel env vars
2. `sms_messages` table exists in Supabase
3. RLS policies allow inserts (check Supabase)

---

## 📝 Local Development

If you want to test locally before deploying:

### **Option 1: Use Vercel CLI (Recommended)**
```bash
vercel dev
```

This runs your API routes locally at `http://localhost:3000/api/*`

### **Option 2: Keep Express Backend**
Continue running Express backend locally:
```bash
npm run dev:backend
# Runs on http://localhost:4000
```

To use local backend, update `services/twilioService.ts`:
```typescript
const API_BASE = 'http://localhost:4000';
```

---

## 🚀 Deploying Changes

To deploy changes to the API routes:

```bash
# Commit and push
git add .
git commit -m "Update API routes"
git push origin main

# Vercel automatically deploys
# Or manually:
vercel deploy --prod
```

---

## 📞 API Route Reference

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/api/twilio/token` | GET | Generate JWT token | `{ token, identity, expiresIn }` |
| `/api/twiml/voice` | POST | Voice call TwiML | XML TwiML response |
| `/api/incoming-sms` | POST | Handle incoming SMS | `200 OK` |

---

## ✨ Next Steps

1. ✅ Deploy to Vercel (if not already)
2. ✅ Set environment variables
3. ✅ Update Twilio webhook URLs
4. ✅ Test token endpoint
5. ✅ Test making/receiving calls
6. ✅ Monitor Vercel logs for issues

Your application is now fully serverless on Vercel! 🎉

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs/serverless-functions/quickstart
- Twilio Docs: https://www.twilio.com/docs/voice/api
- Check logs: `vercel logs` or Vercel Dashboard → Functions
