import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly rows: Locator;
  readonly total: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('#tbodyid tr');
    this.total = page.locator('#totalp');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getTotal(): Promise<number> {
    await expect(this.total).not.toBeEmpty();
    return Number(await this.total.innerText());
  }

  async deleteItem(productName: string) {
    await this.rows.filter({ hasText: productName })
      .getByRole('link', { name: 'Delete' })
      .click();
  }

    async openPlaceOrder() {
    await this.placeOrderButton.click();
    await this.page.locator('#orderModal #name').waitFor();
  }
}