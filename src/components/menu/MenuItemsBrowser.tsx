"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BilingualLabel } from "@/src/components/language/BilingualLabel";
import type { MenuItem } from "@/src/types/menu";

type MenuView = "grid" | "list" | "flavor-map";

type MenuSection = {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
};

type MenuItemsBrowserProps = {
  sections: MenuSection[];
  itemBaseHref: string;
};

const STORAGE_KEY = "pinoc-menu-view";

const formatPrice = (price: number) => `฿${price}`;

const viewOptions: { label: string; value: Exclude<MenuView, "flavor-map"> }[] =
  [
    { label: "Journal", value: "grid" },
    { label: "Quiet List", value: "list" },
  ];

function GridIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="7"
        x="4"
        y="4"
      />
      <rect
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="7"
        x="13"
        y="4"
      />
      <rect
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="7"
        x="4"
        y="13"
      />
      <rect
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="7"
        x="13"
        y="13"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M8 6h12M8 12h12M8 18h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.9"
      />
      <path
        d="M4 6h.01M4 12h.01M4 18h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
    </svg>
  );
}

function ViewIcon({ view }: { view: Exclude<MenuView, "flavor-map"> }) {
  return view === "grid" ? <GridIcon /> : <ListIcon />;
}

function EmptyMenuSection() {
  return (
    <div className="rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/42 p-6 shadow-[0_12px_34px_rgba(84,55,34,0.06)] backdrop-blur sm:p-8">
      <div className="mb-5 h-px w-14 bg-[#7d4d2f]/35" />
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
        Resting today
      </p>
      <h3 className="mt-4 text-2xl font-semibold leading-tight">
        This path is quiet for now.
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[#5f4635]">
        Pinoc rotates drinks and products with the season. Explore another
        direction, or let the Digital Barista guide you to a cup that fits
        today.
      </p>
      <Link
        href="/find-your-cup"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:bg-[#fff8ed]"
      >
        Find Your Cup
      </Link>
    </div>
  );
}

export function MenuItemsBrowser({
  sections,
  itemBaseHref,
}: MenuItemsBrowserProps) {
  const [view, setView] = useState<MenuView>("grid");

  useEffect(() => {
    const savedView = window.sessionStorage.getItem(STORAGE_KEY);

    if (savedView === "grid" || savedView === "list") {
      const frame = window.requestAnimationFrame(() => setView(savedView));

      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  const updateView = (nextView: Exclude<MenuView, "flavor-map">) => {
    setView(nextView);
    window.sessionStorage.setItem(STORAGE_KEY, nextView);
  };

  return (
    <div className="grid gap-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
          Choose how to wander
        </p>
        <div className="grid grid-cols-2 rounded-full border border-[#3d2618]/12 bg-[#fff8ed]/58 p-1 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur sm:w-fit">
          {viewOptions.map((option) => {
            const isActive = view === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateView(option.value)}
                className={
                  isActive
                    ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#2b1a12] px-4 text-sm font-semibold text-[#fff8ed] shadow-[0_10px_22px_rgba(43,26,18,0.18)]"
                    : "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/70"
                }
                aria-pressed={isActive}
              >
                <ViewIcon view={option.value} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {sections.map((section) => (
        <section key={section.id} className="grid gap-5">
          {sections.length > 1 ? (
            <div className="rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/38 p-5 backdrop-blur">
              <div className="mb-4 h-px w-14 bg-[#7d4d2f]/45" />
              <h2 className="text-2xl font-semibold">{section.name}</h2>
              {section.description ? (
                <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                  {section.description}
                </p>
              ) : null}
            </div>
          ) : null}

          {section.items.length === 0 ? <EmptyMenuSection /> : null}

          {section.items.length > 0 && view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  href={`${itemBaseHref}/${item.slug}`}
                  className="group flex min-h-[25rem] flex-col overflow-hidden rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/46 shadow-[0_14px_38px_rgba(84,55,34,0.08)] backdrop-blur transition hover:-translate-y-1 hover:bg-[#fff8ed]/70"
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-[#3d2618]/10 bg-[radial-gradient(circle_at_30%_25%,rgba(255,248,237,0.94),transparent_35%),linear-gradient(135deg,#ead9c2,#8f5c39)]">
                    {item.imageUrl ? (
                      <img
                        alt={item.name}
                        src={item.imageUrl}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-x-5 bottom-5 rounded-lg border border-[#fff8ed]/36 bg-[#2b1a12]/58 px-4 py-3 text-[#fff8ed] backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e7caa7]">
                          {item.imagePlaceholder}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="mb-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                          Discovery entry
                        </p>
                        <h3 className="text-2xl font-semibold leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-sm leading-7 text-[#5f4635]">
                        {item.flavorNotes.slice(0, 3).join(", ")}
                      </p>
                    </div>
                    <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#3d2618]/10 pt-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6a55]">
                        Story first
                      </span>
                      <span className="text-sm font-semibold text-[#7d4d2f]">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          {section.items.length > 0 && view === "list" ? (
            <div className="grid gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  href={`${itemBaseHref}/${item.slug}`}
                  className="group rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/46 p-5 shadow-[0_10px_30px_rgba(84,55,34,0.08)] backdrop-blur transition hover:bg-[#fff8ed]/70 sm:p-6"
                >
                  <div className="grid gap-4 sm:grid-cols-[7rem_1fr] lg:grid-cols-[7rem_1fr_auto] lg:items-start">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#3d2618]/10 bg-[radial-gradient(circle_at_30%_25%,rgba(255,248,237,0.94),transparent_35%),linear-gradient(135deg,#ead9c2,#8f5c39)]">
                      {item.imageUrl ? (
                        <img
                          alt={item.name}
                          src={item.imageUrl}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-end p-3">
                          <p className="text-[0.64rem] font-semibold uppercase leading-4 tracking-[0.16em] text-[#fff8ed]">
                            {item.imagePlaceholder}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#7d4d2f]">
                          {item.flavorNotes.join(", ")}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                        {item.description}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                        <span className="font-semibold text-[#241710]">
                          <BilingualLabel
                            english="Recommended for"
                            thai="เหมาะสำหรับ"
                            compact
                          />
                        </span>{" "}
                        {item.recommendedFor}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-[#7d4d2f]">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
