const { test, expect } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:4321';

test.describe('site smoke navigation', () => {
  test('home -> course -> topic -> navigation flow tests', async ({ page }) => {
    // 1. Navigate to Home
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await expect(page.locator('text=Fullstack Accelerator')).toHaveCount(1);

    // 2. Navigate to first course page (Java)
    const courseLink = page.locator('#courses-grid a').first();
    await expect(courseLink).toBeVisible();
    await courseLink.click();
    await page.waitForLoadState('networkidle');

    // Ensure course page loaded
    await expect(page.locator('h1')).toBeVisible();
    const courseUrl = page.url();

    // 2a. Test header "All courses" link on course index
    const allCoursesLink = page.locator('header a:has-text("All courses")');
    await expect(allCoursesLink).toBeVisible();
    await allCoursesLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/index.html');

    // Navigate back to course
    await page.goto(courseUrl, { waitUntil: 'networkidle' });

    // 2b. Test hero "Browse all courses" button on course index
    const browseAllCoursesBtn = page.locator('.hero a.button:has-text("Browse all courses")');
    await expect(browseAllCoursesBtn).toBeVisible();
    await browseAllCoursesBtn.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/index.html');

    // Navigate back to course
    await page.goto(courseUrl, { waitUntil: 'networkidle' });

    // 3. Navigate to first topic (01-intro)
    const topicLink = page.locator('a[href*="01-"]').first();
    await expect(topicLink).toBeVisible();
    await topicLink.click();
    await page.waitForLoadState('networkidle');

    // Ensure topic 1 page loaded
    await expect(page.locator('h1#title')).toBeVisible();
    await expect(page.locator('h1#title')).toContainText('Introduction');
    const topic1Url = page.url();

    // 4. Test "Back to course" navigation via the top header back link
    const backToCourseLink = page.locator('header.topic-header a.back-link');
    await expect(backToCourseLink).toBeVisible();
    await backToCourseLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(courseUrl);

    // Go back to topic 1 to continue tests
    await page.goto(topic1Url, { waitUntil: 'networkidle' });

    // 5. Test "Next Topic" navigation
    const nextBtn = page.locator('#next-topic-btn');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('02-install');

    // 6. Test "Previous Topic" navigation from topic 2
    const prevBtn = page.locator('#prev-topic-btn');
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('01-intro');

    // 7. Test "Course Index" navigation from topic 1 footer
    const courseIndexBtn = page.locator('#course-index-btn');
    await expect(courseIndexBtn).toBeVisible();
    await courseIndexBtn.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(courseUrl);
  });
});
