import { Page } from '@playwright/test';

export async function acceptDialog(page: Page, action: () => Promise<unknown>): Promise<string> {
  const [dialog] = await Promise.all([
    page.waitForEvent('dialog'),
    action(),
  ]);
  const message = dialog.message();
  await dialog.accept();
  return message;
}