'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { FieldError, Merge } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { petInfoSchema, type PetInfoFormValues } from '@/lib/schema';
import { usePetStore } from '@/store/petStore';
import { PERSONALITY_OPTIONS, FAVORITE_PLACE_OPTIONS } from '@/types';
import type { PetType, Gender, FavoritePlace } from '@/types';

// ─── Micro components ─────────────────────────────────────────────────────────

function FieldCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-3xl border border-beige shadow-card p-6', className)}>
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
  optional,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-serif text-[1rem] text-deep-brown font-semibold mb-3 leading-snug"
    >
      {children}
      {optional && (
        <span className="text-soft-brown text-sm font-normal ml-2">(선택)</span>
      )}
    </label>
  );
}

type AnyFieldError = FieldError | Merge<FieldError, (FieldError | undefined)[]> | undefined;

function FieldError({ error }: { error?: AnyFieldError }) {
  const message = error && 'message' in error ? (error.message as string | undefined) : undefined;
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="text-red-500 text-xs mt-2"
          role="alert"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ─── Option button (used for type / gender / isAdopted) ───────────────────────

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 py-3 rounded-2xl border text-sm font-medium',
        'transition-all duration-150 active:scale-[0.97]',
        selected
          ? 'bg-beige border-warm-brown text-warm-brown shadow-card'
          : 'bg-white border-soft-brown/30 text-soft-brown hover:border-warm-brown/50 hover:text-deep-brown',
      )}
    >
      {children}
    </button>
  );
}

// ─── Age Slider ───────────────────────────────────────────────────────────────

function AgeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const pct = (value / 20) * 100;
  const label = value === 0 ? '1살 미만' : `${value}살`;

  return (
    <div className="space-y-4">
      {/* Current value display */}
      <div className="text-center">
        <span className="font-serif text-4xl text-warm-brown font-bold">{label}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        className="age-range"
        min={0}
        max={20}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--color-warm-brown) 0%, var(--color-warm-brown) ${pct}%, #E8E0D5 ${pct}%, #E8E0D5 100%)`,
        }}
        aria-label="나이 선택"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={20}
      />

      {/* Min / Max labels */}
      <div className="flex justify-between text-xs text-soft-brown/70">
        <span>1살 미만</span>
        <span>20살</span>
      </div>
    </div>
  );
}

