import { FindYourCupFlow } from "@/src/components/find/FindYourCupFlow";
import { PublicBackLink } from "@/src/components/navigation/PublicBackLink";
import { PublicHeader } from "@/src/components/navigation/PublicHeader";
import {
  getMenuCategories,
  getMenuItems,
} from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function FindYourCupPage() {
  const [menuItems, menuCategories] = await Promise.all([
    getMenuItems(),
    getMenuCategories(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <PublicHeader />
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_8%,rgba(255,248,237,0.52),transparent_30%),linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-[#4a2d1c]/15 sm:inset-x-10 lg:inset-x-16" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col justify-center gap-8 pb-16 pt-36 sm:pb-20 sm:pt-40 lg:pt-32">
          <div>
            <PublicBackLink href="/" label="Back to Home" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f]">
              Find Your Cup
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              มาหาแก้วที่เข้ากับอารมณ์วันนี้กัน
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4635]">
              Let’s find the cup that fits your mood today. ตอบไม่กี่ข้อ
              แล้วเราจะแนะนำเมนูจาก Pinoc ให้แบบเข้าใจง่าย
            </p>
          </div>

          <FindYourCupFlow
            menuItems={menuItems}
            menuCategories={menuCategories}
          />
        </div>
      </section>
    </main>
  );
}
