import { test, expect } from '@playwright/test';
import { acceptDialog } from '../utils/dialog';

test.describe('Login / Logout', () => {

  test.beforeEach(async ({ page }) => {
    // Open the site and the Log in popup before each test
    await page.goto('/');
    await page.locator('#login2').click();
    await page.locator('#loginusername').waitFor();
  });

  test('valid user can log in', async ({ page }) => {
    await page.locator('#loginusername').fill(process.env.DEMO_USER!);
    await page.locator('#loginpassword').fill(process.env.DEMO_PASS!);
    await page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click();

    // After login the navbar shows "Welcome <username>"
    await expect(page.locator('#nameofuser')).toHaveText(`Welcome ${process.env.DEMO_USER}`);
    await expect(page.locator('#logout2')).toBeVisible();
    await expect(page.locator('#login2')).toBeHidden();
  });

  test('wrong password shows error', async ({ page }) => {
    await page.locator('#loginusername').fill(process.env.DEMO_USER!);
    await page.locator('#loginpassword').fill('wrong_password');

    const message = await acceptDialog(page, () =>
      page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click()
    );

    expect(message).toBe('Wrong password.');
  });

  test('unknown user shows error', async ({ page }) => {
    await page.locator('#loginusername').fill(`nobody_${Date.now()}`);
    await page.locator('#loginpassword').fill('Test@123');

    const message = await acceptDialog(page, () =>
      page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click()
    );

    expect(message).toBe('User does not exist.');
  });

  test('empty fields show validation', async ({ page }) => {
    const message = await acceptDialog(page, () =>
      page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click()
    );

    expect(message).toBe('Please fill out Username and Password.');
  });

  test('user can log out', async ({ page }) => {
    await page.locator('#loginusername').fill(process.env.DEMO_USER!);
    await page.locator('#loginpassword').fill(process.env.DEMO_PASS!);
    await page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click();
    await expect(page.locator('#nameofuser')).toBeVisible();

    await page.locator('#logout2').click();

    await expect(page.locator('#login2')).toBeVisible();
    await expect(page.locator('#nameofuser')).toBeHidden();
  });

});