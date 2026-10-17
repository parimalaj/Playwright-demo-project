import { Page, Locator } from '@playwright/test';
import { acceptDialog } from '../utils/dialog';

export class SignupPage {
  readonly page: Page;
  readonly signupLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupLink = page.locator('#signin2');
    this.usernameInput = page.locator('#sign-username');
    this.passwordInput = page.locator('#sign-password');
    this.signupButton = page.locator('#signInModal').getByRole('button', { name: 'Sign up' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async openSignupPopup() {
    await this.signupLink.click();
    await this.usernameInput.waitFor();
  }

  // Every sign-up shows an alert, so this always returns the message
  async signup(username: string, password: string): Promise<string> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    return acceptDialog(this.page, () => this.signupButton.click());
  }
}