export type PetType = 'dog' | 'cat' | 'other';
export type Gender = 'male' | 'female';
export type Plan = 'free' | 'basic' | 'premium' | 'memory';
export type FavoritePlace = 'park' | 'window' | 'sofa' | 'garden' | 'kitchen' | 'unknown';

export interface PetInfo {
  name: string;
  type: PetType;
  breed: string;
  age: number;
  gender: Gender;
  isAdopted: boolean;
  adoptedAt?: string;
  personality: string[];
  favoritePlace?: FavoritePlace;
  messageFromOwner: string;
}

export const FAVORITE_PLACE_OPTIONS: { value: FavoritePlace; label: string; icon: string }[] = [
  { value: 'park',    label: '공원 · 산책로', icon: '🌳' },
  { value: 'window',  label: '창가 · 햇볕',   icon: '☀️' },
  { value: 'sofa',    label: '소파 · 침대',   icon: '🛋️' },
  { value: 'garden',  label: '마당 · 정원',   icon: '🌸' },
  { value: 'kitchen', label: '주방 · 부엌',   icon: '🏡' },
  { value: 'unknown', label: '잘 모르겠어요', icon: '🐾' },
];

export const PLACE_BACKGROUND: Record<FavoritePlace, string> = {
  park:    'outdoor park background, lush green grass, warm sunlight filtering through trees, shallow depth of field',
  window:  'cozy indoor setting, warm golden sunlight streaming through a window, soft gauzy curtains in background',
  sofa:    'cozy living room background, soft sofa or couch visible, warm ambient indoor lighting, homey atmosphere',
  garden:  'blooming garden background, soft pastel flowers and greenery, gentle dappled outdoor sunlight',
  kitchen: 'warm homey kitchen background, soft natural indoor light, wooden surfaces, cozy domestic setting',
  unknown: 'soft neutral background, warm natural light, shallow depth of field',
};

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
  '애교쟁이에요',
  '독립적이에요',
  '먹보예요',
  '장난꾸러기예요',
  '온순해요',
];
