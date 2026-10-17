import { Page, Locator } from '@playwright/test';
import { acceptDialog } from '../utils/dialog';

export class ContactPage {
  readonly page: Page;
  readonly contactLink: Locator;
  readonly emailInput: Locator;
  readonly nameInput: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;

  // About us popup
  readonly aboutLink: Locator;
  readonly aboutModal: Locator;
  readonly aboutVideo: Locator;
  readonly aboutCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactLink = page.locator('a[data-target="#exampleModal"]');
    this.emailInput = page.locator('#recipient-email');
    this.nameInput = page.locator('#recipient-name');
    this.messageInput = page.locator('#message-text');
    this.sendButton = page.getByRole('button', { name: 'Send message' });

    this.aboutLink = page.locator('a[data-target="#videoModal"]');
    this.aboutModal = page.locator('#videoModal');
    this.aboutVideo = this.aboutModal.locator('video');
    this.aboutCloseButton = this.aboutModal.locator('.modal-footer').getByRole('button', { name: 'Close' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async sendMessage(email: string, name: string, message: string): Promise<string> {
    await this.contactLink.click();
    await this.emailInput.waitFor();
    await this.emailInput.fill(email);
    await this.nameInput.fill(name);
    await this.messageInput.fill(message);
    return acceptDialog(this.page, () => this.sendButton.click());
  }

  async openAbout() {
    await this.aboutLink.click();
    await this.aboutVideo.waitFor();
  }

  async closeAbout() {
    await this.aboutCloseButton.click();
  }
}