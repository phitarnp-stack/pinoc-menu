"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  MenuCategory,
  MenuItem,
  RecommendationAdventureLevel,
  RecommendationComfortLevel,
  RecommendationDrinkType,
  RecommendationFlavorPreference,
  RecommendationFeelingTag,
} from "@/src/types/menu";

type FindYourCupFlowProps = {
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
};

type MoodChoice =
  | "freshness"
  | "comfort"
  | "richness"
  | "smoothness"
  | "discovery";
type BeginChoice = RecommendationDrinkType | "not_sure";
type Step = 1 | 2 | 3 | 4 | 5 | "reveal" | "result";

const moodOptions: {
  value: MoodChoice;
  label: string;
  thai: string;
  feelingTags: RecommendationFeelingTag[];
  keywords: string[];
}[] = [
  {
    value: "freshness",
    label: "Freshness",
    thai: "🌿 สดชื่น",
    feelingTags: ["light_refreshing", "clean_delicate"],
    keywords: ["refreshing", "clean", "tea", "citrus", "sparkling"],
  },
  {
    value: "comfort",
    label: "Comfort",
    thai: "🤍 สบายใจ",
    feelingTags: ["creamy_smooth"],
    keywords: ["comfort", "milk", "latte", "cream", "caramel"],
  },
  {
    value: "richness",
    label: "Richness",
    thai: "🍫 เข้มข้น",
    feelingTags: ["deep_chocolatey", "bold_intense"],
    keywords: ["cocoa", "chocolate", "malt", "molasses", "bold"],
  },
  {
    value: "smoothness",
    label: "Smoothness",
    thai: "🍯 นุ่มลื่น",
    feelingTags: ["creamy_smooth", "clean_delicate"],
    keywords: ["smooth", "honey", "sweet", "cream", "silky"],
  },
  {
    value: "discovery",
    label: "Discovery",
    thai: "✨ อยากค้นพบ",
    feelingTags: ["bright_fruity", "clean_delicate"],
    keywords: ["seasonal", "floral", "fruit", "origin", "special"],
  },
];

const adventureOptions: {
  value: RecommendationAdventureLevel;
  label: string;
  thai: string;
}[] = [
  { value: "familiar", label: "Safe", thai: "🛟 คุ้นเคย" },
  { value: "curious", label: "Open to something new", thai: "🌤️ ลองใหม่ได้นิดหน่อย" },
  { value: "adventurous", label: "Surprise me", thai: "🚀 เซอร์ไพรส์ฉันเลย" },
];

const beginOptions: {
  value: BeginChoice;
  label: string;
  thai: string;
  categoryHints: string[];
}[] = [
  { value: "coffee", label: "Coffee", thai: "☕ Coffee", categoryHints: ["classic-coffee", "filter-coffee"] },
  { value: "milk_coffee", label: "Milk Coffee", thai: "🥛 Milk Coffee", categoryHints: ["classic-coffee"] },
  { value: "matcha", label: "Matcha", thai: "🍵 Matcha", categoryHints: ["matcha"] },
  { value: "craft_cocoa", label: "Craft Cocoa", thai: "🍫 Craft Cocoa", categoryHints: ["craft-cocoa"] },
  { value: "not_sure", label: "I’m not sure", thai: "🤔 ยังไม่แน่ใจ", categoryHints: ["special"] },
];

const flavorOptions: {
  value: RecommendationFlavorPreference;
  label: string;
  thai: string;
  keywords: string[];
}[] = [
  { value: "fruity", label: "Fruity", thai: "🍓 Fruity", keywords: ["fruit", "strawberry", "peach", "apple", "cherry", "juicy"] },
  { value: "citrus", label: "Citrus", thai: "🍊 Citrus", keywords: ["citrus", "orange", "mandarin", "lemon"] },
  { value: "floral", label: "Floral", thai: "🌸 Floral", keywords: ["floral", "jasmine", "blossom", "rose"] },
  { value: "chocolatey", label: "Chocolatey", thai: "🍫 Chocolatey", keywords: ["cocoa", "cacao", "chocolate", "malt"] },
  { value: "nutty", label: "Nutty", thai: "🥜 Nutty", keywords: ["nut", "almond", "hazelnut", "macadamia"] },
  { value: "sweet_smooth", label: "Sweet & Smooth", thai: "🍯 Sweet & Smooth", keywords: ["sweet", "honey", "caramel", "smooth", "cream"] },
];

