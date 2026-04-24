import { NextRequest, NextResponse } from 'next/server';
import { replicate } from '@/lib/replicate';
import { generateId } from '@/lib/utils';
import type { PetInfo, Plan } from '@/types';

function buildImagePrompt(petInfo: PetInfo): string {
  const species = petInfo.type === 'dog' ? 'puppy' : petInfo.type === 'cat' ? 'kitten' : 'baby animal';
  const breed = petInfo.breed || 'mixed breed';

  return `A warm, photorealistic baby ${species} portrait.
Breed: ${breed}.
The subject should look like a very young version (8-12 weeks old) of an adult ${petInfo.type}.
Soft, natural lighting. Warm color temperature. Slightly blurry background (bokeh).
Documentary-style photography, like a real family photo album.
The composition should feel tender, intimate, and nostalgic.
NOT a cartoon, illustration, or fantasy. Must look like a real photograph.
Style: film photography, warm tones, grain texture, emotional.`.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { petInfo, plan } = (await req.json()) as {
      petInfo: PetInfo;
      plan: Plan;
    };

    const imageCount = plan === 'premium' ? 3 : 1;
    const prompt = buildImagePrompt(petInfo);

    const promises = Array.from({ length: imageCount }, () =>
      replicate.run('black-forest-labs/flux-schnell', {
        input: {
          prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 90,
        },
      }),
    );

    const results = await Promise.all(promises);
    const images = results
      .flat()
      .filter((url): url is string => typeof url === 'string' && Boolean(url));

    return NextResponse.json({ images, id: generateId() });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
  }
}
