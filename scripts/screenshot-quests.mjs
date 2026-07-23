import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:4200/quests', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Full page screenshot
  await page.screenshot({ 
    path: 'scripts/quests-page-full.png', 
    fullPage: true 
  });
  
  console.log('Desktop screenshot saved to scripts/quests-page-full.png');
  
  // Mobile viewport  
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: 'scripts/quests-page-mobile.png', 
    fullPage: true 
  });
  
  console.log('Mobile screenshot saved to scripts/quests-page-mobile.png');
  
  await browser.close();
})();
