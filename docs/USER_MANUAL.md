# SalesCRM User Manual
**Version 1.0 | February 2026**

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Making Calls](#making-calls)
4. [Sending SMS](#sending-sms)
5. [Managing Leads](#managing-leads)
6. [Managing Contacts](#managing-contacts)
7. [Managing Deals](#managing-deals)
8. [Analytics & Reporting](#analytics--reporting)
9. [Settings & Profile](#settings--profile)
10. [Tips & Best Practices](#tips--best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Logging In

1. Navigate to the application URL
2. Enter your email address
3. Enter your password
4. Click **Sign In**

**First-time users:** You'll receive a welcome email with login credentials.

### Dashboard Layout

The main interface consists of:
- **Sidebar** (left): Navigation menu
- **Header** (top): User profile, settings, notifications
- **Main Area** (center): Content area for selected view
- **Dialer** (right): Quick access to telephony features

---

## Dashboard Overview

### Key Metrics

The dashboard displays four main KPIs:

1. **Pipeline Value**
   - Total value of all active deals
   - Click to view detailed deal breakdown

2. **Weighted Forecast**
   - Expected revenue based on deal probability
   - Calculated as: Deal Value × Probability

3. **Average Confidence**
   - Average probability across all deals
   - Indicates overall pipeline health

4. **Total Touchpoints**
   - Combined count of calls and SMS
   - Shows engagement level

### Recent Activity

View your latest interactions:
- Recent calls made/received
- SMS messages sent/received
- Lead updates
- Deal stage changes

### Quick Actions

Access common tasks:
- **New Lead** - Add a new lead
- **Make Call** - Open dialer
- **Send SMS** - Compose message
- **View Analytics** - See performance metrics

---

## Making Calls

### Choosing a Provider

SalesCRM supports two telephony providers:

1. **Twilio** (Primary)
   - Best for Australian numbers
   - Supports 1300/1800 numbers
   - High-quality WebRTC calls

2. **Zadarma** (Fallback)
   - Alternative provider
   - WebRTC widget-based
   - Callback functionality

**To switch providers:**
1. Click the **Dialer** tab
2. Select provider from dropdown
3. Wait for "Ready" status

### Making an Outgoing Call

#### Method 1: From Lead/Contact
1. Navigate to **Leads** or **Contacts**
2. Click on a lead/contact card
3. Click the **phone icon** next to their number
4. The dialer will open and initiate the call

#### Method 2: Manual Dialing
1. Click **Dialer** in the sidebar
2. Enter the phone number using:
   - On-screen number pad
   - Keyboard input
3. Click the **green call button**

### Supported Number Formats

- **Australian Mobile:** 04XX XXX XXX
- **Australian Landline:** 0X XXXX XXXX
- **1300 Numbers:** 1300 XXX XXX
- **1800 Numbers:** 1800 XXX XXX
- **International:** +XX XXX XXX XXXX

### During a Call

**Available Controls:**

1. **Mute/Unmute**
   - Click microphone icon
   - Mutes your audio

2. **Hold/Resume**
   - Click hold icon
   - Places call on hold

3. **Keypad**
   - Click keypad icon
   - Send DTMF tones (for IVR navigation)

4. **End Call**
   - Click red phone icon
   - Terminates the call

**Call Information Displayed:**
- Call duration (live timer)
- Call status (Connecting, Ringing, Connected)
- Caller/Callee number
- Associated lead (if applicable)

### Receiving Incoming Calls

When a call comes in:

1. **Incoming Call Banner** appears
2. Shows caller number and name (if matched to lead)
3. Options:
   - **Accept** - Answer the call
   - **Reject** - Decline the call

**Auto-matching:**
- System automatically matches incoming number to existing leads
- Lead details displayed if match found

### Call History

View all past calls:

1. Click **Dialer** → **History** tab
2. See list of all calls:
   - Date and time
   - Duration
   - Call type (incoming/outgoing/missed)
   - Associated lead
   - Notes

**Actions:**
- Click call to view details
- Click phone icon to redial
- Add notes to call record

---

## Sending SMS

### Composing an SMS

#### Method 1: From Lead/Contact
1. Open lead/contact detail
2. Click **SMS** tab in dialer
3. Message field opens with number pre-filled
4. Type your message
5. Click **Send**

#### Method 2: Manual SMS
1. Click **Dialer** → **SMS** tab
2. Enter recipient phone number
3. Type your message
4. Click **Send**

### SMS Features

**Character Counter:**
- Shows characters used / limit
- Indicates multi-part messages (>160 chars)

**Message Status:**
- **Pending** - Sending in progress
- **Sent** - Delivered to carrier
- **Delivered** - Received by recipient
- **Failed** - Delivery failed

**Message Templates:**
- Save frequently used messages
- Quick insert with one click

### SMS History

View message thread:
1. Click **Dialer** → **SMS** tab
2. Select conversation
3. See full message history
4. Reply directly in thread

---

## Managing Leads

### Creating a New Lead

1. Click **Leads** in sidebar
2. Click **+ New Lead** button
3. Fill in lead details:
   - **Name** (required)
   - **Email**
   - **Phone**
   - **Company**
   - **Role**
   - **Deal Value**
   - **Probability** (0-100%)
4. Click **Save**

### Lead Pipeline Stages

Leads move through three stages:

1. **New Lead**
   - Newly acquired leads
   - Initial contact pending

2. **Follow-up**
   - Active engagement
   - Nurturing in progress

3. **Closed**
   - Deal won or lost
   - No further action needed

**To move a lead:**
- Drag and drop to new stage
- Or click lead → Change status dropdown

### Editing a Lead

1. Click on lead card
2. Click **Edit** button
3. Update fields
4. Click **Save Changes**

### Deleting a Lead

1. Click on lead card
2. Click **Delete** button
3. Confirm deletion

**Warning:** This action cannot be undone. All associated activities, notes, and call history will be deleted.

### Searching Leads

Use the search bar to find leads by:
- Name
- Company
- Email
- Phone number

**Tips:**
- Search is case-insensitive
- Partial matches work
- Results update in real-time

### Filtering Leads

Filter leads by:
- **Status** (New Lead, Follow-up, Closed)
- **Date Range** (Last 7 days, Last 30 days, Custom)
- **Deal Value** (High to Low, Low to High)
- **Probability** (High to Low, Low to High)

---

## Managing Contacts

### Adding a Contact

1. Click **Contacts** in sidebar
2. Click **+ Add Contact**
3. Enter contact details:
   - Name
   - Email
   - Phone
   - Company
   - Role
4. Click **Save**

### Contact Status

Contacts can be:
- **Active** - Currently engaged
- **Inactive** - No recent activity

**To change status:**
1. Click contact
2. Toggle status switch
3. Changes save automatically

### Editing Contacts

1. Click contact card
2. Click **Edit**
3. Update information
4. Click **Save**

### Deleting Contacts

1. Click contact
2. Click **Delete**
3. Confirm deletion

---

## Managing Deals

### Creating a Deal

1. Click **Deals** in sidebar
2. Click **+ New Deal**
3. Fill in deal information:
   - **Title** (required)
   - **Value** (in USD)
   - **Company**
   - **Stage**
   - **Owner** (assigned user)
   - **Closing Date**
4. Click **Create Deal**

### Deal Pipeline Stages

Deals progress through:

1. **Qualified**
   - Lead qualified as opportunity
   - Initial proposal stage

2. **Proposal**
   - Formal proposal sent
   - Awaiting client review

3. **Negotiation**
   - Terms being discussed
   - Final details being worked out

4. **Closed**
   - Deal won or lost
   - Contract signed or opportunity lost

### Moving Deals

**Drag and Drop:**
1. Click and hold deal card
2. Drag to target stage
3. Release to drop

**Manual Update:**
1. Click deal card
2. Select new stage from dropdown
3. Click **Update**

### Deal Details

View comprehensive deal information:
- Deal value and probability
- Associated company
- Assigned owner
- Closing date
- Activity history
- Notes and comments

---

## Analytics & Reporting

### Accessing Analytics

Click **Analytics** in the sidebar to view performance metrics.

### Key Metrics

**Pipeline Metrics:**
- Total Pipeline Value
- Weighted Forecast
- Average Confidence
- Total Touchpoints

**Call Metrics:**
- Total calls made
- Average call duration
- Call success rate
- Daily call volume

**SMS Metrics:**
- Total messages sent
- Delivery rate
- Response rate
- Daily message volume

### Charts & Visualizations

**Engagement Velocity Chart:**
- Shows daily calls and SMS for last 7 days
- Area chart with trend lines
- Hover for detailed counts

**Channel Split:**
- Pie chart showing calls vs SMS
- Total touchpoint count
- Percentage breakdown

### Exporting Data

To export analytics data:
1. Click **Export** button
2. Choose format (CSV, PDF)
3. Select date range
4. Click **Download**

---

## Settings & Profile

### Accessing Settings

Click your **avatar** in top-right → **Settings**

### Profile Settings

**Update Profile:**
1. Go to **Profile** tab
2. Edit fields:
   - Full Name
   - Email
   - Phone
   - Avatar (upload image)
3. Click **Save Changes**

### Security Settings

**Change Password:**
1. Go to **Security** tab
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click **Update Password**

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

**Enable Multi-Factor Authentication:**
1. Go to **Security** tab
2. Click **Enable MFA**
3. Scan QR code with authenticator app
4. Enter verification code
5. Save recovery codes

### Notification Settings

Configure notifications for:
- Incoming calls
- New SMS messages
- Lead updates
- Deal stage changes

**To update:**
1. Go to **Notifications** tab
2. Toggle notification types
3. Changes save automatically

---

## Tips & Best Practices

### Calling Best Practices

1. **Always verify numbers** before calling
2. **Use call notes** to document conversations
3. **Associate calls with leads** for better tracking
4. **Review call history** before follow-up calls
5. **Test your microphone** before important calls

### Lead Management Tips

1. **Update lead status regularly** to keep pipeline accurate
2. **Add notes after each interaction** for context
3. **Set realistic probabilities** for better forecasting
4. **Use search and filters** to find leads quickly
5. **Review pipeline weekly** to identify bottlenecks

### SMS Etiquette

1. **Keep messages concise** and professional
2. **Include your name** in first message
3. **Respect business hours** when sending
4. **Use templates** for common messages
5. **Track delivery status** before follow-up

### Data Hygiene

1. **Remove duplicate leads** regularly
2. **Update contact information** when it changes
3. **Archive closed deals** to keep pipeline clean
4. **Delete test data** before going live
5. **Back up important notes** externally

---

## Troubleshooting

### Common Issues

#### "Failed to connect call"

**Possible Causes:**
- Internet connection issue
- Provider not ready
- Invalid phone number

**Solutions:**
1. Check internet connection
2. Verify provider status shows "Ready"
3. Confirm number format is correct
4. Try switching providers
5. Refresh the page

#### "SMS failed to send"

**Possible Causes:**
- Invalid phone number
- Insufficient credits
- Network issue

**Solutions:**
1. Verify phone number format
2. Check Twilio account balance
3. Retry sending
4. Contact support if persists

#### "Cannot see my calls in history"

**Possible Causes:**
- Calls not logged properly
- Database sync issue
- Filter applied

**Solutions:**
1. Refresh the page
2. Check if filters are active
3. Verify you're logged in correctly
4. Contact support if issue continues

#### "Audio quality is poor"

**Possible Causes:**
- Slow internet connection
- Microphone issues
- Provider network congestion

**Solutions:**
1. Check internet speed (min 1 Mbps)
2. Test microphone in system settings
3. Switch to alternative provider
4. Use headset for better quality
5. Close bandwidth-heavy applications

#### "Lead not showing in search"

**Possible Causes:**
- Typo in search term
- Lead deleted
- Filter applied

**Solutions:**
1. Check spelling
2. Clear all filters
3. Try searching by different field (email vs name)
4. Refresh the page

### Getting Help

If you encounter issues not covered here:

1. **Check Documentation:**
   - System Documentation
   - API Documentation
   - FAQ section

2. **Contact Support:**
   - Email: vincent.tiongson@example.com
   - Include: Screenshot, error message, steps to reproduce

3. **Report Bugs:**
   - Use GitHub Issues (if access provided)
   - Provide detailed description
   - Include browser and OS information

---

## Keyboard Shortcuts

### Global Shortcuts

- `Ctrl/Cmd + K` - Open search
- `Ctrl/Cmd + N` - New lead
- `Ctrl/Cmd + D` - Open dialer
- `Ctrl/Cmd + ,` - Open settings
- `Esc` - Close modal/dialog

### Dialer Shortcuts

- `0-9` - Dial number
- `Enter` - Make call
- `Backspace` - Delete last digit
- `M` - Mute/unmute
- `H` - Hold/resume
- `E` - End call

### Navigation Shortcuts

- `Ctrl/Cmd + 1` - Dashboard
- `Ctrl/Cmd + 2` - Leads
- `Ctrl/Cmd + 3` - Contacts
- `Ctrl/Cmd + 4` - Deals
- `Ctrl/Cmd + 5` - Analytics

---

## Glossary

**CRM** - Customer Relationship Management

**Lead** - Potential customer or sales opportunity

**Deal** - Active sales opportunity with defined value

**Pipeline** - Visual representation of sales stages

**Touchpoint** - Any interaction with a lead (call, SMS, email)

**DTMF** - Dual-Tone Multi-Frequency (phone keypad tones)

**WebRTC** - Web Real-Time Communication (browser-based calling)

**RLS** - Row Level Security (database security feature)

**MFA** - Multi-Factor Authentication

**KPI** - Key Performance Indicator

---

## Appendix

### Supported Browsers

- **Chrome** 90+ (Recommended)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### System Requirements

- **Internet:** Minimum 1 Mbps (5 Mbps recommended)
- **RAM:** 4GB minimum
- **Screen:** 1280x720 minimum resolution
- **Microphone:** Required for calling
- **Speakers/Headset:** Required for calling

### Privacy & Data

- All data encrypted in transit (TLS 1.3)
- Data stored in secure Supabase database
- User data isolated with Row Level Security
- No data shared with third parties
- Regular automated backups

### Updates & Maintenance

- **Updates:** Deployed automatically
- **Maintenance:** Scheduled during off-peak hours
- **Notifications:** Sent 24 hours before maintenance
- **Downtime:** Typically less than 5 minutes

---

**User Manual Version:** 1.0  
**Last Updated:** February 4, 2026  
**For Support:** vincent.tiongson@example.com  
**Application Version:** 1.0.0
