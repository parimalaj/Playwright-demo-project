import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

// Helper: open a product, add it to the cart, and return its price
async function addProduct(page: Page, name: string): Promise<number> {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);

  await homePage.goto();
  await homePage.openProduct(name);
  const price = await productPage.getPrice();

  const message = await productPage.addToCart();
  expect(message).toContain('Product added');

  return price;
}

test.describe('Cart', () => {

  test('added product appears in the cart', { tag: '@smoke' }, async ({ page }) => {
    const price = await addProduct(page, 'Samsung galaxy s6');

    const cartPage = new CartPage(page);
    await cartPage.goto();

    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.rows.first()).toContainText('Samsung galaxy s6');
    expect(await cartPage.getTotal()).toBe(price);
  });

  test('cart total is the sum of all items', async ({ page }) => {
    const phonePrice = await addProduct(page, 'Samsung galaxy s6');
    const laptopPrice = await addProduct(page, 'Sony vaio i5');

    const cartPage = new CartPage(page);
    await cartPage.goto();

    await expect(cartPage.rows).toHaveCount(2);
    expect(await cartPage.getTotal()).toBe(phonePrice + laptopPrice);
  });

    test('deleting an item removes it from the cart', async ({ page }) => {
    await addProduct(page, 'Samsung galaxy s6');
    await addProduct(page, 'Nokia lumia 1520');

    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(cartPage.rows).toHaveCount(2);

    await cartPage.deleteItem('Nokia lumia 1520');

    await expect(cartPage.rows).toHaveCount(1);
    await expect(cartPage.rows.first()).toContainText('Samsung galaxy s6');
  });

});