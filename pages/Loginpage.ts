import { Page, Locator } from '@playwright/test';
import { acceptDialog } from '../utils/dialog';

export class LoginPage {
  // 1. Properties: the page and its elements
  readonly page: Page;
  readonly loginLink: Locator;
  readonly logoutLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly welcomeUser: Locator;

  // 2. Constructor: find all the elements once
  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.locator('#login2');
    this.logoutLink = page.locator('#logout2');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginButton = page.locator('#logInModal').getByRole('button', { name: 'Log in' });
    this.welcomeUser = page.locator('#nameofuser');
  }

  // 3. Actions: what a user can do on this page
  async goto() {
    await this.page.goto('/');
  }

  async openLoginPopup() {
    await this.loginLink.click();
    await this.usernameInput.waitFor();
  }

  async fillCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  // Successful login: no alert, the welcome text appears
  async login(username: string, password: string) {
    await this.fillCredentials(username, password);
    await this.loginButton.click();
    await this.welcomeUser.waitFor();
  }

  // Failed login: an alert appears, so return its text
  async loginExpectingError(username: string, password: string): Promise<string> {
    await this.fillCredentials(username, password);
    return acceptDialog(this.page, () => this.loginButton.click());
  }

  async logout() {
    await this.logoutLink.click();
  }
}