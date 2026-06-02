"use client";

import { FormEvent, useState } from "react";
import { saveHeroContent } from "@/src/lib/menu/adminWrites";
import type {
  HeroContent,
  HeroContentMode,
  MenuItem,
  OverlayField,
  Product,
} from "@/src/types/menu";
import { AdminBackLink } from "./AdminBackLink";
import { ImageUploadField } from "./ImageUploadField";
import { HeroImageFrame } from "@/src/components/media/HeroImageFrame";

type HeroContentFormProps = {
  initialHeroContent: HeroContent;
  products: Product[];
  specials: MenuItem[];
};

type HeroFormState = {
  title: string;
  subtitle: string;
  imageUrl: string;
  heroContentMode: HeroContentMode;
  customOverlayTitle: string;
  customOverlayText: string;
  overlayFields: OverlayField[];
  tastingNote: string;
  ctaLabel: string;
  ctaHref: string;
  featuredProductId: string;
  featuredSpecialId: string;
};

const heroContentModeOptions: {
  description: string;
  label: string;
  value: HeroContentMode;
}[] = [
  {
    description: "Only the image. Best for mood photography.",
    label: "Image only",
    value: "image_only",
  },
  {
    description: "Use selected hero details on top of the image.",
    label: "Image with info",
    value: "image_with_menu_info",
  },
  {
    description: "Write campaign or launch text by hand.",
    label: "Custom overlay",
    value: "custom_overlay",
  },
];

const heroOverlayFieldOptions: { label: string; value: OverlayField }[] = [
  { label: "Name", value: "name" },
  { label: "Taste Note", value: "taste_note" },
  { label: "Description", value: "description" },
];

