# 🔄 Duplicate Contact Creation Flow

## Normal Flow (Expected)
```
┌─────────────────┐
│  User Action    │
│  Create Lead    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  addLead()      │
│  Lead Created   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Existing  │
│ Contact by      │
│ Phone Number    │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌───────┐  ┌───────┐
│Exists │  │ None  │
└───┬───┘  └───┬───┘
    │          │
    │          ▼
    │    ┌──────────┐
    │    │addContact│
    │    │Created ✓ │
    │    └──────────┘
    │          │
    └──────────┴─────► DONE (1 Contact)
```

## Bug Flow (What Actually Happens)
```
┌─────────────────┐
│  User Action    │
│  Create Lead    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  addLead()      │
│  Lead Created   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ handleAddLeadAction             │
│ Check: existingContact?         │
│ State Snapshot #1: []           │
│ Result: No contact found        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  addContact()   │
│  Contact #1 ✓   │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌─────────────────┐         ┌─────────────────┐
│ State Update    │         │ ⚠️ RACE!       │
│ leads = [L1]    │         │ Sync Effect     │
│ contacts = [C1] │         │ Triggered       │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │                           ▼
         │              ┌─────────────────────────┐
         │              │ syncLeadsToContacts()   │
         │              │ State Snapshot #2       │
         │              │ leads = [L1]            │
         │              │ contacts = [] (STALE!)  │
         │              └────────┬────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────────┐
         │              │ Check: L1 has       │
         │              │ contact in []?      │
         │              │ Result: NO! (Wrong) │
         │              └────────┬────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │  addContact()   │
         │              │  Contact #2 ✗   │
         │              │  (DUPLICATE!)   │
         │              └────────┬────────┘
         │                       │
         └───────────────────────┴─────────► DONE (2 Contacts! ❌)
```

## Dialer Call Flow (Triggers More Duplicates)
```
┌─────────────────┐
│ User Makes Call │
│ to Lead         │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ handleMakeCall()        │
│ Calls callService       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ callHistoryService      │
│ .logOutgoingCall()      │
│ Creates call record     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Call connects           │
│ State updates happen    │
└────────┬────────────────┘
         │
         ├────────────────────────┐
         │                        │
         ▼                        ▼
┌────────────────┐    ┌──────────────────────┐
│ Normal Flow    │    │ ⚠️ Sync Effect       │
│ Continues      │    │ Sees state change    │
└────────┬───────┘    │ Triggers again!      │
         │            └──────────┬───────────┘
         │                       │
         │                       ▼
         │            ┌──────────────────────┐
         │            │ Checks stale state   │
         │            │ "No contact found"   │
         │            │ Creates duplicate    │
         │            └──────────┬───────────┘
         │                       │
         └───────────────────────┴────► Duplicate Contact ❌
```

## Timeline Analysis
```
Time →   0ms         50ms        100ms       150ms       200ms
         │           │           │           │           │
User:    │ Create    │           │           │           │
         │ Lead      │           │           │           │
         ▼           │           │           │           │
         │           │           │           │           │
Lead     │ addLead() │ Lead      │           │           │
Service: │           │ saved ✓   │           │           │
         │           ▼           │           │           │
         │           │           │           │           │
Handler: │           │Check      │ Add       │           │
         │           │Contact    │Contact #1 │           │
         │           │           ▼           │           │
         │           │           │           │           │
State:   │           │           │ Update    │ Update    │
         │           │           │ leads[]   │ contacts[]│
         │           │           ▼           ▼           │
         │           │           │           │           │
Sync     │           │           │ Trigger!  │ Running   │ DUPLICATE!
Effect:  │           │           │ (stale)   │ (stale)   │ Contact #2
         │           │           │           │           ▼
         └───────────┴───────────┴───────────┴───────────┴────────►
```

## Solution Flow (After Fix)
```
┌─────────────────┐
│  User Action    │
│  Create Lead    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  addLead()      │
│  Lead Created   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ handleAddLeadAction             │
│ Check: existingContact?         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  addContact()   │
│  (with DB check)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✅ NO SYNC      │
│ ✅ NO RACE      │
│ ✅ 1 Contact    │
└─────────────────┘

Same for calls:

┌─────────────────┐
│ User Makes Call │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Log to history  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✅ NO SYNC      │
│ ✅ NO DUPLICATE │
└─────────────────┘
```

## Key Takeaways

1. **Root Cause**: Sync effect with stale state
2. **Trigger**: ANY change to leads/contacts arrays
3. **Timing**: Race condition during async operations
4. **Frequency**: High - happens often during normal use
5. **Solution**: Remove auto-sync, rely on explicit creation

---

**Legend:**
- ✓ = Expected behavior
- ✗ = Bug/Duplicate
- ⚠️ = Problem area
- 🔄 = Async operation
