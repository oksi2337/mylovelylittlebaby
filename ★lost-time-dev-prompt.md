# 🐾 개발 프롬프트: 잃어버린 시간의 복원 플랫폼

> **사용 방법**: 이 프롬프트를 Claude, Cursor, 또는 다른 AI 코딩 도구에 그대로 붙여넣어 사용하세요.
> 각 섹션은 독립적으로 사용하거나, 전체를 한 번에 전달할 수 있습니다.

---

## 💡 전체 사용 가이드

### 권장 순서
1. **SECTION 1** → 프로젝트 초기 세팅
2. **SECTION 9** → 공통 컴포넌트 먼저 생성
3. **SECTION 2** → 랜딩페이지
4. **SECTION 3 → 4 → 5** → 사용자 입력 플로우
5. **SECTION 8** → AI API 엔드포인트
6. **SECTION 6 → 7** → 생성 대기 + 결과 페이지
7. **SECTION 10** → 배포 설정

### 각 프롬프트 사용 팁
- 각 SECTION은 독립적으로 사용 가능합니다
- 앞 SECTION의 코드가 이미 생성된 상태에서 다음 SECTION을 사용하면 일관성이 높아집니다
- "위에서 만든 컴포넌트와 디자인 시스템을 유지해주세요" 를 각 SECTION 앞에 붙이면 더 좋습니다
- 에러 발생 시 에러 메시지와 함께 "이 에러를 수정해주세요" 로 이어가세요

### 추가로 요청할 수 있는 것들
- `Supabase 연동 및 DB 스키마 설계 프롬프트`
- `카카오 소셜 로그인 연동 프롬프트`
- `기억 아카이브 페이지 프롬프트`
- `마이페이지 프롬프트`
- `관리자 대시보드 프롬프트`
- `SEO 최적화 (og:image, sitemap) 프롬프트`
- `기부 리포트 월별 자동화 프롬프트`

---

## ✅ SECTION 1: 프로젝트 초기 설정 프롬프트

```
당신은 시니어 풀스택 개발자입니다.
아래 사양에 따라 Next.js 14 (App Router) 기반의 웹 서비스를 처음부터 구축해주세요.

## 프로젝트 개요

서비스명: 잃어버린 시간의 복원 (가칭: BabyPet / 베이비펫)
핵심 가치: 반려동물의 아기 시절을 AI로 상상 복원하고, 감성 스토리와 함께 제공하는 감정 콘텐츠 플랫폼
주요 타겟: 유기견·유기묘 입양자, 반려동물을 가족처럼 여기는 20~40대

## 기술 스택

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- 상태 관리: Zustand
- 폼 처리: React Hook Form + Zod
- 애니메이션: Framer Motion
- 이미지 업로드: react-dropzone
- API 통신: axios + React Query (TanStack Query)
- 결제: TossPayments SDK (한국)
- AI 이미지: OpenAI DALL-E 3 API (또는 Replicate API)
- AI 스토리: OpenAI GPT-4o API
- 배포: Vercel

## 디자인 시스템

### 컬러 팔레트 (CSS Variables로 정의)
--color-cream: #FAF7F2        /* 배경 기본 */
--color-beige: #F0EBE0        /* 카드 배경 */
--color-warm-brown: #8B6651   /* 포인트 */
--color-deep-brown: #4A2F1A   /* 텍스트 메인 */
--color-soft-brown: #C4A882   /* 보조 텍스트 */
--color-white: #FFFFFF
--color-shadow: rgba(74, 47, 26, 0.08)

### 타이포그래피
- 한글 헤드라인: Noto Serif KR (Google Fonts)
- 영문 헤드라인: Playfair Display
- 본문: Pretendard

### 디자인 원칙
- 가족 앨범 같은 따뜻하고 아날로그적인 분위기
- 과장 없이 감성적이고 조용한 톤
- 카드형 UI, 둥근 모서리 (border-radius: 16px~24px)
- 충분한 여백 (breathing room)
- 모바일 퍼스트

## 폴더 구조

src/
├── app/
│   ├── page.tsx                  # 랜딩페이지
│   ├── upload/page.tsx           # 사진 업로드
│   ├── info/page.tsx             # 반려동물 정보 입력
│   ├── select/page.tsx           # 상품 선택
│   ├── generating/page.tsx       # 생성 대기
│   ├── result/[id]/page.tsx      # 결과 페이지
│   ├── archive/page.tsx          # 기억 아카이브
│   └── api/
│       ├── generate-image/route.ts
│       ├── generate-story/route.ts
│       └── payment/route.ts
├── components/
│   ├── ui/                       # 공통 UI 컴포넌트
│   ├── landing/                  # 랜딩페이지 섹션들
│   ├── upload/                   # 업로드 관련
│   ├── result/                   # 결과 페이지 관련
│   └── shared/                   # 공유 컴포넌트
├── store/
│   └── petStore.ts               # Zustand 전역 상태
├── types/
│   └── index.ts
├── lib/
│   ├── openai.ts
│   └── utils.ts
└── hooks/
    └── usePetStore.ts

## 전역 상태 (Zustand) 설계

interface PetStore {
  // 사용자 입력
  photo: File | null
  photoPreviewUrl: string | null
  petInfo: {
    name: string
    type: 'dog' | 'cat' | 'other'
    breed: string
    age: number
    gender: 'male' | 'female'
    isAdopted: boolean
    adoptedAt?: string
    personality: string[]
    messageFromOwner: string
  }
  selectedPlan: 'free' | 'basic' | 'premium' | 'memory'
  
  // 생성 결과
  generatedImages: string[]
  generatedStory: string
  resultId: string | null
  
  // 액션
  setPhoto: (file: File) => void
  setPetInfo: (info: Partial<PetInfo>) => void
  setSelectedPlan: (plan: Plan) => void
  setResult: (images: string[], story: string, id: string) => void
  reset: () => void
}

이 구조로 프로젝트를 초기 세팅해주세요.
package.json 의존성 목록과 기본 설정 파일들(tailwind.config.ts, globals.css)을 먼저 생성해주세요.
```

