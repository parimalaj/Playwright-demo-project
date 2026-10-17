import { test, expect } from '@playwright/test';
import { acceptDialog } from '../utils/dialog';

test('cannot sign up with an existing username', async ({ page }) => {
  await page.goto('/');
  await page.locator('#signin2').click();

  await page.locator('#sign-username').fill(process.env.DEMO_USER!);
  await page.locator('#sign-password').fill(process.env.DEMO_PASS!);

  const message = await acceptDialog(page, () =>
    page.locator('#signInModal').getByRole('button', { name: 'Sign up' }).click()
  );

  expect(message).toBe('This user already exist.');
});