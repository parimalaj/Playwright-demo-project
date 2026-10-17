import { Page } from '@playwright/test';

export async function acceptDialog(page: Page, action: () => Promise<unknown>): Promise<string> {
  const messagePromise = new Promise<string>((resolve) => {
    page.once('dialog', async (dialog) => {
      const message = dialog.message();
      await dialog.accept().catch(() => {});
      resolve(message);
    });
  });

  await action();

  return messagePromise;
}