---

## ✅ SECTION 2: 랜딩페이지 프롬프트

```
위 프로젝트 설정을 기반으로, app/page.tsx (랜딩페이지)를 구현해주세요.

## 랜딩페이지 목표
- 감성적 메시지로 감정적 공감을 만들기
- "무료로 1장 받아보기" CTA로 전환 유도
- 서비스 신뢰감 형성
- 모바일 퍼스트 반응형

## 섹션 구성 및 상세 요구사항

### 1. Hero 섹션
레이아웃: 전체 뷰포트 높이 (min-h-screen)
배경: --color-cream, 상단에 미묘한 노이즈 텍스처 또는 grain 효과

콘텐츠:
- 상단: 서비스 로고/이름 (작고 조용하게)
- 중앙 헤드라인 (Noto Serif KR):
  "우리가 만나기 전,
   너는 어떤 모습이었을까?"
  (줄바꿈 그대로 유지, 폰트 사이즈 모바일 28px / 데스크톱 48px)
  스타일: 글자 크기는 작고 깔끔하게, 배지 안쪽에 여백(Padding)을 적당히 줘서 답답하지 않게 배치해줘. 전체 화면에서 가로로 중앙 정렬이 되어야 해."
-중앙 헤드라인 글자 바로 상단:
 "♡수익의 2%가 유기동물 보호에 기부됩니다"
  배경: 배경색을 넣고 모서리는 아주 둥글게(완전 타원형 느낌) 
  글자색: 배경보다 살짝 진한 색으로 해서 글자가 돋보이게
- 서브 카피 (Pretendard, 회색):
  "반려동물의 아기 시절을 상상 복원하고,
   그 시간을 하나의 이야기로 만들어드립니다."
- 메인 CTA 버튼:
  텍스트: "무료로 1장 받아보기"
  스타일: --color-warm-brown 배경, 흰 텍스트, border-radius 100px (pill shape)
  크기: 모바일 full-width, 데스크톱 auto
  호버: 약간 어두워지면서 scale(1.02) 트랜지션
- 보조 링크: "프리미엄으로 더 많은 모습 보기 →" (텍스트 링크)
- 하단: 반려동물 아기 사진 예시 카드 2~3장 (가로 스크롤 또는 오버랩 레이아웃)
  ※ 예시 이미지는 placeholder 처리 (/images/example-1.jpg 등)

애니메이션:
- 헤드라인: 페이지 로드 시 아래에서 위로 fade in (staggered, 0.3s delay)
- CTA 버튼: 헤드라인 후 0.6s 후 등장
- 예시 카드: 스크롤 시 등장 (Framer Motion useInView)

###2. problem 섹션
(1) 섹션 헤더:

최상단에 작은 알약 모양(Pill shape)의 배지를 배치하고, 안에 물음표 아이콘과 텍스트를 한 줄로 넣어줘.

그 아래에 메인 타이틀을 두 줄로 배치해줘. 첫 줄은 크고 강조된 폰트로, 두 번째 줄은 그보다 약간 작고 친근한 느낌으로 구성해줘.

헤더 전체는 중앙 정렬이 되어야 해.

(2). 카드 리스트 레이아웃:

가로로 3개의 카드가 나란히 배치되는 그리드 레이아웃을 만들어줘. (모바일에서는 세로로 쌓여야 함)

카드들은 모두 같은 높이를 가져야 하고, 모서리는 부드럽고 둥글게 처리해줘.

각 카드에는 은은한 그림자 효과를 주어 배경과 분리된 느낌을 줘.

(3) 카드 내부 구성:

상단: 각 카드의 주제를 나타내는 입체적인 아이콘이나 이모지를 왼쪽 상단에 배치해줘.

중간: 볼드체로 된 소제목을 넣어줘.

하단: 소제목 아래에 설명 문구를 넣고, 줄 간격을 여유 있게 설정해서 읽기 편하게 만들어줘.

카드 내부의 모든 요소는 왼쪽 정렬로 배치해줘.

(4) 간격:

섹션 전체에 상하 여백을 충분히 주고, 카드 사이에도 적절한 간격을 설정해줘. 카드 안쪽에도 내용이 벽에 붙지 않도록 여백(Padding)을 넉넉히 줘.

 
### 3. 감정 메시지 섹션(solution section)
배경: --color-beige
레이아웃: 중앙 정렬, 충분한 상하 패딩

콘텐츠 (각 문장을 한 줄씩, 큰 따옴표 형태로):
- "내가 몰랐던 시간을 처음으로 본다."
- "만약 그때 너를 만났다면, 나는 어떤 말을 해줬을까?"
- "입양 전의 시간도 이제 우리의 이야기로 남길 수 있다."
- "단 한 장의 사진이, 하나의 기억이 된다."

스타일: Noto Serif KR, 각 문장 사이 넉넉한 간격, 스크롤 시 순서대로 fade in

### 3. 이용 방법 섹션
스텝 4단계로 표현:
1. 반려동물 사진 업로드
2. 이름, 성격, 입양 여부 입력
3. AI가 아기 시절을 상상 복원
4. 이미지 + 감성 스토리 수령

각 스텝: 번호(크게) + 제목 + 짧은 설명
레이아웃: 모바일 세로 스택 / 데스크톱 가로 4열

### 4. 결과 예시 섹션
제목: "이런 결과를 받아보실 수 있어요"
결과 카드 2장 나란히 보여주기 (모바일 세로, 데스크톱 가로):
- 카드 구성:
  - 상단: Before(현재) / After(아기 시절) 이미지 나란히
  - 반려동물 이름 + 간단한 감성 문구
  - 기부 적립 배지 아이콘

### 5. 유기동물 입양자 전용 메시지 섹션
배경: --color-deep-brown (어두운 갈색), 텍스트 흰색
강조 메시지:
  "유기동물 보호소에서 입양하셨나요?"
  "아이의 입양 전 시간을 처음으로 만나볼 수 있어요."
CTA: "입양 전 시간 복원하기" 버튼 (흰 배경, 갈색 텍스트)

### 6. 가격 안내 섹션
3개 플랜 카드:
- Free: 0원 / 이미지 1장 / 짧은 감성 문구 / 공유 카드
- Basic: 4,900원 / 이미지 1장 / 감성 스토리 / 공유 카드 / 기부 배지
- Premium: 14,900원 (추천 배지) / 이미지 3장 / 확장 스토리 / 고화질 / 다양한 스타일

추천 플랜(Premium)은 테두리 강조 + "가장 인기" 배지

### 7. 기부 안내 섹션
아이콘 + 짧은 설명:
"결제 금액의 2%는 유기동물 보호를 위해 기부됩니다."
월별 기부 리포트 링크 포함

### 9. 최종 CTA 섹션
배경: --color-cream
헤드라인: "지금 바로 아이의 첫 시간을 만나보세요."
버튼: "무료로 1장 받아보기" (Hero와 동일)

## 컴포넌트 분리
각 섹션을 components/landing/ 폴더 안에 별도 파일로 분리해주세요:
- HeroSection.tsx
- EmotionSection.tsx
- HowItWorksSection.tsx
- ResultExampleSection.tsx
- AdoptionSection.tsx
- PricingSection.tsx
- DonationSection.tsx
- FAQSection.tsx
- FinalCTASection.tsx

page.tsx는 이 컴포넌트들을 조합하는 역할만 해주세요.
```

