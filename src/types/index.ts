export type PetType = 'dog' | 'cat' | 'other';
export type Gender = 'male' | 'female';
export type Plan = 'free' | 'basic' | 'premium' | 'memory';

export interface PetInfo {
  name: string;
  type: PetType;
  breed: string;
  age: number;
  gender: Gender;
  isAdopted: boolean;
  adoptedAt?: string;
  personality: string[];
  messageFromOwner: string;
}

export interface PlanDetail {
  id: Plan;
  name: string;
  price: number;
  description: string;
  features: string[];
  imageCount: number;
  highlighted?: boolean;
}

export interface GenerationResult {
  id: string;
  images: string[];
  story: string;
  petInfo: PetInfo;
  plan: Plan;
  createdAt: string;
}

export const PLAN_DETAILS: PlanDetail[] = [
  {
    id: 'free',
    name: '무료 체험',
    price: 0,
    description: '아기 시절 사진 1장',
    features: ['AI 생성 이미지 1장', '워터마크 포함', '기본 감성 스토리'],
    imageCount: 1,
  },
  {
    id: 'basic',
    name: '베이직',
    price: 3900,
    description: '소중한 추억 패키지',
    features: ['AI 생성 이미지 3장', '워터마크 없음', '감성 스토리', 'HD 다운로드'],
    imageCount: 3,
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 6900,
    description: '완성된 추억 앨범',
    features: [
      'AI 생성 이미지 6장',
      '워터마크 없음',
      '풀 감성 스토리',
      'HD 다운로드',
      '성장 일기 형식',
    ],
    imageCount: 6,
    highlighted: true,
  },
  {
    id: 'memory',
    name: '메모리 북',
    price: 12900,
    description: '평생 간직할 메모리 북',
    features: [
      'AI 생성 이미지 10장',
      '워터마크 없음',
      '완성형 감성 스토리',
      'PDF 메모리 북',
      '4K 다운로드',
      '아카이브 영구 보관',
    ],
    imageCount: 10,
  },
];

export const PERSONALITY_OPTIONS = [
  '활발해요',
  '조용해요',
  '겁쟁이예요',
  '용감해요',
  '애교쟁이예요',
  '독립적이에요',
  '먹보예요',
  '장난꾸러기예요',
  '겁이 많아요',
  '온순해요',
];
