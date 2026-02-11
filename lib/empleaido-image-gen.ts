/**
 * EMPLEAIDO IMAGE GENERATOR
 * Uses Runware API to generate visual identities for each Empleaido
 */

export interface EmpleaidoImagePrompt {
  name: string;
  serial: number;
  role: string;
  sephirah: string;
  accessory: string;
  colorAccent: string;
}

export async function generateEmpleaidoImage(config: EmpleaidoImagePrompt): Promise<string> {
  const apiKey = process.env.RUNWARE_API_KEY;

  if (!apiKey) {
    throw new Error('RUNWARE_API_KEY environment variable is not set');
  }

  // Sephirah-based visual themes
  const sephirahThemes: Record<string, string> = {
    Netzach: 'energetic, persistent, forward-moving, victorious',
    Chesed: 'generous, expansive, creative, abundant',
    Hod: 'structured, organized, methodical, precise',
    Binah: 'analytical, deep, understanding, wise',
    Yesod: 'foundational, consistent, memory-keeper, stable',
  };

  // Build character prompt
  const theme = sephirahThemes[config.sephirah] || 'professional';

  const prompt = `Professional AI assistant character portrait, ${theme} personality.
Clean flat illustration style, soft shadows, minimal background.
Character wearing ${config.accessory !== 'none' ? config.accessory : 'professional attire'}.
Main color accent: ${config.colorAccent}.
Friendly, approachable, competent expression.
Square composition, centered character, soft lighting.
Modern, clean, professional aesthetic.`;

  const negativePrompt = 'realistic photo, 3D render, anime, distorted, text, watermark, multiple subjects, busy background';

  const payload = {
    taskType: 'imageInference',
    taskUUID: crypto.randomUUID(),
    model: 'runware:101@1',
    positivePrompt: prompt,
    negativePrompt: negativePrompt,
    width: 512,
    height: 512,
    steps: 25,
    guidance: 7.5,
    seed: config.serial, // Use serial as seed for consistency
    safety_checker: true,
  };

  const response = await fetch('https://api.runware.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    throw new Error(`Runware API error: ${response.status}`);
  }

  const result = await response.json();

  if (result.data?.[0]?.imageURL) {
    return result.data[0].imageURL;
  }

  throw new Error('No image URL in response');
}
