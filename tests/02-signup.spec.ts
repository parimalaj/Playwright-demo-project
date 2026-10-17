import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';

test.describe('Signup', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.openSignupPopup();
  });

  test('new user can sign up', async () => {
    const message = await signupPage.signup(`user_${Date.now()}`, 'Test@123');
    expect(message).toBe('Sign up successful.');
  });

  test('cannot sign up with an existing username', async () => {
    const message = await signupPage.signup(process.env.DEMO_USER!, process.env.DEMO_PASS!);
    expect(message).toBe('This user already exist.');
  });

  test('empty fields show validation', async () => {
    const message = await signupPage.signup('', '');
    expect(message).toBe('Please fill out Username and Password.');
  });
});