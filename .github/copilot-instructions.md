# SalesCRM AI Agent Instructions

## Project Overview
SalesCRM is a React + TypeScript sales management application built with Vite. It's a single-page app featuring lead management, contact tracking, deal pipelines, and a built-in dialer. The app uses client-side state management via React hooks for leads, contacts, deals, and user data.

**Tech Stack:** React 18, TypeScript 5.8, Vite 6, Lucide React icons, Tailwind CSS

## Architecture & Data Flow

### State Management Pattern
All app state is centralized in `App.tsx` using React hooks (useState). Key patterns:
- **Data Collections:** `leads`, `contacts`, `deals` - stored as arrays of typed objects
- **Selection State:** `selectedLeadId` tracks the currently selected lead for detail view
- **User State:** `currentUser` holds authenticated user info (name, email, role, avatar)
- **UI State:** `currentView` controls which view/component is displayed
- **Activity State:** `activities` and `currentNote` track lead-specific data

Handlers in `App.tsx` follow naming convention `handle{Action}` (e.g., `handleAddLead`, `handleUpdateNote`). Props flow downward to components; handlers flow upward through props.

### Component Structure
- **App.tsx:** Root component containing all state and view logic
- **Sidebar.tsx:** Navigation between views (Dashboard, Leads, Contacts, Deals, Analytics)
- **Header.tsx:** User profile menu, logout
- **Dashboard.tsx:** Stats cards (revenue, active leads, pipeline value, win rate) + recent activity
- **LeadList.tsx & LeadDetail.tsx:** Lead pipeline with filtering and individual lead editing
- **Contacts.tsx & Deals.tsx:** Separate data collections managed through handlers
- **Dialer.tsx:** Phone keypad component with call/message actions
- **Analytics.tsx:** Data visualization/reporting view
- **Login.tsx:** Authentication screen (currently mock-based)

### Type System
All data types defined in `types.ts`. Key interfaces:
- `Lead` - core CRM entity with status, activity timing, contact info, deal metrics
- `Deal` - sales opportunities with pipeline stages (Qualified → Proposal → Negotiation → Closed)
- `Contact` - separate from leads, minimal contact info with activity timestamp
- `Activity` - events associated with leads (call/email/meeting with duration)
- `Note` - pinnable annotations with author
- `CurrentUser` - authenticated user profile

## Key Patterns & Conventions

### Handler Pattern in App.tsx
Every data modification follows the same pattern:
```tsx
const handle{Action} = () => {
  const newEntity: EntityType = { id: Date.now().toString(), /* properties */ };
  set{Entities}([newEntity, ...previousState]); // Prepend new items
  setSelected{Entity}Id(newEntity.id); // Usually auto-select new entity
};
```
**Critical**: Always use the spread operator for state updates; never mutate directly.

### Cascading Updates
When creating a lead via `handleAddLead()`, it automatically creates a linked deal via `handleAddDeal()`. This demonstrates the expected pattern: operations can trigger side effects on related entities.

### Component Props Pattern
All feature components receive data and handlers as props. Use `React.FC<PropsInterface>` typing:
```tsx
interface ComponentProps {
  items: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export const Component: React.FC<ComponentProps> = ({ items, selectedId, onSelect, onAdd }) => { }
```

### Styling
Tailwind CSS utility classes only. No CSS files. Common patterns:
- Grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Spacing: `p-4` (padding), `mb-4` (margin-bottom), `gap-4` (flex/grid gaps)
- Colors: `bg-blue-600`, `text-gray-900`, `border-gray-100` - matches design tokens
- Interactive states: `hover:bg-gray-50`, `active:scale-95`, `disabled:opacity-50`
- Selection indicators: Left border bar (`absolute left-0 w-1 bg-blue-600`) when item selected

### Empty States
When data collections are empty, show centered UI with icon, message, and CTA:
```tsx
<div className="flex flex-col items-center justify-center h-64 text-center px-6">
  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
    <Icon className="text-gray-300" size={24} />
  </div>
  <h3 className="text-sm font-semibold text-gray-900">No items found</h3>
  <p className="text-xs text-gray-500 mt-1 mb-4">Description here</p>
  <button className="text-xs font-semibold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">
    + Add Item
  </button>
</div>
```

### Data Generation
Mock data is generated on-demand when needed (e.g., `handleAddLead` creates random lead). Random generation uses `Date.now().toString()` for IDs and avatar URLs from `ui-avatars.com` or `unsplash.com`.

## Development Workflow

**Install & Run:**
```bash
npm install
npm run backend:install  # Install backend dependencies
npm run dev             # Start Vite dev server at http://localhost:3000
npm run dev:backend     # Start Express backend at http://localhost:4000 (in another terminal)
npm run dev:all         # Start both frontend + backend
npm run build           # Production build to ./dist
npm run preview         # Preview production build
```

