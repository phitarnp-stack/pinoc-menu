import type { HeroContentMode, OverlayField } from "@/src/types/menu";

type OverlayContent = {
  name?: string;
  tasteNote?: string;
  description?: string;
  storyTitle?: string;
  storyDescription?: string;
  price?: string;
  customTitle?: string;
  customText?: string;
};

type HeroImageFrameProps = {
  imageUrl?: string;
  placeholder?: string;
  alt: string;
  mode?: HeroContentMode;
  overlayFields?: OverlayField[];
  content: OverlayContent;
  aspectClass?: string;
  className?: string;
  compact?: boolean;
};

const defaultOverlayFields: OverlayField[] = ["name", "taste_note", "price"];

function FallbackVisual({ placeholder }: { placeholder?: string }) {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,248,237,0.94),transparent_35%),linear-gradient(135deg,#ead9c2,#8f5c39)]">
      {placeholder ? (
        <div className="absolute inset-x-5 bottom-5 rounded-lg border border-[#fff8ed]/36 bg-[#2b1a12]/58 px-4 py-3 text-[#fff8ed] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e7caa7]">
            {placeholder}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function overlayLine(field: OverlayField, content: OverlayContent) {
  switch (field) {
    case "name":
      return content.name;
    case "taste_note":
      return content.tasteNote;
    case "description":
      return content.description;
    case "story_title":
      return content.storyTitle;
    case "story_description":
      return content.storyDescription;
    case "price":
      return content.price;
    default:
      return undefined;
  }
}

export function HeroImageFrame({
  imageUrl,
  placeholder,
  alt,
  mode = "image_with_menu_info",
  overlayFields = defaultOverlayFields,
  content,
  aspectClass = "aspect-[4/3]",
  className = "",
  compact = false,
}: HeroImageFrameProps) {
  const showCustom = mode === "custom_overlay";
  const showMenuInfo = mode === "image_with_menu_info";
  const selectedLines = overlayFields
    .map((field) => overlayLine(field, content))
    .filter((line): line is string => Boolean(line));

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {imageUrl ? (
        <img alt={alt} src={imageUrl} className="h-full w-full object-cover" />
      ) : (
        <FallbackVisual placeholder={placeholder} />
      )}

      {showCustom && (content.customTitle || content.customText) ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241710]/88 via-[#241710]/48 to-transparent p-4 pt-16 text-[#fff8ed] sm:p-6 sm:pt-20">
          {content.customTitle ? (
            <p
              className={
                compact
                  ? "text-lg font-semibold leading-tight"
                  : "text-2xl font-semibold leading-tight sm:text-3xl"
              }
            >
              {content.customTitle}
            </p>
          ) : null}
          {content.customText ? (
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#ead9c2]">
              {content.customText}
            </p>
          ) : null}
        </div>
      ) : null}

      {showMenuInfo && selectedLines.length > 0 ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241710]/88 via-[#241710]/48 to-transparent p-4 pt-16 text-[#fff8ed] sm:p-6 sm:pt-20">
          {selectedLines.slice(0, compact ? 3 : 5).map((line, index) =>
            index === 0 ? (
              <p
                key={`${line}-${index}`}
                className={
                  compact
                    ? "text-lg font-semibold leading-tight"
                    : "text-2xl font-semibold leading-tight sm:text-3xl"
                }
              >
                {line}
              </p>
            ) : (
              <p
                key={`${line}-${index}`}
                className="mt-2 max-w-xl text-sm leading-6 text-[#ead9c2]"
              >
                {line}
              </p>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
