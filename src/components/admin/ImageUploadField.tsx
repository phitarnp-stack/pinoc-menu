"use client";

import { ChangeEvent, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/src/lib/supabase/client";

type ImageUploadFieldProps = {
  bucket: "products" | "menu-items" | "specials" | "hero";
  currentUrl: string;
  guidelines?: {
    aspectRatio: string;
    formats: string;
    minimumWidth: string;
    recommendedSize: string;
  };
  label: string;
  objectNameSeed: string;
  onChange: (url: string) => void;
};

const safeSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "pinoc-image";

export function ImageUploadField({
  bucket,
  currentUrl,
  guidelines,
  label,
  objectNameSeed,
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setStatus("Supabase is unavailable. Use the manual image URL fallback.");
      return;
    }

    setIsUploading(true);
    setStatus("Uploading image...");
    setProgress(12);

    const simulatedProgress = window.setInterval(() => {
      setProgress((current) => Math.min(current + 12, 88));
    }, 260);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${safeSegment(objectNameSeed)}/${Date.now().toString(36)}-${safeSegment(
        file.name.replace(/\.[^.]+$/, ""),
      )}.${extension}`;

      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: true,
      });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      onChange(data.publicUrl);
      setProgress(100);
      setStatus("Image uploaded. Public URL added automatically.");
    } catch (error) {
      setProgress(0);
      setStatus(
        error instanceof Error
          ? error.message
          : "Image upload failed. Please try again.",
      );
    } finally {
      window.clearInterval(simulatedProgress);
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="grid gap-3 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#5f4635]">{label}</p>
          <p className="mt-1 text-xs leading-5 text-[#8a6a55]">
            Upload to Supabase Storage, or keep using an existing image URL.
          </p>
          {guidelines ? (
            <div className="mt-3 grid gap-1 text-xs leading-5 text-[#8a6a55]">
              <p>
                Recommended:{" "}
                <span className="font-semibold text-[#5f4635]">
                  {guidelines.recommendedSize}
                </span>
              </p>
              <p>
                Aspect ratio:{" "}
                <span className="font-semibold text-[#5f4635]">
                  {guidelines.aspectRatio}
                </span>{" "}
                / Minimum width:{" "}
                <span className="font-semibold text-[#5f4635]">
                  {guidelines.minimumWidth}
                </span>
              </p>
              <p>Formats: {guidelines.formats}</p>
            </div>
          ) : null}
        </div>
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#412719]">
          {currentUrl ? "Replace Image" : "Choose File"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={uploadFile}
            className="sr-only"
          />
        </label>
      </div>

      {isUploading || progress > 0 ? (
        <div className="grid gap-2">
          <div className="h-2 overflow-hidden rounded-full bg-[#3d2618]/10">
            <div
              className="h-full rounded-full bg-[#7d4d2f] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-[#7d4d2f]">
            {progress}% uploaded
          </p>
        </div>
      ) : null}

      {status ? (
        <p className="text-xs leading-5 text-[#7d4d2f]">{status}</p>
      ) : null}

      {currentUrl ? (
        <div className="overflow-hidden rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/60">
          <img
            alt={`${label} preview`}
            src={currentUrl}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
        Manual Image URL
        <input
          type="url"
          value={currentUrl}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#fff8ed]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
          placeholder="https://example.com/image.jpg"
        />
      </label>
    </div>
  );
}