---

## ✅ SECTION 3: 사진 업로드 페이지 프롬프트

```
app/upload/page.tsx 와 관련 컴포넌트를 구현해주세요.

## 페이지 목표
- 가능한 빠르게, 마찰 없이 사진 업로드 완료
- 업로드 가이드로 결과물 품질 기대치 설정
- 모바일에서 카메라 직접 촬영도 가능하게

## UI 요구사항

### 상단
- 뒤로가기 버튼 (← 텍스트 링크)
- 진행 단계 표시: "1/3 단계" 또는 스텝 인디케이터 (●○○)
- 제목: "아이의 사진을 올려주세요"
- 부제: "얼굴이 잘 보이는 사진일수록 더 자연스럽게 복원돼요."

### 업로드 영역 (react-dropzone)
기본 상태 (비어있음):
- 점선 테두리, 둥근 모서리 (border-radius: 24px)
- 중앙: 카메라 아이콘 + "사진을 드래그하거나 탭해서 선택"
- 하단: "JPG, PNG 파일 / 최대 10MB"
- 모바일: 탭 시 파일 선택 또는 카메라 앱으로 연결
  (accept="image/*" capture="environment" 옵션)

사진 선택 후 상태:
- 미리보기 이미지 (object-fit: cover, 정사각형 or 4:3)
- 우측 상단 X 버튼으로 제거 가능
- 하단: "다른 사진 선택" 링크

### 가이드 섹션
"좋은 사진 예시" (텍스트 설명만, 아이콘 포함):
✅ 얼굴 전체가 보이는 사진
✅ 밝은 조명에서 찍은 사진
✅ 1마리만 있는 사진

❌ 너무 멀리서 찍은 사진
❌ 어둡거나 흔들린 사진
❌ 여러 동물이 함께 있는 사진

### 하단 CTA
버튼: "다음으로" (pill shape, warm-brown, 비활성화 시 gray)
- 사진 선택 전: disabled 상태
- 사진 선택 후: 활성화, 클릭 시 /info 로 이동 + Zustand에 photo 저장

## 유효성 검사
- 파일 형식: jpg, jpeg, png, webp만 허용
- 파일 크기: 10MB 이하
- 위반 시 토스트 메시지로 안내

## 상태 처리
- 업로드 후 photoPreviewUrl을 Zustand에 저장
- 페이지 이탈 후 돌아와도 미리보기 유지 (Zustand persist)

컴포넌트 파일: components/upload/PhotoUploader.tsx
```

