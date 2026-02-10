import { Logger } from '../utils/browser.js';

export class CatalogAgent {
  constructor() {
    this.name = 'CatalogNavigator';
    this.role = 'Product Catalog Explorer and Tester';
    this.goal = 'Test the empleaido catalog functionality and user experience';
    this.backstory = `You are an expert e-commerce catalog tester.
    You thoroughly examine product listings for:
    - Product display and information
    - Filtering and sorting options
    - Search functionality
    - Product detail pages
    - Image quality and loading
    - Pricing display
    - Add to cart/purchase flows`;
  }

  async testCatalogAccess(page) {
    Logger.log(this.name, 'Testing Catalog Access...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      // Try multiple possible catalog routes
      const catalogRoutes = ['/catalog', '/empleaido', '/empleaidos', '/products'];

      let catalogFound = false;
      for (const route of catalogRoutes) {
        try {
          const fullUrl = route.startsWith('http') ? route : `${baseURL}${route}`;
          await page.goto(fullUrl, { waitUntil: 'networkidle' });
          const bodyVisible = await page.locator('body').isVisible();
          if (bodyVisible) {
            Logger.success(this.name, `Catalog accessible at: ${route}`);
            catalogFound = true;
            break;
          }
        } catch (routeError) {
          // Route doesn't exist, try next
        }
      }

      if (!catalogFound) {
        issues.push({
          type: 'error',
          message: 'Catalog route not found. Tried: /catalog, /empleaido, /empleaidos, /products',
          severity: 'critical'
        });
      }

      // Check for catalog links from landing page
      await page.goto(baseURL);
      const catalogLinks = await page.locator('a[href*="catalog"], a[href*="empleaido"]').all();

      if (catalogLinks.length === 0) {
        issues.push({
          type: 'warning',
          message: 'No catalog links found on landing page',
          severity: 'medium'
        });
      } else {
        Logger.success(this.name, `Found ${catalogLinks.length} catalog link(s) on landing page`);
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing catalog access', error);
      issues.push({
        type: 'error',
        message: `Catalog access test failed: ${error.message}`,
        severity: 'critical'
      });
    }

    return issues;
  }

  async testProductListings(page) {
    Logger.log(this.name, 'Testing Product Listings...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      // Catalog is on the landing page with empleaido-XXXXX links
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      await page.waitForTimeout(2000);

      // Check for product cards
      const productCards = await page.locator('[class*="card"], [class*="product"], article').all();
      Logger.log(this.name, `Found ${productCards.length} product card(s)`);

      if (productCards.length === 0) {
        issues.push({
          type: 'error',
          message: 'No products displayed in catalog',
          severity: 'critical'
        });
      } else {
        Logger.success(this.name, `Catalog has ${productCards.length} products`);

        // Test first few products
        const testCount = Math.min(productCards.length, 3);
        for (let i = 0; i < testCount; i++) {
          try {
            const card = productCards[i];
            const isVisible = await card.isVisible();
            if (isVisible) {
              Logger.log(this.name, `Product ${i + 1} visible`);
            }
          } catch (cardError) {
            issues.push({
              type: 'warning',
              message: `Product ${i + 1} display issue: ${cardError.message}`,
              severity: 'low'
            });
          }
        }
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing product listings', error);
      issues.push({
        type: 'error',
        message: `Product listings test failed: ${error.message}`,
        severity: 'high'
      });
    }

    return issues;
  }

  async testProductDetails(page) {
    Logger.log(this.name, 'Testing Product Detail Pages...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      // Try to access a specific empleaido (find one on the landing page)
      await page.goto(baseURL);
      await page.waitForTimeout(2000);

      // Find first empleaido link
      const empleaidoLinks = await page.locator('a[href*="/empleaido/"]').all();
      if (empleaidoLinks.length > 0) {
        const href = await empleaidoLinks[0].getAttribute('href');
        const fullUrl = href.startsWith('http') ? href : `${baseURL}${href}`;
        Logger.log(this.name, `Testing empleaido at: ${fullUrl}`);
        await page.goto(fullUrl, { waitUntil: 'networkidle' });
      } else {
        throw new Error('No empleaido links found on landing page');
      }

      // Check if page loaded
      const bodyVisible = await page.locator('body').isVisible();

      if (bodyVisible) {
        Logger.success(this.name, 'Product detail page accessible');

        // Check for product information
        const productInfo = await page.locator('h1, h2, h3, [class*="title"], [class*="name"]').all();
        if (productInfo.length > 0) {
          Logger.success(this.name, `Product information found`);
        } else {
          issues.push({
            type: 'warning',
            message: 'Product title/name not clearly displayed',
            severity: 'medium'
          });
        }

        // Check for description
        const description = await page.locator('[class*="description"], p').all();
        if (description.length > 0) {
          Logger.success(this.name, `Product description found`);
        }

        // Check for purchase button (check both button elements and links with role="button")
        const purchaseButtons = await page.locator('button, a[role="button"]').all();
        let foundPurchaseButton = false;
        for (const btn of purchaseButtons) {
          try {
            const text = await btn.textContent();
            if (text && (text.toLowerCase().includes('buy') ||
                         text.toLowerCase().includes('purchase') ||
                         text.toLowerCase().includes('adopt') ||
                         text.toLowerCase().includes('get') ||
                         text.toLowerCase().includes('add'))) {
              foundPurchaseButton = true;
              Logger.success(this.name, `Found purchase button: "${text.trim()}"`);
              break;
            }
          } catch (e) {
            // Continue to next button
          }
        }

        if (!foundPurchaseButton) {
          issues.push({
            type: 'error',
            message: 'No purchase/CTA button found on product page',
            severity: 'high'
          });
        }

      } else {
        issues.push({
          type: 'error',
          message: 'Product detail page not accessible',
          severity: 'high'
        });
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing product details', error);
      issues.push({
        type: 'error',
        message: `Product details test failed: ${error.message}`,
        severity: 'high'
      });
    }

    return issues;
  }

  async testSearchAndFilters(page) {
    Logger.log(this.name, 'Testing Search and Filters...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/empleaido`);
      await page.waitForTimeout(2000);

      // Check for search input
      const searchInputs = await page.locator('input[type="search"], input[placeholder*="search" i], [class*="search"]').all();
      if (searchInputs.length === 0) {
        issues.push({
          type: 'suggestion',
          message: 'Consider adding search functionality to catalog',
          severity: 'low'
        });
      } else {
        Logger.success(this.name, 'Search functionality found');
      }

      // Check for filters
      const filters = await page.locator('select, [class*="filter"], [class*="category"]').all();
      if (filters.length === 0) {
        issues.push({
          type: 'suggestion',
          message: 'Consider adding filters to improve catalog navigation',
          severity: 'low'
        });
      } else {
        Logger.success(this.name, `Found ${filters.length} filter(s)`);
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing search and filters', error);
      issues.push({
        type: 'error',
        message: `Search and filters test failed: ${error.message}`,
        severity: 'medium'
      });
    }

    return issues;
  }

  async runTests(page) {
    Logger.log(this.name, 'Starting catalog tests...');

    const allIssues = [];

    // Run all tests
    allIssues.push(...await this.testCatalogAccess(page));
    allIssues.push(...await this.testProductListings(page));
    allIssues.push(...await this.testProductDetails(page));
    allIssues.push(...await this.testSearchAndFilters(page));

    return allIssues;
  }
}
