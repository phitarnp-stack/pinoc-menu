type BilingualLabelProps = {
  english: string;
  thai: string;
  compact?: boolean;
};

export function BilingualLabel({
  english,
  thai,
  compact = false,
}: BilingualLabelProps) {
  return (
    <span className={compact ? "inline-grid gap-0.5" : "grid gap-1"}>
      <span>{english}</span>
      <span className="text-[0.72rem] font-medium leading-5 tracking-normal text-[#8a6a55]">
        {thai}
      </span>
    </span>
  );
}