---

## ✅ SECTION 4: 반려동물 정보 입력 페이지 프롬프트

```
app/info/page.tsx 와 관련 컴포넌트를 구현해주세요.

## 페이지 목표
- 감성적인 분위기 유지하면서 정보 입력 유도
- 모바일에서 스크롤 없이 입력할 수 있도록 스텝 분리 가능
- 개인화 데이터를 Zustand에 저장

## 폼 필드 구성 (React Hook Form + Zod)

### 필드 목록
1. 이름 (텍스트 입력)
   - 라벨: "아이 이름이 뭔가요?"
   - placeholder: "예: 뭉이, 코코, 보리"
   - 필수

2. 동물 종류 (버튼 선택)
   - 라벨: "어떤 친구인가요?"
   - 선택지: 강아지 🐶 / 고양이 🐱 / 기타 🐾
   - 필수

3. 품종 (텍스트 입력)
   - 라벨: "품종을 알고 계신가요?"
   - placeholder: "예: 믹스, 말티즈, 페르시안..."
   - 선택사항, "잘 모르겠어요" 토글

4. 현재 나이 (슬라이더 또는 드롭다운)
   - 라벨: "지금 몇 살인가요?"
   - 범위: 0~20세, 1세 단위
   - 필수

5. 성별 (버튼 선택)
   - 라벨: "성별은요?"
   - 선택지: 남아 / 여아
   - 필수

6. 입양 여부 (토글 or 버튼 선택)
   - 라벨: "보호소나 유기동물 센터에서 입양하셨나요?"
   - 선택지: 네, 입양했어요 / 아니요, 어릴 때부터 함께했어요
   - 필수
   - "네" 선택 시: 입양 시기 입력 필드 추가 표시 (월/년도 선택)

7. 성격 키워드 (멀티 선택 칩)
   - 라벨: "아이의 성격은 어떤가요? (최대 3개)"
   - 선택지:
     활발해요 / 조용해요 / 겁쟁이예요 / 용감해요
     애교쟁이예요 / 독립적이에요 / 먹보예요 / 장난꾸러기예요
     겁이 많아요 / 온순해요
   - 최대 3개 선택

8. 보호자 메시지 (텍스트에어리어)
   - 라벨: "아이에게 전하고 싶은 말이 있나요?"
   - placeholder: "그때 네가 어땠는지... 지금은 행복하길 바란다고..."
   - 선택사항, 최대 200자
   - 글자 수 카운터 표시

## UI 스타일 가이드

- 각 필드 간 넉넉한 여백
- 버튼형 선택지: 선택 시 warm-brown 테두리 + 연한 베이지 배경
- 멀티 선택 칩: pill shape, 선택 시 채워진 스타일
- 입력 필드: 밑줄 스타일 (border-bottom only) 또는 soft card 스타일

## 유효성 검사 (Zod Schema)
const petInfoSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(20),
  type: z.enum(['dog', 'cat', 'other']),
  breed: z.string().optional(),
  age: z.number().min(0).max(20),
  gender: z.enum(['male', 'female']),
  isAdopted: z.boolean(),
  adoptedAt: z.string().optional(),
  personality: z.array(z.string()).max(3),
  messageFromOwner: z.string().max(200).optional(),
})

## 하단 CTA
"다음으로" 버튼 → 클릭 시 Zustand에 petInfo 저장 후 /select 로 이동

## 진행 표시
상단 스텝 인디케이터: ●●○ (2/3단계)
```

