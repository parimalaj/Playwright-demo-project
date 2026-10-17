# Demoblaze E2E Automation — Playwright + TypeScript

![Playwright Tests](https://github.com/parimalaj/Playwright-demo-project/actions/workflows/playwright.yml/badge.svg)

End-to-end UI test automation for the demo e-commerce site [demoblaze.com](https://www.demoblaze.com), built with **Playwright** and **TypeScript** using the **Page Object Model**, and running in **two CI/CD pipelines: GitHub Actions and Azure DevOps**.

> Personal practice project, built to learn and demonstrate a complete test automation + CI/CD workflow.

---

## Tech stack

| Area | Tools |
|---|---|
| Test framework | Playwright Test |
| Language | TypeScript (Node.js 22) |
| Design pattern | Page Object Model |
| CI/CD | GitHub Actions, Azure Pipelines |
| Reporting | Playwright HTML report, JUnit XML (Azure Tests tab) |
| Secrets | `.env` (local), GitHub Secrets, Azure secret variables |

---

## Test coverage — 21 tests

| Area | Spec file | Scenarios |
|---|---|---|
| Sign up | `02-signup.spec.ts` | new user, existing username, empty fields |
| Login / Logout | `03-login-logout.spec.ts` | valid login, wrong password, unknown user, empty fields, logout |
| Products | `04-products.spec.ts` | home page items, Phones / Laptops / Monitors filters, pagination, product details |
| Cart | `05-cart.spec.ts` | add item, total = sum of prices, delete item |
| Checkout | `06-checkout.spec.ts` | complete purchase (amount, card, name verified), empty-form validation |
| Contact / About | `07-contact-about.spec.ts` | send contact message, About us video modal |

Includes both **positive and negative** scenarios.

---

## Project structure

```
├── pages/                  # Page Objects — locators + actions
│   ├── HomePage.ts
│   ├── SignupPage.ts
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── OrderPage.ts
│   └── ContactPage.ts
├── tests/                  # Test specs — steps + assertions only
├── utils/
│   └── dialog.ts           # Helper for native JS alerts
├── playwright.config.ts    # baseURL, timeouts, retries, reporters, viewport
├── .github/workflows/
│   └── playwright.yml      # GitHub Actions pipeline
└── azure-pipelines.yml     # Azure DevOps pipeline
```

Tests never contain locators. They call page-object methods such as `loginPage.login(user, pass)`, so a UI change is fixed in one place.

---

## Run locally

**1. Install**

```bash
npm ci
npx playwright install
```

**2. Add credentials.** Create a `.env` file in the project root (it is git-ignored):

```
DEMO_USER=your_demoblaze_username
DEMO_PASS=your_demoblaze_password
```

The account must already exist on demoblaze.com.

**3. Run**

```bash
npx playwright test                 # all tests (headless)
npx playwright test --headed        # watch the browser
npx playwright test tests/05-cart.spec.ts   # one file
npx playwright show-report          # open the HTML report
```

---

## CI/CD

Both pipelines run automatically on every **push** and **pull request** to `main`:

```
git push → webhook → pipeline starts on a fresh Linux agent
   → checkout → install Node → npm ci → install Chromium
   → run tests (credentials injected from secrets)
   → publish HTML report + JUnit results → ✅ / ❌
```

| | GitHub Actions | Azure Pipelines |
|---|---|---|
| Config | `.github/workflows/playwright.yml` | `azure-pipelines.yml` |
| Credentials | Repository Secrets | Secret pipeline variables |
| Results | HTML report artifact | Tests tab (JUnit) + HTML report artifact |

---

## Key implementation details

- **Native alert handling**: Demoblaze uses `alert()` for results. `utils/dialog.ts` registers a one-time dialog handler before the click, then reads and accepts the alert the moment it appears.
- **No hard waits**: relies on Playwright auto-waiting and web-first assertions (`toHaveCount`, `toHaveText`) for AJAX-loaded content.
- **Test isolation**: each test runs in a fresh browser context, so the cart always starts empty and tests can run in parallel.
- **Unique test data**: new users are generated with `user_${Date.now()}`.
- **No hard-coded prices**: cart and checkout tests read prices from the product page and verify the totals.
- **Debugging**: traces and screenshots are kept on failure, and one automatic retry is enabled.

---

## Author

**Parimala Jillella**: QA Automation Engineer# Playwright-demo-project