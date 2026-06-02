import Link from "next/link";

export function PassportEmptyState() {
  return (
    <div className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/48 p-6 shadow-[0_14px_42px_rgba(84,55,34,0.08)] backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        Guest Passport
      </p>
      <h2 className="mt-4 text-3xl font-semibold">Your journal is still open.</h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-[#5f4635]">
        Save a cup from any story page. Pinoc will keep the origin, flavor
        notes, and quiet milestones on this device.
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
