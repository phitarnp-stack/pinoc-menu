"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  addPassportEntry,
  createPassportEntry,
  readPassport,
} from "@/src/lib/passport/storage";
import type { MenuItem, Product } from "@/src/types/menu";

type PassportAddButtonProps = {
  item: MenuItem;
  categorySlug: string;
  categoryName: string;
  linkedProducts: Product[];
};

export function PassportAddButton({
  item,
  categorySlug,
  categoryName,
  linkedProducts,
}: PassportAddButtonProps) {
  const [note, setNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const passport = readPassport();
      setEntryCount(
        passport.entries.filter((entry) => entry.menuItemId === item.id).length,
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [item.id]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entry = createPassportEntry({
      item,
      categorySlug,
      categoryName,
      linkedProducts,
      note,
    });
    const passport = addPassportEntry(entry);

    setEntryCount(
      passport.entries.filter((current) => current.menuItemId === item.id)
        .length,
    );
    setNote("");
    setIsSaved(true);
  };

  return (
    <div className="mt-8 rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
            Coffee Passport
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Add this cup to your journal
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#5f4635]">
            Save this experience on your device. Pinoc will collect the origin,
            flavor notes, and discovery milestones for your Passport.
          </p>
        </div>
        {entryCount > 0 ? (
          <span className="w-fit rounded-full bg-[#7d4d2f]/12 px-3 py-1 text-xs font-semibold text-[#7d4d2f]">
            Collected {entryCount} time{entryCount === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
          Optional note
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="min-h-24 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
            placeholder="What did this cup make you notice?"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed] shadow-[0_14px_30px_rgba(43,26,18,0.18)] transition hover:bg-[#412719]"
          >
            Add to Passport
          </button>
          <Link
            href="/passport"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#3d2618]/14 px-6 text-sm font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/70"
          >
            View Passport
          </Link>
        </div>
      </form>

      {isSaved ? (
        <div className="mt-5 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/68 p-4 text-sm leading-7 text-[#5f4635]">
          Saved to your Guest Passport. Your discovery journal is stored on this
          device for now.
        </div>
      ) : null}
    </div>
  );
}
