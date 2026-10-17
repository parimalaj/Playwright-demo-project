import { Page, Locator } from '@playwright/test';
import { acceptDialog } from '../utils/dialog';

export interface OrderDetails {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export class OrderPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;

  // Confirmation popup shown after a successful purchase
  readonly confirmTitle: Locator;
  readonly confirmDetails: Locator;
  readonly confirmOkButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#orderModal #name');
    this.countryInput = page.locator('#orderModal #country');
    this.cityInput = page.locator('#orderModal #city');
    this.cardInput = page.locator('#orderModal #card');
    this.monthInput = page.locator('#orderModal #month');
    this.yearInput = page.locator('#orderModal #year');
    this.purchaseButton = page.locator('#orderModal').getByRole('button', { name: 'Purchase' });

    this.confirmTitle = page.locator('.sweet-alert h2');
    this.confirmDetails = page.locator('.sweet-alert p.lead');
    this.confirmOkButton = page.locator('.sweet-alert').getByRole('button', { name: 'OK' });
  }

  async fillForm(details: OrderDetails) {
    await this.nameInput.fill(details.name);
    await this.countryInput.fill(details.country);
    await this.cityInput.fill(details.city);
    await this.cardInput.fill(details.card);
    await this.monthInput.fill(details.month);
    await this.yearInput.fill(details.year);
  }

  async purchase(details: OrderDetails) {
    await this.fillForm(details);
    await this.purchaseButton.click();
  }

  // Clicking Purchase with empty fields shows a browser alert
  async purchaseExpectingError(): Promise<string> {
    return acceptDialog(this.page, () => this.purchaseButton.click());
  }

  async confirm() {
    await this.confirmOkButton.click();
  }
}