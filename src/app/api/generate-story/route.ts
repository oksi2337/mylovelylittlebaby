import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
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

출력 형식 (JSON):
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

export async function POST(req: NextRequest) {
  try {
    const { petInfo, plan } = (await req.json()) as {
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: 'No story generated' }, { status: 500 });
    }

    const story: StoryResult = JSON.parse(raw);
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json({ error: 'Story generation failed' }, { status: 500 });
  }
}
