/**
 * Auth-bypassed Playwright test — tests the dialer directly
 * 
 * Since the app requires Supabase auth and we have no credentials,
 * we bypass auth by injecting JS to set isAuthenticated = true
 * and accessing the DOM directly.
 * 
 * Run: npx tsx tests/e2e/auth-bypass-test.ts
 */

import { chromium } from '@playwright/test';

const BASE = 'http://localhost:3002';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  console.log('\n🚀 Starting auth-bypassed E2E test\n');
  
  // Capture console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // 1. Navigate to app
  console.log('1️⃣  Loading app...');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const loginVisible = await page.locator('text=/welcome back/i').count() > 0;
  console.log(`   Login page visible: ${loginVisible ? 'YES' : 'NO'}`);
  
  if (loginVisible) {
    // 2. Bypass auth — inject React state setter via React DevTools or DOM
    console.log('2️⃣  Bypassing auth...');
    
    // Try setting window auth state if exposed
    await page.evaluate(() => {
      // Try to find if there's a global state object
      if ((window as any).__STATE__) {
        console.log('Found __STATE__');
      }
    });
    
    // Alternative: modify localStorage to simulate auth
    await page.evaluate(() => {
      // Set Supabase auth session (fake but enough to pass auth checks)
      localStorage.setItem('sb-access-token', 'test_token');
      localStorage.setItem('sb-refresh-token', 'test_refresh');
      localStorage.setItem('supabase-auth-token', JSON.stringify({
        access_token: 'test_access',
        user: { id: 'test-user', email: 'test@test.com' }
      }));
    });
    
    // Reload to pick up localStorage
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  }
  
  // 3. Try to find the main CRM interface (bypassed auth)
  console.log('3️⃣  Looking for main CRM interface...');
  
  // Check if we can see the dialer now
  const dialerTabVisible = await page.locator('text=/dialer/i').first().count() > 0;
  const sidebarVisible = await page.locator('text=/dashboard/i').first().count() > 0;
  
  console.log(`   Dialer tab: ${dialerTabVisible ? 'FOUND' : 'NOT FOUND'}`);
  console.log(`   Sidebar: ${sidebarVisible ? 'FOUND' : 'NOT FOUND'}`);
  
  if (dialerTabVisible) {
    // Click the Dialer tab
    console.log('4️⃣  Navigating to Dialer tab...');
    await page.locator('text=/dialer/i').first().click();
    await page.waitForTimeout(1000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/dialer-view.png', fullPage: false });
    console.log('   Screenshot saved: test-results/dialer-view.png');
  } else {
    // Try direct navigation
    console.log('4️⃣  Trying direct navigation to CRM...');
    await page.goto(`${BASE}/#/crm`, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(1000);
    
    // Check for phone input
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i], input[placeholder*="number" i]').first();
    const phoneCount = await phoneInput.count();
    console.log(`   Phone input found: ${phoneCount > 0 ? 'YES' : 'NO'}`);
  }
  
  // 5. Find phone input and test 131488
  console.log('5️⃣  Testing number 131488 in phone input...');
  
  // Look for any text input that could be phone
  const inputs = await page.locator('input').all();
  console.log(`   Total inputs on page: ${inputs.length}`);
  
  // Try to find phone input by label/placeholder
  const phoneInput = page.locator('input[placeholder*="phone" i], input[placeholder*="number" i], input[placeholder*="dial" i]').first();
  const phoneFound = await phoneInput.count() > 0;
  
  if (phoneFound) {
    console.log('   Phone input found! Typing 131488...');
    await phoneInput.fill('');
    await phoneInput.fill('131488');
    await page.waitForTimeout(500);
    
    // Check what's displayed
    const inputValue = await phoneInput.inputValue();
    console.log(`   Input value: "${inputValue}"`);
    
    // Look for the call button
    const callButton = page.locator('button').filter({ has: page.locator('svg[class*="phone"], [data-testid="call-button"]') }).first();
    const callBtnFound = await callButton.count() > 0;
    
    if (callBtnFound) {
      console.log('   Call button found! Clicking...');
      await callButton.click();
      await page.waitForTimeout(1000);
      
      // Check for errors
      const errorText = await page.locator('text=/invalid|error|invalid number/i').allTextContents();
      const hasError = errorText.length > 0;
      
      console.log(`\n   🔍 Result for 131488:`);
      if (hasError) {
        console.log(`   ❌ STILL SHOWS ERROR: "${errorText[0]}"`);
      } else {
        console.log(`   ✅ NO INVALID NUMBER ERROR!`);
      }
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/131488-result.png', fullPage: false });
      console.log('   Screenshot saved: test-results/131488-result.png');
    } else {
      console.log('   Call button NOT found on this page');
    }
  } else {
    console.log('   Phone input NOT found on this page');
    await page.screenshot({ path: 'test-results/page-state.png', fullPage: false });
    console.log('   Screenshot saved: test-results/page-state.png');
    
    // Dump all input placeholders
    console.log('\n   All inputs on page:');
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      const type = await input.getAttribute('type');
      const ariaLabel = await input.getAttribute('aria-label');
      console.log(`   - type="${type}" placeholder="${placeholder}" aria-label="${ariaLabel}"`);
    }
  }
  
  // 6. Console errors
  if (consoleErrors.length > 0) {
    console.log('\n   Console errors:');
    for (const err of consoleErrors.slice(0, 5)) {
      console.log(`   ⚠️  ${err.substring(0, 150)}`);
    }
  }
  
  await browser.close();
  
  console.log('\n✅ E2E test complete\n');
}

main().catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
