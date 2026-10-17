import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login / Logout', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.openLoginPopup();
  });

  test('valid user can log in', async () => {
    await loginPage.login(process.env.DEMO_USER!, process.env.DEMO_PASS!);

    await expect(loginPage.welcomeUser).toHaveText(`Welcome ${process.env.DEMO_USER}`);
    await expect(loginPage.logoutLink).toBeVisible();
    await expect(loginPage.loginLink).toBeHidden();
  });

  test('wrong password shows error', async () => {
    const message = await loginPage.loginExpectingError(process.env.DEMO_USER!, 'wrong_password');
    expect(message).toBe('Wrong password.');
  });

  test('unknown user shows error', async () => {
    const message = await loginPage.loginExpectingError(`nobody_${Date.now()}`, 'Test@123');
    expect(message).toBe('User does not exist.');
  });

  test('empty fields show validation', async () => {
    const message = await loginPage.loginExpectingError('', '');
    expect(message).toBe('Please fill out Username and Password.');
  });

  test('user can log out', async () => {
    await loginPage.login(process.env.DEMO_USER!, process.env.DEMO_PASS!);
    await loginPage.logout();

    await expect(loginPage.loginLink).toBeVisible();
    await expect(loginPage.welcomeUser).toBeHidden();
  });
});