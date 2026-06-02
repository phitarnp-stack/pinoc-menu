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
        Opening your Guest Passport...
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
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Experiences" value={passport.entries.length} />
        <SummaryCard label="Origins" value={origins.length} />
        <SummaryCard label="Milestones" value={passport.badgeAwards.length} />
      </div>

      <PassportSyncNotice />

      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <RecentExperiences entries={passport.entries} />
        <div className="grid gap-5">
          <OriginCollectionGrid origins={origins} />
          <FlavorCollectionGrid flavors={flavors} />
        </div>
      </div>

      <BadgeCollection awards={passport.badgeAwards} />
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
