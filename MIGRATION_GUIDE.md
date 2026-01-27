# SalesCRM Refactoring Migration Guide

This guide shows how to integrate the new shared components, utilities, and hooks into existing components.

## Quick Start

### 1. Import Shared Components
```tsx
// Before: Duplicate EmptyState code in multiple files
<div className="flex flex-col items-center justify-center h-64...">
  {/* ... */}
</div>

// After: Use shared component
import { EmptyState } from '@/components/Shared';

<EmptyState
  icon={Users}
  title="No contacts found"
  description="Add your first contact to get started"
  actionLabel="Add Contact"
  onAction={handleAddContact}
/>
```

### 2. Import Utilities
```tsx
// Before: Math/formatting scattered in components
const pipelineValue = deals
  .filter(d => d.stage !== 'Closed')
  .reduce((sum, d) => sum + d.value, 0);

// After: Use utility function
import { calculatePipelineValue } from '@/utils/dataHelper';
const pipelineValue = calculatePipelineValue(deals);
```

### 3. Use Custom Hooks
```tsx
// Before: Manual state management for forms
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});

// After: Use useForm hook
import { useForm } from '@/hooks';

const { values, errors, handleChange, reset } = useForm({
  email: '',
  password: '',
});
```

### 4. Use Async Hook
```tsx
// Before: Manual loading/error state
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const makeCall = async () => {
  setLoading(true);
  try {
    await initiateCall(phone);
    setLoading(false);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};

// After: Use useAsync hook
import { useAsync } from '@/hooks';

const { loading, error, execute: makeCall } = useAsync(
  () => initiateCall(phone)
);
```

---

## Component-by-Component Integration Plan

### LeadList.tsx
**Current Issues**:
- Uses duplicate EmptyState code
- Business logic mixed with rendering

**Integration Steps**:
1. Import EmptyState: `import { EmptyState } from '@/components/Shared';`
2. Replace empty state code with component
3. Import dataHelper: `import { filterLeadsByStatus } from '@/utils/dataHelper';`
4. Use utility for filtering instead of inline filter

**Example**:
```tsx
import { EmptyState, Badge } from '@/components/Shared';
import { filterLeadsByStatus } from '@/utils/dataHelper';

export const LeadList: React.FC<LeadListProps> = ({ leads, onAddLead }) => {
  const activeleads = filterLeadsByStatus(leads, 'active');

  if (activeleads.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No leads found"
        actionLabel="Add Lead"
        onAction={onAddLead}
      />
    );
  }

  return (
    // ... render leads
  );
};
```

### Dialer.tsx
**Current Issues**:
- 325 lines (too large)
- Duplicate StatusMessage rendering
- Phone number state scattered

**Integration Steps**:
1. Import StatusMessage: `import { StatusMessage } from '@/components/Shared';`
2. Replace hardcoded error/success messages
3. Import useForm for phone input: `import { useForm } from '@/hooks';`
4. Use useAsync for call/SMS operations
5. Extract tabs into separate sub-components (Phase 2)

**Example**:
```tsx
import { useAsync, useForm } from '@/hooks';
import { StatusMessage, TabBar } from '@/components/Shared';
import { initiateCall, sendSMS } from '@/services/twilioService';

export const Dialer: React.FC<DialerProps> = () => {
  const { values, handleChange } = useForm({ phone: '', message: '' });
  const { loading: callLoading, error: callError, execute: makeCall } = 
    useAsync(() => initiateCall(values.phone));

  const handleCallClick = async () => {
    await makeCall();
  };

  return (
    <>
      {callError && <StatusMessage type="error">{callError}</StatusMessage>}
      {/* ... rest of dialer UI */}
    </>
  );
};
```

### Header.tsx
**Current Issues**:
- 320 lines (too large)
- Multiple dropdowns in one file
- Notification state hardcoded

**Integration Steps**:
1. Import Badge and StatusMessage
2. Import useLocalStorage for user preferences
3. Create sub-components for dropdowns (Phase 2)
4. Use utilities for date formatting

**Example**:
```tsx
import { useLocalStorage } from '@/hooks';
import { Badge, StatusMessage } from '@/components/Shared';
import { formatDate } from '@/utils/formatter';

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <header className="...">
      <Badge variant="success">{user.role}</Badge>
      {/* notifications with formatDate */}
      {notifications.map(n => (
        <div key={n.id}>{formatDate(n.timestamp)}</div>
      ))}
    </header>
  );
};
```

