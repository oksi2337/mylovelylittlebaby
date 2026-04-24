import { forwardRef } from 'react';

interface ShareCardProps {
  imageUrl: string;
  petName: string;
  shareText: string;
}

/**
 * Hidden component rendered off-screen.
 * Captured by html2canvas to generate a downloadable share image.
 * Install: npm install html2canvas
 */
const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ imageUrl, petName, shareText }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: 540,
          height: 540,
          background: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px',
          fontFamily: '"Noto Serif KR", Georgia, serif',
          gap: '0px',
        }}
      >
        {/* Image */}
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24,
            boxShadow: '0 8px 32px rgba(74,47,26,0.18)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={petName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            crossOrigin="anonymous"
          />
        </div>

        {/* Pet name */}
        <p
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: '#4A2F1A',
            marginBottom: 10,
            textAlign: 'center',
          }}
        >
          {petName}
        </p>

        {/* Share text */}
        <p
          style={{
            fontSize: 13,
            color: '#8B6651',
            textAlign: 'center',
            lineHeight: 1.75,
            marginBottom: 24,
            maxWidth: 380,
          }}
        >
          {shareText}
        </p>

        {/* Divider */}
        <div
          style={{ width: 40, height: 1, background: '#C4A882', marginBottom: 20 }}
        />

        {/* Branding */}
        <p style={{ fontSize: 12, color: '#C4A882', letterSpacing: '0.1em' }}>
          🐾 BabyPet — 아기 시절 복원 서비스
        </p>
      </div>
    );
  },
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;
