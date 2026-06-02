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
    <div className="relative h-full min-h-44 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_22%_18%,rgba(255,248,237,0.92),transparent_24%),radial-gradient(circle_at_76%_22%,rgba(231,202,167,0.42),transparent_22%),linear-gradient(135deg,#ead9c2,#8f6041_58%,#241710)]">
      <div className="absolute inset-x-8 top-8 h-px bg-[#fff8ed]/42" />
      <div className="absolute left-7 top-10 h-24 w-16 rounded-b-[2rem] rounded-t-lg border border-[#fff8ed]/42 bg-[#fff8ed]/16 shadow-[0_18px_48px_rgba(36,23,16,0.16)] backdrop-blur" />
      <div className="absolute left-10 top-20 h-9 w-10 rounded-b-[1.5rem] bg-[#2b1a12]/82" />
      <div className="absolute right-8 top-10 h-20 w-20 rotate-45 rounded-lg border border-[#fff8ed]/34 bg-[#fff8ed]/14 backdrop-blur" />
      <div className="absolute right-14 top-20 h-20 w-10 rounded-full border border-[#fff8ed]/35 bg-[#fff8ed]/10" />
      <div className="absolute bottom-9 left-9 h-16 w-28 rounded-[2rem] border border-[#fff8ed]/40 bg-[#fff8ed]/18 backdrop-blur" />
      <div className="absolute bottom-12 left-12 h-8 w-20 rounded-full bg-[radial-gradient(circle_at_38%_34%,#d3a06f,#714025_62%,#2b1a12)]" />
      <div className="absolute bottom-14 right-10 flex gap-2">
        <span className="h-5 w-3 rotate-12 rounded-full bg-[#4b2d1d]" />
        <span className="h-5 w-3 -rotate-12 rounded-full bg-[#6f432a]" />
        <span className="h-5 w-3 rotate-12 rounded-full bg-[#3a2317]" />
      </div>
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
