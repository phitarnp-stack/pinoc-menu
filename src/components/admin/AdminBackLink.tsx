import Link from "next/link";

type AdminBackLinkProps = {
  label: string;
  fallbackHref: string;
};

export function AdminBackLink({ label, fallbackHref }: AdminBackLinkProps) {
  return (
    <Link
      href={fallbackHref}
      className="mb-8 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f] transition hover:text-[#2b1a12] focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}
