type EducationHintProps = {
  text: string;
};

export function EducationHint({ text }: EducationHintProps) {
  return (
    <span
      title={text}
      className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#3d2618]/14 bg-[#fff8ed]/70 text-[0.68rem] font-semibold text-[#7d4d2f]"
      aria-label={text}
    >
      ?
    </span>
  );
}
