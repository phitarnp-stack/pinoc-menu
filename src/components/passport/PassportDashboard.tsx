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

type PassportDashboardProps = {
  totalPublishedMenuItems: number;
};

const percent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const peaceOfMindRank = (verifiedPercent: number) => {
  if (verifiedPercent >= 90) {
    return {
      name: "The Peaceful One",
      description: "At home among the stories.",
    };
  }

  if (verifiedPercent >= 70) {
    return {
      name: "The Keeper",
      description: "Carrying many quiet moments with you.",
    };
  }

  if (verifiedPercent >= 50) {
    return {
      name: "The Reflector",
      description: "Taking time to understand each story.",
    };
  }

  if (verifiedPercent >= 30) {
    return {
      name: "The Listener",
      description: "Learning to notice the details.",
    };
  }

  if (verifiedPercent >= 15) {
    return {
      name: "The Explorer",
      description: "Finding new paths through Pinoc.",
    };
  }

  if (verifiedPercent >= 5) {
    return {
      name: "The Seeker",
      description: "Looking for something meaningful.",
    };
  }

  if (verifiedPercent >= 1) {
    return {
      name: "The Wanderer",
      description: "Beginning to slow down.",
    };
  }

  return {
    name: "New Guest",
    description: "Your quiet journey is just beginning.",
  };
};

export function PassportDashboard({
  totalPublishedMenuItems,
}: PassportDashboardProps) {
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
  const collectedMenuItemIds = useMemo(
    () => new Set(passport?.entries.map((entry) => entry.menuItemId) ?? []),
    [passport],
  );
  const verifiedMenuItemIds = useMemo(
    () =>
      new Set(
        passport?.entries
          .filter((entry) => entry.status === "verified")
          .map((entry) => entry.menuItemId) ?? [],
      ),
    [passport],
  );
  const collectedPercent = percent(
    collectedMenuItemIds.size,
    totalPublishedMenuItems,
  );
  const verifiedPercent = percent(
    verifiedMenuItemIds.size,
    totalPublishedMenuItems,
  );
  const rank = peaceOfMindRank(verifiedPercent);

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
        <div className="mt-5 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/58 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
            Peace of Mind
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-3xl font-semibold">{rank.name}</p>
              <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                {rank.description}
              </p>
            </div>
            <div className="grid gap-1 text-sm font-semibold text-[#5f4635]">
              <span>Collected: {collectedPercent}%</span>
              <span>Verified: {verifiedPercent}%</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#5f4635]">
            Collected cups are moments you saved. Verified discoveries are cups
            you stamped at Pinoc.
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Collected discoveries"
            value={collectedMenuItemIds.size}
          />
          <SummaryCard label="Origins met" value={origins.length} />
          <SummaryCard label="Flavors noticed" value={flavors.length} />
          <SummaryCard
            label="Verified discoveries"
            value={verifiedMenuItemIds.size}
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
