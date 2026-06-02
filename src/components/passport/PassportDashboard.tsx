"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCollection } from "./BadgeCollection";
import { FlavorCollectionGrid } from "./FlavorCollectionGrid";
import { OriginCollectionGrid } from "./OriginCollectionGrid";
import { PassportEmptyState } from "./PassportEmptyState";
import { PassportSyncNotice } from "./PassportSyncNotice";
import { RecentExperiences } from "./RecentExperiences";
import { deriveFlavorCollections, deriveOriginCollections } from "@/src/lib/passport/collections";
import { readPassport } from "@/src/lib/passport/storage";
import type { GuestPassport } from "@/src/types/passport";

export function PassportDashboard() {
  const [passport, setPassport] = useState<GuestPassport | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPassport(readPassport());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const origins = useMemo(
    () => deriveOriginCollections(passport?.entries ?? []),
    [passport],
  );
  const flavors = useMemo(
    () => deriveFlavorCollections(passport?.entries ?? []),
    [passport],
  );

  if (!passport) {
    return (
      <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 text-sm font-semibold text-[#5f4635] shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur">
        Opening My Cup...
      </div>
    );
  }

  if (passport.entries.length === 0) {
    return (
      <div className="grid gap-5">
        <PassportEmptyState />
        <PassportSyncNotice />
      </div>
    );
  }

  return (
    <div className="grid gap-7">
      <section className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/44 p-6 shadow-[0_14px_42px_rgba(84,55,34,0.08)] backdrop-blur sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
          Your Journey
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          A gentle record of what you are discovering.
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total experiences"
            value={passport.entries.length}
          />
          <SummaryCard label="Origins met" value={origins.length} />
          <SummaryCard label="Flavors noticed" value={flavors.length} />
          <SummaryCard
            label="Badges earned"
            value={passport.badgeAwards.length}
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <RecentExperiences entries={passport.entries} />
        <div className="grid gap-5">
          <OriginCollectionGrid origins={origins} />
          <FlavorCollectionGrid flavors={flavors} />
        </div>
      </div>

      <BadgeCollection awards={passport.badgeAwards} />
      <PassportSyncNotice />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/44 p-5 shadow-[0_10px_28px_rgba(84,55,34,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[#241710]">{value}</p>
    </div>
  );
}
