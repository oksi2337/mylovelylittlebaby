'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface ArchiveModalProps {
  open: boolean;
  onClose: () => void;
  petName: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ArchiveModal({ open, onClose, petName }: ArchiveModalProps) {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!EMAIL_RE.test(email)) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    // TODO: POST /api/archive with { email, resultId }
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast.success(`${petName}의 기억이 아카이브에 저장됐어요 🐾`);
    setEmail('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`${petName}의 기억 저장하기`}>
      <p className="text-soft-brown text-sm leading-relaxed mb-6">
        이메일 주소를 남겨주시면 언제든 다시 꺼내볼 수 있도록
        <br />
        아카이브에 안전하게 보관해드릴게요.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="archive-email" className="block text-deep-brown text-sm font-medium mb-2">
          이메일 주소
        </label>
        <input
          id="archive-email"
          type="email"
          autoComplete="email"
          placeholder="hello@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          className={[
            'w-full bg-beige border rounded-2xl px-4 py-3 text-sm text-deep-brown',
            'placeholder-soft-brown/50',
            'focus:outline-none focus:ring-2 focus:ring-warm-brown/30 focus:border-warm-brown',
            'transition-all duration-150',
            error ? 'border-red-400' : 'border-soft-brown/25',
          ].join(' ')}
        />
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !email}
          className={[
            'mt-5 w-full py-3.5 rounded-full text-sm font-medium',
            'bg-warm-brown text-white',
            'transition-all duration-200',
            'hover:bg-deep-brown hover:shadow-soft',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ].join(' ')}
        >
          {submitting ? '저장 중…' : '아카이브에 저장하기 🐾'}
        </button>
      </form>
    </Modal>
  );
}
