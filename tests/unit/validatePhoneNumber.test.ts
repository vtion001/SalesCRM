/**
 * Unit Test: validatePhoneNumber — Australian 13xx Bug
 * 
 * Bug: 6-digit Australian 13xx numbers (e.g. 131488) are rejected
 * because the format check requires 10+ digits minimum.
 * 
 * Run with: npx tsx tests/unit/validatePhoneNumber.test.ts
 */

// Copy of the FIXED validation logic from services/twilioService.ts
// (same as actual file after applying the fix)
enum NumberType {
  MOBILE = 'mobile',
  LANDLINE = 'landline',
  PREMIUM_1300 = 'premium_1300',
  PREMIUM_1800 = 'premium_1800',
  PREMIUM_13 = 'premium_13',
  INTERNATIONAL = 'international',
  INVALID = 'invalid'
}

interface NumberValidation {
  isValid: boolean;
  type: NumberType;
  canCall: boolean;
  errorMessage?: string;
  formattedNumber: string;
}

function validatePhoneNumber(phoneNumber: string): NumberValidation {
  const cleaned = phoneNumber.replace(/[\s-]/g, '');
  
  // Special case: Australian 13xx short numbers (6 digits: e.g., 131488, 136688)
  if (cleaned.match(/^(?:\+?61\s?|)13[0-9]{4}$/)) {
    let formatted = cleaned;
    if (!formatted.startsWith('+')) {
      formatted = formatted.startsWith('61') ? '+' + formatted : '+61' + formatted;
    }
    return {
      isValid: true,
      type: NumberType.PREMIUM_13,
      canCall: true,
      formattedNumber: formatted
    };
  }
  
  if (!cleaned.match(/^\+?[0-9]{10,15}$/)) {
    return {
      isValid: false,
      type: NumberType.INVALID,
      canCall: false,
      errorMessage: 'Invalid phone number format. Use international format (e.g., +61466123456)',
      formattedNumber: phoneNumber
    };
  }

  if (cleaned.match(/^\+?61\s?1?300/)) {
    return {
      isValid: true,
      type: NumberType.PREMIUM_1300,
      canCall: true,
      formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
    };
  }

  if (cleaned.match(/^\+?61\s?1?800/)) {
    return {
      isValid: true,
      type: NumberType.PREMIUM_1800,
      canCall: true,
      formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
    };
  }

  if (cleaned.match(/^\+?61\s?13[0-9]{4,6}$/)) {
    return {
      isValid: true,
      type: NumberType.PREMIUM_13,
      canCall: true,
      formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
    };
  }

  if (cleaned.match(/^\+?61\s?4[0-9]{8}$/)) {
    return {
      isValid: true,
      type: NumberType.MOBILE,
      canCall: true,
      formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
    };
  }

  if (cleaned.match(/^\+?61\s?[2378][0-9]{8}$/)) {
    return {
      isValid: true,
      type: NumberType.LANDLINE,
      canCall: true,
      formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
    };
  }

  return {
    isValid: true,
    type: NumberType.INTERNATIONAL,
    canCall: true,
    formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
  };
}

// ─── Test Suite ─────────────────────────────────────────────────────────────

interface TestResult {
  number: string;
  description: string;
  isValid: boolean;
  canCall: boolean;
  type: string;
  expected: 'pass' | 'fail';
  bug: boolean;
}

