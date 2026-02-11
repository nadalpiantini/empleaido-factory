/**
 * USER PREFERENCES API
 *
 * Updates learned user preferences during onboarding
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase-server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const empleaidoId = params.id;
    const preferences = await request.json();

    // Get empleaido serial from ID
    const supabase = createRouteHandlerClient();
    const { data: adoption } = await supabase
      .from('ef_adoptions')
      .select('empleaido_serial')
      .eq('empleaido_id', empleaidoId)
      .single();

    if (!adoption) {
      return NextResponse.json(
        { error: 'Adoption not found' },
        { status: 404 }
      );
    }

    // Update USER.md in workspace
    const workspacePath = join(
      process.env.HOME || '',
      '.openclaw',
      `workspace-empleaido-${empleaidoId}-${adoption.empleaido_serial}`
    );

    const userMdPath = join(workspacePath, 'USER.md');
    let userContent = '';

    try {
      userContent = readFileSync(userMdPath, 'utf8');
    } catch {
      // File doesn't exist yet, create basic structure
      userContent = generateUserTemplate(preferences.user_id || 'unknown');
    }

    // Update preferences section
    const updatedContent = updatePreferencesSection(userContent, preferences);

    writeFileSync(userMdPath, updatedContent);

    // Also update SOUL.md with communication style
    await updateSoulCommunicationStyle(workspacePath, preferences);

    // Store in database for quick access
    await supabase
      .from('ef_adoptions')
      .update({
        user_preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('empleaido_id', empleaidoId);

    return NextResponse.json({
      success: true,
      message: 'Preferencias actualizadas',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function generateUserTemplate(userId: string): string {
  return `# USER

## Current Adopter

- **User ID**: ${userId}
- **Adopted**: ${new Date().toISOString().split('T')[0]}
- **Cycle**: 1

## Preferences

(To be learned through interaction)

## Workflow

(How the user likes to work)

## History

(Recent interactions will appear here)
`;
}

function updatePreferencesSection(content: string, preferences: Record<string, unknown>): string {
  const prefSection = `## Preferences

- **Language**: ${preferences.language || 'Not specified'}
- **Formality**: ${preferences.formality || 'Not specified'}
- **Proactivity Level**: ${preferences.proactivity || 'Not specified'}
- **Communication**: ${preferences.communication || 'Not specified'}
- **Detail Level**: ${preferences.detailLevel || 'Not specified'}
`;

  // Replace existing preferences section or add it
  if (content.includes('## Preferences')) {
    return content.replace(
      /## Preferences\n([\s\S]*?)\n\n##/,
      prefSection + '\n\n##'
    );
  } else {
    // Insert after Current Adopter section
    return content.replace(
      /(## Current Adopter\n[\s\S]*?)\n\n##/,
      `$1\n\n${prefSection}\n\n##`
    );
  }
}

async function updateSoulCommunicationStyle(
  workspacePath: string,
  preferences: Record<string, unknown>
): Promise<void> {
  const soulPath = join(workspacePath, 'SOUL.md');

  try {
    let soulContent = readFileSync(soulPath, 'utf8');

    const commStyle = `### Communication Style (Learned)
- User prefers: ${preferences.formality || 'to be determined'}
- Proactivity: ${preferences.proactivity || 'to be calibrated'}
- Language: ${preferences.language || 'spanish'}
- Detail level: ${preferences.detailLevel || 'balanced'}
`;

    if (soulContent.includes('### Communication Style (Learned)')) {
      soulContent = soulContent.replace(
        /### Communication Style \(Learned\)\n([\s\S]*?)\n\n###/,
        commStyle + '\n\n###'
      );
    } else {
      // Insert after base Communication Style
      soulContent = soulContent.replace(
        /### Communication Style \(Base\)\n([\s\S]*?)\n\n###/,
        `### Communication Style (Base)\n$1\n\n${commStyle}\n\n###`
      );
    }

    writeFileSync(soulPath, soulContent);
  } catch (error) {
    console.warn('Could not update SOUL.md:', error);
  }
}
