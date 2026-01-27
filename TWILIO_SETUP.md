# Twilio Integration Setup Guide

This guide walks you through setting up Twilio calling and SMS functionality in SalesCRM.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Twilio Account Setup](#twilio-account-setup)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- A Twilio account (free tier available at https://www.twilio.com/try-twilio)

## Twilio Account Setup

### Step 1: Create a Twilio Account

1. Visit https://www.twilio.com/try-twilio
2. Sign up with your email and verify your account
3. Complete the account creation process
4. Keep the Twilio Console tab open for the next steps

### Step 2: Get Your Account Credentials

1. Navigate to Twilio Console: https://console.twilio.com
2. Find your **Account SID** and **Auth Token** on the Dashboard
3. Copy these values - you'll need them in `.env.local`

![Twilio Dashboard](https://www.twilio.com/docs/_static/account-dashboard.png)

### Step 3: Create an API Key & Secret

1. Go to **Account** → **API Keys & Tokens**
2. Click **Create API Key** 
3. Enter a name (e.g., "SalesCRM Dev")
4. Select "Signing Key SID" for voice/messaging
5. Click **Create**
6. Save the **API Key SID** and **API Secret** - store securely!

### Step 4: Buy a Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Buy a Number**
2. Choose a country (e.g., US) and city
3. Select a number that supports Voice and Messaging
4. Click **Buy**
5. Copy the phone number (e.g., +1 415 555 1212)

### Step 5: Create a TwiML Application

1. Go to **Phone Numbers** → **Manage** → **TwiML Apps**
2. Click **Create TwiML App**
3. Enter a name (e.g., "SalesCRM Dev")
4. For **Voice Request URL**, enter:
   ```
   http://localhost:4000/twiml/voice
   ```
5. For **Messaging Request URL**, enter:
   ```
   http://localhost:4000/incoming-sms
   ```
6. Click **Create**
7. Copy the **SID** from the next page

## Configuration

### Step 1: Install Backend Dependencies

```bash
npm run backend:install
```

This installs dependencies for `/backend` directory.

### Step 2: Create `.env.local` File

Create a file named `.env.local` in the project root (same level as `package.json`):

```
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=your_api_key_sid_here
TWILIO_API_SECRET=your_api_secret_here
TWILIO_PHONE_NUMBER=+1 415 555 1212
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Backend Configuration
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
PORT=4000
```

**Replace the values with your actual Twilio credentials.**

⚠️ **IMPORTANT**: Never commit `.env.local` to Git! It's already in `.gitignore`.

### Step 3: Update Frontend Environment (Optional)

If you want to expose Twilio credentials to the frontend build, update `vite.config.ts`:

```typescript
define: {
  'process.env.VITE_TWILIO_PHONE_NUMBER': JSON.stringify(env.TWILIO_PHONE_NUMBER)
}
```

(This is optional - the backend handles credential security)

## Running the Application

### Option 1: Run Frontend & Backend Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Runs Vite dev server on `http://localhost:3000`

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```
Runs Express server on `http://localhost:4000`

### Option 2: Run Both Together

```bash
npm run dev:all
```

This starts both frontend and backend in parallel (requires two processes).

## Testing

### Test with Dialer UI

1. Open http://localhost:3000 in your browser
2. Log in (any credentials work in mock auth)
3. Navigate to a lead
4. In the **Dialer** tab:
   - Enter a phone number (e.g., your own cell phone)
   - Click the green **Call** button
5. You should receive a call from your Twilio number!

### Test SMS

1. In the **SMS** tab:
   - Enter a message
   - Click **Send**
2. You should receive an SMS from your Twilio number

### Check Logs

Backend logs show call/SMS activity:
```
Call ABC123 status: initiated | From: Alex Rivers | To: +1 555 012 3456
Message XYZ789 status: queued | From: +1 415 555 1212 | To: +1 555 012 3456
```

## Production Deployment

### Before Deploying:

1. **Separate Credentials**: Use different API keys for dev vs. production
2. **Environment Variables**: Set in your hosting platform (Netlify, Vercel, Heroku, etc.)
3. **TwiML URLs**: Update webhook URLs to match your production domain:
   ```
   https://yourdomain.com/twiml/voice
   https://yourdomain.com/incoming-sms
   ```
4. **CORS**: Update `backend/server.js` CORS allowed origins to your production domains
5. **SSL/HTTPS**: All Twilio webhooks must use HTTPS URLs

### Deployment Platform Examples

**Vercel (Frontend) + Render (Backend):**

1. Deploy frontend to Vercel (auto-deploys from `dist/`)
2. Deploy backend to Render.com free tier (Node.js)
3. Set environment variables in each platform
4. Update `BACKEND_URL` in Vercel to your Render backend URL

**Heroku (Full Stack):**

```bash
# Deploy root project
git push heroku main

# Ensure Procfile exists:
web: npm run dev:backend
```

## Troubleshooting

### "TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set"

- Check that `.env.local` exists in the project root
- Verify credentials are correct (copy directly from Twilio Console)
- Restart the backend server after updating `.env.local`

### "TWILIO_API_KEY and TWILIO_API_SECRET not configured"

- Create an API Key in Twilio Console (see Step 3 above)
- Add `TWILIO_API_KEY` and `TWILIO_API_SECRET` to `.env.local`
- These are different from your Account Token!

### "Connection refused - localhost:4000"

- Ensure backend is running: `npm run dev:backend`
- Check that PORT 4000 is not in use: `lsof -i :4000`
- On macOS: Kill process with `kill -9 <PID>`

### "Invalid TwiML SID"

- Verify `TWILIO_TWIML_APP_SID` matches your actual TwiML App SID
- Check in Twilio Console under **Phone Numbers** → **Manage** → **TwiML Apps**

### Call connects but no audio

- Ensure your Twilio number supports Voice calling
- Check browser microphone permissions
- Test with a different phone number
- Verify TwiML App webhook URL is correct

### SMS not received

- Verify `TWILIO_PHONE_NUMBER` is correct
- Check that your number is SMS-capable (check Twilio Console)
- Verify recipient phone number is in E.164 format (+1 555 012 3456)

### "CORS error from frontend"

- Check backend is running on correct port (4000)
- Update `VITE_BACKEND_URL` if using custom port
- Ensure backend CORS origins include your frontend URL

## Support

- **Twilio Docs**: https://www.twilio.com/docs
- **Twilio Support**: https://support.twilio.com
- **GitHub Issues**: Report integration bugs in this repo

---

**Next Steps:**
- [ ] Create Twilio account
- [ ] Get credentials (Account SID, Auth Token)
- [ ] Create API Key & Secret
- [ ] Buy a phone number
- [ ] Create TwiML Application
- [ ] Add credentials to `.env.local`
- [ ] Install backend: `npm run backend:install`
- [ ] Run backend: `npm run dev:backend`
- [ ] Run frontend: `npm run dev`
- [ ] Test calling and SMS
