# SalesCRM - System Documentation
**Version 1.0 | February 2026**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Features & Capabilities](#features--capabilities)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Component Structure](#component-structure)
8. [Security](#security)
9. [Deployment](#deployment)
10. [Maintenance](#maintenance)

---

## System Overview

### Purpose
SalesCRM is a full-stack customer relationship management system with integrated telephony capabilities. It enables sales teams to manage leads, make calls, send SMS messages, and track performance metrics from a single unified interface.

### Key Capabilities
- **Dual Telephony Providers:** Twilio (primary) and Zadarma (fallback)
- **CRM Management:** Leads, contacts, deals with pipeline visualization
- **Real-Time Communication:** Voice calls and SMS messaging
- **Analytics Dashboard:** Performance tracking and reporting
- **Secure Authentication:** Multi-factor authentication support

### Target Users
- Sales representatives
- Sales managers
- Business development teams
- Customer support teams

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │  │  Dialer UI   │  │ Analytics UI │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Custom Hooks │  │   Services   │  │  Utilities   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
│  Supabase API    │  │  Twilio API  │  │  Zadarma API     │
│  (PostgreSQL)    │  │  (Voice/SMS) │  │  (WebRTC)        │
└──────────────────┘  └──────────────┘  └──────────────────┘
```

### Layered Architecture

#### 1. Presentation Layer
- **Components:** React functional components
- **Styling:** Tailwind CSS with custom design system
- **Animations:** Framer Motion
- **Charts:** Recharts library

#### 2. Application Layer
- **State Management:** React Hooks (useState, useEffect, useCallback, useMemo)
- **Custom Hooks:** Business logic orchestration
- **Services:** Business logic and API integration
- **Utilities:** Helper functions and validators

#### 3. Data Layer
- **Primary Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (avatars, files)

#### 4. Integration Layer
- **Twilio:** Voice calls, SMS, webhooks
- **Zadarma:** WebRTC widget, callback API
- **Vercel:** Serverless API functions

---

## Technology Stack

### Frontend
```json
{
  "framework": "React 18.2.0",
  "language": "TypeScript 5.x",
  "styling": "Tailwind CSS 3.x",
  "animations": "Framer Motion 11.x",
  "charts": "Recharts 2.x",
  "icons": "Lucide React 0.x",
  "build": "Vite 5.x"
}
```

### Backend
```json
{
  "database": "Supabase (PostgreSQL 15)",
  "authentication": "Supabase Auth",
  "api": "Supabase REST API",
  "realtime": "Supabase Realtime",
  "storage": "Supabase Storage"
}
```

### Telephony
```json
{
  "primary": "Twilio Voice SDK v2",
  "fallback": "Zadarma WebRTC",
  "sms": "Twilio SMS API",
  "webhooks": "Vercel Serverless Functions"
}
```

### Development Tools
```json
{
  "version_control": "Git",
  "package_manager": "npm",
  "linting": "ESLint",
  "formatting": "Prettier",
  "deployment": "Vercel"
}
```

---

## Features & Capabilities

### 1. Telephony Features

#### Voice Calling
- **Outgoing Calls:**
  - Click-to-call from lead/contact records
  - Manual dialing with number pad
  - Call status indicators (connecting, ringing, connected)
  - Real-time duration tracking
  - Call controls (mute, hold, transfer, end)

- **Incoming Calls:**
  - Visual incoming call notifications
  - Caller ID display
  - Accept/reject options
  - Automatic lead matching

- **Call History:**
  - Complete call log with timestamps
  - Call duration tracking
  - Call type (incoming/outgoing/missed)
  - Associated lead/contact information
  - Call recordings (if enabled)

#### SMS Messaging
- **Send SMS:**
  - Send from lead/contact records
  - Character count and multi-part detection
  - Delivery status tracking
  - Message templates

- **Receive SMS:**
  - Webhook-based message receiving
  - Automatic lead matching
  - Message threading
  - Read/unread status

#### Number Support
- Australian mobile (04xx xxx xxx)
- Australian landline (02/03/07/08 xxxx xxxx)
- 1300 shared-cost numbers
- 1800 toll-free numbers
- International numbers (E.164 format)

### 2. CRM Features

#### Lead Management
- **Lead Pipeline:**
  - Visual pipeline with stages (New Lead, Follow-up, Closed)
  - Drag-and-drop stage progression
  - Deal value and probability tracking
  - Weighted forecast calculation

- **Lead Operations:**
  - Create leads with full contact details
  - Edit lead information
  - Delete leads (with cascade)
  - Search leads by name, company, email, phone
  - Filter by status, date range

- **Lead Details:**
  - Contact information (name, email, phone)
  - Company and role
  - Avatar/profile picture
  - Online status indicator
  - Activity timeline
  - Notes and comments

#### Contact Management
- **Contact Database:**
  - Centralized contact repository
  - Contact status (Active/Inactive)
  - Last contacted tracking
  - Company association

- **Contact Operations:**
  - Add new contacts
  - Edit contact details
  - Delete contacts
  - Search and filter
  - Bulk import/export

#### Deal Management
- **Deal Pipeline:**
  - Visual deal stages (Qualified, Proposal, Negotiation, Closed)
  - Deal value tracking
  - Closing date management
  - Deal owner assignment
  - Win/loss tracking

- **Deal Operations:**
  - Create deals from leads
  - Update deal status
  - Move deals between stages
  - Delete deals
  - Deal history tracking

### 3. Analytics & Reporting

#### Call Analytics
- **Metrics:**
  - Total calls made/received
  - Average call duration
  - Call success rate
  - Peak calling hours
  - Daily call volume (7-day chart)

- **Visualizations:**
  - Area chart (daily call trends)
  - Pie chart (call type distribution)
  - Bar chart (comparative metrics)

#### SMS Analytics
- **Metrics:**
  - Total messages sent/received
  - Delivery rate
  - Response rate
  - Daily message volume

#### Pipeline Analytics
- **Metrics:**
  - Total pipeline value
  - Weighted forecast
  - Average deal probability
  - Conversion rates by stage
  - Average deal cycle time

#### Engagement Metrics
- **Metrics:**
  - Total touchpoints
  - Channel split (calls vs SMS)
  - Activity trends
  - Response times
  - Lead engagement score

### 4. User Management

#### Authentication
- Email/password login
- Secure session management
- Auto-logout on inactivity
- Password reset flow

#### Multi-Factor Authentication
- TOTP-based MFA
- QR code generation
- Recovery codes
- MFA enforcement options

#### Profile Management
- Avatar upload
- Profile editing
- Password change
- Account settings
- User preferences

---

## Database Schema

### Tables Overview

```sql
-- Core CRM Tables
leads           (Lead management)
contacts        (Contact database)
deals           (Deal pipeline)
activities      (Activity tracking)
notes           (Notes and comments)

-- Telephony Tables
call_history    (Call logs)
sms_messages    (SMS logs)

-- User Management
profiles        (User profiles)
```

### Detailed Schema

#### 1. leads
```sql
CREATE TABLE leads (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    avatar TEXT,
    status TEXT CHECK (status IN ('New Lead', 'Follow-up', 'Closed')),
    last_activity_time TEXT,
    email TEXT,
    phone TEXT,
    is_online BOOLEAN DEFAULT false,
    deal_value NUMERIC DEFAULT 0,
    probability NUMERIC DEFAULT 0,
    last_contact_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);
```

#### 2. contacts
```sql
CREATE TABLE contacts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    email TEXT,
    phone TEXT,
    last_contacted TEXT,
    status TEXT CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_phone ON contacts(phone);
```

#### 3. deals
```sql
CREATE TABLE deals (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    value NUMERIC DEFAULT 0,
    company TEXT,
    stage TEXT CHECK (stage IN ('Qualified', 'Proposal', 'Negotiation', 'Closed')),
    owner TEXT,
    closing_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_owner ON deals(owner);
```

#### 4. call_history
```sql
CREATE TABLE call_history (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    call_type TEXT CHECK (call_type IN ('incoming', 'outgoing', 'missed')) DEFAULT 'outgoing',
    duration_seconds INTEGER DEFAULT 0,
    call_sid TEXT UNIQUE,
    recording_url TEXT,
    notes TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_call_history_lead_id ON call_history(lead_id);
CREATE INDEX idx_call_history_user_id ON call_history(user_id);
CREATE INDEX idx_call_history_created_at ON call_history(created_at);
```

#### 5. sms_messages
```sql
CREATE TABLE sms_messages (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    message_text TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN ('sent', 'received')) DEFAULT 'sent',
    message_sid TEXT UNIQUE,
    status TEXT CHECK (status IN ('pending', 'sent', 'delivered', 'failed')) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sms_messages_lead_id ON sms_messages(lead_id);
CREATE INDEX idx_sms_messages_created_at ON sms_messages(created_at);
```

#### 6. activities
```sql
CREATE TABLE activities (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('call', 'email', 'meeting', 'note')),
    title TEXT,
    description TEXT,
    timestamp TEXT,
    duration TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_type ON activities(type);
```

#### 7. notes
```sql
CREATE TABLE notes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    content TEXT,
    is_pinned BOOLEAN DEFAULT false,
    author TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notes_lead_id ON notes(lead_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
```

#### 8. profiles
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
```

### Row Level Security (RLS)

All tables have RLS enabled with user-specific policies:

```sql
-- Example: call_history RLS policies
CREATE POLICY "Users can view their own call history"
    ON call_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own call history"
    ON call_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own call history"
    ON call_history FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own call history"
    ON call_history FOR DELETE
    USING (auth.uid() = user_id);
```

---

## API Reference

### Supabase API Endpoints

#### Authentication
```typescript
// Sign in
POST /auth/v1/token?grant_type=password
Body: { email, password }

// Sign up
POST /auth/v1/signup
Body: { email, password }

// Sign out
POST /auth/v1/logout

// Get user
GET /auth/v1/user
```

#### Database Operations
```typescript
// Query leads
GET /rest/v1/leads?select=*&order=created_at.desc

// Create lead
POST /rest/v1/leads
Body: { name, email, phone, ... }

// Update lead
PATCH /rest/v1/leads?id=eq.{id}
Body: { status, ... }

// Delete lead
DELETE /rest/v1/leads?id=eq.{id}
```

### Twilio API Endpoints

#### Voice
```typescript
// Get access token
POST /api/twilio/token
Body: { identity: string }
Response: { token: string, method: string }

// Voice TwiML
POST /api/twiml/voice
Body: { To: string, From: string }
Response: TwiML XML
```

#### SMS
```typescript
// Send SMS
POST /api/sms
Body: { to: string, body: string }
Response: { success: boolean, messageSid: string }

// Incoming SMS webhook
POST /api/incoming-sms
Body: Twilio webhook payload
Response: TwiML XML
```

### Zadarma API Endpoints

#### WebRTC
```typescript
// Get WebRTC key
GET /api/zadarma/webrtc-key?sip_login={sip}
Response: { success: boolean, key: string, expiresIn: string }

// Make call
POST /api/zadarma/make-call
Body: { to: string, predicted: boolean }
Response: { success: boolean, callId: string }
```

---

## Component Structure

### Directory Organization

```
src/
├── components/
│   ├── Analytics.tsx
│   ├── Contacts.tsx
│   ├── Dashboard.tsx
│   ├── Deals.tsx
│   ├── Dialer/
│   │   ├── index.tsx
│   │   ├── DialPad.tsx
│   │   ├── CallControls.tsx
│   │   └── IncomingCallBanner.tsx
│   ├── Header/
│   │   ├── index.tsx
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   ├── LeadDetail.tsx
│   ├── LeadForm.tsx
│   ├── LeadList.tsx
│   ├── Sidebar.tsx
│   └── ZadarmaWebRTC/
│       ├── index.tsx
│       ├── LoadingState.tsx
│       ├── ErrorState.tsx
│       └── ReadyState.tsx
├── hooks/
│   ├── useActivities.ts
│   ├── useCallHistory.ts
│   ├── useCallState.ts
│   ├── useContacts.ts
│   ├── useDeals.ts
│   ├── useDialer.ts
│   ├── useIncomingCalls.ts
│   ├── useLeads.ts
│   ├── useNotes.ts
│   ├── useSMSMessages.ts
│   └── useZadarmaWebRTC.ts
├── services/
│   ├── supabaseClient.ts
│   ├── twilioService.ts
│   ├── telephony/
│   │   ├── CallHistoryService.ts
│   │   ├── CallService.ts
│   │   ├── ZadarmaAudioService.ts
│   │   ├── ZadarmaScriptLoader.ts
│   │   └── ZadarmaWidgetService.ts
│   ├── FileUploadService.ts
│   ├── PasswordService.ts
│   └── ProfileService.ts
├── types/
│   └── index.ts
├── pages/
│   └── Auth.tsx
└── App.tsx
```

### Key Components

#### 1. Dialer Component
**Purpose:** Main telephony interface  
**Location:** `components/Dialer/index.tsx`  
**Lines:** ~280 (refactored from 807)

**Props:**
```typescript
interface DialerProps {
  targetLead?: Lead;
  onLogActivity?: (activity: Activity) => void;
  activeTab?: 'Dialer' | 'SMS' | 'History';
  onTabChange?: (tab: string) => void;
}
```

**Features:**
- Dual provider support (Twilio/Zadarma)
- Number pad with DTMF
- Call controls (mute, hold, transfer)
- SMS messaging
- Call history view

#### 2. Analytics Component
**Purpose:** Performance metrics and reporting  
**Location:** `components/Analytics.tsx`  
**Lines:** ~246

**Props:**
```typescript
interface AnalyticsProps {
  items: Lead[];
  onNavigate?: (view: string) => void;
}
```

**Features:**
- KPI cards (pipeline value, forecast, confidence)
- Daily activity chart (calls & SMS)
- Channel split pie chart
- Real-time data from database

#### 3. LeadList Component
**Purpose:** Lead pipeline visualization  
**Location:** `components/LeadList.tsx`

**Features:**
- Drag-and-drop stage management
- Search and filter
- Lead cards with quick actions
- Status indicators

---

## Security

### Authentication

#### Supabase Auth
- **Method:** Email/password with JWT tokens
- **Session:** Secure HTTP-only cookies
- **Expiration:** Configurable token lifetime
- **Refresh:** Automatic token refresh

#### Multi-Factor Authentication
- **Type:** TOTP (Time-based One-Time Password)
- **Setup:** QR code generation
- **Recovery:** Backup codes provided
- **Enforcement:** Optional per-user

### Authorization

#### Row Level Security (RLS)
- **Enabled:** All tables
- **Policies:** User-specific data isolation
- **Enforcement:** Database-level security

```sql
-- Example RLS policy
CREATE POLICY "Users can only see their own data"
    ON table_name FOR ALL
    USING (auth.uid() = user_id);
```

### Data Protection

#### Encryption
- **In Transit:** TLS 1.3
- **At Rest:** AES-256 encryption (Supabase)
- **Passwords:** bcrypt hashing

#### API Security
- **Authentication:** Bearer tokens
- **Rate Limiting:** Supabase built-in
- **CORS:** Configured for allowed origins

### Best Practices

1. **Never expose secrets in client code**
2. **Use environment variables for configuration**
3. **Validate all user input**
4. **Sanitize data before database insertion**
5. **Use parameterized queries (Supabase handles this)**
6. **Implement proper error handling**
7. **Log security events**

---

## Deployment

### Environment Setup

#### Required Environment Variables
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_API_KEY_SID=your-api-key-sid
TWILIO_API_KEY_SECRET=your-api-key-secret
TWILIO_PHONE_NUMBER=+1234567890

# Zadarma
ZADARMA_API_KEY=your-api-key
ZADARMA_API_SECRET=your-api-secret
ZADARMA_SIP_LOGIN=12825

# Application
VITE_APP_URL=https://your-app.vercel.app
```

### Deployment Steps

#### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### 2. Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

#### 3. Configure Webhooks
- **Twilio Voice:** `https://your-app.vercel.app/api/twiml/voice`
- **Twilio SMS:** `https://your-app.vercel.app/api/incoming-sms`

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Webhooks configured
- [ ] SSL/TLS certificates valid
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Backup strategy in place

---

## Maintenance

### Monitoring

#### Application Monitoring
- **Vercel Analytics:** Page views, performance
- **Supabase Dashboard:** Database queries, connections
- **Error Tracking:** Console errors, API failures

#### Telephony Monitoring
- **Twilio Console:** Call logs, SMS logs, errors
- **Zadarma Dashboard:** Call statistics, balance

### Backup Strategy

#### Database Backups
- **Frequency:** Daily automatic backups (Supabase)
- **Retention:** 7 days (free tier), 30 days (pro)
- **Manual Backups:** Export via Supabase dashboard

#### Code Backups
- **Version Control:** Git repository
- **Deployment History:** Vercel deployment logs

### Updates & Patches

#### Dependency Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update to latest
npm install package@latest
```

#### Security Patches
- Monitor GitHub security advisories
- Apply critical patches immediately
- Test in staging before production

### Performance Optimization

#### Frontend
- Code splitting and lazy loading
- Image optimization
- Minimize bundle size
- Use production builds

#### Database
- Regular VACUUM and ANALYZE
- Index optimization
- Query performance monitoring

#### API
- Implement caching where appropriate
- Use connection pooling
- Monitor API rate limits

---

## Support & Troubleshooting

### Common Issues

#### 1. Twilio Connection Errors
**Symptom:** "Failed to get access token"  
**Solution:** Check Twilio credentials in environment variables

#### 2. Database Connection Errors
**Symptom:** "Failed to fetch data"  
**Solution:** Verify Supabase URL and anon key

#### 3. Call Quality Issues
**Symptom:** Poor audio quality  
**Solution:** Check network connection, try different provider

### Getting Help

#### Documentation
- Twilio Docs: https://www.twilio.com/docs
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev

#### Support Channels
- Email: vincent.tiongson@example.com
- GitHub Issues: [Repository URL]
- Twilio Support: https://support.twilio.com

---

**Document Version:** 1.0  
**Last Updated:** February 4, 2026  
**Author:** Vincent Tiongson  
**Status:** Production Ready