export function HeroContentForm({
  initialHeroContent,
  products,
  specials,
}: HeroContentFormProps) {
  const [formState, setFormState] = useState<HeroFormState>({
    title: initialHeroContent.title,
    subtitle: initialHeroContent.subtitle,
    imageUrl: initialHeroContent.imageUrl ?? "",
    heroContentMode:
      initialHeroContent.heroContentMode ?? "image_with_menu_info",
    customOverlayTitle: initialHeroContent.customOverlayTitle ?? "",
    customOverlayText: initialHeroContent.customOverlayText ?? "",
    overlayFields: initialHeroContent.overlayFields?.length
      ? initialHeroContent.overlayFields
      : ["name", "taste_note"],
    tastingNote: initialHeroContent.tastingNote ?? "",
    ctaLabel: initialHeroContent.ctaLabel ?? "Find Your Cup",
    ctaHref: initialHeroContent.ctaHref ?? "/find-your-cup",
    featuredProductId: initialHeroContent.featuredProductId ?? "",
    featuredSpecialId: initialHeroContent.featuredSpecialId ?? "",
  });
  const [feedback, setFeedback] = useState<{
    tone: "success" | "warning" | "error";
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setIsSaving(true);

    const nextHeroContent: HeroContent = {
      id: "home",
      title: formState.title.trim(),
      subtitle: formState.subtitle.trim(),
      imageUrl: formState.imageUrl.trim() || undefined,
      heroContentMode: formState.heroContentMode,
      customOverlayTitle: formState.customOverlayTitle.trim() || undefined,
      customOverlayText: formState.customOverlayText.trim() || undefined,
      overlayFields: formState.overlayFields,
      tastingNote: formState.tastingNote.trim() || undefined,
      ctaLabel: formState.ctaLabel.trim() || "Find Your Cup",
      ctaHref: formState.ctaHref.trim() || "/find-your-cup",
      featuredProductId: formState.featuredProductId || undefined,
      featuredSpecialId: formState.featuredSpecialId || undefined,
    };

    try {
      const result = await saveHeroContent(nextHeroContent);

      setFeedback(
        result.source === "mock"
          ? { tone: "warning", message: result.warning ?? "Saved locally." }
          : { tone: "success", message: "Hero content saved to Supabase." },
      );
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not save hero content.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleOverlayField = (overlayField: OverlayField) => {
    setFormState((current) => ({
      ...current,
      overlayFields: current.overlayFields.includes(overlayField)
        ? current.overlayFields.filter((field) => field !== overlayField)
        : [...current.overlayFields, overlayField],
    }));
  };

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl py-12 sm:py-16">
          <AdminBackLink label="Back to Admin" fallbackHref="/admin" />

          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
                Homepage
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                Hero Content
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#5f4635]">
                Curate the first impression for Pinoc Specialty: the editorial
                image, seasonal focus, and featured beverage story.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/68 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur sm:p-7"
            >
              {feedback ? (
                <div
                  className={
                    feedback.tone === "error"
                      ? "mb-5 rounded-lg border border-red-900/20 bg-red-50/70 px-4 py-3 text-sm leading-6 text-red-900"
                      : feedback.tone === "warning"
                        ? "mb-5 rounded-lg border border-[#9a6b39]/25 bg-[#fff8ed]/76 px-4 py-3 text-sm leading-6 text-[#7d4d2f]"
                        : "mb-5 rounded-lg border border-[#2b1a12]/12 bg-[#fff8ed]/76 px-4 py-3 text-sm leading-6 text-[#2b1a12]"
                  }
                >
                  {feedback.message}
                </div>
              ) : null}

              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Hero Title
                  <input
                    required
                    value={formState.title}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Hero Subtitle
                  <textarea
                    required
                    value={formState.subtitle}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        subtitle: event.target.value,
                      }))
                    }
                    className="min-h-28 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <ImageUploadField
                  bucket="hero"
                  currentUrl={formState.imageUrl}
                  guidelines={{
                    recommendedSize: "1440 x 1920 px",
                    aspectRatio: "3:4",
                    minimumWidth: "1440 px",
                    formats: "JPG / PNG / WEBP",
                  }}
                  label="Hero Image"
                  objectNameSeed="homepage-hero"
                  onChange={(url) =>
                    setFormState((current) => ({
                      ...current,
                      imageUrl: url,
                    }))
                  }
                />

                {!formState.imageUrl ? (
                  <div className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/60 px-4 py-8 text-sm font-semibold text-[#7d4d2f]">
                    Fallback editorial visual will be shown.
                  </div>
                ) : null}

                <div className="grid gap-4 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                      Hero Image Presentation
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                      Let the homepage image speak alone, carry selected hero
                      information, or use a custom campaign overlay.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-semibold text-[#5f4635]">
                      Hero Content Mode
                    </p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {heroContentModeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormState((current) => ({
                              ...current,
                              heroContentMode: option.value,
                            }))
                          }
                          className={
                            formState.heroContentMode === option.value
                              ? "rounded-lg bg-[#2b1a12] px-4 py-3 text-left text-sm font-semibold text-[#fff8ed]"
                              : "rounded-lg border border-[#3d2618]/14 px-4 py-3 text-left text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          <span>{option.label}</span>
                          <span
                            className={
                              formState.heroContentMode === option.value
                                ? "mt-1 block text-xs font-medium leading-5 text-[#ead9c2]"
                                : "mt-1 block text-xs font-medium leading-5 text-[#8a6a55]"
                            }
                          >
                            {option.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formState.heroContentMode === "image_with_menu_info" ? (
                    <div className="grid gap-2">
                      <p className="text-sm font-semibold text-[#5f4635]">
                        Overlay Content
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {heroOverlayFieldOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleOverlayField(option.value)}
                            className={
                              formState.overlayFields.includes(option.value)
                                ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                                : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                            }
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {formState.heroContentMode === "custom_overlay" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        Custom Overlay Title
                        <input
                          value={formState.customOverlayTitle}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              customOverlayTitle: event.target.value,
                            }))
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                          placeholder="THE BRICE FRIEND"
                        />
                      </label>

                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        Custom Overlay Text
                        <textarea
                          value={formState.customOverlayText}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              customOverlayText: event.target.value,
                            }))
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                          placeholder="A seasonal collaboration. Coming soon."
                        />
                      </label>
                    </div>
                  ) : null}

                  <div className="grid gap-2">
                    <p className="text-sm font-semibold text-[#5f4635]">
                      Live Preview
                    </p>
                    <HeroImageFrame
                      alt="Homepage hero preview"
                      imageUrl={formState.imageUrl || undefined}
                      placeholder="Pinoc hero"
                      mode={formState.heroContentMode}
                      overlayFields={formState.overlayFields}
                      content={{
                        name: formState.title || "Hero Title",
                        tasteNote: formState.tastingNote,
                        description: formState.subtitle,
                        customTitle: formState.customOverlayTitle,
                        customText: formState.customOverlayText,
                      }}
                      aspectClass="aspect-[3/4]"
                      className="rounded-lg border border-[#3d2618]/10"
                    />
                  </div>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Hero Tasting Note
                  <textarea
                    value={formState.tastingNote}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        tastingNote: event.target.value,
                      }))
                    }
                    className="min-h-24 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    CTA Label
                    <input
                      value={formState.ctaLabel}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          ctaLabel: event.target.value,
                        }))
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    CTA Link
                    <input
                      value={formState.ctaHref}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          ctaHref: event.target.value,
                        }))
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Featured Product
                    <select
                      value={formState.featuredProductId}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          featuredProductId: event.target.value,
                        }))
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      <option value="">Auto select active product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Featured Special
                    <select
                      value={formState.featuredSpecialId}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          featuredSpecialId: event.target.value,
                        }))
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      <option value="">Auto select active special</option>
                      {specials.map((special) => (
                        <option key={special.id} value={special.id}>
                          {special.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-7 min-h-12 w-full rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed] shadow-[0_14px_30px_rgba(43,26,18,0.18)] transition hover:bg-[#412719] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Hero Content"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
