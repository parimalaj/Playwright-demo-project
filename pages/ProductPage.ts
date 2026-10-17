import { Page, Locator } from '@playwright/test';
import { acceptDialog } from '../utils/dialog';

export class ProductPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('#tbodyid .name');
    this.price = page.locator('#tbodyid .price-container');
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
  }

  // "$360 *includes tax" → 360
  async getPrice(): Promise<number> {
    await this.price.waitFor();
    const text = await this.price.innerText();
    return Number(text.replace(/[^\d]/g, ''));
  }

  async addToCart(): Promise<string> {
    return acceptDialog(this.page, () => this.addToCartButton.click());
  }
}