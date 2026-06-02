import Link from "next/link";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative flex min-h-screen items-center px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,155,104,0.34),transparent_34%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_43%,#b99069_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />
        <div className="absolute inset-x-6 bottom-6 h-px bg-[#fff8ed]/40 sm:inset-x-10 lg:inset-x-16" />

        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-[#4a2d1c]/10 bg-[#7c4a2b]/10 blur-sm sm:right-4 sm:h-[28rem] sm:w-[28rem]" />
        <div className="pointer-events-none absolute -bottom-24 left-[-7rem] h-80 w-80 rounded-full bg-[#3b2316]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-8 bottom-24 hidden h-44 w-44 rounded-full border border-[#fff8ed]/35 lg:block" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 lg:grid lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div className="max-w-xl pt-36 sm:pt-40 lg:pt-20">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.34em] text-[#7d4d2f]">
              Pinoc Specialty
            </p>

            <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal text-[#241710] sm:text-6xl lg:text-7xl">
              Discover Your Perfect Cup
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#5f4635] sm:text-lg">
              A quieter way to meet specialty coffee: curated origins, refined
              roast profiles, and tasting notes designed for the cup you are in
              the mood for.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#2b1a12] px-7 text-sm font-semibold text-[#fff8ed] shadow-[0_18px_38px_rgba(43,26,18,0.22)] transition hover:bg-[#412719] focus:outline-none focus:ring-2 focus:ring-[#2b1a12] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
              >
                Explore Menu
              </Link>
              <a
                href="#match"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#3d2618]/20 bg-[#fff8ed]/55 px-7 text-sm font-semibold text-[#2b1a12] shadow-[0_14px_34px_rgba(84,55,34,0.12)] backdrop-blur transition hover:border-[#3d2618]/35 hover:bg-[#fff8ed]/80 focus:outline-none focus:ring-2 focus:ring-[#7d4d2f] focus:ring-offset-4 focus:ring-offset-[#f6efe6]"
              >
                Which One Fits You?
              </a>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div className="absolute inset-0 rounded-[1.75rem] border border-[#fff8ed]/55 bg-[#fff8ed]/22 shadow-[0_42px_110px_rgba(48,29,17,0.2)] backdrop-blur-md" />
            <div className="absolute inset-5 rounded-[1.35rem] border border-[#3d2618]/10 bg-[linear-gradient(145deg,rgba(255,248,237,0.9),rgba(238,222,199,0.72)_45%,rgba(173,128,88,0.34))] shadow-[inset_0_1px_0_rgba(255,248,237,0.82)]" />
            <div className="absolute inset-9 rounded-[1rem] border border-[#fff8ed]/42 bg-[#fff8ed]/18" />

            <div className="absolute left-9 right-9 top-8 flex items-center justify-between text-[#7d4d2f]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                Slow Filter
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                01
              </p>
            </div>

            <div className="absolute left-10 top-20 h-40 w-28 rounded-xl border border-[#3d2618]/10 bg-[linear-gradient(180deg,rgba(255,248,237,0.76),rgba(222,198,170,0.42))] shadow-[0_18px_42px_rgba(84,55,34,0.12)]" />
            <div className="absolute left-14 top-24 h-2 w-14 rounded-full bg-[#7d4d2f]/28" />
            <div className="absolute left-14 top-32 h-20 w-20 rounded-full border border-[#3d2618]/10 bg-[radial-gradient(circle_at_38%_32%,rgba(255,248,237,0.62),rgba(205,166,124,0.38)_56%,rgba(125,77,47,0.18))]" />

            <div className="absolute left-1/2 top-[18%] h-56 w-56 -translate-x-1/2">
              <div className="absolute left-1/2 top-0 h-8 w-28 -translate-x-1/2 rounded-full border border-[#3d2618]/18 bg-[#fff8ed]/72 shadow-[0_10px_24px_rgba(84,55,34,0.14)]" />
              <div className="absolute left-1/2 top-5 h-24 w-36 -translate-x-1/2 rounded-b-[3.4rem] rounded-t-xl border border-[#3d2618]/16 bg-[linear-gradient(180deg,#fff8ed,#dec29e)] shadow-[0_24px_54px_rgba(84,55,34,0.18)]" />
              <div className="absolute left-1/2 top-9 h-16 w-28 -translate-x-1/2 rounded-b-[2.5rem] rounded-t-md bg-[linear-gradient(180deg,#6d4228,#2b1a12)] shadow-[inset_0_10px_18px_rgba(255,248,237,0.12)]" />
              <div className="absolute left-1/2 top-[7.75rem] h-20 w-px -translate-x-1/2 bg-[linear-gradient(180deg,#7d4d2f,rgba(125,77,47,0))]" />
              <div className="absolute left-1/2 top-[12.2rem] h-11 w-32 -translate-x-1/2 rounded-[2rem] border border-[#3d2618]/14 bg-[linear-gradient(180deg,rgba(255,248,237,0.78),rgba(222,201,176,0.48))] shadow-[0_24px_46px_rgba(84,55,34,0.18)]" />
              <div className="absolute left-1/2 top-[13rem] h-7 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_42%_35%,#c99262,#714025_62%,#2b1a12)] shadow-[inset_0_8px_14px_rgba(255,248,237,0.18)]" />
              <div className="absolute right-8 top-[12.8rem] h-9 w-10 rounded-r-full border-[7px] border-l-0 border-[#d8b996]/82" />
            </div>

            <div className="absolute bottom-[8.5rem] right-10 grid grid-cols-2 gap-2">
              <div className="h-5 w-3 rotate-[24deg] rounded-full bg-[#4a2d1c] shadow-[inset_2px_0_0_rgba(255,248,237,0.16)]" />
              <div className="mt-5 h-4 w-2.5 rotate-[-24deg] rounded-full bg-[#7d4d2f] shadow-[inset_1px_0_0_rgba(255,248,237,0.18)]" />
              <div className="ml-4 h-4 w-2.5 rotate-[38deg] rounded-full bg-[#5f3924] shadow-[inset_1px_0_0_rgba(255,248,237,0.16)]" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-xl border border-[#fff8ed]/44 bg-[#2b1a12]/84 px-5 py-5 text-[#fff8ed] shadow-[0_18px_44px_rgba(25,13,7,0.28)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e7caa7]">
                Tasting Direction
              </p>
              <p className="mt-3 text-2xl font-semibold leading-tight">
                Filter clarity, soft florals, cacao warmth.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
