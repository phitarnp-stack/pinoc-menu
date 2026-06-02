"use client";

import { useState } from "react";

export type DisplayMode = "simple" | "expert";

type DisplayModeToggleProps = {
  value: DisplayMode;
  onChange: (mode: DisplayMode) => void;
};

export const DISPLAY_MODE_STORAGE_KEY = "pinoc-display-mode";

export function useDisplayMode() {
  const [mode, setMode] = useState<DisplayMode>(() => {
    if (typeof window === "undefined") {
      return "simple";
    }

    const savedMode = window.sessionStorage.getItem(DISPLAY_MODE_STORAGE_KEY);

    if (savedMode === "simple" || savedMode === "expert") {
      return savedMode;
    }

    return "simple";
  });

  const updateMode = (nextMode: DisplayMode) => {
    setMode(nextMode);
    window.sessionStorage.setItem(DISPLAY_MODE_STORAGE_KEY, nextMode);
  };

  return [mode, updateMode] as const;
}

export function DisplayModeToggle({
  value,
  onChange,
}: DisplayModeToggleProps) {
  return (
    <div className="grid gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
        Display
      </p>
      <div className="grid grid-cols-2 rounded-full border border-[#3d2618]/12 bg-[#f6efe6]/70 p-1">
        {[
          { value: "simple" as const, label: "Simple", thai: "อ่านง่าย" },
          { value: "expert" as const, label: "Expert", thai: "ข้อมูลครบ" },
        ].map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={
                isActive
                  ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                  : "rounded-full px-4 py-2 text-sm font-semibold text-[#5f4635] transition hover:bg-[#fff8ed]/80"
              }
              aria-pressed={isActive}
            >
              <span className="grid gap-0.5">
                <span>{option.label}</span>
                <span className="text-[0.68rem] font-medium">
                  {option.thai}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
