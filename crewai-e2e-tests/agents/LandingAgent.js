import { Logger } from '../utils/browser.js';

export class LandingAgent {
  constructor() {
    this.name = 'LandingExplorer';
    this.role = 'Landing Page Quality Assurance Specialist';
    this.goal = 'Thoroughly test the landing page functionality, design, and user experience';
    this.backstory = `You are an expert UX tester with 10+ years of experience evaluating landing pages.
    You have a keen eye for detail and can identify issues with:
    - Visual design and layout
    - Navigation and accessibility
    - Content clarity and messaging
    - Performance and loading issues
    - Mobile responsiveness
    - Call-to-action effectiveness`;
  }

  async testHeroSection(page) {
    Logger.log(this.name, 'Testing Hero Section...');

    const issues = [];

    try {
      // Check for hero section
      const hero = await page.locator('section').first();
      const isVisible = await hero.isVisible();

      if (!isVisible) {
        issues.push({
          type: 'error',
          message: 'Hero section not visible',
          severity: 'high'
        });
      }

      // Check for CTA button
      const ctaButtons = await page.locator('button').all();
      if (ctaButtons.length === 0) {
        issues.push({
          type: 'warning',
          message: 'No CTA buttons found on landing page',
          severity: 'medium'
        });
      } else {
        Logger.success(this.name, `Found ${ctaButtons.length} CTA button(s)`);
      }

      // Check for headline
      const headings = await page.locator('h1, h2').all();
      if (headings.length === 0) {
        issues.push({
          type: 'error',
          message: 'No headings found on landing page',
          severity: 'high'
        });
      } else {
        const headingText = await headings[0].textContent();
        Logger.success(this.name, `Headline found: "${headingText?.trim().substring(0, 50)}..."`);
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing hero section', error);
      issues.push({
        type: 'error',
        message: `Hero section test failed: ${error.message}`,
        severity: 'critical'
      });
    }

    return issues;
  }

  async testNavigation(page) {
    Logger.log(this.name, 'Testing Navigation...');

    const issues = [];

    try {
      // Check for navigation
      const nav = await page.locator('nav, header').first();
      const hasNav = await nav.count() > 0;

      if (!hasNav) {
        issues.push({
          type: 'warning',
          message: 'No navigation element found',
          severity: 'medium'
        });
      } else {
        Logger.success(this.name, 'Navigation found');

        // Check navigation links
        const navLinks = await nav.locator('a').all();
        Logger.log(this.name, `Found ${navLinks.length} navigation link(s)`);

        // Test each link
        for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
          try {
            const link = navLinks[i];
            const href = await link.getAttribute('href');
            const text = await link.textContent();

            if (href && !href.startsWith('#')) {
              Logger.log(this.name, `Testing link: "${text?.trim()}" -> ${href}`);
            }
          } catch (linkError) {
            issues.push({
              type: 'warning',
              message: `Navigation link ${i} failed: ${linkError.message}`,
              severity: 'low'
            });
          }
        }
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing navigation', error);
      issues.push({
        type: 'error',
        message: `Navigation test failed: ${error.message}`,
        severity: 'high'
      });
    }

    return issues;
  }

  async testContentSections(page) {
    Logger.log(this.name, 'Testing Content Sections...');

    const issues = [];

    try {
      // Check for sections
      const sections = await page.locator('section, div[class*="section"]').all();
      Logger.log(this.name, `Found ${sections.length} section(s)`);

      if (sections.length < 3) {
        issues.push({
          type: 'warning',
          message: `Landing page has only ${sections.length} sections. Consider adding more content.`,
          severity: 'low'
        });
      }

      // Check for images
      const images = await page.locator('img').all();
      Logger.log(this.name, `Found ${images.length} image(s)`);

      // Check for broken images
      for (let i = 0; i < images.length; i++) {
        try {
          const img = images[i];
          const src = await img.getAttribute('src');
          const naturalWidth = await img.evaluate(img => img.naturalWidth);

          if (naturalWidth === 0 && src) {
            issues.push({
              type: 'error',
              message: `Broken image detected: ${src}`,
              severity: 'medium'
            });
          }
        } catch (imgError) {
          // Image might not be loaded yet
        }
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing content sections', error);
      issues.push({
        type: 'error',
        message: `Content sections test failed: ${error.message}`,
        severity: 'medium'
      });
    }

    return issues;
  }

  async testMobileResponsiveness(page) {
    Logger.log(this.name, 'Testing Mobile Responsiveness...');

    const issues = [];

    try {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);

      // Check if content is still visible
      const bodyVisible = await page.locator('body').isVisible();
      if (!bodyVisible) {
        issues.push({
          type: 'error',
          message: 'Content not visible on mobile viewport',
          severity: 'critical'
        });
      } else {
        Logger.success(this.name, 'Mobile responsive');
      }

      // Reset to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });

    } catch (error) {
      Logger.error(this.name, 'Error testing mobile responsiveness', error);
      issues.push({
        type: 'error',
        message: `Mobile responsiveness test failed: ${error.message}`,
        severity: 'high'
      });
    }

    return issues;
  }

  async testPerformance(page) {
    Logger.log(this.name, 'Testing Performance...');

    const issues = [];
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });

    Logger.log(this.name, 'Performance Metrics', metrics);

    if (metrics.totalTime > 3000) {
      issues.push({
        type: 'warning',
        message: `Page load time is ${metrics.totalTime}ms. Consider optimizing.`,
        severity: 'low'
      });
    } else {
      Logger.success(this.name, `Page loaded in ${metrics.totalTime}ms`);
    }

    return issues;
  }

  async runTests(page) {
    Logger.log(this.name, 'Starting landing page tests...');

    const allIssues = [];

    // Run all tests
    allIssues.push(...await this.testHeroSection(page));
    allIssues.push(...await this.testNavigation(page));
    allIssues.push(...await this.testContentSections(page));
    allIssues.push(...await this.testMobileResponsiveness(page));
    allIssues.push(...await this.testPerformance(page));

    return allIssues;
  }
}
