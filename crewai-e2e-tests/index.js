import { BrowserManager, BugReport } from './utils/browser.js';
import { LandingAgent } from './agents/LandingAgent.js';
import { OnboardingAgent } from './agents/OnboardingAgent.js';
import { CatalogAgent } from './agents/CatalogAgent.js';
import { PurchaseAgent } from './agents/PurchaseAgent.js';

const HEADED = process.env.HEADED === 'true' || process.argv.includes('--headed');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   Empleaido Factory - E2E Testing with CrewAI            ║');
console.log('║   Playwright + AI Agents = Comprehensive Testing         ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`Configuration:`);
console.log(`  Base URL: ${BASE_URL}`);
console.log(`  Headed Mode: ${HEADED ? 'YES (browser visible)' : 'NO (headless)'}`);
console.log('');

async function runTests() {
  const browserManager = new BrowserManager({
    baseURL: BASE_URL,
    headed: HEADED
  });

  const bugReport = new BugReport();
  const page = await browserManager.start();

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  STARTING COMPREHENSIVE E2E TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  // Initialize agents
  const agents = {
    landing: new LandingAgent(),
    onboarding: new OnboardingAgent(),
    catalog: new CatalogAgent(),
    purchase: new PurchaseAgent()
  };

  const results = {
    landing: { issues: [], passed: 0, failed: 0 },
    onboarding: { issues: [], passed: 0, failed: 0 },
    catalog: { issues: [], passed: 0, failed: 0 },
    purchase: { issues: [], passed: 0, failed: 0 }
  };

  try {
    // Test 1: Landing Page
    console.log('📍 Test Suite 1: LANDING PAGE');
    console.log('───────────────────────────────────────────────────────────');
    await browserManager.navigateTo('/');
    await page.waitForTimeout(2000);
    await browserManager.screenshot('01-landing-page');

    const landingIssues = await agents.landing.runTests(page);
    results.landing.issues = landingIssues;
    landingIssues.forEach(issue => {
      if (issue.type === 'error') results.landing.failed++;
      else results.landing.passed++;
    });
    console.log(`✅ Landing page tests completed: ${landingIssues.length} issue(s) found`);
    console.log('');

    // Test 2: Onboarding Flow
    console.log('📍 Test Suite 2: ONBOARDING FLOW');
    console.log('───────────────────────────────────────────────────────────');
    await browserManager.screenshot('02-onboarding-start');

    const onboardingIssues = await agents.onboarding.runTests(page);
    results.onboarding.issues = onboardingIssues;
    onboardingIssues.forEach(issue => {
      if (issue.type === 'error') results.onboarding.failed++;
      else results.onboarding.passed++;
    });
    console.log(`✅ Onboarding tests completed: ${onboardingIssues.length} issue(s) found`);
    console.log('');

    // Test 3: Catalog
    console.log('📍 Test Suite 3: EMPLEAIDO CATALOG');
    console.log('───────────────────────────────────────────────────────────');
    await browserManager.screenshot('03-catalog-page');

    const catalogIssues = await agents.catalog.runTests(page);
    results.catalog.issues = catalogIssues;
    catalogIssues.forEach(issue => {
      if (issue.type === 'error') results.catalog.failed++;
      else results.catalog.passed++;
    });
    console.log(`✅ Catalog tests completed: ${catalogIssues.length} issue(s) found`);
    console.log('');

    // Test 4: Purchase Flow
    console.log('📍 Test Suite 4: PURCHASE FLOW');
    console.log('───────────────────────────────────────────────────────────');
    await browserManager.screenshot('04-purchase-flow');

    const purchaseIssues = await agents.purchase.runTests(page);
    results.purchase.issues = purchaseIssues;
    purchaseIssues.forEach(issue => {
      if (issue.type === 'error') results.purchase.failed++;
      else results.purchase.passed++;
    });
    console.log(`✅ Purchase flow tests completed: ${purchaseIssues.length} issue(s) found`);
    console.log('');

    // Final screenshot
    await browserManager.screenshot('99-final-state');

    // Process results into bug report
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  PROCESSING RESULTS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

    Object.entries(results).forEach(([suite, result]) => {
      result.issues.forEach(issue => {
        if (issue.type === 'error') {
          bugReport.addBug(issue.severity, issue.message, `${suite} test suite`, issue.severity);
        } else if (issue.type === 'warning') {
          bugReport.addWarning(issue.message, `${suite} test suite`, issue.severity);
        } else if (issue.type === 'suggestion') {
          bugReport.addSuggestion(issue.message, `${suite} test suite`, issue.severity);
        }
      });
    });

    // Generate and save report
    const report = bugReport.generateReport();
    const reportPath = bugReport.saveReport(`test-report-${Date.now()}.json`);

    // Print summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  TEST SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log(`Total Issues Found: ${report.summary.totalBugs + report.summary.totalWarnings + report.summary.totalSuggestions}`);
    console.log(`  - Critical Bugs: ${report.summary.criticalBugs}`);
    console.log(`  - High Bugs: ${report.summary.highBugs}`);
    console.log(`  - Medium Bugs: ${report.summary.mediumBugs}`);
    console.log(`  - Low Bugs: ${report.summary.lowBugs}`);
    console.log(`  - Warnings: ${report.summary.totalWarnings}`);
    console.log(`  - Suggestions: ${report.summary.totalSuggestions}`);
    console.log('');

    // Print detailed issues
    if (report.bugs.length > 0) {
      console.log('🐛 BUGS FOUND:');
      console.log('───────────────────────────────────────────────────────────');
      report.bugs.forEach((bug, index) => {
        const icon = bug.severity === 'critical' ? '🚨' : bug.severity === 'high' ? '❌' : '⚠️';
        console.log(`${icon} [${bug.id}] ${bug.title}`);
        console.log(`   Severity: ${bug.severity.toUpperCase()}`);
        console.log(`   Location: ${bug.location}`);
        console.log(`   Description: ${bug.description}`);
        console.log('');
      });
    }

    if (report.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      console.log('───────────────────────────────────────────────────────────');
      report.warnings.forEach(warning => {
        console.log(`   [${warning.id}] ${warning.title}`);
        console.log(`   ${warning.description}`);
        console.log('');
      });
    }

    if (report.suggestions.length > 0) {
      console.log('💡 SUGGESTIONS:');
      console.log('───────────────────────────────────────────────────────────');
      report.suggestions.forEach(suggestion => {
        console.log(`   [${suggestion.id}] ${suggestion.title}`);
        console.log(`   ${suggestion.description}`);
        console.log('');
      });
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  📄 Full report saved to: ${reportPath}`);
    console.log('═══════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Test execution failed:', error);
    bugReport.addBug('critical', 'Test execution failure', error.message, error.stack);
  } finally {
    await browserManager.close();
  }
}

// Run tests
runTests().then(() => {
  console.log('');
  console.log('✅ All tests completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
