import { Logger } from '../utils/browser.js';

export class PurchaseAgent {
  constructor() {
    this.name = 'PurchaseFlowTester';
    this.role = 'Purchase and Checkout Flow Specialist';
    this.goal = 'Test the complete purchase flow from product selection to completion';
    this.backstory = `You are an expert in e-commerce checkout flows.
    You thoroughly test:
    - Add to cart functionality
    - Cart management
    - Checkout process
    - Payment integration
    - Order confirmation
    - User account creation/login requirements
    - Error handling and validation`;
  }

  async testPurchaseFlow(page) {
    Logger.log(this.name, 'Testing Purchase Flow...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      // Start from landing page and find an empleaido
      await page.goto(baseURL);
      await page.waitForTimeout(2000);

      // Find first empleaido link
      const empleaidoLinks = await page.locator('a[href*="/empleaido/"]').all();
      if (empleaidoLinks.length > 0) {
        const href = await empleaidoLinks[0].getAttribute('href');
        const fullUrl = href.startsWith('http') ? href : `${baseURL}${href}`;
        Logger.log(this.name, `Found empleaido, navigating to: ${fullUrl}`);
        await page.goto(fullUrl, { waitUntil: 'networkidle' });
      } else {
        throw new Error('No empleaido links found on landing page');
      }

      // Look for purchase buttons
      const purchaseButtons = await page.locator('button, a[role="button"]').all();

      let purchaseClicked = false;
      for (const button of purchaseButtons) {
        try {
          const text = await button.textContent();
          if (text && (text.toLowerCase().includes('buy') ||
                       text.toLowerCase().includes('purchase') ||
                       text.toLowerCase().includes('get') ||
                       text.toLowerCase().includes('add'))) {
            Logger.log(this.name, `Found purchase button: "${text.trim()}"`);
            await button.click();
            await page.waitForTimeout(2000);
            purchaseClicked = true;
            break;
          }
        } catch (buttonError) {
          // Continue to next button
        }
      }

      if (!purchaseClicked) {
        issues.push({
          type: 'error',
          message: 'Could not find or click purchase button',
          severity: 'high'
        });
      } else {
        Logger.success(this.name, 'Purchase button clicked successfully');

        // Check what happens after click
        const currentUrl = page.url();
        Logger.log(this.name, `Current URL after click: ${currentUrl}`);

        // Check for cart, checkout, or auth redirect
        if (currentUrl.includes('cart') || currentUrl.includes('checkout')) {
          Logger.success(this.name, 'Redirected to cart/checkout');
        } else if (currentUrl.includes('login') || currentUrl.includes('signin')) {
          Logger.log(this.name, 'Redirected to authentication (expected behavior)');
        } else {
          issues.push({
            type: 'warning',
            message: `After clicking purchase, user is at: ${currentUrl}. Expected cart/checkout/auth.`,
            severity: 'medium'
          });
        }
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing purchase flow', error);
      issues.push({
        type: 'error',
        message: `Purchase flow test failed: ${error.message}`,
        severity: 'critical'
      });
    }

    return issues;
  }

  async testCartFunctionality(page) {
    Logger.log(this.name, 'Testing Cart Functionality...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      // Try to access cart
      const cartRoutes = ['/cart', '/checkout', '/basket'];

      let cartFound = false;
      for (const route of cartRoutes) {
        try {
          await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
          const bodyVisible = await page.locator('body').isVisible();
          if (bodyVisible) {
            Logger.success(this.name, `Cart accessible at: ${route}`);
            cartFound = true;
            break;
          }
        } catch (routeError) {
          // Try next route
        }
      }

      if (!cartFound) {
        issues.push({
          type: 'warning',
          message: 'Cart page not found. Tried: /cart, /checkout, /basket',
          severity: 'medium'
        });
      }

      // Check for cart icon/link on pages
      await page.goto(baseURL);
      const cartIcons = await page.locator('[class*="cart"], [aria-label*="cart" i], svg').all();
      Logger.log(this.name, `Found ${cartIcons.length} potential cart icon(s)`);

    } catch (error) {
      Logger.error(this.name, 'Error testing cart functionality', error);
      issues.push({
        type: 'error',
        message: `Cart functionality test failed: ${error.message}`,
        severity: 'medium'
      });
    }

    return issues;
  }

  async testCheckoutProcess(page) {
    Logger.log(this.name, 'Testing Checkout Process...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      // Try to access checkout
      await page.goto(`${baseURL}/checkout`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Check if checkout page exists
      const bodyVisible = await page.locator('body').isVisible();

      if (bodyVisible) {
        Logger.success(this.name, 'Checkout page accessible');

        // Check for checkout form elements
        const forms = await page.locator('form').all();
        const inputs = await page.locator('input').all();

        Logger.log(this.name, `Found ${forms.length} form(s) and ${inputs.length} input(s)`);

        if (forms.length === 0 && inputs.length === 0) {
          issues.push({
            type: 'warning',
            message: 'Checkout form not clearly visible',
            severity: 'medium'
          });
        }

        // Check for payment section
        const paymentSection = await page.locator('text=Payment, text=Card, text=Credit, [class*="payment"]').all();
        if (paymentSection.length === 0) {
          issues.push({
            type: 'warning',
            message: 'Payment section not clearly visible',
            severity: 'medium'
          });
        } else {
          Logger.success(this.name, 'Payment section found');
        }

      } else {
        issues.push({
          type: 'error',
          message: 'Checkout page not accessible',
          severity: 'high'
        });
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing checkout process', error);
      issues.push({
        type: 'error',
        message: `Checkout process test failed: ${error.message}`,
        severity: 'high'
      });
    }

    return issues;
  }

  async testAuthenticationRequirement(page) {
    Logger.log(this.name, 'Testing Authentication Requirement...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      // Check if purchase requires authentication
      await page.goto(baseURL);
      await page.waitForTimeout(1000);

      // Find first empleaido link
      const empleaidoLinks = await page.locator('a[href*="/empleaido/"]').all();
      if (empleaidoLinks.length > 0) {
        const href = await empleaidoLinks[0].getAttribute('href');
        const fullUrl = href.startsWith('http') ? href : `${baseURL}${href}`;
        await page.goto(fullUrl);
      }
      await page.waitForTimeout(2000);

      // Try to click purchase
      const purchaseButtons = await page.locator('button, a[role="button"]').all();
      for (const button of purchaseButtons) {
        try {
          const text = await button.textContent();
          if (text && (text.toLowerCase().includes('buy') ||
                       text.toLowerCase().includes('purchase') ||
                       text.toLowerCase().includes('adopt') ||
                       text.toLowerCase().includes('get'))) {
            await button.click();
            await page.waitForTimeout(2000);

            const currentUrl = page.url();
            if (currentUrl.includes('login') || currentUrl.includes('signin') || currentUrl.includes('auth')) {
              Logger.success(this.name, 'Authentication required for purchase (good practice)');
            }
            break;
          }
        } catch (e) {
          // Continue
        }
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing authentication requirement', error);
      issues.push({
        type: 'warning',
        message: `Authentication requirement test failed: ${error.message}`,
        severity: 'low'
      });
    }

    return issues;
  }

  async runTests(page) {
    Logger.log(this.name, 'Starting purchase flow tests...');

    const allIssues = [];

    // Run all tests
    allIssues.push(...await this.testPurchaseFlow(page));
    allIssues.push(...await this.testCartFunctionality(page));
    allIssues.push(...await this.testCheckoutProcess(page));
    allIssues.push(...await this.testAuthenticationRequirement(page));

    return allIssues;
  }
}