// ─── Adopted Date Picker (year + month selects) ───────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function AdoptedDatePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  const [year, setYear] = useState(() => value?.split('-')[0] ?? '');
  const [month, setMonth] = useState(() => value?.split('-')[1] ?? '');

  useEffect(() => {
    if (year && month) {
      onChange(`${year}-${month}`);
    } else {
      onChange(undefined);
    }
  }, [year, month]);

  const selectClass = cn(
    'flex-1 bg-beige border border-soft-brown/25 rounded-2xl px-4 py-2.5',
    'text-deep-brown text-sm',
    'focus:outline-none focus:ring-2 focus:ring-warm-brown/30 focus:border-warm-brown',
    'appearance-none cursor-pointer',
  );

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      <p className="text-soft-brown text-sm mb-2.5 mt-4">언제 입양했나요?</p>
      <div className="flex gap-3">
        <select
          className={selectClass}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          aria-label="입양 연도"
        >
          <option value="">연도</option>
          {YEARS.map((y) => (
            <option key={y} value={String(y)}>{y}년</option>
          ))}
        </select>

        <select
          className={selectClass}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          aria-label="입양 월"
        >
          <option value="">월</option>
          {MONTHS.map((m, i) => (
            <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}

// ─── Personality Chips ────────────────────────────────────────────────────────

function PersonalityChips({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (trait: string) => {
    if (value.includes(trait)) {
      onChange(value.filter((p) => p !== trait));
    } else if (value.length < 3) {
      onChange([...value, trait]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PERSONALITY_OPTIONS.map((trait) => {
          const selected = value.includes(trait);
          const maxed = !selected && value.length >= 3;
          return (
            <button
              key={trait}
              type="button"
              onClick={() => toggle(trait)}
              disabled={maxed}
              className={cn(
                'px-4 py-2 rounded-full text-sm border transition-all duration-150',
                selected
                  ? 'bg-warm-brown text-white border-warm-brown'
                  : maxed
                  ? 'bg-white text-soft-brown/40 border-soft-brown/20 cursor-not-allowed'
                  : 'bg-white text-soft-brown border-soft-brown/30 hover:border-warm-brown/50 hover:text-deep-brown',
              )}
            >
              {trait}
            </button>
          );
        })}
      </div>
      <p className="text-soft-brown/60 text-xs">
        {value.length}/3 선택됨
      </p>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function PetInfoForm() {
  const router = useRouter();
  const { petInfo, setPetInfo } = usePetStore();
  const [breedUnknown, setBreedUnknown] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PetInfoFormValues>({
    resolver: zodResolver(petInfoSchema),
    defaultValues: {
      name:             petInfo.name,
      type:             petInfo.type,
      breed:            petInfo.breed,
      age:              petInfo.age,
      gender:           petInfo.gender,
      isAdopted:        petInfo.isAdopted,
      adoptedAt:        petInfo.adoptedAt,
      personality:      petInfo.personality,
      messageFromOwner: petInfo.messageFromOwner,
    },
    mode: 'onTouched',
  });

  const isAdopted       = watch('isAdopted');
  const adoptedAt       = watch('adoptedAt');
  const messageValue    = watch('messageFromOwner') ?? '';

  const onSubmit = (data: PetInfoFormValues) => {
    setPetInfo(data);
    router.push('/select');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      {/* ── 1. 이름 ── */}
      <FieldCard>
        <FieldLabel htmlFor="name">아이 이름이 뭔가요?</FieldLabel>
        <input
          id="name"
          type="text"
          autoComplete="off"
          placeholder="예: 뭉이, 코코, 보리"
          className={cn(
            'w-full bg-beige border-b-2 rounded-none px-1 py-2.5',
            'text-deep-brown placeholder-soft-brown/50 text-base',
            'focus:outline-none transition-colors duration-150',
            errors.name
              ? 'border-red-400'
              : 'border-soft-brown/30 focus:border-warm-brown',
          )}
          {...register('name')}
        />
        <FieldError error={errors.name} />
      </FieldCard>

      {/* ── 2. 동물 종류 ── */}
      <FieldCard>
        <FieldLabel>어떤 친구인가요?</FieldLabel>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3">
              {(
                [
                  { value: 'dog',   label: '🐶 강아지' },
                  { value: 'cat',   label: '🐱 고양이' },
                  { value: 'other', label: '🐾 기타' },
                ] as { value: PetType; label: string }[]
              ).map(({ value, label }) => (
                <OptionButton
                  key={value}
                  selected={field.value === value}
                  onClick={() => field.onChange(value)}
                >
                  {label}
                </OptionButton>
              ))}
            </div>
          )}
        />
        <FieldError error={errors.type} />
      </FieldCard>

      {/* ── 3. 품종 ── */}
      <FieldCard>
        <div className="flex items-center justify-between mb-3">
          <FieldLabel htmlFor="breed" optional>
            품종을 알고 계신가요?
          </FieldLabel>
          <button
            type="button"
            onClick={() => {
              const next = !breedUnknown;
              setBreedUnknown(next);
              if (next) setValue('breed', '');
            }}
            className={cn(
              'text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150',
              breedUnknown
                ? 'bg-soft-brown/15 text-warm-brown border-warm-brown/30'
                : 'bg-white text-soft-brown border-soft-brown/25 hover:border-warm-brown/40',
            )}
          >
            {breedUnknown ? '✓ 잘 모르겠어요' : '잘 모르겠어요'}
          </button>
        </div>
        <input
          id="breed"
          type="text"
          disabled={breedUnknown}
          placeholder={breedUnknown ? '모르셔도 괜찮아요 🐾' : '예: 믹스, 말티즈, 페르시안...'}
          className={cn(
            'w-full border-b-2 rounded-none px-1 py-2.5',
            'text-deep-brown placeholder-soft-brown/50 text-base',
            'focus:outline-none transition-all duration-150',
            breedUnknown
              ? 'bg-beige/50 border-soft-brown/15 text-soft-brown/40 cursor-not-allowed'
              : 'bg-beige border-soft-brown/30 focus:border-warm-brown',
          )}
          {...register('breed')}
        />
        <FieldError error={errors.breed} />
      </FieldCard>

      {/* ── 4. 나이 ── */}
      <FieldCard>
        <FieldLabel>지금 몇 살인가요?</FieldLabel>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <AgeSlider value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError error={errors.age} />
      </FieldCard>

      {/* ── 5. 성별 ── */}
      <FieldCard>
        <FieldLabel>성별은요?</FieldLabel>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3">
              {(
                [
                  { value: 'male',   label: '♂ 남아' },
                  { value: 'female', label: '♀ 여아' },
                ] as { value: Gender; label: string }[]
              ).map(({ value, label }) => (
                <OptionButton
                  key={value}
                  selected={field.value === value}
                  onClick={() => field.onChange(value)}
                >
                  {label}
                </OptionButton>
              ))}
            </div>
          )}
        />
        <FieldError error={errors.gender} />
      </FieldCard>

      {/* ── 6. 입양 여부 ── */}
      <FieldCard>
        <FieldLabel>보호소나 유기동물 센터에서 입양하셨나요?</FieldLabel>
        <Controller
          name="isAdopted"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <OptionButton
                  selected={field.value === true}
                  onClick={() => field.onChange(true)}
                >
                  네, 입양했어요 🐾
                </OptionButton>
                <OptionButton
                  selected={field.value === false}
                  onClick={() => {
                    field.onChange(false);
                    setValue('adoptedAt', undefined);
                  }}
                >
                  아니요, 어릴 때부터 함께했어요
                </OptionButton>
              </div>

              {/* Conditional: adopted date */}
              <AnimatePresence>
                {field.value === true && (
                  <AdoptedDatePicker
                    value={adoptedAt}
                    onChange={(v) => setValue('adoptedAt', v, { shouldDirty: true })}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        />
        <FieldError error={errors.isAdopted} />
      </FieldCard>

      {/* ── 7. 성격 ── */}
      <FieldCard>
        <FieldLabel optional>아이의 성격은 어떤가요?</FieldLabel>
        <p className="text-soft-brown text-xs mb-3 -mt-2">최대 3개까지 선택할 수 있어요</p>
        <Controller
          name="personality"
          control={control}
          render={({ field }) => (
            <PersonalityChips value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError error={errors.personality} />
      </FieldCard>

      {/* ── 8. 보호자 메시지 ── */}
      <FieldCard>
        <div className="flex items-start justify-between mb-3">
          <FieldLabel htmlFor="messageFromOwner" optional>
            아이에게 전하고 싶은 말이 있나요?
          </FieldLabel>
          <span className="text-soft-brown/60 text-xs shrink-0 ml-2 mt-1">
            {messageValue.length}/200
          </span>
        </div>
        <textarea
          id="messageFromOwner"
          rows={4}
          placeholder="그때 네가 어땠는지... 지금은 행복하길 바란다고..."
          className={cn(
            'w-full bg-beige border border-soft-brown/20 rounded-2xl px-4 py-3',
            'text-deep-brown placeholder-soft-brown/45 text-sm leading-relaxed resize-none',
            'focus:outline-none focus:ring-2 focus:ring-warm-brown/25 focus:border-warm-brown',
            'transition-all duration-150',
          )}
          {...register('messageFromOwner')}
        />
        <FieldError error={errors.messageFromOwner} />
      </FieldCard>

      {/* ── CTA ── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full py-4 rounded-full text-base font-medium',
            'bg-warm-brown text-white',
            'transition-all duration-200',
            'hover:bg-deep-brown hover:scale-[1.01] hover:shadow-hover',
            'active:scale-[0.98]',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100',
          )}
        >
          {isSubmitting ? '저장 중…' : '다음으로 →'}
        </button>
      </div>
    </form>
  );
}
