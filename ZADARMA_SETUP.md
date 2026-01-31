// Zadarma Integration Setup Guide

## Overview
This guide explains how to set up and use the Zadarma telephony provider alongside Twilio in SalesCRM.

## Architecture
The system uses a provider abstraction layer that allows runtime switching between Twilio and Zadarma:

```
Dialer Component
    ↓
TelephonyFactory (Provider Switcher)
    ↓
ITelephonyProvider Interface
    ├── TwilioProvider (wraps existing twilioService.ts)
    └── ZadarmaProvider (new implementation)
```

## Environment Variables

### Backend (Vercel)
Add these to your Vercel project environment variables:

```bash
# Zadarma API Credentials
ZADARMA_API_KEY=9730a08f829a0b6b08ba
ZADARMA_SECRET_KEY=cecf0fdc63df8efbc513
ZADARMA_SIP_NUMBER=<your-zadarma-sip-number>

# Existing Twilio variables (unchanged)
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>
# ... other Twilio variables
```

### Frontend (Vite)
Add to your `.env` file:

```bash
# Default provider (optional, defaults to 'twilio')
VITE_TELEPHONY_PROVIDER=twilio

# Existing Supabase variables (unchanged)
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
```

## Zadarma Webhook Configuration

### 1. Configure Webhooks in Zadarma Dashboard
Go to https://my.zadarma.com/api/ and configure:

**PBX Notifications URL:**
```
https://your-domain.vercel.app/api/zadarma/webhooks/call-notify
```

**Enable these webhook events:**
- ✅ NOTIFY_START - Incoming call started
- ✅ NOTIFY_END - Call ended
- ✅ NOTIFY_ANSWER - Call answered
- ✅ NOTIFY_OUT_START - Outgoing call started
- ✅ NOTIFY_OUT_END - Outgoing call ended
- ⬜ NOTIFY_INTERNAL - (optional) Internal PBX calls

### 2. Test Webhook Delivery
After configuration, test a call and verify webhooks are received:

```bash
# Check Vercel logs
vercel logs --follow

# You should see:
# 📞 Zadarma webhook received: NOTIFY_START {...}
# ✅ Call history created: <pbx_call_id>
```

## Database Schema Updates

### Add Provider Column (Optional)
To track which provider was used for each call:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE call_history 
ADD COLUMN provider TEXT DEFAULT 'twilio';

ALTER TABLE sms_messages 
ADD COLUMN provider TEXT DEFAULT 'twilio';
```

## Usage

### Switching Providers at Runtime
Users can switch providers via the UI in the Dialer footer:

1. Click "Switch Provider" button
2. Confirm the switch in the modal
3. Provider reinitializes with new selection
4. Preference is saved in localStorage

### Programmatic Provider Access
```typescript
import { useTelephony } from '@/context';

function MyComponent() {
  const { provider, providerInstance, switchProvider } = useTelephony();
  
  // Current provider
  console.log(provider); // 'twilio' or 'zadarma'
  
  // Make a call using current provider
  await providerInstance?.makeCall(phoneNumber);
  
  // Switch to Zadarma
  await switchProvider('zadarma');
}
```

## Key Differences Between Providers

### Twilio
- **Call Method:** WebRTC (instant browser calling)
- **Incoming Calls:** Real-time via WebSocket
- **Mute/Hold:** Supported
- **Best For:** Instant call connection, US/AU numbers

### Zadarma
- **Call Method:** Callback (calls you first, then recipient)
- **Incoming Calls:** Via webhooks + Supabase realtime
- **Mute/Hold:** Not supported in callback mode
- **Best For:** International calling, cost savings

## Troubleshooting

### Zadarma Calls Not Connecting
1. Verify API credentials in Vercel environment variables
2. Check Zadarma account balance
3. Review Zadarma dashboard for call logs
4. Verify SIP number is configured

### Webhooks Not Received
1. Verify webhook URL in Zadarma dashboard
2. Check Vercel function logs
3. Ensure Supabase credentials are correct
4. Test webhook endpoint manually:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/zadarma/webhooks/call-notify \
     -H "Content-Type: application/json" \
     -d '{"event":"NOTIFY_START","pbx_call_id":"test123"}'
   ```

### Provider Switch Not Working
1. Check browser console for errors
2. Verify localStorage has 'telephony_provider' key
3. Ensure no active call when switching
4. Try clearing browser cache

## Files Created (Zero Twilio Modifications)

### Core Provider System
- `services/telephony/ITelephonyProvider.ts` - Provider interface
- `services/telephony/TelephonyTypes.ts` - Shared types
- `services/telephony/TwilioProvider.ts` - Twilio wrapper (uses existing twilioService.ts)
- `services/telephony/ZadarmaProvider.ts` - Zadarma implementation
- `services/telephony/TelephonyFactory.ts` - Provider factory

### Backend API
- `api/zadarma/config.ts` - Zadarma authentication
- `api/zadarma/initialize.ts` - Device initialization
- `api/zadarma/make-call.ts` - Outgoing calls
- `api/zadarma/call-logs.ts` - Call history
- `api/zadarma/send-sms.ts` - SMS sending
- `api/zadarma/validate-number.ts` - Number validation
- `api/zadarma/webhooks/call-notify.ts` - Webhook handler
- `api/zadarma/hangup-call.ts` - Call termination
- `api/zadarma/reject-call.ts` - Call rejection

### Frontend Components
- `components/Providers/TelephonyProviderBadge.tsx` - Status badge
- `components/Providers/ProviderSwitcher.tsx` - Switch UI
- `components/Providers/ProviderSettings.tsx` - Settings panel
- `context/TelephonyContext.tsx` - React context
- `hooks/useTelephonyProvider.ts` - Provider selection hook
- `utils/telephonyConfig.ts` - Configuration utilities

## Testing Checklist

### Twilio (Existing Functionality)
- ✅ Make outgoing call
- ✅ Receive incoming call
- ✅ Answer/reject calls
- ✅ Mute/unmute
- ✅ Send SMS
- ✅ View call logs

### Zadarma (New Functionality)
- ⬜ Make outgoing call (callback method)
- ⬜ Receive incoming call notification
- ⬜ View call in Supabase call_history
- ⬜ Send SMS (verify endpoint)
- ⬜ View Zadarma call logs
- ⬜ Switch between providers

### Provider Switching
- ⬜ Switch from Twilio to Zadarma
- ⬜ Switch from Zadarma to Twilio
- ⬜ Preference persists after reload
- ⬜ Cannot switch during active call
- ⬜ Device reinitializes correctly

## Next Steps

1. Deploy to Vercel with environment variables
2. Configure Zadarma webhooks in dashboard
3. Test outgoing call with Zadarma
4. Verify webhook delivery to Supabase
5. Test provider switching UI
6. Monitor call logs in both providers
