import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly productTitles: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('#tbodyid .card');
    this.productTitles = page.locator('#tbodyid .card-title a');
    this.nextButton = page.locator('#next2');
  }

  async goto() {
    await this.page.goto('/');
    await this.productCards.first().waitFor();
  }

  async selectCategory(name: 'Phones' | 'Laptops' | 'Monitors') {
    await this.page.locator('#itemc', { hasText: name }).click();
  }

  async openProduct(name: string) {
    await this.productTitles.filter({ hasText: name }).click();
    await this.page.waitForURL(/prod\.html/);
  }
}