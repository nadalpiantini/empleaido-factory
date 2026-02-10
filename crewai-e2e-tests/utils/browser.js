import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BrowserManager {
  constructor(options = {}) {
    this.baseURL = options.baseURL || process.env.BASE_URL || 'http://localhost:3000';
    this.headless = options.headed ? false : (process.env.HEADED === 'true' ? false : true);
    this.slowMo = parseInt(process.env.SLOW_MO) || 50;
    this.devtools = process.env.DEVTOOLS === 'true';
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async start() {
    console.log(`🚀 Starting browser...`);
    console.log(`   - URL: ${this.baseURL}`);
    console.log(`   - Headless: ${this.headless}`);
    console.log(`   - SlowMo: ${this.slowMo}ms`);

    this.browser = await chromium.launch({
      headless: this.headless,
      slowMo: this.slowMo,
      devtools: this.devtools,
      args: ['--start-maximized']
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: path.join(__dirname, '../videos'),
        size: { width: 1920, height: 1080 }
      }
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(10000);

    // Error handling
    this.page.on('pageerror', (error) => {
      console.error('❌ Page Error:', error.message);
    });

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('❌ Console Error:', msg.text());
      }
    });

    return this.page;
  }

  async navigateTo(url) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    console.log(`📍 Navigating to: ${fullUrl}`);
    await this.page.goto(fullUrl, { waitUntil: 'networkidle' });
    return this.page;
  }

  async screenshot(name) {
    const screenshotPath = path.join(__dirname, '../screenshots', `${name}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  async close() {
    console.log('🔚 Closing browser...');
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  getPage() {
    return this.page;
  }
}

export class Logger {
  static log(agent, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${agent}] ${message}`;
    console.log(logMessage);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    return { timestamp, agent, message, data };
  }

  static error(agent, message, error = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `❌ [${timestamp}] [${agent}] ${message}`;
    console.error(logMessage);
    if (error) {
      console.error(error);
    }
    return { timestamp, agent, message, error, type: 'error' };
  }

  static success(agent, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `✅ [${timestamp}] [${agent}] ${message}`;
    console.log(logMessage);
    return { timestamp, agent, message, type: 'success' };
  }

  static warning(agent, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `⚠️  [${timestamp}] [${agent}] ${message}`;
    console.warn(logMessage);
    return { timestamp, agent, message, type: 'warning' };
  }
}

export class BugReport {
  constructor() {
    this.bugs = [];
    this.warnings = [];
    this.suggestions = [];
  }

  addBug(severity, title, description, location, screenshot = null) {
    const bug = {
      id: `BUG-${this.bugs.length + 1}`,
      severity, // 'critical', 'high', 'medium', 'low'
      title,
      description,
      location,
      screenshot,
      timestamp: new Date().toISOString()
    };
    this.bugs.push(bug);
    return bug;
  }

  addWarning(title, description, location) {
    const warning = {
      id: `WARN-${this.warnings.length + 1}`,
      title,
      description,
      location,
      timestamp: new Date().toISOString()
    };
    this.warnings.push(warning);
    return warning;
  }

  addSuggestion(title, description, location) {
    const suggestion = {
      id: `SUG-${this.suggestions.length + 1}`,
      title,
      description,
      location,
      timestamp: new Date().toISOString()
    };
    this.suggestions.push(suggestion);
    return suggestion;
  }

  generateReport() {
    return {
      summary: {
        totalBugs: this.bugs.length,
        criticalBugs: this.bugs.filter(b => b.severity === 'critical').length,
        highBugs: this.bugs.filter(b => b.severity === 'high').length,
        mediumBugs: this.bugs.filter(b => b.severity === 'medium').length,
        lowBugs: this.bugs.filter(b => b.severity === 'low').length,
        totalWarnings: this.warnings.length,
        totalSuggestions: this.suggestions.length
      },
      bugs: this.bugs,
      warnings: this.warnings,
      suggestions: this.suggestions,
      generatedAt: new Date().toISOString()
    };
  }

  saveReport(filename) {
    const reportPath = path.join(__dirname, '../reports', filename);
    fs.writeFileSync(reportPath, JSON.stringify(this.generateReport(), null, 2));
    console.log(`📄 Report saved: ${reportPath}`);
    return reportPath;
  }
}