### LeadDetail.tsx
**Integration Steps**:
1. Import utilities: `import { formatPhoneNumber, formatDate } from '@/utils/formatter';`
2. Use formatters in render
3. Use StatusMessage for validation feedback
4. Extract ActivityTimeline to sub-component (Phase 2)

**Example**:
```tsx
import { formatPhoneNumber, formatDate } from '@/utils/formatter';
import { StatusMessage } from '@/components/Shared';

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead }) => {
  return (
    <div>
      <div>Phone: {formatPhoneNumber(lead.phone)}</div>
      <div>Last Activity: {formatDate(new Date(lead.lastActivity))}</div>
    </div>
  );
};
```

### Contacts.tsx
**Integration Steps**:
1. Replace EmptyState code with shared component
2. Use calculateContactDealCount from dataHelper
3. Use Badge for contact status

**Example**:
```tsx
import { EmptyState, Badge } from '@/components/Shared';
import { getContactDealCount } from '@/utils/dataHelper';

export const Contacts: React.FC<ContactsProps> = ({ contacts, deals }) => {
  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No contacts"
        actionLabel="Add Contact"
        onAction={onAdd}
      />
    );
  }

  return (
    <div>
      {contacts.map(contact => (
        <div key={contact.id}>
          <h3>{contact.name}</h3>
          <Badge>{getContactDealCount(contacts, deals)} deals</Badge>
        </div>
      ))}
    </div>
  );
};
```

### Dashboard.tsx
**Integration Steps**:
1. Import dataHelper utilities
2. Replace inline calculations with utilities
3. Use formatter for currency display

**Example**:
```tsx
import { calculatePipelineValue, calculateWinRate } from '@/utils/dataHelper';
import { formatCurrency } from '@/utils/formatter';

export const Dashboard: React.FC<DashboardProps> = ({ deals, leads }) => {
  const pipelineValue = calculatePipelineValue(deals);
  const winRate = calculateWinRate(deals);

  return (
    <div>
      <div>Pipeline: {formatCurrency(pipelineValue)}</div>
      <div>Win Rate: {(winRate * 100).toFixed(1)}%</div>
    </div>
  );
};
```

---

## Recommended Import Aliases

Add these to your TypeScript config for shorter imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/utils/*": ["./utils/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/context/*": ["./context/*"],
      "@/services/*": ["./services/*"]
    }
  }
}
```

Then imports become:
```tsx
import { EmptyState } from '@/components/Shared';
import { formatCurrency } from '@/utils/formatter';
import { useAsync } from '@/hooks';
```

---

## Integration Order (Recommended)

1. **Phase 1** (Low Risk - Display only):
   - [ ] Replace all EmptyState code with shared component (LeadList, Contacts, Deals)
   - [ ] Replace hardcoded Badge usage with Badge component
   - [ ] Add formatters to Dashboard and LeadDetail

2. **Phase 2** (Medium Risk - State):
   - [ ] Use useForm in Login.tsx
   - [ ] Use useAsync in Dialer.tsx for calls/SMS
   - [ ] Use useLocalStorage for user preferences in Header

3. **Phase 3** (High Risk - Major changes):
   - [ ] Migrate to AppContext (requires App.tsx changes)
   - [ ] Extract sub-components from Dialer, Header, LeadDetail
   - [ ] Add error boundaries

---

## Rollback Plan

Each integration step is reversible:

1. **UI Components**: Comment out imports, restore old code
2. **Utilities**: Remove utility calls, restore inline logic
3. **Hooks**: Replace hook usage with manual state management
4. **Context**: Remove context provider, restore prop drilling

No data or functionality will be lost.

---

## Testing After Integration

For each component updated:

1. **Functional Test**: Ensure all features still work
2. **UI Test**: Check styling and layout unchanged
3. **Props Test**: Verify props still pass correctly
4. **Error Test**: Check error states still display

Run: `npm run dev` and manually test each feature.

---

## Questions?

Refer to:
- [CODE_REVIEW_AND_REFACTORING_SUMMARY.md](./CODE_REVIEW_AND_REFACTORING_SUMMARY.md) - Full analysis
- [REFACTOR_PLAN.md](./REFACTOR_PLAN.md) - Implementation strategy
- Component files in `/components/Shared/` - Implementation examples
- Utility files in `/utils/` - Function signatures and JSDoc
