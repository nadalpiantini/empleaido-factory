#!/usr/bin/env npx tsx

/**
 * MASCOT BATCH GENERATOR
 *
 * Generates all 6 mascot poses using the master prompt system.
 *
 * Usage:
 *   npx tsx scripts/generate-mascot-poses.ts
 *   npx tsx scripts/generate-mascot-poses.ts --scene space-office
 *   npx tsx scripts/generate-mascot-poses.ts --seed 12345
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

import {
  generateAllMascotPoses,
  MascotScene,
  GeneratedMascot,
} from '../src/lib/mascot-generator';

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let scene: MascotScene = 'minimal';
  let seed: number | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scene' && args[i + 1]) {
      scene = args[i + 1] as MascotScene;
    }
    if (args[i] === '--seed' && args[i + 1]) {
      seed = parseInt(args[i + 1], 10);
    }
  }

  console.log('╔══════════════════════════════════════════╗');
  console.log('║   EMPLEAIDO MASCOT BATCH GENERATOR       ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log(`Scene: ${scene}`);
  console.log(`Seed: ${seed || 'random'}`);
  console.log('');

  try {
    console.log('🚀 Starting generation...');
    console.log('');

    const startTime = Date.now();
    const results = await generateAllMascotPoses(scene, seed);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('');

    // Save results
    const outputPath = path.join(process.cwd(), 'public/mascot-poses.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    // Summary
    console.log('📊 GENERATION SUMMARY');
    console.log('');
    console.log(`✅ Generated: ${results.length}/6 poses`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`💾 Saved to: public/mascot-poses.json`);
    console.log('');

    // List results
    console.log('📦 GENERATED POSES:');
    results.forEach((r: GeneratedMascot) => {
      console.log(`   • ${r.pose.padEnd(12)} → ${r.imageUrl.slice(0, 60)}...`);
    });

    console.log('');
    console.log('✨ Done!');
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

main();
