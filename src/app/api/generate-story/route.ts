import { NextRequest, NextResponse } from 'next/server';
import { replicate } from '@/lib/replicate';
import type { PetInfo, Plan } from '@/types';

const SYSTEM_PROMPT = `
당신은 반려동물과 보호자 사이의 따뜻한 감정 이야기를 쓰는 작가입니다.
주어진 반려동물 정보를 바탕으로, 아이가 보호자를 만나기 전의 시간을
상상한 짧고 감성적인 이야기를 한국어로 씁니다.

규칙:
- 과장하지 말고, 조용하고 따뜻한 톤으로 쓴다
- 실제 사실처럼 쓰지 말고, "상상"임을 내포한 표현 사용
- "만약 그때 만났다면" 메시지를 반드시 포함
- 유기동물 입양자의 경우, 입양 전 외로운 시간을 위로하는 방향으로
- 전체 400~600자 이내
- 마지막에 보호자에게 전하는 한 문장으로 마무리

반드시 아래 JSON 형식으로만 응답하세요. 다른 말 없이 JSON만 출력하세요:
{
  "title": "짧은 제목 (최대 20자)",
  "story": "본문 스토리 (300~500자)",
  "wishMessage": "'만약 그때 만났다면' 으로 시작하는 메시지 (80~120자)",
  "closingLine": "보호자에게 전하는 마무리 문장 (30~50자)",
  "shareText": "SNS 공유용 한 줄 문구 (40~60자)"
}
`.trim();

export interface StoryResult {
  title: string;
  story: string;
  wishMessage: string;
  closingLine: string;
  shareText: string;
}

function buildFallbackStory(petInfo: PetInfo): StoryResult {
  const name = petInfo.name;
  const petType = petInfo.type === 'dog' ? '강아지' : petInfo.type === 'cat' ? '고양이' : '반려동물';
  return {
    title: `${name}의 기다림`,
    story: `${name}는 세상에 태어난 첫날부터 따뜻한 손길을 기다렸어요. 작은 발로 이 세상을 탐험하며, 언젠가 만날 소중한 사람을 꿈꿨답니다. 봄볕이 따사로운 어느 날, 살랑이는 바람 속에서 ${name}는 행복한 미래를 그렸어요. 세상이 아직 낯설고 두렵던 그 시절에도, ${name}의 마음속엔 언제나 당신을 향한 자리가 있었답니다.`,
    wishMessage: `만약 그때 만났다면, 함께한 모든 순간이 지금보다 더욱 빛났을 거예요.`,
    closingLine: `지금 이 순간, 당신 곁에 있어 행복해요.`,
    shareText: `${name}와 나의 소중한 어린 시절 이야기 🐾`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { petInfo } = (await req.json()) as {
      petInfo: PetInfo;
      plan: Plan;
    };

    const userPrompt = `
반려동물 정보:
- 이름: ${petInfo.name}
- 종류: ${petInfo.type === 'dog' ? '강아지' : petInfo.type === 'cat' ? '고양이' : '반려동물'}
- 품종: ${petInfo.breed || '알 수 없음'}
- 나이: ${petInfo.age}세
- 성별: ${petInfo.gender === 'male' ? '남아' : '여아'}
- 유기동물 입양 여부: ${petInfo.isAdopted ? '예' : '아니오'}
- 성격: ${petInfo.personality.join(', ') || '알 수 없음'}
- 보호자 메시지: ${petInfo.messageFromOwner || '없음'}
    `.trim();

    try {
      const output = await replicate.run('meta/meta-llama-3-8b-instruct', {
        input: {
          prompt: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
          max_new_tokens: 1024,
          temperature: 0.8,
        },
      });

      const raw = Array.isArray(output) ? (output as string[]).join('') : String(output);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const story = JSON.parse(jsonMatch[0]) as StoryResult;
        return NextResponse.json({ story });
      }
    } catch (llmError) {
      console.error('LLM generation error, using fallback:', llmError);
    }

    return NextResponse.json({ story: buildFallbackStory(petInfo) });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json({ error: 'Story generation failed' }, { status: 500 });
  }
}
