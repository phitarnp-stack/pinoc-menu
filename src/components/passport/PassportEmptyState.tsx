import Link from "next/link";

export function PassportEmptyState() {
  return (
    <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        Guest Passport
      </p>
      <h2 className="mt-4 text-3xl font-semibold">Your journal is still open.</h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-[#5f4635]">
        Add a cup from any menu detail page. Pinoc will collect the origin,
        flavor notes, and discovery badges quietly in this device.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/menu"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed]"
        >
          Explore Menu
        </Link>
        <Link
          href="/find-your-cup"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#3d2618]/14 px-6 text-sm font-semibold text-[#5f4635]"
        >
          Find Your Cup
        </Link>
      </div>
    </div>
  );
}
