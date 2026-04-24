'use client';

import { useCallback, useRef } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Camera, ImageIcon, X, RefreshCw } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png':  ['.png'],
  'image/webp': ['.webp'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rejectionMessage(r: FileRejection): string {
  const codes = r.errors.map((e) => e.code);
  if (codes.includes('file-too-large'))    return '파일 크기가 10MB를 초과했어요.';
  if (codes.includes('file-invalid-type')) return 'JPG, PNG, WEBP 파일만 업로드할 수 있어요.';
  if (codes.includes('too-many-files'))    return '사진은 1장만 선택할 수 있어요.';
  return '업로드할 수 없는 파일이에요.';
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({
  isDragActive,
  onClick,
}: {
  isDragActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="w-full py-14 flex flex-col items-center gap-4 focus:outline-none"
      aria-label="사진 선택하기"
    >
      {/* Icon */}
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200',
          isDragActive ? 'bg-warm-brown/15 text-warm-brown' : 'bg-beige text-soft-brown',
        )}
      >
        {isDragActive ? (
          <ImageIcon className="w-8 h-8" strokeWidth={1.5} />
        ) : (
          <Camera className="w-8 h-8" strokeWidth={1.5} />
        )}
      </div>

      {/* Text */}
      <div className="space-y-1.5 text-center">
        <p
          className={cn(
            'font-medium text-[0.95rem] transition-colors duration-200',
            isDragActive ? 'text-warm-brown' : 'text-deep-brown',
          )}
        >
          {isDragActive ? '여기에 놓아주세요!' : '사진을 드래그하거나 탭해서 선택'}
        </p>
        <p className="text-soft-brown text-sm">JPG, PNG 파일 / 최대 10MB</p>
      </div>
    </motion.button>
  );
}

// ─── Preview state ────────────────────────────────────────────────────────────

function PreviewState({
  url,
  onRemove,
  onReplace,
}: {
  url: string;
  onRemove: () => void;
  onReplace: () => void;
}) {
  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative p-4"
    >
      {/* Image */}
      <div className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden shadow-soft">
        <Image
          src={url}
          alt="업로드된 반려동물 사진"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 320px"
          priority
        />
      </div>

      {/* Remove button — top-right of image */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label="사진 제거"
        className={[
          'absolute top-2 right-2',
          'w-8 h-8 rounded-full bg-white shadow-soft border border-beige',
          'flex items-center justify-center',
          'text-soft-brown hover:text-deep-brown hover:bg-beige',
          'transition-colors duration-150',
        ].join(' ')}
      >
        <X className="w-4 h-4" strokeWidth={2.5} />
      </button>

      {/* Replace link */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReplace(); }}
          className="inline-flex items-center gap-1.5 text-sm text-warm-brown hover:text-deep-brown transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          다른 사진 선택
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PhotoUploader() {
  const { photoPreviewUrl, setPhoto, clearPhoto } = usePetStore();
  const toast = useToast();
  const cameraRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setPhoto(file);
    },
    [setPhoto],
  );

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      // Show first rejection error only (avoid duplicate toasts)
      if (rejected.length > 0) {
        toast.error(rejectionMessage(rejected[0]));
        return;
      }
      if (accepted[0]) processFile(accepted[0]);
    },
    [processFile, toast],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept:   ACCEPT,
    maxFiles:  1,
    maxSize:   MAX_SIZE,
    noClick:   true,  // we control clicks manually
    noDragEventsBubbling: true,
  });

  // Camera input handler (mobile capture)
  const handleCameraChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_SIZE) {
        toast.error('파일 크기가 10MB를 초과했어요.');
        e.target.value = '';
        return;
      }
      processFile(file);
      e.target.value = '';
    },
    [processFile, toast],
  );

  const hasPrevie = Boolean(photoPreviewUrl);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 rounded-[24px] overflow-hidden',
          'transition-all duration-200 ease-out',
          isDragActive
            ? 'border-warm-brown bg-warm-brown/5 border-solid'
            : hasPrevie
            ? 'border-soft-brown/20 bg-white border-solid'
            : 'border-soft-brown/35 bg-white border-dashed hover:border-warm-brown/50 hover:bg-beige/30',
        )}
      >
        {/* Hidden file input (gallery) */}
        <input {...getInputProps()} />

        <AnimatePresence mode="wait" initial={false}>
          {photoPreviewUrl ? (
            <PreviewState
              url={photoPreviewUrl}
              onRemove={clearPhoto}
              onReplace={open}
            />
          ) : (
            <EmptyState isDragActive={isDragActive} onClick={open} />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-only: direct camera button */}
      {!hasPrevie && (
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className={[
            'md:hidden w-full py-3.5 rounded-2xl',
            'flex items-center justify-center gap-2',
            'border border-soft-brown/30 bg-beige',
            'text-sm font-medium text-warm-brown',
            'hover:bg-soft-brown/20 transition-colors duration-150',
          ].join(' ')}
        >
          <Camera className="w-4 h-4" />
          카메라로 바로 촬영하기
        </button>
      )}

      {/* Hidden camera input — capture="environment" goes directly to rear camera */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraChange}
        aria-hidden="true"
      />
    </div>
  );
}
