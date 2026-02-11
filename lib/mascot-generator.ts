/**
 * EMPLEAIDO MASCOT GENERATOR
 * Uses Master Prompt System for consistent character generation
 */

export type MascotPose =
  | 'idle'
  | 'wave'
  | 'thinking'
  | 'working'
  | 'celebrating'
  | 'supportive';

export type MascotScene = 'space-office' | 'control-room' | 'launchpad' | 'minimal';

export interface MascotConfig {
  pose: MascotPose;
  scene?: MascotScene;
  seed?: number;
}

export interface GeneratedMascot {
  pose: MascotPose;
  scene: MascotScene;
  imageUrl: string;
  seed: number;
  generatedAt: string;
}

// Master prompt components
const STYLE_BASE = `1950s Japanese sci-fi manga × mid-century American pulp comic fusion, bold black line-art, thick outlines, dynamic diagonal motion lines, explosive star-bursts, exaggerated perspective, heavy vintage halftone dot shading, subtle aged paper grain, retro optimism`;

const COLOR_SYSTEM = `tri-tonal flat comic shading only, shadows #0E3A41 deep dark teal-blue, midtones #1A434F rich teal, highlights #F3E4C8 warm aqua-cream, LED accent #5ED3D0 soft cyan glow, every surface uses 2-3 tones max with visible screen-tone texture`;

const CHARACTER_BASE = `chibi robot mascot called Empleaido, 60% head 40% body ratio, total height 1.2-1.4 heads, rounded-square speech-bubble head shape with tiny tail bottom-left, recessed LED face panel always smiling positive expression, rounded LED dot eyes, simple curved LED mouth, single short antenna topped with glowing cyan sphere #5ED3D0, cylindrical torso, stubby segmented limbs, mitten fists, rounded boots, body color #1A434F`;

const EFFECTS = `vintage halftone dots 4px+10px mis-registered 15 degrees, paper-grain overlay 10% Soft Light, optional outer glow on LED accents #5ED3D0 30px 55% opacity, no realistic lighting no specular flat comic shading only`;

const NEGATIVE_PROMPT = `photo, realism, 3d render, gradients, multicolor, rainbow, text, typography, watermark, emoji, UI, HUD, glitch, cyberpunk, neon, dystopian, gritty, helmet, glass dome, sad, neutral, frown, reflections, chrome, excessive detail, modern sci-fi, anime style, realistic lighting, complex background`;

// Pose-specific prompts
const POSE_PROMPTS: Record<MascotPose, string> = {
  idle: `standing confidently, slight tilt, relaxed pose, standard warm smile, subtle glow from antenna sphere`,
  wave: `waving enthusiastically, one arm raised high, open smile expression, antenna sphere pulsing bright, dynamic curved motion lines behind raised arm, welcoming pose`,
  thinking: `thinking pose, one mitten hand touching chin area, focused smile expression, antenna sphere glowing steadily, small gear and lightbulb icons floating nearby, contemplative but positive energy`,
  working: `at retro floating console, hands on holographic keyboard, focused smile, speed lines indicating productivity, antenna sphere bright, multiple floating task icons around workspace`,
  celebrating: `victory pose, both arms raised triumphantly, open smile expression, jumping with slight lift off ground, explosive star-burst behind, confetti-like geometric shapes, maximum energy and joy`,
  supportive: `reassuring pose, slight forward lean, hands together warmly, gentle smile, soft glow, calm supportive energy, no alarm symbols just gentle presence`,
};

// Scene-specific prompts
const SCENE_PROMPTS: Record<MascotScene, string> = {
  'space-office': `outer-space office setting, starfield backdrop, ringed planet in corner, floating asteroids as tasks with icons etched into rocks clock envelope spreadsheet dollar, floating hologram panels with retro-space aesthetic`,
  'control-room': `retro mission control room, banks of rounded CRT monitors, analog dials, toggle switches, warm lighting from screens, 1950s NASA meets manga aesthetic`,
  'launchpad': `rocket launchpad scene, streamlined retro rocket in background, steam smoke clouds, dramatic upward perspective, hero pose in foreground, dawn sunset warm light`,
  'minimal': `clean starfield backdrop, minimal floating geometric shapes, focus on character, subtle depth`,
};

/**
 * Build the complete prompt for mascot generation
 */
export function buildMascotPrompt(config: MascotConfig): {
  positive: string;
  negative: string;
} {
  const scene = config.scene || 'minimal';
  const posePrompt = POSE_PROMPTS[config.pose];
  const scenePrompt = SCENE_PROMPTS[scene];

  const positive = [
    STYLE_BASE,
    COLOR_SYSTEM,
    CHARACTER_BASE,
    posePrompt,
    scenePrompt,
    EFFECTS,
    `Astro Boy aesthetic, Mega Man energy, playful heroism, upbeat inspirational, clean friendly iconic`,
  ].join(', ');

  return {
    positive,
    negative: NEGATIVE_PROMPT,
  };
}

/**
 * Generate a mascot image using Runware API
 */
export async function generateMascotImage(
  config: MascotConfig
): Promise<GeneratedMascot> {
  const apiKey = process.env.RUNWARE_API_KEY;

  if (!apiKey) {
    throw new Error('RUNWARE_API_KEY environment variable is not set');
  }

  const { positive, negative } = buildMascotPrompt(config);
  const seed = config.seed || Math.floor(Math.random() * 999999);
  const scene = config.scene || 'minimal';

  const payload = {
    taskType: 'imageInference',
    taskUUID: crypto.randomUUID(),
    model: 'runware:101@1', // Stable Diffusion XL
    positivePrompt: positive,
    negativePrompt: negative,
    width: 768,
    height: 768,
    steps: 35,
    CFGScale: 9,
    seed,
    scheduler: 'Default',
  };

  console.log(`🤖 Generating mascot: ${config.pose} in ${scene}...`);

  const response = await fetch('https://api.runware.ai/v1/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Runware API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  if (result.data?.[0]?.imageURL) {
    return {
      pose: config.pose,
      scene,
      imageUrl: result.data[0].imageURL,
      seed,
      generatedAt: new Date().toISOString(),
    };
  }

  throw new Error('No image URL in response');
}

/**
 * Generate all mascot poses
 */
export async function generateAllMascotPoses(
  scene: MascotScene = 'minimal',
  baseSeed?: number
): Promise<GeneratedMascot[]> {
  const poses: MascotPose[] = [
    'idle',
    'wave',
    'thinking',
    'working',
    'celebrating',
    'supportive',
  ];

  const results: GeneratedMascot[] = [];
  const seed = baseSeed || Math.floor(Math.random() * 999999);

  for (const pose of poses) {
    try {
      const mascot = await generateMascotImage({
        pose,
        scene,
        seed: seed + poses.indexOf(pose), // Consistent but varied
      });
      results.push(mascot);
      console.log(`✅ Generated: ${pose}`);
    } catch (error) {
      console.error(`❌ Failed: ${pose}`, error);
    }
  }

  return results;
}

const MascotGeneratorExport = {
  buildMascotPrompt,
  generateMascotImage,
  generateAllMascotPoses,
};

export default MascotGeneratorExport;