---

## ✅ SECTION 5: 상품 선택 페이지 프롬프트

```
app/select/page.tsx 를 구현해주세요.

## 페이지 목표
- 무료 체험 먼저 경험, 그 후 유료 전환 유도
- Premium이 자연스럽게 눈에 띄도록 (앵커링 효과)

## UI 구성

### 상단
진행 표시: ●●● (3/3단계)
제목: "어떻게 받아보시겠어요?"
부제: "먼저 무료로 만나보고, 더 원하시면 업그레이드하세요."

### 요약 카드 (Zustand에서 읽어와서 표시)
업로드한 사진 썸네일 + 반려동물 이름 + 선택한 성격 키워드들

### 플랜 선택 카드 목록

1. Free
   태그: 무료 체험
   가격: 0원
   포함:
   - 아기 시절 상상 이미지 1장
   - 짧은 감성 문구
   - 기본 공유 카드
   안내: "결과 확인 후 업그레이드 가능"
   버튼: "무료로 먼저 받아보기"

2. Basic
   가격: ₩4,900
   포함:
   - 아기 시절 상상 이미지 1장
   - 감성 스토리 (전체)
   - 고화질 다운로드
   - 공유 카드
   - 🐾 기부 적립 배지
   버튼: "Basic 시작하기"

3. Premium  ← 추천
   태그: 가장 인기 ⭐
   가격: ₩14,900
   원가 취소선: ₩19,900
   포함:
   - 아기 시절 상상 이미지 3장
   - 확장 감성 스토리
   - 다양한 스타일 선택
   - 고화질 다운로드
   - 공유 카드
   - 🐾 기부 적립 배지
   버튼: "Premium 시작하기"
   스타일: 테두리 2px warm-brown, 상단 추천 리본

4. Memory Pack
   태그: Coming Soon
   가격: ₩29,000
   포함:
   - 이미지 5장 + 영상 콘텐츠 + 기념일 카드
   스타일: 전체 흐릿하게(opacity: 0.5), 선택 불가
   버튼: "출시 알림 받기" (이메일 입력 모달)

## 기부 안내 배너
플랜 카드 아래:
"🐾 결제 금액의 2%는 유기동물 보호를 위해 기부됩니다."

## 동작
- Free 선택: /generating 으로 이동 (결제 없이 바로 생성 시작)
- Basic/Premium 선택: TossPayments 결제 모달 실행
  결제 성공 콜백 → /generating 으로 이동
  결제 실패 → 에러 토스트 표시

## 결제 연동 (TossPayments)
const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY)
await tossPayments.requestPayment('카드', {
  amount: selectedPlan.price,
  orderId: generateOrderId(),
  orderName: `반려동물 아기 시절 복원 - ${selectedPlan.name}`,
  customerName: '',
  successUrl: `${window.location.origin}/generating?plan=${selectedPlan.id}`,
  failUrl: `${window.location.origin}/select`,
})
```

