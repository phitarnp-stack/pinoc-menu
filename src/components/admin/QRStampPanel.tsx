"use client";

import { useState } from "react";

type QRStampPanelProps = {
  className?: string;
  menuItemId: string;
};

export function QRStampPanel({ className = "", menuItemId }: QRStampPanelProps) {
  const [origin] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );
  const [copied, setCopied] = useState(false);

  const stampUrl = origin ? `${origin}/stamp/${menuItemId}` : `/stamp/${menuItemId}`;

  const copyUrl = async () => {
    await window.navigator.clipboard.writeText(stampUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={`rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
        QR Stamp
      </p>
      <p className="mt-2 text-sm leading-6 text-[#5f4635]">
        Print or display this QR after serving this drink so guests can stamp
        My Cup.
      </p>
      <div className="mt-4 rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/70 p-3">
        <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8a6a55]">
          QR Stamp URL
        </p>
        <p className="break-all text-sm font-semibold text-[#241710]">
          {stampUrl}
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={copyUrl}
          className="min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#412719]"
        >
          {copied ? "Copied" : "Copy URL"}
        </button>
        <a
          href={stampUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:bg-[#fff8ed]/70"
        >
          Open Stamp Page
        </a>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#8a6a55]">
        MVP uses the menu item ID as the stamp code. A signed token system can
        be added later for stronger verification control.
      </p>
    </div>
  );
}
