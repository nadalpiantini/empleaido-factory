import { NextResponse } from 'next/server';
import { generateEmpleaidoImage } from '@/lib/empleaido-image-gen';
import empleaidos from '@/data/empleaidos.json';
import fs from 'fs';
import path from 'path';

export async function POST() {
  const results = [];

  for (const e of empleaidos) {
    try {
      console.log(`🎨 Generating image for ${e.name}...`);

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
        imageUrl,
        success: true,
      });

      console.log(`✅ ${e.name}: ${imageUrl}`);

    } catch (error) {
      results.push({
        empleaido_id: e.id,
        name: e.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      });

      console.error(`❌ ${e.name} failed:`, error);
    }
  }

  // Save results
  const outputPath = path.join(process.cwd(), 'public/empleaido-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  return NextResponse.json({
    success: true,
    generated: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
  });
}
