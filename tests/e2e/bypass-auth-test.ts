/**
 * Auth bypass test — tries to get past login page
 */
const { chromium } = require('@playwright/test');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().substring(0, 200)); });
  page.on('pageerror', e => consoleErrors.push('PAGE: ' + e.message.substring(0, 200)));

  // Inject fake auth token BEFORE app loads
  await page.addInitScript(() => {
    localStorage.setItem('supabase-auth-token', JSON.stringify({
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.fake',
      refresh_token: 'fake-refresh',
      expires_at: Date.now() + 86400000,
      user: { id: 'fake-user', email: 'test@example.com', aud: 'authenticated' }
    }));
  });

  console.log('Loading app with fake auth...');
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(5000);

  let url = page.url();
  let h1 = await page.locator('h1, h2').first().innerText().catch(() => '(none)');
  console.log('URL:', url);
  console.log('Heading:', h1);

  const onLogin = h1.includes('Welcome') || h1.includes('LOGIN') || h1.includes('Email');

  if (onLogin) {
    console.log('Still on login — trying to inject React state...');

    // Try to override Supabase getSession
    await page.evaluate(() => {
      // Find and override the window.supabase if exposed
      console.log('localStorage keys:', Object.keys(localStorage).filter(k => k.includes('supabase')));
    });

    const lsKeys = await page.evaluate(() => Object.keys(localStorage).filter(k => k.includes('supabase')));
    console.log('Supabase localStorage keys:', lsKeys);

    // Try to set localStorage and reload
    await page.evaluate(() => {
      localStorage.setItem('supabase-auth-token', JSON.stringify({
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.fake',
        refresh_token: 'fake-refresh',
        expires_at: Date.now() + 86400000,
        user: { id: 'fake-user', email: 'test@example.com', aud: 'authenticated' }
      }));
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);

    url = page.url();
    h1 = await page.locator('h1, h2').first().innerText().catch(() => '(none)');
    console.log('After reload — URL:', url, '| Heading:', h1);
  }

  // Look for CRM elements
  const dialerTab = await page.locator('button:has-text("Dialer"), [data-testid*="dialer"], [aria-label*="dialer"]').count();
  const phoneInput = await page.locator('input[type="tel"], input[placeholder*="phone" i], input[placeholder*="number" i]').count();
  const dashboardEl = await page.locator('[class*="dashboard"], [class*="sidebar"]').count();

  console.log('\nCRM elements:');
  console.log('  Dialer:', dialerTab > 0 ? 'FOUND' : 'NOT FOUND');
  console.log('  Phone input:', phoneInput > 0 ? 'FOUND' : 'NOT FOUND');
  console.log('  Dashboard/Sidebar:', dashboardEl > 0 ? 'FOUND' : 'NOT FOUND');

  // Take screenshot
  await page.screenshot({ path: 'test-results/salescrm-final-state.png', fullPage: false });

  // Count all inputs
  const allInputs = await page.locator('input').all();
  console.log('\nAll inputs on page:');
  for (const inp of allInputs) {
    const ph = await inp.getAttribute('placeholder');
    const type = await inp.getAttribute('type');
    console.log(`  - type="${type}" placeholder="${ph}"`);
  }

  // If we can find the phone input, test 131488
  if (phoneInput > 0) {
    const input = page.locator('input[type="tel"], input[placeholder*="phone" i]').first();
    await input.fill('131488');
    await page.waitForTimeout(500);

    // Find call button
    const buttons = await page.locator('button').all();
    console.log('\nButtons on page:');
    for (const btn of buttons) {
      const text = await btn.innerText().catch(() => '');
      const ariaLabel = await btn.getAttribute('aria-label');
      console.log(`  - text="${text}" aria-label="${ariaLabel}"`);
    }

    const callBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await callBtn.count() > 0) {
      await callBtn.click();
      await page.waitForTimeout(1500);

      const errorEl = page.locator('[class*="error"], [class*="Error"], [role="alert"]').first();
      const hasError = await errorEl.count() > 0;
      const errorText = hasError ? await errorEl.innerText() : '';

      console.log('\n📞 Testing 131488:');
      console.log('  Input value:', await input.inputValue());
      console.log('  Error shown:', hasError ? 'YES — ' + errorText : 'NO');

      await page.screenshot({ path: 'test-results/131488-test-result.png' });
    }
  }

  console.log('\nConsole errors:', consoleErrors.length);
  consoleErrors.slice(0, 5).forEach(e => console.log('  ', e.substring(0, 150)));

  await browser.close();
  console.log('\nDone.\n');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