---

## ✅ SECTION 6: 생성 대기 페이지 프롬프트

```
app/generating/page.tsx 를 구현해주세요.

## 페이지 목표
- 대기 시간(10~30초) 동안 기대감과 감정적 몰입 유지
- 이탈 방지
- 실제 API 호출 처리

## UI 구성

### 배경
- 크림색 배경
- 부드럽게 흔들리는 / 숨쉬는 듯한 원형 그라데이션 (pulse 애니메이션)
- 또는 파티클 효과 (선택)

### 중앙 콘텐츠
반려동물 업로드 사진 (작은 원형 프레임, 소프트 shadow)
아래 로딩 인디케이터 (점 3개 bounce 애니메이션 or 원형 진행 바)

감성 문구 순환 (3~4초마다 교체, fade transition):
- "아이의 작은 시절을 조심스럽게 상상하고 있어요."
- "털빛과 눈빛을 기억하며 복원 중입니다."
- "우리가 만나기 전의 시간을 그리고 있어요."
- "[이름]이의 첫 번째 시간을 만들고 있어요."
  ※ Zustand에서 이름 읽어와 개인화

### 하단
작은 텍스트: "평균 15~30초 정도 소요돼요. 잠시만 기다려주세요."

## API 호출 로직

useEffect(() => {
  const generate = async () => {
    try {
      // 1. 이미지 생성 API 호출
      const imageRes = await axios.post('/api/generate-image', {
        photoUrl: store.photoPreviewUrl,
        petInfo: store.petInfo,
        plan: store.selectedPlan,
      })
      
      // 2. 스토리 생성 API 호출
      const storyRes = await axios.post('/api/generate-story', {
        petInfo: store.petInfo,
        plan: store.selectedPlan,
      })
      
      // 3. Zustand에 결과 저장
      store.setResult(imageRes.data.images, storyRes.data.story, resultId)
      
      // 4. 결과 페이지로 이동
      router.push(`/result/${resultId}`)
    } catch (error) {
      // 에러 시 재시도 옵션 표시
      setError(true)
    }
  }
  generate()
}, [])

## 에러 상태
에러 발생 시:
"앗, 잠시 문제가 발생했어요."
"[다시 시도하기] 버튼" → 재시도
"[처음으로 돌아가기] 링크"
```

---

## ✅ SECTION 7: 결과 페이지 프롬프트