const destinationOptions: {
  value: RecommendationComfortLevel;
  label: string;
  thai: string;
}[] = [
  { value: "comfort_zone", label: "Comfort Zone", thai: "😌 Comfort Zone" },
  { value: "something_new", label: "Something New", thai: "🌱 Something New" },
  { value: "explore_origin", label: "Explore Origin", thai: "🌍 Explore Origin" },
  { value: "surprise_me", label: "Surprise Me", thai: "🎨 Surprise Me" },
];

const categoryName = (categories: MenuCategory[], categoryId: string) =>
  categories.find((category) => category.id === categoryId)?.name ?? categoryId;

const categorySlug = (categories: MenuCategory[], categoryId: string) =>
  categories.find((category) => category.id === categoryId)?.slug ?? categoryId;

const optionLabel = <Value extends string>(
  options: { label: string; value: Value }[],
  value: Value | undefined | null,
) => options.find((option) => option.value === value)?.label ?? value;

const itemText = (item: MenuItem) =>
  [
    item.name,
    item.description,
    item.recommendedFor,
    item.flavorNotes.join(" "),
  ]
    .join(" ")
    .toLowerCase();

const scoreKeywordMatch = (text: string, keywords: string[], value = 2) =>
  keywords.reduce((score, keyword) => score + (text.includes(keyword) ? value : 0), 0);

const scoreItem = (
  item: MenuItem,
  mood: MoodChoice,
  adventure: RecommendationAdventureLevel,
  begin: BeginChoice,
  flavor: RecommendationFlavorPreference,
  destination: RecommendationComfortLevel,
) => {
  const moodOption = moodOptions.find((option) => option.value === mood);
  const beginOption = beginOptions.find((option) => option.value === begin);
  const flavorOption = flavorOptions.find((option) => option.value === flavor);
  const text = itemText(item);
  let score = 0;

  if (begin !== "not_sure" && item.drinkType === begin) {
    score += 12;
  } else if (
    begin !== "not_sure" &&
    !item.drinkType &&
    beginOption?.categoryHints.includes(item.categoryId)
  ) {
    score += 6;
  } else if (begin === "not_sure" && item.categoryId === "special") {
    score += 4;
  }

  if (moodOption?.feelingTags.some((tag) => item.feelingTags?.includes(tag))) {
    score += 7;
  } else {
    score += scoreKeywordMatch(text, moodOption?.keywords ?? []);
  }

  if (item.adventureLevel === adventure) {
    score += 6;
  } else if (!item.adventureLevel) {
    if (adventure === "familiar" && item.categoryId === "classic-coffee") {
      score += 3;
    }

    if (adventure === "curious" && item.isSeasonal) {
      score += 3;
    }

    if (adventure === "adventurous" && item.categoryId === "special") {
      score += 4;
    }
  }

  if (item.flavorPreferences?.includes(flavor)) {
    score += 6;
  } else {
    score += scoreKeywordMatch(text, flavorOption?.keywords ?? []);
  }

  if (item.comfortLevel === destination) {
    score += 4;
  } else if (!item.comfortLevel) {
    if (destination === "comfort_zone" && item.categoryId === "classic-coffee") {
      score += 2;
    }

    if (destination === "explore_origin" && item.categoryId === "filter-coffee") {
      score += 3;
    }

    if (destination === "surprise_me" && item.categoryId === "special") {
      score += 3;
    }
  }

  return score;
};

