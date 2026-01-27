# Code Refactoring & Modularization Plan

## Phase 1: Extract Shared Components & Utilities (No Breaking Changes)

### 1.1 Extract Reusable UI Components
- **EmptyState.tsx** - Used in Dialer, LeadList, LeadDetail
- **TabBar.tsx** - Tab navigation UI pattern (Dialer)
- **StatusMessage.tsx** - Error/success alerts
- **Modal.tsx** - Dialog wrapper
- **FormInput.tsx** - Controlled input wrapper
- **StatCard.tsx** - Dashboard metric cards
- **Badge.tsx** - Status badges

### 1.2 Extract State Logic Utilities
- **hooks/useDialerState.ts** - Phone number, message, call state
- **hooks/useAsync.ts** - Loading/error/data state
- **hooks/useLocalStorage.ts** - Persist user preferences

### 1.3 Extract Constants & Config
- **config/theme.ts** - Tailwind color/spacing tokens
- **config/validation.ts** - Form validation rules
- **constants/messages.ts** - UI text strings

## Phase 2: Refactor Large Components

### 2.1 App.tsx (193 lines → Split)
- **contexts/AppContext.ts** - Centralize state with useContext
- **hooks/useAppState.ts** - State initialization logic
- **hooks/useAppHandlers.ts** - All handler functions

### 2.2 Dialer.tsx (325 lines → Split)
- **components/DialerTabs.tsx** - Tab selector
- **components/DialerKeypad.tsx** - Phone keypad
- **components/DialerSMS.tsx** - SMS tab content
- **components/DialerHistory.tsx** - Call history tab
- **hooks/useDialer.ts** - Phone/SMS state

### 2.3 Header.tsx (320 lines → Split)
- **components/ProfileMenu.tsx** - User menu
- **components/NotificationBell.tsx** - Notifications
- **components/SettingsMenu.tsx** - Settings dropdown

### 2.4 LeadDetail.tsx (190 lines)
- **components/ActivityTimeline.tsx** - Extract timeline
- **components/NotesSection.tsx** - Extract notes panel

## Phase 3: Create Utility Functions

### 3.1 Data Helpers
- **utils/dealHelper.ts** - filterByStage, calculatePipelineValue
- **utils/leadHelper.ts** - filterByStatus, getRecentLeads
- **utils/numberFormat.ts** - Currency, percentage formatting

### 3.2 UI Helpers  
- **utils/tailwindHelper.ts** - Dynamic class combinations
- **utils/getStatusColor.ts** - Status → color mapping
- **utils/getStageColor.ts** - Deal stage → color mapping

## Phase 4: Organize File Structure

```
src/
├── components/          # UI Components
│   ├── Shared/         # Reusable UI components
│   │   ├── EmptyState.tsx
│   │   ├── TabBar.tsx
│   │   └── StatusMessage.tsx
│   ├── Layout/         # Main layout structure
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MainContent.tsx
│   ├── Dialer/         # Dialer feature
│   │   ├── Dialer.tsx
│   │   ├── DialerTabs.tsx
│   │   └── DialerKeypad.tsx
│   ├── Leads/          # Lead management
│   │   ├── LeadList.tsx
│   │   └── LeadDetail.tsx
│   ├── Contacts/       # Contact management
│   ├── Deals/          # Deal pipeline
│   ├── Dashboard/      # Analytics view
│   ├── Analytics/      # Reports
│   └── Auth/           # Login/auth
├── hooks/              # Custom React hooks
│   ├── useAsync.ts
│   ├── useDialer.ts
│   └── useLocalStorage.ts
├── contexts/           # React Context
│   └── AppContext.tsx
├── services/           # API/External services
│   └── twilioService.ts
├── utils/              # Utility functions
│   ├── dealHelper.ts
│   ├── leadHelper.ts
│   ├── numberFormat.ts
│   └── tailwindHelper.ts
├── config/             # Config files
│   ├── theme.ts
│   └── validation.ts
├── constants/          # Constants
│   ├── messages.ts
│   ├── status.ts
│   └── keybindings.ts
├── types/              # TypeScript types
│   └── types.ts (split if >300 lines)
├── App.tsx
├── index.tsx
└── index.html
```

## Phase 5: Code Quality Improvements

### 5.1 Type Safety
- [ ] Remove all `any` types
- [ ] Add strict prop types to components
- [ ] Create domain models from types.ts

### 5.2 Performance
- [ ] Add React.memo() to pure components
- [ ] Lazy load feature routes
- [ ] Memoize expensive computations

### 5.3 Error Handling
- [ ] Add try/catch to async operations
- [ ] Create error boundary component
- [ ] User-friendly error messages

### 5.4 Code Standards
- [ ] Remove console.log statements (except errors)
- [ ] Add JSDoc comments to exported functions
- [ ] Consistent naming conventions
- [ ] Remove unused imports

## Implementation Order
1. Create shared components (10 files)
2. Create hooks (3-5 files)
3. Create utilities (4 files)
4. Create contexts (1 file)
5. Refactor App.tsx (3 files)
6. Refactor Dialer.tsx (4 files)
7. Refactor Header.tsx (3 files)
8. Update imports in existing components
9. Remove old unused files

---

This plan maintains full backward compatibility while improving:
- ✅ Code organization
- ✅ Reusability
- ✅ Maintainability
- ✅ Type safety
- ✅ Performance
