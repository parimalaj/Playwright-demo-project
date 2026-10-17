import { test, expect } from '@playwright/test';

test('home page shows 9 products', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#tbodyid .card');
  await expect(cards).toHaveCount(9);
});