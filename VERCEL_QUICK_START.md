# ⚡ Quick Start - Vercel Deployment

**Time to deploy**: ~5 minutes

---

## 1️⃣ Install Dependencies
```bash
npm install
```

## 2️⃣ Deploy to Vercel
```bash
git add .
git commit -m "Add Vercel API routes for Twilio"
git push origin main
```
Wait for Vercel deployment to complete.

## 3️⃣ Update Twilio Console

**Important**: These URLs won't work until you update Twilio

### Voice Calls
1. Go to: https://console.twilio.com/voice/twiml-apps
2. Click your app (SID starts with `AP`)
3. Change **Voice Request URL** to:
```
https://sales-crm-sigma-eosin.vercel.app/api/twiml/voice
```

### Incoming SMS
1. Go to: https://console.twilio.com/phone-numbers/
2. Click your number: `+61468165521`
3. Scroll to **Messaging** section
4. Change **Webhook** to:
```
https://sales-crm-sigma-eosin.vercel.app/api/incoming-sms
```

## 4️⃣ Test It Works

### Test 1: Token Generation
```bash
curl "https://sales-crm-sigma-eosin.vercel.app/api/twilio/token?identity=test"
```
Should return JSON with `token` field ✅

### Test 2: In Browser
1. Open https://sales-crm-sigma-eosin.vercel.app
2. Log in with `admin@salescrm.com` / `password123`
3. Go to **Dialer** tab
4. Open browser console (F12)
5. Look for:
   - `✅ Token received successfully`
   - `✅ Twilio Device ready for calls`
6. Try making a call ✅

## ✅ Done!

Your app is now deployed on Vercel with serverless Twilio integration!

---

### If Something Goes Wrong
1. Check Vercel logs: `vercel logs`
2. Check browser console (F12)
3. Review: [VERCEL_DEPLOYMENT_INSTRUCTIONS.md](VERCEL_DEPLOYMENT_INSTRUCTIONS.md)
4. Review: [VERCEL_API_QUICK_REFERENCE.md](VERCEL_API_QUICK_REFERENCE.md)

### What Was Added
- ✅ 3 API routes in `/api/` directory
- ✅ Updated frontend service
- ✅ Vercel configuration
- ✅ Complete documentation

**Deployment ready!** 🚀