const createReason = (
  item: MenuItem,
  mood: MoodChoice | null,
  adventure: RecommendationAdventureLevel | null,
  begin: BeginChoice | null,
  flavor: RecommendationFlavorPreference | null,
  destination: RecommendationComfortLevel | null,
) => {
  const selected = [
    optionLabel(moodOptions, mood),
    optionLabel(adventureOptions, adventure),
    optionLabel(beginOptions, begin),
    optionLabel(flavorOptions, flavor),
    optionLabel(destinationOptions, destination),
  ]
    .filter(Boolean)
    .join(" + ");

  const matched = [
    begin && begin !== "not_sure" && item.drinkType === begin ? "drink direction" : "",
    flavor && item.flavorPreferences?.includes(flavor) ? "flavor profile" : "",
    adventure && item.adventureLevel === adventure ? "adventure level" : "",
    destination && item.comfortLevel === destination ? "journey mood" : "",
  ].filter(Boolean);

  return matched.length > 0
    ? `Recommended because you selected ${selected}. This cup matches your ${matched.join(", ")}.`
    : `Recommended because you selected ${selected}. It follows the mood of your answers using today’s Pinoc menu.`;
};

export function FindYourCupFlow({
  menuItems,
  menuCategories,
}: FindYourCupFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState<MoodChoice | null>(null);
  const [adventure, setAdventure] =
    useState<RecommendationAdventureLevel | null>(null);
  const [begin, setBegin] = useState<BeginChoice | null>(null);
  const [flavor, setFlavor] =
    useState<RecommendationFlavorPreference | null>(null);
  const [destination, setDestination] =
    useState<RecommendationComfortLevel | null>(null);

  const recommendations = useMemo(() => {
    if (!mood || !adventure || !begin || !flavor || !destination) {
      return [];
    }

    return menuItems
      .filter((item) => item.isActive)
      .map((item) => ({
        item,
        score: scoreItem(item, mood, adventure, begin, flavor, destination),
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, 3)
      .map(({ item }) => item);
  }, [adventure, begin, destination, flavor, menuItems, mood]);

  const startAgain = () => {
    setMood(null);
    setAdventure(null);
    setBegin(null);
    setFlavor(null);
    setDestination(null);
    setStep(1);
  };

  const revealResults = (nextDestination: RecommendationComfortLevel) => {
    setDestination(nextDestination);
    setStep("reveal");
    window.setTimeout(() => setStep("result"), 850);
  };

  const primary = recommendations[0];
  const secondary = recommendations.slice(1);

  return (
    <div className="rounded-[1.25rem] border border-[#3d2618]/10 bg-[#fff8ed]/52 p-5 shadow-[0_14px_42px_rgba(84,55,34,0.1)] backdrop-blur sm:p-7">
      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
          {typeof step === "number" ? `Step ${step} of 5` : "Your Cup Today"}
          <span className="ml-2 tracking-normal text-[#8a6a55]">
            ให้ Pinoc ช่วยเลือกแก้ววันนี้
          </span>
        </p>
        <button
          type="button"
          onClick={startAgain}
          className="text-sm font-semibold text-[#5f4635] transition hover:text-[#2b1a12]"
        >
          เริ่มใหม่
        </button>
      </div>

      {step === 1 ? (
        <ChoiceStep
          title="วันนี้คุณกำลังมองหาอะไร?"
          subtitle="Let’s begin with the feeling, not the technical words."
          options={moodOptions}
          onSelect={(value) => {
            setMood(value);
            setStep(2);
          }}
        />
      ) : null}

      {step === 2 ? (
        <ChoiceStep
          title="วันนี้อยากเปิดใจแค่ไหน?"
          subtitle="A familiar cup, a small discovery, or something more expressive."
          options={adventureOptions}
          onSelect={(value) => {
            setAdventure(value);
            setStep(3);
          }}
        />
      ) : null}

      {step === 3 ? (
        <ChoiceStep
          title="อยากเริ่มจากหมวดไหน?"
          subtitle="Choose a direction, or let Pinoc keep it open."
          options={beginOptions}
          onSelect={(value) => {
            setBegin(value);
            setStep(4);
          }}
        />
      ) : null}

      {step === 4 ? (
        <ChoiceStep
          title="รสชาติแบบไหนที่ดึงดูดคุณ?"
          subtitle="A soft hint is enough. The barista will translate it."
          options={flavorOptions}
          onSelect={(value) => {
            setFlavor(value);
            setStep(5);
          }}
        />
      ) : null}

      {step === 5 ? (
        <ChoiceStep
          title="อยากให้แก้วนี้พาคุณไปที่ไหน?"
          subtitle="Comfort, curiosity, origin, or a small surprise."
          options={destinationOptions}
          onSelect={revealResults}
        />
      ) : null}

      {step === "reveal" ? (
        <div className="grid min-h-72 place-items-center text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
              Finding your cup
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              กำลังหาแก้วที่เข้ากับวันนี้...
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#5f4635]">
              We are matching your mood with the Pinoc menu.
            </p>
          </div>
        </div>
      ) : null}

      {step === "result" ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
            Your Cup Today
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            แก้วที่น่าจะเหมาะกับคุณวันนี้
          </h2>

          {primary ? (
            <article className="mt-7 overflow-hidden rounded-[1.25rem] border border-[#3d2618]/10 bg-[#f6efe6]/62 shadow-[0_18px_48px_rgba(84,55,34,0.08)]">
              {primary.imageUrl ? (
                <img
                  alt={primary.name}
                  src={primary.imageUrl}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : null}
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                  Barista recommendation /{" "}
                  {categoryName(menuCategories, primary.categoryId)}
                </p>
                <h3 className="mt-4 text-4xl font-semibold leading-tight">
                  {primary.name}
                </h3>
                <p className="mt-5 text-base leading-8 text-[#5f4635]">
                  {primary.description}
                </p>
                <div className="mt-6 rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/48 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                    Why this cup fits today
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                    {createReason(
                      primary,
                      mood,
                      adventure,
                      begin,
                      flavor,
                      destination,
                    )}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {primary.flavorNotes.slice(0, 4).map((note) => (
                    <span
                      key={note}
                      className="rounded-full bg-[#7d4d2f]/12 px-3 py-1 text-xs font-semibold text-[#7d4d2f]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold text-[#241710]">
                  ฿{primary.price}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/menu/${categorySlug(menuCategories, primary.categoryId)}/${primary.slug}`}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed]"
                  >
                    Read the Story
                  </Link>
                  <button
                    type="button"
                    onClick={startAgain}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635]"
                  >
                    Start Again
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="mt-7 rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/70 p-5">
              <p className="text-sm leading-7 text-[#5f4635]">
                วันนี้ระบบยังหาแก้วที่ตรงที่สุดไม่เจอ ลองดูเมนูทั้งหมดได้เลย
                แล้วให้ทีม Pinoc ช่วยแนะนำต่อได้
              </p>
              <Link
                href="/menu"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed]"
              >
                Explore Menu
              </Link>
            </div>
          )}

          {secondary.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-xl font-semibold">Other gentle directions</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {secondary.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/62 p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                      {categoryName(menuCategories, item.categoryId)}
                    </p>
                    <h4 className="mt-3 text-xl font-semibold">{item.name}</h4>
                    <p className="mt-3 text-sm leading-6 text-[#5f4635]">
                      {item.flavorNotes.slice(0, 3).join(", ")}
                    </p>
                    <Link
                      href={`/menu/${categorySlug(menuCategories, item.categoryId)}/${item.slug}`}
                      className="mt-5 inline-flex text-sm font-semibold text-[#7d4d2f]"
                    >
                      Read the Story
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ChoiceStep<Value extends string>({
  title,
  subtitle,
  options,
  onSelect,
}: {
  title: string;
  subtitle: string;
  options: { value: Value; label: string; thai: string }[];
  onSelect: (value: Value) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#5f4635]">{subtitle}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="min-h-16 rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/62 px-4 text-left text-sm font-semibold text-[#241710] transition hover:border-[#7d4d2f]/40 hover:bg-[#fff8ed]"
          >
            <span className="grid gap-1">
              <span className="text-base">{option.thai}</span>
              <span className="text-xs text-[#8a6a55]">{option.label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
