import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Products', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('home page shows 9 products', { tag: '@smoke' }, async () => {
    await expect(homePage.productCards).toHaveCount(9);
  });

  test('Phones category shows 7 products', async () => {
    await homePage.selectCategory('Phones');
    await expect(homePage.productCards).toHaveCount(7);
  });

  test('Laptops category shows 6 products', async () => {
    await homePage.selectCategory('Laptops');
    await expect(homePage.productCards).toHaveCount(6);
  });

  test('Monitors category shows 2 products', async () => {
    await homePage.selectCategory('Monitors');
    await expect(homePage.productCards).toHaveCount(2);
    await expect(homePage.productTitles).toContainText(['Apple monitor 24']);
  });

  test('next page shows different products', async () => {
    const firstTitle = await homePage.productTitles.first().innerText();
    await homePage.nextButton.click();
    await expect(homePage.productTitles.first()).not.toHaveText(firstTitle);
  });

  test('open product details page', async ({ page }) => {
    await homePage.openProduct('Samsung galaxy s6');
    await expect(page.locator('#tbodyid .name')).toHaveText('Samsung galaxy s6');
    await expect(page.locator('#tbodyid .price-container')).toContainText('$');
  });
});