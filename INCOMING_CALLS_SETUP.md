# Twilio Incoming Call Configuration

This guide explains how to configure your Twilio phone number to receive incoming calls.

## Overview

When someone calls your Twilio phone number, Twilio needs to know what to do with the call. You configure this by setting a **Voice Webhook** that returns TwiML instructions.

## Available Incoming Call Handlers

### 1. Route to Browser Client (Default)
**Endpoint:** `/api/twiml/incoming-call`

Routes incoming calls to the browser-based Dialer component.

**Use case:** CRM agents answering calls in the web app

**Setup:**
1. Go to [Twilio Console → Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
2. Click on your phone number
3. Under "Voice Configuration":
   - A CALL COMES IN: **Webhook**
   - URL: `https://sales-crm-sigma-eosin.vercel.app/api/twiml/incoming-call`
   - HTTP: **POST**
4. Click **Save**

### 2. Forward to Another Phone
**Endpoint:** `/api/twiml/forward-call`

Forwards all incoming calls to a specific phone number (e.g., your mobile).

**Use case:** Simple call forwarding, after-hours routing

**Setup:**
1. Add environment variable in Vercel:
   ```
   FORWARD_TO_NUMBER=+15551234567
   ```
2. Configure Twilio phone number webhook:
   - URL: `https://sales-crm-sigma-eosin.vercel.app/api/twiml/forward-call`
   - HTTP: **POST**

### 3. Voicemail Recording
**Endpoint:** `/api/twiml/voicemail`

Records voicemail messages with optional transcription.

**Use case:** After-hours voicemail, overflow routing

**Setup:**
1. (Optional) Enable transcription in Vercel:
   ```
   ENABLE_TRANSCRIPTION=true
   ```
2. Configure Twilio phone number webhook:
   - URL: `https://sales-crm-sigma-eosin.vercel.app/api/twiml/voicemail`
   - HTTP: **POST**

## Testing Incoming Calls

1. Make sure your Twilio Device is initialized in the browser (green "Device Ready" status)
2. Call your Twilio phone number from any phone
3. The Dialer should show an "Incoming Call" notification
4. Click **Answer** to accept or **Reject** to decline

## Client Identity Matching

The browser client must use the same identity that the webhook routes to.

**Current configuration:**
- Client identity: `user_default`
- Webhook routes to: `user_default`

These **must match** for incoming calls to work.

## Advanced: Dynamic Routing

To route calls based on business logic (e.g., lead assignment, agent availability):

1. Modify `/api/twiml/incoming-call.ts` to implement your routing logic
2. Use Twilio's [TaskRouter](https://www.twilio.com/docs/taskrouter) for queue-based routing
3. Store agent statuses in your database and route accordingly

Example:
```typescript
// Get available agent from database
const agent = await getAvailableAgent();
const clientIdentity = agent ? `user_${agent.id}` : 'user_default';
```

## Troubleshooting

### Incoming calls not reaching browser
- ✅ Check that client identity matches in both places
- ✅ Verify webhook URL is correct in Twilio Console
- ✅ Ensure browser has microphone permissions
- ✅ Check browser console for errors

### Calls go straight to voicemail
- ✅ Verify the correct webhook endpoint is configured
- ✅ Check that `<Client>` identity exists and is registered
- ✅ Increase `timeout` value in `<Dial>` if needed

### No transcriptions received
- ✅ Verify `ENABLE_TRANSCRIPTION=true` is set
- ✅ Check transcription webhook URL is accessible
- ✅ Review Twilio debugger for webhook errors

## Production Considerations

1. **Use authenticated identities:** Replace `user_default` with actual user IDs
2. **Implement presence:** Track which agents are online/available
3. **Queue overflow:** Route to voicemail if no agents available
4. **Recording storage:** Save recordings to S3 or similar storage
5. **Call logs:** Store call details in your database via webhooks

## Related Files

- [/api/twiml/incoming-call.ts](api/twiml/incoming-call.ts) - Main incoming call handler
- [/api/twiml/forward-call.ts](api/twiml/forward-call.ts) - Call forwarding
- [/api/twiml/voicemail.ts](api/twiml/voicemail.ts) - Voicemail recording
- [/api/webhooks/transcription.ts](api/webhooks/transcription.ts) - Transcription callback
- [/components/Dialer.tsx](components/Dialer.tsx) - Browser client UI
