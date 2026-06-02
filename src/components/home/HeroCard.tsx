type HeroCardProps = {
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  description?: string;
  variant?: "large" | "compact";
};

function FallbackVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative h-full min-h-44 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_28%_20%,rgba(255,248,237,0.9),transparent_28%),linear-gradient(135deg,#ead9c2,#9b6a45_58%,#2b1a12)]">
      <div className="absolute left-5 top-5 h-20 w-12 rounded-full border border-[#fff8ed]/40 bg-[#fff8ed]/12 backdrop-blur" />
      <div className="absolute right-7 top-8 h-24 w-20 rounded-b-[2.4rem] rounded-t-lg border border-[#fff8ed]/42 bg-[#fff8ed]/20 backdrop-blur" />
      <div className="absolute right-10 top-16 h-10 w-14 rounded-b-[1.6rem] bg-[#2b1a12]/78" />
      <div className="absolute bottom-7 left-7 h-16 w-24 rounded-[2rem] border border-[#fff8ed]/40 bg-[#fff8ed]/18 backdrop-blur" />
      <div className="absolute bottom-10 left-10 h-8 w-16 rounded-full bg-[radial-gradient(circle_at_38%_34%,#c99262,#714025_62%,#2b1a12)]" />
      {!compact ? (
        <div className="absolute inset-x-8 bottom-28 h-px bg-[#fff8ed]/34" />
      ) : null}
    </div>
  );
}

export function HeroCard({
  title,
  subtitle,
  image,
  badge,
  description,
  variant = "compact",
}: HeroCardProps) {
  const isLarge = variant === "large";

  return (
    <article
      className={
        isLarge
          ? "overflow-hidden rounded-[1.35rem] border border-[#fff8ed]/46 bg-[#fff8ed]/24 shadow-[0_36px_90px_rgba(48,29,17,0.22)] backdrop-blur"
          : "overflow-hidden rounded-lg border border-[#fff8ed]/36 bg-[#fff8ed]/18 shadow-[0_18px_48px_rgba(48,29,17,0.16)] backdrop-blur"
      }
    >
      <div className={isLarge ? "aspect-[4/3]" : "aspect-[16/10]"}>
        {image ? (
          <img alt={title} src={image} className="h-full w-full object-cover" />
        ) : (
          <FallbackVisual compact={!isLarge} />
        )}
      </div>
      <div className={isLarge ? "p-6 sm:p-7" : "p-4"}>
        {badge ? (
          <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#b99069]">
            {badge}
          </p>
        ) : null}
        <h2
          className={
            isLarge
              ? "text-3xl font-semibold leading-tight text-[#fff8ed]"
              : "text-lg font-semibold leading-tight text-[#fff8ed]"
          }
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-[#ead9c2]">{subtitle}</p>
        ) : null}
        {description ? (
          <p className="mt-4 text-sm leading-6 text-[#fff8ed]/78">
            {description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
