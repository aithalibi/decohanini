interface LogoProps {
  light?: boolean;
  compact?: boolean;
  className?: string;
}

export default function Logo({ light = false, compact = false, className = '' }: LogoProps) {
  const ink = light ? 'text-brand-cream' : 'text-brand-espresso';
  const border = light ? 'border-brand-taupe' : 'border-brand-caramel';
  const accent = light ? 'text-brand-taupe' : 'text-brand-caramel';

  return (
    <div
      dir="ltr"
      className={`flex select-none flex-col items-center whitespace-nowrap ${className}`}
      style={{ direction: 'ltr' }}
    >
      <div className={`flex items-center font-serif leading-none ${ink} ${compact ? 'text-[24px]' : 'text-[34px] md:text-[40px]'}`}>
        <span className="tracking-[-0.055em]">Déco</span>
        <span
          className={`mx-[2px] inline-grid aspect-square h-[1.16em] place-items-center rounded-full border ${border}`}
          aria-hidden="true"
        >
          <span className="-translate-y-[0.02em] text-[0.72em]">H</span>
        </span>
        <span className="tracking-[-0.065em]">anini</span>
      </div>
      <span className={`mt-1 font-sans font-semibold uppercase ${accent} ${compact ? 'text-[5px] tracking-[0.22em]' : 'text-[7px] tracking-[0.3em] md:text-[8px]'}`}>
        Décoration · Maison · Art
      </span>
    </div>
  );
}