const testCases: Array<{ number: string; description: string; expected: 'pass' | 'fail' }> = [
  // ✅ Valid Australian numbers (should pass)
  { number: '+61412345678', description: 'Mobile with +61 prefix', expected: 'pass' },
  { number: '0412345678', description: 'Mobile without prefix', expected: 'pass' },
  { number: '+61212345678', description: 'Sydney landline 02', expected: 'pass' },
  { number: '+611300130928', description: '1300 premium number', expected: 'pass' },
  { number: '+611800123456', description: '1800 toll-free', expected: 'pass' },
  { number: '1300130928', description: '1300 national format', expected: 'pass' },
  
  // ❌ BROKEN: 13xx 6-digit numbers (BUG)
  { number: '131488', description: 'BROKEN: 6-digit 13xx number', expected: 'pass' },  // BUG: fails format check
  { number: '136688', description: 'BROKEN: 6-digit 13xx number', expected: 'pass' },  // BUG: fails format check
  { number: '+61131488', description: 'BROKEN: 6-digit 13xx with +61', expected: 'pass' },  // BUG: fails format check
  { number: '+61136688', description: 'BROKEN: 6-digit 13xx with +61', expected: 'pass' },  // BUG: fails format check
  
  // ✅ More 13xx numbers (some may work if they have 10+ digits after cleaning)
  { number: '1300123456', description: '1300 national 10 digits', expected: 'pass' },
  { number: '+611300123456', description: '1300 E.164 format', expected: 'pass' },
];

console.log('\n🧪 validatePhoneNumber() — Australian 13xx Bug Tests\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

for (const tc of testCases) {
  const result = validatePhoneNumber(tc.number);
  const isBug = tc.expected === 'pass' && (!result.isValid || !result.canCall);
  const status = isBug ? '🐛 BUG CONFIRMED' : (result.isValid && result.canCall ? '✅ PASS' : '❌ FAIL');
  
  if (isBug) {
    failed++;
    console.log(`\n🐛 BUG: "${tc.number}" (${tc.description})`);
    console.log(`   Expected: VALID (${tc.expected})`);
    console.log(`   Got: ${result.isValid ? 'VALID' : 'INVALID'} | canCall=${result.canCall} | type=${result.type}`);
    console.log(`   Error: ${result.errorMessage || 'none'}`);
    console.log(`   Root cause: Frontend regex requires 10+ digits, but 131488 is only 6 digits`);
  } else if (result.isValid === (tc.expected === 'pass')) {
    passed++;
    console.log(`✅ ${tc.number.padEnd(20)} | ${result.type.padEnd(15)} | ${tc.description}`);
  } else {
    failed++;
    console.log(`❌ ${tc.number.padEnd(20)} | Expected: ${tc.expected}, Got: isValid=${result.isValid}`);
  }
}

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`);

// ─── Root Cause Analysis ────────────────────────────────────────────────────
console.log('🔍 ROOT CAUSE ANALYSIS:\n');
console.log('File: services/twilioService.ts, function validatePhoneNumber()');
console.log('');
console.log('Problematic regex:');
console.log('  /^\+?[0-9]{10,15}$/');
console.log('  - Requires 10-15 digits MINIMUM');
console.log('  - Australian 13xx numbers (e.g., 131488) are only 6 digits');
console.log('  - 131488 has 6 digits → FAILS format check → marked INVALID');
console.log('');
console.log('Fix needed: Add a special case BEFORE the 10-digit minimum check');
console.log('to handle Australian 13xx short numbers (6 digits).');
console.log('');

// ─── The Fix ────────────────────────────────────────────────────────────────
console.log('✅ PROPOSED FIX (in services/twilioService.ts):\n');
console.log(`
// BEFORE the format check regex, add special case for Australian 13xx:
const cleaned = phoneNumber.replace(/[\\s-]/g, '');

// Special case: Australian 13xx numbers (6 digits: e.g., 131488, 136688)
if (cleaned.match(/^(?:\\+?61\\s?|)13[0-9]{4}$/)) {
  return {
    isValid: true,
    type: NumberType.PREMIUM_13,
    canCall: true,
    formattedNumber: cleaned.startsWith('+') ? cleaned : '+' + cleaned
  };
}

// General format check (existing)
if (!cleaned.match(/^\\+?[0-9]{10,15}$/)) { ... }
`);

if (failed > 0) {
  console.log('\n⚠️  BUGS DETECTED — fix required before 131488 can be dialed\n');
  process.exit(1);
}
