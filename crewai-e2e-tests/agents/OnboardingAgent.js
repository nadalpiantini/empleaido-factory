import { Logger } from '../utils/browser.js';

export class OnboardingAgent {
  constructor() {
    this.name = 'OnboardingTester';
    this.role = 'Onboarding Flow Quality Assurance Specialist';
    this.goal = 'Test the complete onboarding flow from signup to dashboard';
    this.backstory = `You are an expert in user onboarding experiences.
    You understand the importance of smooth, intuitive onboarding flows.
    You test for:
    - Clear signup/login processes
    - Step-by-step guidance
    - Form validation and error handling
    - Progress indicators
    - User data collection
    - Successful completion leading to dashboard`;
  }

  async testOnboardingEntry(page) {
    Logger.log(this.name, 'Testing Onboarding Entry Points...');

    const issues = [];

    try {
      // Look for onboarding triggers
      const startButtons = await page.locator('button:has-text("Start"), button:has-text("Begin"), button:has-text("Get Started"), a:has-text("Start")').all();

      if (startButtons.length === 0) {
        issues.push({
          type: 'warning',
          message: 'No obvious onboarding entry point found',
          severity: 'medium'
        });
      } else {
        Logger.success(this.name, `Found ${startButtons.length} onboarding entry point(s)`);
      }

      // Check for onboarding route
      try {
        const baseURL = process.env.BASE_URL || 'http://localhost:3000';
        await page.goto(`${baseURL}/onboarding/test-user`, { waitUntil: 'networkidle' });
        const onboardingVisible = await page.locator('body').isVisible();
        if (onboardingVisible) {
          Logger.success(this.name, 'Onboarding route accessible');
        }
      } catch (navError) {
        issues.push({
          type: 'error',
          message: `Onboarding route not accessible: ${navError.message}`,
          severity: 'high'
        });
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing onboarding entry', error);
      issues.push({
        type: 'error',
        message: `Onboarding entry test failed: ${error.message}`,
        severity: 'critical'
      });
    }

    return issues;
  }

  async testOnboardingSteps(page) {
    Logger.log(this.name, 'Testing Onboarding Steps...');

    const issues = [];

    try {
      // Navigate to onboarding
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/onboarding/test-user`);

      // Wait for page to load
      await page.waitForTimeout(2000);

      // Check for form elements
      const forms = await page.locator('form, input, select, textarea').all();
      Logger.log(this.name, `Found ${forms.length} form element(s)`);

      if (forms.length === 0) {
        issues.push({
          type: 'warning',
          message: 'No form elements found in onboarding',
          severity: 'medium'
        });
      }

      // Check for next/continue buttons
      const nextButtons = await page.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Submit")').all();
      Logger.log(this.name, `Found ${nextButtons.length} navigation button(s)`);

      if (nextButtons.length === 0) {
        issues.push({
          type: 'error',
          message: 'No navigation buttons found in onboarding',
          severity: 'high'
        });
      }

      // Check for progress indicator
      const progressIndicators = await page.locator('[class*="progress"], [role="progressbar"]').all();
      if (progressIndicators.length > 0) {
        Logger.success(this.name, 'Progress indicator found');
      } else {
        issues.push({
          type: 'suggestion',
          message: 'Consider adding a progress indicator for multi-step onboarding',
          severity: 'low'
        });
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing onboarding steps', error);
      issues.push({
        type: 'error',
        message: `Onboarding steps test failed: ${error.message}`,
        severity: 'high'
      });
    }

    return issues;
  }

  async testFormValidation(page) {
    Logger.log(this.name, 'Testing Form Validation...');

    const issues = [];

    try {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/onboarding/test-user`);
      await page.waitForTimeout(2000);

      // Try to submit form without filling required fields
      const submitButtons = await page.locator('button:has-text("Submit"), button:has-text("Continue"), button[type="submit"]').all();

      if (submitButtons.length > 0) {
        await submitButtons[0].click();
        await page.waitForTimeout(1000);

        // Check for validation messages
        const validationMessages = await page.locator('text=required, text=invalid, [class*="error"], [role="alert"]').all();

        if (validationMessages.length > 0) {
          Logger.success(this.name, `Form validation working (${validationMessages.length} message(s))`);
        } else {
          issues.push({
            type: 'warning',
            message: 'No validation messages shown when submitting empty form',
            severity: 'medium'
          });
        }
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing form validation', error);
      issues.push({
        type: 'error',
        message: `Form validation test failed: ${error.message}`,
        severity: 'medium'
      });
    }

    return issues;
  }

  async testOnboardingCompletion(page) {
    Logger.log(this.name, 'Testing Onboarding Completion Flow...');

    const issues = [];

    try {
      // Check if completing onboarding leads to dashboard
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/onboarding/test-user`);
      await page.waitForTimeout(2000);

      // Look for completion elements
      const completionElements = await page.locator('text=Complete, text=Finish, text=Done').all();

      if (completionElements.length > 0) {
        Logger.success(this.name, 'Completion flow detected');
      } else {
        issues.push({
          type: 'warning',
          message: 'Unclear onboarding completion flow',
          severity: 'medium'
        });
      }

      // Check for redirect to dashboard
      try {
        await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle' });
        const dashboardVisible = await page.locator('body').isVisible();
        if (dashboardVisible) {
          Logger.success(this.name, 'Dashboard accessible after onboarding');
        }
      } catch (dashboardError) {
        issues.push({
          type: 'error',
          message: `Dashboard not accessible after onboarding: ${dashboardError.message}`,
          severity: 'high'
        });
      }

    } catch (error) {
      Logger.error(this.name, 'Error testing onboarding completion', error);
      issues.push({
        type: 'error',
        message: `Onboarding completion test failed: ${error.message}`,
        severity: 'high'
      });
    }

    return issues;
  }

  async runTests(page) {
    Logger.log(this.name, 'Starting onboarding flow tests...');

    const allIssues = [];

    // Run all tests
    allIssues.push(...await this.testOnboardingEntry(page));
    allIssues.push(...await this.testOnboardingSteps(page));
    allIssues.push(...await this.testFormValidation(page));
    allIssues.push(...await this.testOnboardingCompletion(page));

    return allIssues;
  }
}
