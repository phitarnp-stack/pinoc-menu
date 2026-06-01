"use client";

import { FormEvent, useMemo, useState } from "react";
import type {
  CustomerFavorite,
  CustomerTasting,
  FeelingTag,
  MenuItem,
} from "@/src/types/menu";

type MenuItemMemberActionsProps = {
  item: MenuItem;
  customerId: string;
  feelingTags: FeelingTag[];
  initialFavorites: CustomerFavorite[];
  initialTastings: CustomerTasting[];
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export function MenuItemMemberActions({
  item,
  customerId,
  feelingTags,
  initialFavorites,
  initialTastings,
}: MenuItemMemberActionsProps) {
  const [tastings, setTastings] =
    useState<CustomerTasting[]>(initialTastings);
  const [favorites, setFavorites] =
    useState<CustomerFavorite[]>(initialFavorites);
  const [rating, setRating] = useState(5);
  const [selectedFeelingTags, setSelectedFeelingTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const itemTastings = useMemo(
    () =>
      tastings
        .filter((tasting) => tasting.menuItemId === item.id)
        .sort(
          (left, right) =>
            new Date(right.tastedAt).getTime() -
            new Date(left.tastedAt).getTime(),
        ),
    [item.id, tastings],
  );

  const lastTasting = itemTastings[0];
  const isFavorite = favorites.some((favorite) => favorite.menuItemId === item.id);

  const toggleFeelingTag = (tagId: string) => {
    setSelectedFeelingTags((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  };

  const saveTasting = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tasting: CustomerTasting = {
      id: `tasting-${item.id}-${Date.now().toString(36)}`,
      customerId,
      menuItemId: item.id,
      tastedAt: new Date().toISOString(),
      rating,
      feelingTagIds: selectedFeelingTags,
      note: note.trim() || undefined,
    };

    setTastings((current) => [tasting, ...current]);
    setSelectedFeelingTags([]);
    setNote("");
    setSavedMessage("Tasting saved locally for this session.");
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites((current) =>
        current.filter((favorite) => favorite.menuItemId !== item.id),
      );
      setSavedMessage("Removed from favorites for this session.");
      return;
    }

    setFavorites((current) => [
      {
        id: `favorite-${item.id}-${Date.now().toString(36)}`,
        customerId,
        menuItemId: item.id,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setSavedMessage("Saved as a favorite for this session.");
  };

  return (
    <div className="mt-8 rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
            Member Memory
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Track this cup</h2>
        </div>
        <button
          type="button"
          onClick={toggleFavorite}
          className={
            isFavorite
              ? "min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed]"
              : "min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/70"
          }
        >
          {isFavorite ? "Saved Favorite" : "Save Favorite"}
        </button>
      </div>

      <div className="mt-6 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/68 p-4">
        {lastTasting ? (
          <div>
            <p className="text-sm font-semibold text-[#241710]">
              You have tried this before.
            </p>
            <p className="mt-2 text-sm leading-6 text-[#5f4635]">
              Last tried {formatDate(lastTasting.tastedAt)} · Rating{" "}
              {lastTasting.rating}/5
            </p>
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#5f4635]">
            You have not recorded this one yet.
          </p>
        )}
      </div>

      <form onSubmit={saveTasting} className="mt-6 grid gap-5">
        <div>
          <p className="text-sm font-semibold text-[#5f4635]">I tried this</p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={
                  rating >= value
                    ? "flex h-11 w-11 items-center justify-center rounded-full bg-[#2b1a12] text-sm font-semibold text-[#fff8ed]"
                    : "flex h-11 w-11 items-center justify-center rounded-full border border-[#3d2618]/14 text-sm font-semibold text-[#5f4635]"
                }
                aria-label={`${value} star rating`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#5f4635]">Feeling notes</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {feelingTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleFeelingTag(tag.id)}
                className={
                  selectedFeelingTags.includes(tag.id)
                    ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                    : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                }
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
          Optional note
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="min-h-24 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
            placeholder="What did you notice?"
          />
        </label>

        <button
          type="submit"
          className="min-h-12 rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed] shadow-[0_14px_30px_rgba(43,26,18,0.18)] transition hover:bg-[#412719]"
        >
          Save Tasting
        </button>

        {savedMessage ? (
          <p className="text-sm font-semibold text-[#7d4d2f]">{savedMessage}</p>
        ) : null}
      </form>

      <div className="mt-7 border-t border-[#3d2618]/10 pt-6">
        <p className="text-sm leading-7 text-[#5f4635]">
          Sign in with LINE to save your tasting history. Login is not connected
          yet, so this demo stores changes locally for the current session.
        </p>
      </div>
    </div>
  );
}
