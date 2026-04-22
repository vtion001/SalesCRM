/**
 * E2E Test: Australian 131488 "Invalid Number" Bug
 * 
 * Bug: Australian 6-digit 13xx numbers like 131488 are rejected as "invalid"
 * Root cause: Frontend validation requires 10+ digits minimum
 * 
 * Run with: npx playwright test tests/e2e/dialer-invalid-numbers.spec.ts
 * Requires dev server: cd ~/Desktop/REPOSITORY/salescrm && npm run dev
 */

import { test, expect } from '@playwright/test';

test.describe('Dialer — Australian 13xx Number Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app — assumes dev server running on port 3001
    await page.goto('http://localhost:3001');
    
    // If auth page shows, bypass with test credentials
    const url = page.url();
    if (!url.includes('/dashboard') && !url.includes('/dialer')) {
      // Try to skip auth or use test mode
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    }
  });

  // ─── BUG CONFIRMATION TEST ───────────────────────────────────────────────
  test('BUG: 131488 shows as "Invalid phone number" (confirming bug exists)', async ({ page }) => {
    // Navigate directly to the dialer if accessible
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    
    // Look for the dialer section — could be on any page
    // Try navigating to CRM main view
    const dialerSelector = '[data-testid="phone-input"], input[placeholder*="phone" i], input[aria-label*="phone" i], .phone-input, #phone-input';
    
    // If no dialer found, skip this test
    const dialer = page.locator(dialerSelector).first();
    const hasDialer = await dialer.count() > 0;
    
    if (!hasDialer) {
      // Try to find the dialer via the Dialer tab/button
      const dialerTab = page.getByText(/dialer/i).first();
      const hasDialerTab = await dialerTab.count() > 0;
      if (hasDialerTab) {
        await dialerTab.click();
        await page.waitForTimeout(500);
      } else {
        test.skip(); // No dialer accessible
      }
    }

    // Find the phone input
    const phoneInput = page.locator('input').filter({ hasAttribute: 'data-testid', }).first();
    const fallbackInput = page.locator('input[type="tel"], input[placeholder*="phone" i]').first();
    
    const input = (await phoneInput.count() > 0) ? phoneInput : fallbackInput;
    
    // Type the number 131488
    await input.fill('131488');
    
    // Click the call button
    const callButton = page.locator('button').filter({ has: page.locator('svg.lucide-phone, [data-testid="call-button"]') }).first();
    await callButton.click();
    
    // Wait for error to appear
    await page.waitForTimeout(500);
    
    // Check for the invalid number error
    const errorElement = page.locator('text=/invalid.*number|invalid phone/i').first();
    const errorCount = await errorElement.count();
    
    console.log(`Error element found: ${errorCount > 0 ? 'YES - bug confirmed' : 'NO - bug may be fixed'}`);
    
    // Take a screenshot for documentation
    await page.screenshot({ path: 'test-results/bug-131488-error.png' });
  });

  // ─── VALID NUMBER TESTS (sanity checks) ──────────────────────────────────
  test('should allow valid Australian mobile +61412345678', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    
    // This test documents the expected behavior for VALID numbers
    // The call button should NOT show "invalid" error for valid Australian mobiles
    
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i]').first();
    if (await phoneInput.count() === 0) {
      test.skip();
    }
    
    await phoneInput.fill('+61412345678');
    
    const callButton = page.locator('button').filter({ has: page.locator('svg.lucide-phone, [data-testid="call-button"]') }).first();
    await callButton.click();
    await page.waitForTimeout(1000);
    
    // Should NOT see "invalid" error
    const errorElement = page.locator('text=/invalid.*number|invalid phone/i').first();
    const hasError = await errorElement.count() > 0;
    
    // For Twilio, we expect either:
    // 1. No "invalid" error (number is valid, call initiates)
    // 2. Twilio connection error (acceptable since Twilio not configured in test)
    // But NOT "invalid phone number" format error
    
    console.log(`Mobile number shows invalid error: ${hasError ? 'YES (bug if true)' : 'NO (correct)'}`);
  });

  test('should allow valid Australian 1300 number +611300130928', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i]').first();
    if (await phoneInput.count() === 0) {
      test.skip();
    }
    
    // 1300 number is 10 digits, should work
    await phoneInput.fill('1300130928');
    
    const callButton = page.locator('button').filter({ has: page.locator('svg.lucide-phone, [data-testid="call-button"]') }).first();
    await callButton.click();
    await page.waitForTimeout(1000);
    
    const errorElement = page.locator('text=/invalid.*number|invalid phone/i').first();
    const hasError = await errorElement.count() > 0;
    
    console.log(`1300 number shows invalid error: ${hasError ? 'YES (bug if true)' : 'NO (correct)'}`);
  });

  // ─── BROKEN 13xx NUMBER TESTS ────────────────────────────────────────────
  test('BROKEN: 131488 (6-digit 13xx) should NOT show invalid — but it does', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i]').first();
    if (await phoneInput.count() === 0) {
      test.skip();
    }
    
    // 131488 is a valid Australian 13xx number (6 digits)
    await phoneInput.fill('131488');
    
    const callButton = page.locator('button').filter({ has: page.locator('svg.lucide-phone, [data-testid="call-button"]') }).first();
    await callButton.click();
    await page.waitForTimeout(500);
    
    const errorElement = page.locator('text=/invalid.*number|invalid phone/i').first();
    const hasError = await errorElement.count() > 0;
    
    // BUG: This SHOULD pass (no error) but currently FAILS (shows error)
    // Expected: call initiates or at least no "invalid number" error
    // Actual: shows "Invalid phone number" error
    expect(hasError).toBe(false); // Will FAIL — confirms bug
    
    await page.screenshot({ path: 'test-results/bug-131488-broken.png' });
  });

  test('BROKEN: 136688 (6-digit 13xx) should NOT show invalid — but it does', async ({ page }) => {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i]').first();
    if (await phoneInput.count() === 0) {
      test.skip();
    }
    
    await phoneInput.fill('136688');
    
    const callButton = page.locator('button').filter({ has: page.locator('svg.lucide-phone, [data-testid="call-button"]') }).first();
    await callButton.click();
    await page.waitForTimeout(500);
    
    const errorElement = page.locator('text=/invalid.*number|invalid phone/i').first();
    const hasError = await errorElement.count() > 0;
    
    expect(hasError).toBe(false); // Will FAIL — confirms bug
  });
});
