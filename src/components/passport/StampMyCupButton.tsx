"use client";

import Link from "next/link";
import { useState } from "react";
import { verifyPassportEntry } from "@/src/lib/passport/storage";
import type { MenuItem, Product } from "@/src/types/menu";

type StampMyCupButtonProps = {
  categoryName: string;
  categorySlug: string;
  code: string;
  item: MenuItem;
  linkedProducts: Product[];
};

export function StampMyCupButton({
  categoryName,
  categorySlug,
  code,
  item,
  linkedProducts,
}: StampMyCupButtonProps) {
  const [isStamped, setIsStamped] = useState(false);

  const stampMyCup = () => {
    verifyPassportEntry({
      categoryName,
      categorySlug,
      code,
      item,
      linkedProducts,
      source: "menu_qr",
    });
    setIsStamped(true);
  };

  return (
    <div className="grid gap-4">
      <button
        type="button"
        onClick={stampMyCup}
        className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#2b1a12] px-7 text-sm font-semibold text-[#fff8ed] shadow-[0_18px_38px_rgba(43,26,18,0.22)] transition hover:bg-[#412719]"
      >
        Stamp My Cup
      </button>

      {isStamped ? (
        <div className="rounded-lg border border-[#7d4d2f]/20 bg-[#fff8ed]/62 p-4 text-sm leading-7 text-[#5f4635]">
          <p className="font-semibold text-[#241710]">Verified Discovery</p>
          <p>
            This cup has been stamped in My Cup. Your quiet journey remembers
            it now.
          </p>
          <Link
            href="/passport"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635]"
          >
            View My Cup
          </Link>
        </div>
      ) : null}
    </div>
  );
}
