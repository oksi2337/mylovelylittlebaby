import { NextRequest, NextResponse } from 'next/server';
import { replicate } from '@/lib/replicate';
import { openai } from '@/lib/openai';
import { generateId } from '@/lib/utils';
import type { PetInfo, Plan } from '@/types';
import { PLACE_BACKGROUND } from '@/types';

const PLAN_IMAGE_COUNT: Record<Plan, number> = {
  free: 1,
  basic: 3,
  premium: 6,
  memory: 10,
};

// GPT-4o Vision으로 사진들의 외형 특징 추출
async function analyzePhotos(photoBase64s: string[], petInfo: PetInfo): Promise<string> {
  const imageContent = photoBase64s.map((base64) => ({
    type: 'image_url' as const,
    image_url: { url: base64, detail: 'low' as const },
  }));

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: [
          ...imageContent,
          {
            type: 'text',
            text: `These are ${photoBase64s.length} photos of a ${petInfo.type} (breed: ${petInfo.breed || 'unknown'}).
Describe their specific physical appearance in 2-3 sentences for use in an AI image prompt: fur color and pattern, eye color, distinctive markings, ear shape, face structure. Be precise and objective. English only.`,
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content ?? '';
}

function buildImagePrompt(petInfo: PetInfo, visualDescription?: string): string {
  const species = petInfo.type === 'dog' ? 'puppy' : petInfo.type === 'cat' ? 'kitten' : 'baby animal';
  const breed = petInfo.breed || 'mixed breed';
  const appearanceLine = visualDescription ? `Appearance based on the adult: ${visualDescription}` : '';
  const background = petInfo.favoritePlace
    ? PLACE_BACKGROUND[petInfo.favoritePlace]
    : 'soft neutral background, warm natural light, shallow depth of field';

  return `A warm, photorealistic baby ${species} portrait.
Breed: ${breed}.
${appearanceLine}
The subject should look like a very young version (8-12 weeks old) of an adult ${petInfo.type}.
Background: ${background}.
Soft, natural lighting. Warm color temperature.
Documentary-style photography, like a real family photo album.
The composition should feel tender, intimate, and nostalgic.
NOT a cartoon, illustration, or fantasy. Must look like a real photograph.
Style: film photography, warm tones, grain texture, emotional.`.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { petInfo, plan, photoBase64s = [] } = (await req.json()) as {
      petInfo: PetInfo;
      plan: Plan;
      photoBase64s?: string[];
    };

    const imageCount = PLAN_IMAGE_COUNT[plan] ?? 1;

    // 사진이 있으면 Vision으로 외형 분석 → 프롬프트 보강
    let visualDescription: string | undefined;
    if (photoBase64s.length > 0) {
      try {
        visualDescription = await analyzePhotos(photoBase64s, petInfo);
      } catch (e) {
        console.warn('Vision analysis failed, falling back to text-only prompt:', e);
      }
    }

    const prompt = buildImagePrompt(petInfo, visualDescription);

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
    const flatResults = results.flat() as unknown[];
    const images = flatResults.map((url) => String(url)).filter(Boolean);

    return NextResponse.json({ images, id: generateId() });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
  }
}
