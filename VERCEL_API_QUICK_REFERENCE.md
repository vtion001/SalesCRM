# Vercel API Routes - Quick Reference

## 📁 File Structure

```
project-root/
├── api/
│   ├── twilio/
│   │   └── token.ts          ← GET /api/twilio/token
│   ├── twiml/
│   │   └── voice.ts          ← POST /api/twiml/voice
│   └── incoming-sms.ts       ← POST /api/incoming-sms
├── components/
├── services/
│   └── twilioService.ts      ← Updated with /api/* paths
├── package.json
└── vercel.json               ← Optional: Vercel config
```

## 🌐 Endpoint URLs

### Production (Vercel)
```
Token:     https://sales-crm-sigma-eosin.vercel.app/api/twilio/token?identity=USER
Voice:     https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice
SMS:       https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms
```

### Local Development (Vercel CLI)
```
Token:     http://localhost:3000/api/twilio/token?identity=USER
Voice:     http://localhost:3000/api/twiml/voice
SMS:       http://localhost:3000/api/incoming-sms
```

## 🔧 Environment Variables Required

Set these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+61468165521
TWILIO_TWIML_APP_SID=AP98540848b18d4faec6117d927e02fbcf
VITE_SUPABASE_URL=https://isdogcsgykvplppezpos.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## ⚡ API Route Details

### 1. Token Endpoint
```typescript
// GET /api/twilio/token?identity=user123
// or POST /api/twilio/token with body { identity: "user123" }

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "identity": "user123",
  "expiresIn": 3600
}
```

**Used by**: `twilioService.ts` → `getAccessToken()`

### 2. Voice TwiML Endpoint
```typescript
// POST /api/twiml/voice?to=+61234567890

Request body: (optional)
{
  "to": "+61234567890",
  "from": "+61468165521"
}

Response: XML TwiML
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="+61468165521">
    <Number>+61234567890</Number>
  </Dial>
</Response>
```

**Used by**: Twilio when routing outgoing calls

### 3. Incoming SMS Endpoint
```typescript
// POST /api/incoming-sms

Twilio sends:
{
  "From": "+61234567890",
  "To": "+61468165521",
  "Body": "Hello!",
  "MessageSid": "SM123456789...",
  "AccountSid": "AC..."
}

Response: 200 OK with empty TwiML
<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>
```

**Used by**: Twilio when SMS is received

## 🧪 Testing Commands

### Test Token Generation
```bash
# GET request
curl "https://sales-crm-sigma-eosin.vercel.app/api/twilio/token?identity=test-user"

# or POST
curl -X POST https://sales-crm-sigma-eosin.vercel.app/api/twilio/token \
  -H "Content-Type: application/json" \
  -d '{"identity":"test-user"}'
```

### Test Voice TwiML
```bash
curl -X POST https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice \
  -H "Content-Type: application/json" \
  -d '{"to":"+61234567890","from":"+61468165521"}'
```

### Test SMS Webhook
```bash
curl -X POST https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=%2B61234567890&To=%2B61468165521&Body=Test&MessageSid=SM123&AccountSid=AC123"
```

## 🔐 Twilio Configuration URLs

Update these in **Twilio Console**:

### Voice - TwiML App Configuration
- **Voice Configuration → Request URL**:
  ```
  https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice
  ```

### Messaging - Webhook Configuration
- **Incoming Messages → Webhook URL**:
  ```
  https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms
  ```

## 📊 Request Flow

```
1. Browser requests token:
   GET /api/twilio/token?identity=user123
   ↓
2. API Route generates JWT:
   - Uses TWILIO_API_KEY & TWILIO_API_SECRET
   - Adds VoiceGrant with outgoingApplicationSid
   - Returns JWT token
   ↓
3. Browser initializes Device.setup(token)
   ↓
4. Device is ready for calls
   ↓
5. User makes outgoing call:
   Device.connect(phoneNumber)
   ↓
6. Twilio routes to /api/twiml/voice
   ↓
7. API returns TwiML dial command
   ↓
8. Call is placed to the number
```

## ✅ Health Checks

All endpoints should respond with 200 status and proper content:

```bash
# Token endpoint
curl -I https://sales-crm-sigma-eosin.vercel.app/api/twilio/token

# Voice endpoint (accepts POST)
curl -X POST -I https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice

# SMS endpoint (accepts POST)
curl -X POST -I https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms
```

All should return `200 OK` or appropriate error status.

## 🚀 Deployment Checklist

- [ ] API route files created in `/api/` directory
- [ ] `services/twilioService.ts` updated with `/api/*` paths
- [ ] Environment variables set in Vercel
- [ ] Code pushed to repository
- [ ] Vercel deployment completed
- [ ] Twilio TwiML app URLs updated
- [ ] All endpoints tested with curl commands
- [ ] Browser console shows no errors
- [ ] Token generation works in app

## 🔗 Related Files

- Main service: `services/twilioService.ts`
- Dialer component: `components/Dialer.tsx`
- Environment config: `.env.local`
- Migration guide: `VERCEL_MIGRATION.md`
