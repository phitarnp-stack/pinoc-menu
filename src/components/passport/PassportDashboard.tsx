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

const peaceOfMindRanks = [
  {
    min: 0,
    name: "New Guest",
    description: "Your quiet journey is just beginning.",
  },
  {
    min: 1,
    name: "The Wanderer",
    description: "Beginning to slow down.",
  },
  {
    min: 5,
    name: "The Seeker",
    description: "Looking for something meaningful.",
  },
  {
    min: 15,
    name: "The Explorer",
    description: "Finding new paths through Pinoc.",
  },
  {
    min: 30,
    name: "The Listener",
    description: "Learning to notice the details.",
  },
  {
    min: 50,
    name: "The Reflector",
    description: "Taking time to understand each story.",
  },
  {
    min: 70,
    name: "The Keeper",
    description: "Carrying many quiet moments with you.",
  },
  {
    min: 90,
    name: "The Peaceful One",
    description: "At home among the stories.",
  },
];

const getPeaceOfMindProgress = (verifiedPercent: number) => {
  const currentIndex = peaceOfMindRanks.reduce(
    (matchedIndex, rank, index) =>
      verifiedPercent >= rank.min ? index : matchedIndex,
    0,
  );
  const current = peaceOfMindRanks[currentIndex];
  const next = peaceOfMindRanks[currentIndex + 1];
  const progressTowardNext = next
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((verifiedPercent - current.min) / (next.min - current.min)) * 100,
          ),
        ),
      )
    : 100;

  return {
    current,
    next,
    progressTowardNext,
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
  const rankProgress = getPeaceOfMindProgress(verifiedPercent);

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
        <PeaceOfMindJourney
          collectedPercent={collectedPercent}
          rankProgress={rankProgress}
          verifiedPercent={verifiedPercent}
        />
        <PassportEmptyState />
        <PeacefulCircle />
        <PassportSyncNotice />
      </div>
    );
  }

  return (
    <div className="grid gap-7">
      <PeaceOfMindJourney
        collectedPercent={collectedPercent}
        rankProgress={rankProgress}
        verifiedPercent={verifiedPercent}
      />

      <section className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/44 p-6 shadow-[0_14px_42px_rgba(84,55,34,0.08)] backdrop-blur sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
          Your Journey
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          A gentle record of what you are discovering.
        </h2>
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
      <PeacefulCircle />
      <PassportSyncNotice />
    </div>
  );
}

function PeaceOfMindJourney({
  collectedPercent,
  rankProgress,
  verifiedPercent,
}: {
  collectedPercent: number;
  rankProgress: ReturnType<typeof getPeaceOfMindProgress>;
  verifiedPercent: number;
}) {
  const { current, next, progressTowardNext } = rankProgress;

  return (
    <section className="rounded-[1.5rem] border border-[#3d2618]/10 bg-[#fff8ed]/52 p-6 shadow-[0_18px_52px_rgba(84,55,34,0.1)] backdrop-blur sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        Peace of Mind Journey
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
        <div>
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
            {current.name}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#5f4635] sm:text-base">
            {current.description}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#5f4635]">
            Collected cups are moments you saved. Verified discoveries are cups
            you stamped at Pinoc.
          </p>
        </div>

        <div className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/58 p-4">
          <div className="grid grid-cols-2 gap-3">
            <ProgressStat label="Collected" value={`${collectedPercent}%`} />
            <ProgressStat label="Verified" value={`${verifiedPercent}%`} />
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#7d4d2f]">
              <span>
                {next ? `Toward ${next.name}` : "Journey Complete"}
              </span>
              <span>{progressTowardNext}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#d9c2a8]/70">
              <div
                className="h-full rounded-full bg-[#7d4d2f] transition-all"
                style={{ width: `${progressTowardNext}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-[#8a6a55]">
              {next
                ? `Verify more discoveries to reach ${next.name}.`
                : "You are at home among the stories."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a55]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-[#241710]">{value}</p>
    </div>
  );
}

function PeacefulCircle() {
  return (
    <section className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/44 p-6 shadow-[0_14px_42px_rgba(84,55,34,0.08)] backdrop-blur sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        Peaceful Circle
      </p>
      <h2 className="mt-3 text-2xl font-semibold">
        A quiet space for fellow travelers.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f4635]">
        One day, this space will show fellow travelers who have explored Pinoc
        deeply. For now, your journey begins here.
      </p>
    </section>
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