```
app/result/[id]/page.tsx 와 관련 컴포넌트를 구현해주세요.

## 페이지 목표
- 감동적인 결과 경험
- 저장 / SNS 공유 유도
- 프리미엄 업그레이드 자연스럽게 노출

## UI 구성

### 1. 감동 도입부
페이지 로드 시: 부드럽게 fade in
상단 작은 텍스트: "AI 상상 복원 이미지 · 실제 사진이 아닙니다"
(회색, 작은 폰트. 윤리적 오해 방지)

### 2. 이미지 표시 영역
생성된 이미지 카드:
- 둥근 모서리 (border-radius: 20px)
- 소프트 drop shadow
- 하단에 반려동물 이름 (Noto Serif KR)

Free/Basic: 이미지 1장
Premium: 이미지 3장 → 가로 스크롤 or 스와이프 가능한 캐러셀

### 3. 감성 스토리 섹션
배경: --color-beige
폰트: Noto Serif KR, 넉넉한 line-height

구성:
짧은 제목: "[이름]이의 첫 시간"
본문 스토리 (GPT-4o 생성 텍스트)
구분선
"만약 그때 만났다면" 메시지 (이탤릭, 인용구 스타일)
보호자에게 전하는 마무리 문장

Free 플랜의 경우:
스토리 일부만 표시 + 블러 처리 + "전체 스토리 보기" 버튼 (프리미엄 유도)

### 4. 기부 적립 배지
Basic/Premium 플랜 사용자에게만 표시
배지: 🐾 아이콘 + "이 구매의 2%가 유기동물 보호에 기부됩니다"
카드 형태, warm-brown 테두리

### 5. 공유 버튼 섹션
"이 아이의 시간을 공유해보세요"

버튼 3개:
- [이미지 저장하기] → canvas API or HTML2Canvas로 공유 카드 다운로드
- [카카오톡 공유] → Kakao SDK
- [링크 복사] → clipboard API + 토스트 알림

공유 카드 구성 (자동 생성):
- 아기 시절 이미지 + 이름 + 짧은 감성 문구 + 기부 배지 + 서비스 로고

### 6. 프리미엄 업그레이드 배너 (Free/Basic 플랜에만 표시)
"더 많은 모습이 궁금하신가요?"
"Premium으로 업그레이드하면 3가지 스타일의 이미지와
확장 스토리를 받아볼 수 있어요."
버튼: "Premium으로 업그레이드" → /select 로 이동

### 7. 기억 아카이브 저장 버튼
"[이름]이의 기억 아카이브에 저장하기"
→ 로그인 모달 or 이메일 입력으로 임시 저장

### 8. 다시 만들기 버튼
"처음부터 다시 만들기" → store.reset() 후 / 로 이동

## 공유 카드 HTML2Canvas 구현
별도 컴포넌트: components/result/ShareCard.tsx
- 1:1 비율 또는 4:5 비율 (인스타 최적화)
- 화면 밖에 숨겨두고 다운로드 시 캡처
- 포함 요소: 이미지, 이름, 감성 문구 1줄, 서비스명

## 데이터 로딩
- Zustand에서 generatedImages, generatedStory 읽어오기
- 없으면 /api/result/[id] 에서 fetch (직접 링크 접근 대비)
```

---

## ✅ SECTION 8: AI API 엔드포인트 프롬프트

```
다음 API Route 파일들을 구현해주세요.

## 1. app/api/generate-image/route.ts

OpenAI DALL-E 3 API를 사용하여 반려동물의 아기 시절 이미지를 생성합니다.

import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

### 프롬프트 구성 로직

function buildImagePrompt(petInfo: PetInfo, photoDescription?: string): string {
  const speciesKr = petInfo.type === 'dog' ? '강아지' : '고양이'
  
  return `
A warm, photorealistic baby ${petInfo.type} puppy/kitten portrait.
Breed: ${petInfo.breed || 'mixed breed'}.
The subject should look like a very young version (8-12 weeks old) of an adult ${petInfo.type}.
Soft, natural lighting. Warm color temperature. Slightly blurry background (bokeh).
Documentary-style photography, like a real family photo album.
The composition should feel tender, intimate, and nostalgic.
NOT a cartoon, illustration, or fantasy. Must look like a real photograph.
Style: film photography, warm tones, grain texture, emotional.
  `.trim()
}

### API 처리
export async function POST(request: Request) {
  const { petInfo, plan } = await request.json()
  
  const imageCount = plan === 'premium' ? 3 : 1
  const promises = Array.from({ length: imageCount }, () =>
    openai.images.generate({
      model: 'dall-e-3',
      prompt: buildImagePrompt(petInfo),
      size: '1024x1024',
      quality: plan === 'premium' ? 'hd' : 'standard',
      style: 'natural',
    })
  )
  
  const results = await Promise.all(promises)
  const imageUrls = results.map(r => r.data[0].url)
  
  return Response.json({ images: imageUrls })
}

## 2. app/api/generate-story/route.ts

GPT-4o를 사용하여 감성 스토리를 생성합니다.

### 시스템 프롬프트
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
`

