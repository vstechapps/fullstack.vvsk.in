const { test, expect } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('site smoke navigation', () => {
  test('home -> course -> topic navigation', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await expect(page.locator('text=Fullstack Accelerator')).toHaveCount(1);

    // find first course card link
    const courseLink = page.locator('#courses-grid a').first();
    await expect(courseLink).toBeVisible();
    const href = await courseLink.getAttribute('href');
    await courseLink.click();
    await page.waitForLoadState('networkidle');

    // ensure course page loaded
    await expect(page.locator('h1')).toBeVisible();

    // try to navigate to a topic link (first NN- folder link)
    const topicLink = page.locator('a[href*="01-"]').first();
    if (await topicLink.count() > 0) {
      await topicLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toBeVisible();
      // check presence of quiz trigger if present
      const quizBtn = page.locator('[data-quiz]');
      // it's okay if no quiz, but if present ensure clickable
      if (await quizBtn.count() > 0) {
        await expect(quizBtn.first()).toBeVisible();
      }
    }
  });
});
