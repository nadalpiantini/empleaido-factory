import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  generateMascotImage,
  generateAllMascotPoses,
  MascotPose,
  MascotScene,
  GeneratedMascot,
} from '@/lib/mascot-generator';

/**
 * POST /api/generate-mascot
 *
 * Generate mascot images with poses for dashboard states
 *
 * Body options:
 * - { pose: "idle" | "wave" | ... } → Generate single pose
 * - { all: true, scene: "minimal" } → Generate all 6 poses
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate all poses
    if (body.all) {
      const scene: MascotScene = body.scene || 'minimal';
      const baseSeed = body.seed || Math.floor(Math.random() * 999999);

      console.log(`🎨 Generating all mascot poses in ${scene} scene...`);

      const results = await generateAllMascotPoses(scene, baseSeed);

      // Save to public folder
      const outputPath = path.join(process.cwd(), 'public/mascot-poses.json');
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

      return NextResponse.json({
        success: true,
        count: results.length,
        results,
        savedTo: '/public/mascot-poses.json',
      });
    }

    // Generate single pose
    const pose: MascotPose = body.pose || 'idle';
    const scene: MascotScene = body.scene || 'minimal';
    const seed = body.seed;

    const result = await generateMascotImage({ pose, scene, seed });

    // Update poses file with new image
    const posesPath = path.join(process.cwd(), 'public/mascot-poses.json');
    let poses: GeneratedMascot[] = [];

    if (fs.existsSync(posesPath)) {
      poses = JSON.parse(fs.readFileSync(posesPath, 'utf-8'));
    }

    // Replace or add pose
    const existingIndex = poses.findIndex((p) => p.pose === pose);
    if (existingIndex >= 0) {
      poses[existingIndex] = result;
    } else {
      poses.push(result);
    }

    fs.writeFileSync(posesPath, JSON.stringify(poses, null, 2));

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Mascot generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-mascot
 *
 * Get current mascot poses manifest
 */
export async function GET() {
  try {
    const posesPath = path.join(process.cwd(), 'public/mascot-poses.json');

    if (!fs.existsSync(posesPath)) {
      return NextResponse.json({
        success: true,
        poses: [],
        message: 'No mascot poses generated yet. POST to generate.',
      });
    }

    const poses = JSON.parse(fs.readFileSync(posesPath, 'utf-8'));

    return NextResponse.json({
      success: true,
      count: poses.length,
      poses,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
