import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { OrderPage, OrderDetails } from '../pages/OrderPage';

// Fake test data: Demoblaze is a demo site and doesn't process payments
const order: OrderDetails = {
  name: 'Parimala Test',
  country: 'Canada',
  city: 'Surrey',
  card: '1234567890123456',
  month: '10',
  year: '2026',
};

test.describe('Checkout', () => {
  let cartPage: CartPage;
  let orderPage: OrderPage;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    orderPage = new OrderPage(page);

    // Put one product in the cart before each test
    await homePage.goto();
    await homePage.openProduct('Samsung galaxy s6');
    await productPage.addToCart();

    await cartPage.goto();
    await expect(cartPage.rows).toHaveCount(1);
  });

  test('user can complete a purchase', { tag: '@smoke' }, async () => {
    const total = await cartPage.getTotal();

    await cartPage.openPlaceOrder();
    await orderPage.purchase(order);

    await expect(orderPage.confirmTitle).toHaveText('Thank you for your purchase!');
    await expect(orderPage.confirmDetails).toContainText(`Amount: ${total} USD`);
    await expect(orderPage.confirmDetails).toContainText(`Card Number: ${order.card}`);
    await expect(orderPage.confirmDetails).toContainText(`Name: ${order.name}`);

    await orderPage.confirm();
  });

  test('purchase with empty form shows validation', async () => {
    await cartPage.openPlaceOrder();

    const message = await orderPage.purchaseExpectingError();
    expect(message).toBe('Please fill out Name and Creditcard.');
  });
});