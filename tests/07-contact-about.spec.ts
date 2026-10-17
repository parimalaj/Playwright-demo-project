import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';

test.describe('Contact and About us', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.goto();
  });

  test('contact form sends a message', async () => {
    const message = await contactPage.sendMessage(
      'test@example.com',
      'Parimala Test',
      'Hello from Playwright automation'
    );
    expect(message).toBe('Thanks for the message!!');
  });

  test('About us shows a video and can be closed', async () => {
    await contactPage.openAbout();

    await expect(contactPage.aboutModal.locator('.modal-title')).toHaveText('About us');
    await expect(contactPage.aboutVideo).toBeVisible();

    await contactPage.closeAbout();
    await expect(contactPage.aboutModal).toBeHidden();
  });
});