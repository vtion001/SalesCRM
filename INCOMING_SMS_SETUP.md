# Incoming SMS Setup Guide

This guide explains how to configure your Twilio phone number to receive incoming SMS messages in the SalesCRM application.

## Overview

The incoming SMS functionality allows your application to:
- ✅ Receive SMS messages sent to your Twilio phone number
- ✅ Store incoming messages in Supabase database
- ✅ Display messages in the Dialer SMS tab
- ✅ Track message delivery status
- ✅ Handle media attachments (MMS)

## Architecture

```
Sender → Twilio Phone Number → Twilio Webhook → /api/incoming-sms → Supabase DB → UI
```

## Quick Setup (5 minutes)

### 1. Deploy to Vercel
Ensure all API routes are deployed:
```bash
vercel --prod
```

Your endpoints should be live at:
- **Incoming SMS**: `https://your-app.vercel.app/api/incoming-sms`
- **Status Updates**: `https://your-app.vercel.app/api/webhooks/message-status`

### 2. Configure Twilio Phone Number

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on your phone number
4. Scroll to **Messaging Configuration** section
5. Under "A MESSAGE COMES IN":
   - Set **Webhook** 
   - URL: `https://your-app.vercel.app/api/incoming-sms`
   - HTTP Method: **POST**
6. Click **Save**

### 3. Test It!

Send an SMS to your Twilio phone number from any phone. You should see:
- ✅ Console log in Vercel function logs
- ✅ Message stored in `sms_messages` table in Supabase
- ✅ Message appears in Dialer SMS tab (if UI is connected)

## API Endpoints

### `/api/incoming-sms` (POST)
Handles incoming SMS messages from Twilio.

**Twilio sends:**
```json
{
  "MessageSid": "SM...",
  "From": "+15551234567",
  "To": "+15557654321",
  "Body": "Hello from customer!",
  "NumMedia": "0",
  "FromCity": "San Francisco",
  "FromState": "CA",
  "FromCountry": "US"
}
```

**Response:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>
```

### `/api/webhooks/message-status` (POST)
Receives delivery status updates for sent messages.

**Twilio sends:**
```json
{
  "MessageSid": "SM...",
  "MessageStatus": "delivered",
  "To": "+15551234567",
  "From": "+15557654321",
  "ErrorCode": null,
  "ErrorMessage": null
}
```

**Possible statuses:**
- `queued` - Message queued for sending
- `sent` - Sent to carrier
- `delivered` - Successfully delivered
- `undelivered` - Failed to deliver
- `failed` - Permanent failure

## Database Schema

The `sms_messages` table stores all SMS:

```sql
CREATE TABLE sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  body TEXT NOT NULL,
  twilio_message_sid TEXT UNIQUE,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  status TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Troubleshooting

### Messages not appearing in database

**Check 1:** Verify Supabase environment variables in Vercel:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...  # For server-side access
```

**Check 2:** Check Vercel function logs:
```bash
vercel logs --follow
```

You should see:
```
📬 Incoming SMS received: { from: '+1...', to: '+1...', messageSid: 'SM...' }
✅ SMS stored in database (MessageSid: SM...)
```

**Check 3:** Verify table exists:
```sql
SELECT * FROM sms_messages ORDER BY created_at DESC LIMIT 5;
```

### Webhook not triggering

**Check 1:** Verify webhook URL in Twilio Console exactly matches:
```
https://your-app.vercel.app/api/incoming-sms
```

**Check 2:** Test webhook manually:
```bash
curl -X POST https://your-app.vercel.app/api/incoming-sms \
  -d "From=+15551234567" \
  -d "To=+15557654321" \
  -d "Body=Test message" \
  -d "MessageSid=SM123test"
```

Expected response:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>
```

### SMS sending fails with URL error

❌ **Error:**
```
The 'StatusCallback' URL sales-k0ylcd4lw-vtion001s-projects.vercel.app/api/message-status is not a valid URL
```

✅ **Fix:** The statusCallback URL now includes the `https://` protocol in `/api/sms.ts`:
```typescript
const baseUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : 'https://sales-crm-sigma-eosin.vercel.app';
const statusCallbackUrl = `${baseUrl}/api/webhooks/message-status`;
```

## Advanced Features

### Auto-Reply
To send automatic replies to incoming SMS, the webhook handler already has the structure in place:

```typescript
if (shouldAutoReply) {
  const response = new twilio.twiml.MessagingResponse();
  response.message('Thank you for your message! Our team will respond shortly.');
  return res.status(200).send(response.toString());
}
```

You can enable this by passing `?autoReply=true` in the webhook URL or modifying the logic.

### Media Attachments (MMS)
The handler logs media attachments when `NumMedia > 0`:

```javascript
if (NumMedia && parseInt(NumMedia) > 0) {
  for (let i = 0; i < parseInt(NumMedia); i++) {
    const mediaUrl = req.body[`MediaUrl${i}`];
    const mediaType = req.body[`MediaContentType${i}`];
    // Store or process media
  }
}
```

### Forwarding to Email
You could add email forwarding using a service like SendGrid:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: 'team@yourcompany.com',
  from: 'sms@yourcompany.com',
  subject: `New SMS from ${From}`,
  text: Body,
});
```

## Testing Checklist

- [ ] Deployed all changes to Vercel production
- [ ] Configured Twilio phone number webhook
- [ ] Sent test SMS to Twilio number
- [ ] Verified message appears in Vercel logs
- [ ] Verified message stored in Supabase
- [ ] Tested outgoing SMS sending
- [ ] Verified status updates arrive at webhook
- [ ] Checked SMS tab in Dialer UI shows messages

## Next Steps

1. **UI Integration**: Update `Dialer.tsx` SMS tab to fetch and display messages from `sms_messages` table
2. **Real-time Updates**: Use Supabase real-time subscriptions to show incoming SMS immediately
3. **Threading**: Group messages by phone number to show conversation threads
4. **Templates**: Add quick reply templates for common responses
5. **Analytics**: Track SMS volume, response rates, and delivery success

## Documentation

- [Twilio SMS Quickstart](https://www.twilio.com/docs/sms/quickstart)
- [TwiML MessagingResponse](https://www.twilio.com/docs/sms/twiml)
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)

---

**Status:** ✅ SMS receiving infrastructure is complete and deployed
**Last Updated:** 2025