**Twilio Integration:**
- Backend: `/backend/server.js` - Handles token generation, call/SMS initiation, webhooks
- Frontend: `services/twilioService.ts` - API layer for Twilio operations
- Dialer: `components/Dialer.tsx` - UI for making calls and sending SMS
- Config: See [TWILIO_SETUP.md](TWILIO_SETUP.md) for complete Twilio credentials setup

**Key Files to Check:**
- Component implementations: `components/*.tsx`
- App state logic: `App.tsx` (centerpiece of all business logic)
- Type definitions: `types.ts` (source of truth for data shapes)
- Backend API: `backend/server.js` (Twilio integration)
- Twilio service: `services/twilioService.ts` (API layer)
- Build config: `vite.config.ts` + `tsconfig.json`

## Cross-Component Communication

**Pattern**: Never pass `setLeads` directly to child components. Instead, provide specific callbacks:
- ❌ Bad: `<LeadDetail lead={lead} setLeads={setLeads} />`
- ✅ Good: `<LeadDetail lead={lead} onUpdate={handleUpdateLead} onDelete={handleDeleteLead} />`

This keeps component responsibilities clear and makes App.tsx the sole source of truth for state mutations.

## Critical Development Notes

1. **No External Backend:** This is a purely client-side app. All data exists in component state only—it won't persist on page reload. Mock data is generated fresh on login.

2. **TypeScript Strict Mode:** Project uses TypeScript with strict null checking. Always import and use types from `types.ts`.

3. **View Routing:** Uses simple string state (`currentView`) not a router library. When modifying navigation, update `currentView` state and conditionally render components in `App.tsx`.

4. **Leads as Primary Entity:** Most functionality centers on leads. Changes to lead data (add, update, select) cascade through the app. Leads include deal value and probability for dashboard calculations.

5. **No Form Libraries:** Form inputs are raw HTML `<input>` and `<textarea>` with controlled components via `useState`.

6. **Lucide Icons:** All icons from lucide-react. Check icon names at https://lucide.dev/ before implementing.

7. **Authentication is Mock:** `Login.tsx` doesn't validate credentials; any submission sets `isAuthenticated = true` and creates sample lead data.

8. **Twilio Integration:** Real calling/SMS requires backend. Dialer.tsx calls `twilioService.ts` which communicates with Express backend on port 4000. Backend generates Twilio access tokens and handles webhooks.

## Common Implementation Tasks

**Adding a new data entity type** (e.g., Tasks):
1. Define `Task` interface in `types.ts`
2. Add `const [tasks, setTasks] = useState<Task[]>([])` in App.tsx
3. Implement `handleAddTask()`, `handleDeleteTask()`, etc. following the handler pattern
4. Create `Tasks.tsx` component with props interface accepting data array and callback handlers
5. Add view routing: set `currentView === 'tasks'` case in App.tsx render logic
6. Add nav item to Sidebar.tsx and wire `onNavigate` callback

**Updating lead data**:
1. Locate lead by `selectedLeadId` via `leads.find(l => l.id === selectedLeadId)`
2. Create updated lead object with spread: `{ ...selectedLead, property: newValue }`
3. Update array: `setLeads(leads.map(l => l.id === selectedLeadId ? updated : l))`
4. Prefer immutable patterns; avoid direct mutations like `selectedLead.property = value`

**Filtering/Computing dashboard metrics**:
- Won deals: `deals.filter(d => d.stage === 'Closed')`
- Pipeline value: `deals.filter(d => d.stage !== 'Closed').reduce((sum, d) => sum + d.value, 0)`
- Use these patterns in Dashboard.tsx around lines 11-14 as reference

**Making a call via Twilio**:
1. Dialer.tsx imports `initiateCall` from `services/twilioService.ts`
2. Call `await initiateCall(phoneNumber, userId)` which POSTs to backend `/call` endpoint
3. Backend uses Twilio SDK to create the call
4. Backend returns `callSid` and status message
5. Handle errors with try/catch and display status in UI

**Sending SMS via Twilio**:
1. Dialer.tsx imports `sendSMS` from `services/twilioService.ts`
2. Call `await sendSMS(phoneNumber, messageText)` which POSTs to backend `/sms` endpoint
3. Backend uses Twilio SDK to send the message
4. Add message locally to UI state and update backend status
5. Set `isSending` state to prevent double-sends

## Code Style

- Functional components with hooks (no class components)
- One component per file in `components/` folder
- Props interfaces defined above component and named `{ComponentName}Props`
- Inline comments for non-obvious logic
- Use semantic HTML (`<button>`, `<section>`, `<header>`) with Tailwind styling
