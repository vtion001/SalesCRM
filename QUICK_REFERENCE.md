# SalesCRM Refactoring - Quick Reference Card

## 📦 New Imports

### Shared Components
```tsx
import { EmptyState, StatusMessage, TabBar, Badge } from '@/components/Shared';
```

### Utilities
```tsx
import { formatCurrency, formatPhoneNumber, formatDate, isValidEmail, isValidPhoneNumber, truncateText } from '@/utils/formatter';
import { filterLeadsByStatus, calculatePipelineValue, calculateWinRate, getLeadsByStage, calculateLeadScore, getRecentActivities, getContactDealCount, calculateAverageLeadValue } from '@/utils/dataHelper';
import { getStatusColor, getStageColor, combineClasses, getLeadBgColor, getPriorityClass } from '@/utils/styleHelper';
```

### Custom Hooks
```tsx
import { useAsync, useLocalStorage, useForm } from '@/hooks';
```

### Context (Future)
```tsx
import { useAppContext } from '@/context';
```

---

## 🎨 Component Usage Snippets

### EmptyState
```tsx
<EmptyState
  icon={Users}
  title="No items found"
  description="Add your first item to get started"
  actionLabel="Add Item"
  onAction={handleAddItem}
/>
```

### StatusMessage
```tsx
<StatusMessage type="error">Failed to save</StatusMessage>
<StatusMessage type="success">Saved successfully</StatusMessage>
<StatusMessage type="info">Please fill all fields</StatusMessage>
```

### TabBar
```tsx
<TabBar
  tabs={['Dialer', 'History', 'SMS']}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### Badge
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Closed</Badge>
<Badge variant="info">New</Badge>
<Badge>Default</Badge>
```

---

## 🔧 Hook Usage Snippets

### useAsync
```tsx
const { data, loading, error, execute } = useAsync(
  () => initiateCall(phone),
  false // don't execute immediately
);

const handleCall = async () => {
  await execute();
};
```

### useLocalStorage
```tsx
const [theme, setTheme] = useLocalStorage('theme', 'light');
const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar', true);

// Usage like useState
setTheme('dark');
```

### useForm
```tsx
const { values, errors, touched, handleChange, handleBlur, reset } = useForm({
  email: '',
  password: '',
});

<input name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
{touched.email && errors.email && <span>{errors.email}</span>}
```

---

## 📊 Utility Function Snippets

### Formatter Utilities
```tsx
import { formatCurrency, formatPhoneNumber, formatDate, isValidEmail } from '@/utils/formatter';

formatCurrency(1500);           // "$1,500.00"
formatPhoneNumber('5551234567'); // "(555) 123-4567"
formatDate(new Date());          // "Jan 15, 2024"
isValidEmail('user@example.com'); // true
```

### Data Helper Utilities
```tsx
import { filterLeadsByStatus, calculatePipelineValue, calculateWinRate } from '@/utils/dataHelper';

const activeLeads = filterLeadsByStatus(leads, 'active');
const pipelineValue = calculatePipelineValue(deals); // 45000
const winRate = calculateWinRate(deals);             // 0.33 (33%)
```

### Style Helper Utilities
```tsx
import { getStatusColor, getStageColor, combineClasses } from '@/utils/styleHelper';

const statusClass = getStatusColor('active');      // "bg-green-100 text-green-800"
const stageClass = getStageColor('proposal');      // "bg-blue-100 text-blue-800"
const combined = combineClasses('p-4', 'rounded'); // "p-4 rounded"
```

---

## 📁 File Organization

```
New Files Created:
├── components/Shared/
│   ├── EmptyState.tsx
│   ├── StatusMessage.tsx
│   ├── TabBar.tsx
│   └── Badge.tsx
├── hooks/
│   ├── useAsync.ts
│   ├── useLocalStorage.ts
│   ├── useForm.ts
│   └── index.ts
├── utils/
│   ├── formatter.ts
│   ├── dataHelper.ts
│   ├── styleHelper.ts
│   └── index.ts
├── context/
│   ├── AppContext.tsx
│   └── index.ts
└── Documentation/
    ├── REFACTORING_COMPLETION_SUMMARY.md
    ├── CODE_REVIEW_AND_REFACTORING_SUMMARY.md
    ├── MIGRATION_GUIDE.md
    └── REFACTOR_PLAN.md
```

---

## ✅ Integration Checklist

### Phase 1: Display Components (Low Risk)
- [ ] LeadList.tsx - Replace EmptyState
- [ ] Contacts.tsx - Replace EmptyState + add Badge
- [ ] Deals.tsx - Replace EmptyState
- [ ] Dashboard.tsx - Add currency/calculation formatters

### Phase 2: State Management (Medium Risk)
- [ ] Dialer.tsx - Use useAsync for calls/SMS
- [ ] Login.tsx - Use useForm
- [ ] Header.tsx - Use useLocalStorage for preferences

### Phase 3: Large Component Extraction (High Risk)
- [ ] Dialer.tsx - Extract sub-components
- [ ] Header.tsx - Extract dropdown menus
- [ ] LeadDetail.tsx - Extract activity timeline

### Phase 4: Context Migration (Major)
- [ ] App.tsx - Wrap with AppContextProvider
- [ ] All components - Use useAppContext hook

---

## 🚨 Common Issues & Solutions

### Issue: Import path too long
```tsx
// ❌ Wrong
import { formatCurrency } from '@/utils/formatter';

// ✅ Right (use index.ts)
import { formatCurrency } from '@/utils';
```

### Issue: Component not found
```tsx
// ❌ Wrong
import EmptyState from '@/components/Shared/EmptyState';

// ✅ Right (use index if created)
import { EmptyState } from '@/components/Shared';
```

### Issue: Hook outside component
```tsx
// ❌ Wrong
const data = useAsync(fn); // At module level

// ✅ Right
function MyComponent() {
  const data = useAsync(fn); // Inside component
}
```

---

## 📞 Reference Documents

| Document | Purpose |
|----------|---------|
| **REFACTORING_COMPLETION_SUMMARY.md** | This refactoring session overview |
| **CODE_REVIEW_AND_REFACTORING_SUMMARY.md** | Code review findings & recommendations |
| **MIGRATION_GUIDE.md** | Step-by-step integration guide with examples |
| **REFACTOR_PLAN.md** | 5-phase refactoring strategy |

---

## 🎯 What's Next?

1. **Read**: REFACTORING_COMPLETION_SUMMARY.md (overview)
2. **Understand**: CODE_REVIEW_AND_REFACTORING_SUMMARY.md (details)
3. **Integrate**: Start with MIGRATION_GUIDE.md Phase 1 (low-risk components)
4. **Expand**: Move to Phase 2 as team confidence grows

---

**Status**: ✅ Phase 1 Complete - Ready for integration
**Breaking Changes**: 🟢 None
**Risk Level**: 🟢 Low (additive only)
**Next Phase**: Component extraction + context migration
