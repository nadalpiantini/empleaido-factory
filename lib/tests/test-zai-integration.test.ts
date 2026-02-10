/**
 * Z.ai Integration Test
 * Verify Z.ai client works correctly with actual API calls
 */

import { ZAIClient } from '../lib/llm/zai-client';
import { calculateCost, estimateCost } from '../lib/billing/cost-tracker';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  total: 0,
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log('\n' + colors.bright + colors.cyan + `═══ ${title} ═══` + colors.reset + '\n');
}

function logTest(name: string) {
  results.total++;
  console.log(colors.blue + `▶ Testing: ${name}` + colors.reset);
}

function logPass(message: string) {
  results.passed++;
  console.log(colors.green + `✓ PASS: ${message}` + colors.reset);
}

function logFail(message: string, error?: any) {
  results.failed++;
  console.log(colors.red + `✗ FAIL: ${message}` + colors.reset);
  if (error) {
    console.log(colors.red + `  Error: ${error}` + colors.reset);
  }
}

// =====================================================
// MAIN TEST FUNCTION
// =====================================================

async function runTests() {
  logSection('Z.AI INTEGRATION TEST SUITE');

  // Check for API key
  logSection('Environment Setup');
  logTest('ZAI_API_KEY is set');
  const apiKey = process.env.ZAI_API_KEY;

  if (!apiKey) {
    logFail('ZAI_API_KEY not found in environment variables');
    log('\n⚠️  Please set ZAI_API_KEY in .env.local before running tests');
    log('Get your API key from: https://open.bigmodel.cn/usercenter/apikeys');
    return;
  }

  if (apiKey.length < 10) {
    logFail('ZAI_API_KEY appears invalid (too short)');
    return;
  }

  logPass(`ZAI_API_KEY found (${apiKey.substring(0, 8)}...)`);

  // Initialize client
  let client: ZAIClient;
  try {
    client = new ZAIClient(apiKey);
    logPass('ZAIClient initialized successfully');
  } catch (error) {
    logFail('Failed to initialize ZAIClient', error);
    return;
  }

  // Test 1: Chat Completion (Free Tier)
  logSection('Chat Completion Test (GLM-4.7-Flash - Free)');
  logTest('Simple chat completion');

  try {
    const chatResponse = await client.chat('glm-4.7-flash', [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: 'Say "Hello, Z.ai!" in exactly those words.',
      },
    ]);

    if (
      chatResponse.choices &&
      chatResponse.choices[0] &&
      chatResponse.choices[0].message
    ) {
      const content = chatResponse.choices[0].message.content;
      logPass(`Chat response received: "${content}"`);

      // Verify usage stats
      if (chatResponse.usage) {
        logPass(
          `Usage: ${chatResponse.usage.total_tokens} tokens (${chatResponse.usage.prompt_tokens} input + ${chatResponse.usage.completion_tokens} output)`
        );
      }
    } else {
      logFail('Invalid chat response structure');
    }
  } catch (error) {
    logFail('Chat completion failed', error);
  }

  // Test 2: Cost Calculation
  logSection('Cost Tracking Test');
  logTest('Calculate cost for GLM-4.7-Flash (FREE)');

  const inputTokens = 100;
  const outputTokens = 50;
  const cost = calculateCost('glm-4.7-flash', inputTokens, outputTokens);

  if (cost === 0) {
    logPass(`Cost correctly calculated as $0.00 (FREE model)`);
  } else {
    logFail(`Expected $0.00 for free model, got $${cost.toFixed(4)}`);
  }

  logTest('Calculate cost for GLM-4.7');

  const premiumCost = calculateCost('glm-4.7', inputTokens, outputTokens);
  const expectedCost = (inputTokens * 0.6 + outputTokens * 2.2) / 1_000_000;

  if (Math.abs(premiumCost - expectedCost) < 0.0001) {
    logPass(`GLM-4.7 cost: $${premiumCost.toFixed(6)} (input: $${(inputTokens * 0.6 / 1_000_000).toFixed(6)} / 1M, output: $${(outputTokens * 2.2 / 1_000_000).toFixed(6)} / 1M)`);
  } else {
    logFail(`Cost calculation incorrect. Expected $${expectedCost.toFixed(6)}, got $${premiumCost.toFixed(6)}`);
  }

  // Test 3: Model Info
  logSection('Model Information Test');
  logTest('Get model info for GLM-4.7-FlashX');

  const modelInfo = client.getModelInfo('glm-4.7-flashx');

  if (
    modelInfo.name === 'GLM-4.7-FlashX' &&
    modelInfo.contextWindow === 128000 &&
    modelInfo.inputCost === 0.07 &&
    modelInfo.outputCost === 0.4
  ) {
    logPass('Model info retrieved correctly:');
    log(`  Name: ${modelInfo.name}`);
    log(`  Context Window: ${modelInfo.contextWindow.toLocaleString()} tokens`);
    log(`  Input Cost: $${modelInfo.inputCost} / 1M tokens`);
    log(`  Output Cost: $${modelInfo.outputCost} / 1M tokens`);
    log(`  Supports Vision: ${modelInfo.supportsVision}`);
    log(`  Supports Tools: ${modelInfo.supportsTools}`);
  } else {
    logFail('Model info incorrect');
  }

  // Test 4: Cost Estimation
  logSection('Cost Estimation Test');
  logTest('Estimate cost before API call');

  const testInput = 'Write a haiku about artificial intelligence.';
  const estimatedCost = estimateCost('glm-4.7-flashx', testInput, 0.75);

  if (estimatedCost > 0 && estimatedCost < 0.01) {
    logPass(`Estimated cost: $${estimatedCost.toFixed(6)} for "${testInput}"`);
  } else {
    logFail(`Cost estimation out of reasonable range: $${estimatedCost.toFixed(6)}`);
  }

  // Test 5: Token Estimation
  logTest('Estimate tokens from text');

  const estimatedTokens = estimateCost ? estimateTokens : 0;
  if (typeof estimateTokens === 'function') {
    const tokens = estimateTokens(testInput);
    logPass(`Estimated ${tokens} tokens from ${testInput.length} characters`);
  }

  // Final Results
  logSection('TEST RESULTS');
  console.log(
    `${colors.bright}Total Tests: ${results.total}${colors.reset}`
  );
  console.log(
    `${colors.green}Passed: ${results.passed}${colors.reset}`
  );
  console.log(
    `${colors.red}Failed: ${results.failed}${colors.reset}`
  );

  if (results.failed === 0) {
    console.log('\n' + colors.green + colors.bright + '✓ ALL TESTS PASSED!' + colors.reset);
    console.log('\n🎉 Z.ai integration is working correctly!');
    console.log('\nNext steps:');
    console.log('  1. Execute database migrations');
    console.log('  2. Build engine registry UI');
    console.log('  3. Create first engine');
  } else {
    console.log('\n' + colors.red + colors.bright + '✗ SOME TESTS FAILED' + colors.reset);
    console.log('\nPlease check:');
    console.log('  1. ZAI_API_KEY is correct');
    console.log('  2. Network connection is working');
    console.log('  3. Z.ai API is accessible');
  }

  return results.failed === 0;
}

// =====================================================
// RUN TESTS
// =====================================================

// Only run if executed directly
if (require.main === module) {
  runTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error(colors.red + 'Test suite crashed:' + colors.reset, error);
      process.exit(1);
    });
}

export { runTests };
