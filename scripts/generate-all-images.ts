/**
 * Generate all Empleaido images using Runware
 */

import { generateEmpleaidoImage } from '../src/lib/empleaido-image-gen';
import empleaidos from '../src/data/empleaidos.json';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🎨 Generating images for 5 Empleaidos...\n');

  const results = [];

  for (const e of empleaidos) {
    try {
      console.log(`Generating ${e.name} (#${e.serial})...`);

      const imageUrl = await generateEmpleaidoImage({
        name: e.name,
        serial: e.serial,
        role: e.role.main,
        sephirah: e.sephirot.primary,
        accessory: e.visual.accessory,
        colorAccent: e.visual.color_accent || '#000000',
      });

      results.push({
        empleaido_id: e.id,
        name: e.name,
        serial: e.serial,
        imageUrl,
        success: true,
      });

      console.log(`✅ ${e.name}: ${imageUrl}\n`);

    } catch (error) {
      results.push({
        empleaido_id: e.id,
        name: e.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      });

      console.error(`❌ ${e.name} failed:`, error, '\n');
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Save results
  const outputPath = path.join(__dirname, '../public/empleaido-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Generated: ${results.filter(r => r.success).length}/5`);
  console.log(`❌ Failed: ${results.filter(r => !r.success).length}/5`);
  console.log(`📁 Results saved to: public/empleaido-images.json`);
  console.log('='.repeat(60));
}

main().catch(console.error);
