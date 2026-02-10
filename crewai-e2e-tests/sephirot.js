#!/usr/bin/env node

/**
 * Sephirot Orchestration Engine for Empleaido Factory E2E Tests
 * Coordinates CrewAI agents with Playwright for comprehensive testing
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { BrowserManager, BugReport, Logger } from './utils/browser.js';
import { LandingAgent } from './agents/LandingAgent.js';
import { OnboardingAgent } from './agents/OnboardingAgent.js';
import { CatalogAgent } from './agents/CatalogAgent.js';
import { PurchaseAgent } from './agents/PurchaseAgent.js';

// Load configuration
const CONFIG_PATH = resolve('./sephirot.config.yaml');
const HEADED = process.env.HEADED === 'true' || process.argv.includes('--headed');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class SephirotOrchestrator {
  constructor(config) {
    this.config = config;
    this.browserManager = null;
    this.bugReport = new BugReport();
    this.agents = {};
    this.results = {};
    this.executionLog = [];
  }

  log(phase, agent, message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      phase,
      agent,
      message,
      data
    };
    this.executionLog.push(entry);
    Logger.log(agent, `[${phase}] ${message}`, data);
    return entry;
  }

  async initialize() {
    this.log('INIT', 'Sephirot', 'Initializing Sephirot Orchestration Engine');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     🔯 SEPHIROT - Orchestration Engine                    ║');
    console.log('║     Empleaido Factory E2E Testing Suite                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`📋 Configuration:`);
    console.log(`   - Base URL: ${BASE_URL}`);
    console.log(`   - Headed Mode: ${HEADED ? 'YES' : 'NO'}`);
    console.log(`   - Agents: ${this.config.agents.length}`);
    console.log(`   - Tasks: ${this.config.tasks.length}`);
    console.log(`   - Crews: ${this.config.crews.length}`);
    console.log('');

    // Initialize browser
    this.log('INIT', 'Sephirot', 'Launching browser');
    this.browserManager = new BrowserManager({
      baseURL: BASE_URL,
      headed: HEADED,
      slowMo: this.config.config?.slowMo || 100
    });
    this.page = await this.browserManager.start();

    // Initialize agents
    this.log('INIT', 'Sephirot', 'Initializing agents');
    this.agents = {
      'landing-explorer': new LandingAgent(),
      'onboarding-tester': new OnboardingAgent(),
      'catalog-navigator': new CatalogAgent(),
      'purchase-tester': new PurchaseAgent()
    };

    // Initialize results structure
    this.config.agents.forEach(agent => {
      this.results[agent.id] = {
        agent: agent.name,
        issues: [],
        passed: 0,
        failed: 0,
        warnings: 0,
        suggestions: 0
      };
    });

    this.log('INIT', 'Sephirot', '✅ Initialization complete');
  }

  async executePhase(phase) {
    this.log('EXEC', 'Sephirot', `═══ Phase: ${phase.name} ═══`);
    console.log('');

    for (const action of phase.actions) {
      this.log('EXEC', 'Sephirot', `Action: ${action}`);
    }

    console.log('');
  }

  async executeTask(task) {
    this.log('TASK', 'Sephirot', `Executing: ${task.name}`);

    // Find agent
    const agent = this.agents[task.agent];
    if (!agent) {
      this.log('ERROR', 'Sephirot', `Agent not found: ${task.agent}`);
      return null;
    }

    // Execute task based on agent type
    let issues = [];
    try {
      if (task.agent === 'landing-explorer') {
        await this.browserManager.navigateTo('/');
        await this.page.waitForTimeout(2000);
        await this.browserManager.screenshot(`before-${task.id}`);
        issues = await agent.runTests(this.page);
      } else if (task.agent === 'onboarding-tester') {
        await this.browserManager.navigateTo('/onboarding/test-user');
        await this.page.waitForTimeout(2000);
        await this.browserManager.screenshot(`before-${task.id}`);
        issues = await agent.runTests(this.page);
      } else if (task.agent === 'catalog-navigator') {
        await this.browserManager.navigateTo('/empleaido');
        await this.page.waitForTimeout(2000);
        await this.browserManager.screenshot(`before-${task.id}`);
        issues = await agent.runTests(this.page);
      } else if (task.agent === 'purchase-tester') {
        await this.browserManager.navigateTo('/empleaido/1');
        await this.page.waitForTimeout(2000);
        await this.browserManager.screenshot(`before-${task.id}`);
        issues = await agent.runTests(this.page);
      }

      // Store results
      this.results[task.agent].issues.push(...issues);
      issues.forEach(issue => {
        if (issue.type === 'error') this.results[task.agent].failed++;
        else if (issue.type === 'warning') this.results[task.agent].warnings++;
        else if (issue.type === 'suggestion') this.results[task.agent].suggestions++;
        else this.results[task.agent].passed++;
      });

      this.log('SUCCESS', task.agent, `✅ Completed: ${task.name} (${issues.length} issue(s))`);
      await this.browserManager.screenshot(`after-${task.id}`);

    } catch (error) {
      this.log('ERROR', task.agent, `❌ Task failed: ${error.message}`);
      this.results[task.agent].failed++;
    }

    return issues;
  }

  async executeCrew(crew) {
    this.log('CREW', 'Sephirot', `═══ Executing Crew: ${crew.name} ═══`);
    console.log('');

    const processType = crew.process || 'sequential';

    if (processType === 'sequential') {
      for (const taskId of crew.tasks) {
        const task = this.config.tasks.find(t => t.id === taskId);
        if (task) {
          await this.executeTask(task);
        }
      }
    } else if (processType === 'hierarchical') {
      // Execute in dependency order
      const executedTasks = new Set();
      const maxIterations = crew.tasks.length * 2;
      let iterations = 0;

      while (executedTasks.size < crew.tasks.length && iterations < maxIterations) {
        for (const taskId of crew.tasks) {
          if (executedTasks.has(taskId)) continue;

          const task = this.config.tasks.find(t => t.id === taskId);
          if (!task) continue;

          // Check dependencies
          const depsMet = task.dependencies.every(dep => executedTasks.has(dep));
          if (depsMet) {
            await this.executeTask(task);
            executedTasks.add(taskId);
          }
        }
        iterations++;
      }
    }

    console.log('');
    this.log('CREW', 'Sephirot', `✅ Crew "${crew.name}" completed`);
  }

  async executePlan() {
    this.log('PLAN', 'Sephirot', '═══ EXECUTING TEST PLAN ═══');
    console.log('');

    // Execute phases
    for (const phase of this.config.executionPlan.phases) {
      if (phase.phase === 'pre-test') {
        await this.executePhase(phase);
      } else if (phase.phase === 'test-execution') {
        // Find and execute the crew
        const crew = this.config.crews.find(c => c.id === phase.crew);
        if (crew) {
          await this.executeCrew(crew);
        }
      } else if (phase.phase === 'post-test') {
        await this.executePhase(phase);
      }
    }
  }

  generateReport() {
    this.log('REPORT', 'Sephirot', '═══ GENERATING FINAL REPORT ═══');
    console.log('');

    // Process all issues into bug report
    Object.entries(this.results).forEach(([agentId, result]) => {
      result.issues.forEach(issue => {
        if (issue.type === 'error') {
          this.bugReport.addBug(issue.severity, issue.message, result.agent, issue.severity);
        } else if (issue.type === 'warning') {
          this.bugReport.addWarning(issue.message, result.agent, issue.severity);
        } else if (issue.type === 'suggestion') {
          this.bugReport.addSuggestion(issue.message, result.agent, issue.severity);
        }
      });
    });

    const report = this.bugReport.generateReport();

    // Print summary
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                    TEST RESULTS SUMMARY                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`📊 Total Issues Found: ${report.summary.totalBugs + report.summary.totalWarnings + report.summary.totalSuggestions}`);
    console.log(``);
    console.log(`🐛 Bugs by Severity:`);
    console.log(`   🚨 Critical: ${report.summary.criticalBugs}`);
    console.log(`   ❌ High:     ${report.summary.highBugs}`);
    console.log(`   ⚠️  Medium:   ${report.summary.mediumBugs}`);
    console.log(`   ℹ️  Low:      ${report.summary.lowBugs}`);
    console.log(``);
    console.log(`⚠️  Warnings:   ${report.summary.totalWarnings}`);
    console.log(`💡 Suggestions: ${report.summary.totalSuggestions}`);
    console.log('');

    // Agent-specific summaries
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  RESULTS BY AGENT');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

    Object.entries(this.results).forEach(([agentId, result]) => {
      if (result.issues.length > 0) {
        console.log(`🤖 ${result.agent}`);
        console.log(`   Issues: ${result.issues.length} (${result.failed} errors, ${result.warnings} warnings, ${result.suggestions} suggestions)`);
        console.log('');
      }
    });

    // Print detailed bugs
    if (report.bugs.length > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('  DETAILED BUG REPORT');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');

      report.bugs.forEach(bug => {
        const icon = bug.severity === 'critical' ? '🚨' : bug.severity === 'high' ? '❌' : bug.severity === 'medium' ? '⚠️' : 'ℹ️';
        console.log(`${icon} [${bug.id}] ${bug.title}`);
        console.log(`   Severity: ${bug.severity.toUpperCase()}`);
        console.log(`   Location: ${bug.location}`);
        console.log(`   Description: ${bug.description}`);
        console.log('');
      });
    }

    // Save report
    const reportPath = this.bugReport.saveReport(`sephirot-report-${Date.now()}.json`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  📄 Report saved to: ${reportPath}`);
    console.log('═══════════════════════════════════════════════════════════');

    return report;
  }

  async cleanup() {
    this.log('CLEANUP', 'Sephirot', 'Cleaning up resources');
    if (this.browserManager) {
      await this.browserManager.close();
    }
    this.log('CLEANUP', 'Sephirot', '✅ Cleanup complete');
  }
}

// Simple YAML parser (basic implementation)
function parseConfig(configPath) {
  // For now, return a hardcoded config structure
  // In production, use a proper YAML parser
  return {
    version: "1.0",
    name: "empleaido-factory-e2e",
    config: {
      baseURL: BASE_URL,
      headed: HEADED,
      slowMo: 100
    },
    agents: [
      { id: 'landing-explorer', name: 'Landing Explorer' },
      { id: 'onboarding-tester', name: 'Onboarding Tester' },
      { id: 'catalog-navigator', name: 'Catalog Navigator' },
      { id: 'purchase-tester', name: 'Purchase Flow Tester' }
    ],
    tasks: [
      { id: 'test-landing-suite', name: 'Test Landing Page', agent: 'landing-explorer', dependencies: [] },
      { id: 'test-onboarding-suite', name: 'Test Onboarding', agent: 'onboarding-tester', dependencies: [] },
      { id: 'test-catalog-suite', name: 'Test Catalog', agent: 'catalog-navigator', dependencies: [] },
      { id: 'test-purchase-suite', name: 'Test Purchase', agent: 'purchase-tester', dependencies: [] }
    ],
    crews: [
      {
        id: 'full-journey-test-crew',
        name: 'Full User Journey Test Crew',
        process: 'hierarchical',
        agents: ['landing-explorer', 'onboarding-tester', 'catalog-navigator', 'purchase-tester'],
        tasks: ['test-landing-suite', 'test-onboarding-suite', 'test-catalog-suite', 'test-purchase-suite']
      }
    ],
    executionPlan: {
      phases: [
        { phase: 'pre-test', name: 'Setup', actions: ['Launch browser', 'Initialize recording'] },
        { phase: 'test-execution', name: 'Execute Tests', crew: 'full-journey-test-crew' },
        { phase: 'post-test', name: 'Report', actions: ['Generate report', 'Cleanup'] }
      ]
    }
  };
}

// Main execution
async function main() {
  const config = parseConfig(CONFIG_PATH);
  const sephirot = new SephirotOrchestrator(config);

  try {
    await sephirot.initialize();
    await sephirot.executePlan();
    const report = sephirot.generateReport();

    // Exit with error code if critical bugs found
    if (report.summary.criticalBugs > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await sephirot.cleanup();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => {
    console.log('');
    console.log('✅ Sephirot orchestration completed successfully!');
    process.exit(0);
  });
}

export { SephirotOrchestrator };
