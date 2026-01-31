## Quick Reference: Zadarma vs Twilio

| Feature | Twilio | Zadarma |
|---------|--------|---------|
| **Call Method** | WebRTC (instant) | Callback (1-2s delay) |
| **Mute/Hold** | ✅ Supported | ❌ Not available |
| **SMS** | ✅ Full support | ⚠️ Limited (verify endpoint) |
| **Incoming Calls** | WebSocket (real-time) | Webhook → Supabase |
| **Call Recording** | Auto-stored | Download via API |
| **Best For** | US/AU, instant calls | International, cost savings |

## Environment Variables

```bash
# Zadarma (Backend only)
ZADARMA_API_KEY=9730a08f829a0b6b08ba
ZADARMA_SECRET_KEY=cecf0fdc63df8efbc513

# Frontend (optional)
VITE_TELEPHONY_PROVIDER=twilio  # or 'zadarma'
```

## Provider Switching

```typescript
// In any component
import { useTelephony } from '@/context';

const { provider, switchProvider } = useTelephony();

// Switch to Zadarma
await switchProvider('zadarma');
```

## Webhook URL
```
https://your-domain.vercel.app/api/zadarma/webhooks/call-notify
```

Configure in: https://my.zadarma.com/api/

## Files Created
- ✅ No modifications to existing Twilio code
- ✅ All Zadarma code in separate files
- ✅ Provider abstraction via interface
- ✅ Runtime provider switching
