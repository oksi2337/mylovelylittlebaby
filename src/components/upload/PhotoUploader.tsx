'use client';

import { useCallback, useRef } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Camera, ImageIcon, Plus, X } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PHOTOS = 5;
export const MIN_PHOTOS = 3;

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
  if (codes.includes('too-many-files'))    return `사진은 최대 ${MAX_PHOTOS}장까지 선택할 수 있어요.`;
  return '업로드할 수 없는 파일이에요.';
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PhotoUploader() {
  const { photoPreviewUrls, addPhotos, removePhoto } = usePetStore();
  const toast = useToast();
  const cameraRef = useRef<HTMLInputElement>(null);

  const count = photoPreviewUrls.length;
  const canAdd = count < MAX_PHOTOS;

  const processFiles = useCallback(
    (files: File[]) => {
      const remaining = MAX_PHOTOS - count;
      const toAdd = files.slice(0, remaining);
      if (toAdd.length < files.length) {
        toast.error(`최대 ${MAX_PHOTOS}장까지만 업로드할 수 있어요.`);
      }
      if (toAdd.length > 0) addPhotos(toAdd);
    },
    [count, addPhotos, toast],
  );

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        toast.error(rejectionMessage(rejected[0]));
        return;
      }
      processFiles(accepted);
    },
    [processFiles, toast],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept:   ACCEPT,
    maxFiles:  MAX_PHOTOS - count,
    maxSize:   MAX_SIZE,
    noClick:   true,
    noDragEventsBubbling: true,
    disabled:  !canAdd,
  });

  const handleCameraChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;
      const oversized = files.find((f) => f.size > MAX_SIZE);
      if (oversized) {
        toast.error('파일 크기가 10MB를 초과했어요.');
        e.target.value = '';
        return;
      }
      processFiles(files);
      e.target.value = '';
    },
    [processFiles, toast],
  );

  return (
    <div className="space-y-4">
      {/* ── Progress indicator ── */}
      <div className="flex items-center justify-between">
        <span className={cn(
          'text-sm font-medium',
          count >= MIN_PHOTOS ? 'text-warm-brown' : 'text-soft-brown',
        )}>
          {count >= MIN_PHOTOS
            ? `${count}장 선택됨 ✓`
            : `최소 ${MIN_PHOTOS}장 필요 (현재 ${count}장)`}
        </span>
        <span className="text-xs text-soft-brown/60">최대 {MAX_PHOTOS}장</span>
      </div>

      {/* ── Photo grid (사진이 1장 이상일 때) ── */}
      {count > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          <AnimatePresence>
            {photoPreviewUrls.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-beige shadow-soft"
              >
                <Image
                  src={url}
                  alt={`업로드 사진 ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 30vw, 160px"
                />
                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={`사진 ${i + 1} 제거`}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 shadow flex items-center justify-center text-soft-brown hover:text-deep-brown hover:bg-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
                {/* 순서 번호 */}
                <div className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
                  <span className="text-white text-[10px] font-medium">{i + 1}</span>
                </div>
              </motion.div>
            ))}

            {/* 추가 슬롯 */}
            {canAdd && (
              <motion.button
                key="add-slot"
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={open}
                className="aspect-square rounded-2xl border-2 border-dashed border-soft-brown/30 bg-beige/50 flex flex-col items-center justify-center gap-1.5 hover:border-warm-brown/50 hover:bg-beige transition-colors"
              >
                <Plus className="w-6 h-6 text-soft-brown" strokeWidth={1.5} />
                <span className="text-xs text-soft-brown">추가</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── 빈 상태 드롭존 ── */}
      {count === 0 && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 rounded-[24px] overflow-hidden transition-all duration-200',
            isDragActive
              ? 'border-warm-brown bg-warm-brown/5 border-solid'
              : 'border-soft-brown/35 bg-white border-dashed hover:border-warm-brown/50 hover:bg-beige/30',
          )}
        >
          <input {...getInputProps()} />
          <motion.button
            type="button"
            onClick={open}
            className="w-full py-14 flex flex-col items-center gap-4 focus:outline-none"
            aria-label="사진 선택하기"
          >
            <div className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200',
              isDragActive ? 'bg-warm-brown/15 text-warm-brown' : 'bg-beige text-soft-brown',
            )}>
              {isDragActive ? (
                <ImageIcon className="w-8 h-8" strokeWidth={1.5} />
              ) : (
                <Camera className="w-8 h-8" strokeWidth={1.5} />
              )}
            </div>
            <div className="space-y-1.5 text-center">
              <p className={cn(
                'font-medium text-[0.95rem] transition-colors duration-200',
                isDragActive ? 'text-warm-brown' : 'text-deep-brown',
              )}>
                {isDragActive ? '여기에 놓아주세요!' : '사진을 드래그하거나 탭해서 선택'}
              </p>
              <p className="text-soft-brown text-sm">JPG, PNG 파일 / 최대 10MB / 여러 장 한 번에 선택 가능</p>
            </div>
          </motion.button>
        </div>
      )}

      {/* ── 사진이 있을 때 드래그 영역 힌트 ── */}
      {count > 0 && canAdd && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 rounded-2xl p-3.5 text-center transition-all duration-200 cursor-pointer',
            isDragActive
              ? 'border-warm-brown bg-warm-brown/5 border-solid'
              : 'border-soft-brown/20 bg-white/50 border-dashed hover:border-warm-brown/40',
          )}
        >
          <input {...getInputProps()} />
          <p className="text-soft-brown text-sm">
            {isDragActive ? '여기에 놓아주세요!' : '사진을 여기에 드래그해서 추가'}
          </p>
        </div>
      )}

      {/* ── 모바일 카메라 버튼 ── */}
      {canAdd && (
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

      {/* Hidden camera input */}
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