export async function POST(request: Request) {
  const { petInfo, plan } = await request.json()
  
  const userPrompt = `
반려동물 정보:
- 이름: ${petInfo.name}
- 종류: ${petInfo.type === 'dog' ? '강아지' : '고양이'}
- 품종: ${petInfo.breed || '알 수 없음'}
- 나이: ${petInfo.age}세
- 성별: ${petInfo.gender === 'male' ? '남아' : '여아'}
- 유기동물 입양 여부: ${petInfo.isAdopted ? '예' : '아니오'}
- 성격: ${petInfo.personality.join(', ')}
- 보호자 메시지: ${petInfo.messageFromOwner || '없음'}
  `
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })
  
  const story = JSON.parse(response.choices[0].message.content!)
  return Response.json({ story })
}
```

---

## ✅ SECTION 9: 공통 컴포넌트 프롬프트

```
다음 공통 UI 컴포넌트들을 components/ui/ 폴더에 구현해주세요.
모든 컴포넌트는 TypeScript + Tailwind CSS로 작성합니다.

## 1. Button.tsx
variants: 'primary' | 'secondary' | 'ghost' | 'danger'
sizes: 'sm' | 'md' | 'lg' | 'full'
states: loading (spinner 포함), disabled
pill shape 기본 (border-radius: 100px)
primary: warm-brown 배경

## 2. Card.tsx
padding, shadow, borderRadius props
hover 시 살짝 올라오는 효과 (transform: translateY(-2px))
베이지 또는 흰색 배경

## 3. Toast.tsx (react-hot-toast 또는 직접 구현)
variants: 'success' | 'error' | 'info'
하단 중앙 고정
3초 후 자동 사라짐

## 4. Modal.tsx
배경 딤 처리 (rgba black 0.5)
중앙 카드
닫기 버튼 (X)
Framer Motion scale + fade 애니메이션

## 5. StepIndicator.tsx
props: currentStep, totalSteps
● 채워진 원, ○ 빈 원
현재 스텝 이름 텍스트 표시

## 6. DonationBadge.tsx
🐾 아이콘 + "이 구매의 2%가 유기동물 보호에 기부됩니다"
작은 pill 형태의 배지
warm-brown 계열 색상

## 7. PlanBadge.tsx
props: plan: 'free' | 'basic' | 'premium'
각 플랜에 맞는 색상과 라벨

## 8. Header.tsx (공통 헤더)
모바일: 로고 + 메뉴 아이콘
데스크톱: 로고 + 네비게이션 (랜딩, 마이페이지)
스크롤 시 배경 생기는 sticky 헤더
```

---

## ✅ SECTION 10: 환경변수 및 배포 설정 프롬프트

```
다음 설정 파일들을 생성해주세요.

## .env.local (샘플)
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
NEXT_PUBLIC_KAKAO_JS_KEY=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=...  # Supabase 또는 PlanetScale

## next.config.ts
- 이미지 도메인 허용: oaidalleapiprodscus.blob.core.windows.net (DALL-E 이미지)
- Strict Mode 활성화

## Vercel 배포 설정
- vercel.json 또는 Vercel 대시보드 환경변수 목록 정리
- 빌드 명령어: next build
- API 타임아웃: 60초 (이미지 생성 API 고려)

## 성능 최적화 체크리스트
- next/image 사용 (모든 이미지)
- 동적 import로 무거운 컴포넌트 lazy load
- API 응답 캐싱 전략 (결과 이미지 URL은 DB에 저장)
- 모바일 font loading 최적화 (font-display: swap)

## 보안 체크리스트
- API 키 서버사이드에서만 사용
- 파일 업로드 크기 제한 (10MB)
- Rate limiting (API Route에 적용)
- CORS 설정
```

