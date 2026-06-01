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
            <div className="absolute inset-0 rounded-[2rem] border border-[#fff8ed]/45 bg-[#fff8ed]/20 shadow-[0_40px_100px_rgba(48,29,17,0.18)] backdrop-blur-md" />
            <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,#fff8ed_0%,#f0dec7_39%,#a66f47_40%,#5b341f_52%,#2b1a12_54%,#140d09_100%)] shadow-[inset_0_0_0_1px_rgba(255,248,237,0.32),0_24px_70px_rgba(43,26,18,0.38)]" />
            <div className="absolute inset-20 rounded-full bg-[radial-gradient(circle_at_42%_35%,#b8794e_0%,#714025_42%,#2f1a10_78%)] shadow-[inset_0_16px_42px_rgba(255,248,237,0.16)]" />
            <div className="absolute left-1/2 top-[24%] h-24 w-24 -translate-x-1/2 rounded-full bg-[#fff8ed]/22 blur-2xl" />
            <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-[#fff8ed]/40 bg-[#2b1a12]/80 px-5 py-5 text-[#fff8ed] shadow-[0_18px_44px_rgba(25,13,7,0.28)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e7caa7]">
                Signature Profile
              </p>
              <p className="mt-3 text-2xl font-semibold leading-tight">
                Velvet cacao, toasted almond, golden citrus.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
