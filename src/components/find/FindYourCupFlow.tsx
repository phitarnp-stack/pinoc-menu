"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  MenuCategory,
  MenuItem,
  RecommendationAdventureLevel,
  RecommendationDrinkType,
  RecommendationFeelingTag,
} from "@/src/types/menu";

type FindYourCupFlowProps = {
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
};

type FeelingChoice = RecommendationFeelingTag | "surprise";

type AdventureChoice = RecommendationAdventureLevel;
type MoodChoice = RecommendationDrinkType;

type Step = 1 | 2 | 3 | 4;

const moodOptions: {
  value: MoodChoice;
  label: string;
  thai: string;
  categoryHints: string[];
}[] = [
  {
    value: "coffee",
    label: "Coffee",
    thai: "กาแฟดำ",
    categoryHints: ["classic-coffee", "filter-coffee"],
  },
  {
    value: "milk_coffee",
    label: "Milk Coffee",
    thai: "กาแฟนม",
    categoryHints: ["classic-coffee"],
  },
  { value: "matcha", label: "Matcha", thai: "มัทฉะ", categoryHints: ["matcha"] },
  {
    value: "craft_cocoa",
    label: "Craft Cocoa",
    thai: "โกโก้พิเศษ",
    categoryHints: ["craft-cocoa"],
  },
  {
    value: "non_coffee",
    label: "Non Coffee",
    thai: "ไม่มีกาแฟ",
    categoryHints: ["matcha", "craft-cocoa", "special"],
  },
  {
    value: "cold_brew",
    label: "Cold Brew",
    thai: "สกัดเย็น",
    categoryHints: ["special", "filter-coffee"],
  },
];

const feelingOptions: {
  value: FeelingChoice;
  label: string;
  thai: string;
  keywords: string[];
  reason: string;
}[] = [
  {
    value: "light_refreshing",
    label: "Light & Refreshing",
    thai: "☀️ สดชื่น เบาสบาย",
    keywords: ["refreshing", "tea", "jasmine", "citrus", "mandarin", "orange"],
    reason: "แก้วนี้น่าจะให้ความรู้สึกเบา สดชื่น และดื่มง่าย",
  },
  {
    value: "bright_fruity",
    label: "Bright & Fruity",
    thai: "🍓 หอมผลไม้ สดใส",
    keywords: ["fruit", "strawberry", "peach", "apple", "orange", "juicy"],
    reason: "แก้วนี้มีโทนผลไม้หรือความสดใสที่เข้ากับอารมณ์วันนี้",
  },
  {
    value: "deep_chocolatey",
    label: "Deep & Chocolatey",
    thai: "🍫 เข้มข้น อบอุ่น",
    keywords: ["cocoa", "cacao", "chocolate", "malt", "molasses"],
    reason: "แก้วนี้ให้โทนเข้ม อบอุ่น หรือช็อกโกแลตชัดขึ้น",
  },
  {
    value: "creamy_smooth",
    label: "Creamy & Smooth",
    thai: "🥛 นุ่มละมุน",
    keywords: ["cream", "creamy", "milk", "latte", "smooth"],
    reason: "แก้วนี้เน้นสัมผัสนุ่ม ละมุน และดื่มสบาย",
  },
  {
    value: "clean_delicate",
    label: "Clean & Delicate",
    thai: "🌿 สะอาด สบาย",
    keywords: ["clean", "tea", "floral", "jasmine", "delicate", "washed"],
    reason: "แก้วนี้ให้ความรู้สึกสะอาด โปร่ง และไม่หนักเกินไป",
  },
  {
    value: "surprise",
    label: "Surprise Me",
    thai: "🎲 เซอร์ไพรส์ฉันเลย",
    keywords: [],
    reason: "ให้ Pinoc เลือกแก้วที่น่าสนใจจากเมนูวันนี้ให้คุณ",
  },
];

const adventureOptions: { value: AdventureChoice; label: string; thai: string }[] = [
  { value: "familiar", label: "Familiar", thai: "คุ้นเคย ดื่มง่าย" },
  { value: "curious", label: "Curious", thai: "ขอลองอะไรใหม่นิดหน่อย" },
  { value: "adventurous", label: "Adventurous", thai: "จัดมาเลย" },
];

const categoryName = (categories: MenuCategory[], categoryId: string) =>
  categories.find((category) => category.id === categoryId)?.name ?? categoryId;

const categorySlug = (categories: MenuCategory[], categoryId: string) =>
  categories.find((category) => category.id === categoryId)?.slug ?? categoryId;

const optionLabel = <Value extends string>(
  options: { label: string; value: Value }[],
  value: Value | undefined | null,
) => options.find((option) => option.value === value)?.label ?? value;

const matchSummary = (
  mood: MoodChoice | null,
  feeling: FeelingChoice | null,
  adventure: AdventureChoice | null,
) =>
  [
    optionLabel(moodOptions, mood),
    optionLabel(feelingOptions, feeling),
    optionLabel(adventureOptions, adventure),
  ]
    .filter(Boolean)
    .join(" + ");

const itemText = (item: MenuItem) =>
  [
    item.name,
    item.description,
    item.recommendedFor,
    item.flavorNotes.join(" "),
  ]
    .join(" ")
    .toLowerCase();

const scoreItem = (
  item: MenuItem,
  mood: MoodChoice,
  feeling: FeelingChoice,
  adventure: AdventureChoice,
) => {
  const moodOption = moodOptions.find((option) => option.value === mood);
  const feelingOption = feelingOptions.find((option) => option.value === feeling);
  const text = itemText(item);
  let score = 0;

  if (item.drinkType === mood) {
    score += 10;
  } else if (!item.drinkType && moodOption?.categoryHints.includes(item.categoryId)) {
    score += 5;
  }

  if (feeling !== "surprise" && item.feelingTags?.includes(feeling)) {
    score += 6;
  } else {
    for (const keyword of feelingOption?.keywords ?? []) {
      if (text.includes(keyword)) {
        score += 2;
      }
    }
  }

  if (item.adventureLevel === adventure) {
    score += 5;
  } else if (!item.adventureLevel) {
    if (adventure === "familiar" && item.categoryId === "classic-coffee") {
      score += 2;
    }

    if (adventure === "curious" && item.isSeasonal) {
      score += 2;
    }

    if (adventure === "adventurous" && item.categoryId === "special") {
      score += 3;
    }
  }

  return score;
};

export function FindYourCupFlow({
  menuItems,
  menuCategories,
}: FindYourCupFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState<MoodChoice | null>(null);
  const [feeling, setFeeling] = useState<FeelingChoice | null>(null);
  const [adventure, setAdventure] = useState<AdventureChoice | null>(null);

  const recommendations = useMemo(() => {
    if (!mood || !feeling || !adventure) {
      return [];
    }

    return menuItems
      .filter((item) => item.isActive)
      .map((item) => ({
        item,
        score: scoreItem(item, mood, feeling, adventure),
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, 3)
      .map(({ item }) => item);
  }, [adventure, feeling, menuItems, mood]);

  const selectedFeeling = feelingOptions.find(
    (option) => option.value === feeling,
  );
  const selectedSummary = matchSummary(mood, feeling, adventure);

  const startAgain = () => {
    setMood(null);
    setFeeling(null);
    setAdventure(null);
    setStep(1);
  };

  return (
    <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-5 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur sm:p-7">
      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
          Step {step} of 4
          <span className="ml-2 tracking-normal text-[#8a6a55]">
            ขั้นที่ {step}
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
        <div>
          <h2 className="text-2xl font-semibold">
            วันนี้คุณอยากดื่มอะไร?
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setMood(option.value);
                  setStep(2);
                }}
                className="min-h-14 rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/62 px-4 text-left text-sm font-semibold text-[#241710] transition hover:border-[#7d4d2f]/40 hover:bg-[#fff8ed]"
              >
                <span className="grid gap-1">
                  <span className="text-base">{option.thai}</span>
                  <span className="text-xs text-[#8a6a55]">{option.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <h2 className="text-2xl font-semibold">
            วันนี้คุณอยากได้ความรู้สึกแบบไหน?
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {feelingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFeeling(option.value);
                  setStep(3);
                }}
                className="min-h-14 rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/62 px-4 text-left text-sm font-semibold text-[#241710] transition hover:border-[#7d4d2f]/40 hover:bg-[#fff8ed]"
              >
                <span className="grid gap-1">
                  <span className="text-base">{option.thai}</span>
                  <span className="text-xs text-[#8a6a55]">{option.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div>
          <h2 className="text-2xl font-semibold">
            วันนี้อยากลองอะไรใหม่แค่ไหน?
          </h2>
          <div className="mt-6 grid gap-3">
            {adventureOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setAdventure(option.value);
                  setStep(4);
                }}
                className="min-h-14 rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/62 px-4 text-left text-sm font-semibold text-[#241710] transition hover:border-[#7d4d2f]/40 hover:bg-[#fff8ed]"
              >
                <span className="grid gap-1">
                  <span className="text-base">{option.thai}</span>
                  <span className="text-xs text-[#8a6a55]">{option.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div>
          <h2 className="text-2xl font-semibold">
            แก้วที่น่าจะเข้ากับคุณวันนี้
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#5f4635]">
            {selectedFeeling?.reason ?? "คำแนะนำเบา ๆ จากเมนู Pinoc วันนี้"}
          </p>

          <div className="mt-6 grid gap-4">
            {recommendations.length > 0 ? recommendations.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/66 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                  {categoryName(menuCategories, item.categoryId)}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                  {item.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-[#7d4d2f]">
                  {item.flavorNotes.slice(0, 4).join(", ")}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                  <span className="font-semibold text-[#241710]">
                    ทำไมถึงแนะนำ:
                  </span>{" "}
                  Recommended because you selected {selectedSummary}.{" "}
                  {item.drinkType === mood &&
                  feeling !== null &&
                  feeling !== "surprise" &&
                  item.feelingTags?.includes(feeling) &&
                  item.adventureLevel === adventure
                    ? "This menu item matches all three preferences."
                    : (selectedFeeling?.reason ??
                      "It matches the direction you chose today.")}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/menu/${categorySlug(menuCategories, item.categoryId)}/${item.slug}`}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed]"
                  >
                    ดูเมนูนี้
                  </Link>
                  <button
                    type="button"
                    onClick={startAgain}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635]"
                  >
                    เริ่มใหม่
                  </button>
                </div>
              </article>
            )) : (
              <div className="rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/66 p-5">
                <p className="text-sm leading-7 text-[#5f4635]">
                  วันนี้ระบบยังหาแก้วที่ตรงที่สุดไม่เจอ ลองดูเมนูทั้งหมดได้เลย
                  แล้วให้ทีม Pinoc ช่วยแนะนำต่อได้
                </p>
                <Link
                  href="/menu"
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed]"
                >
                  ดูเมนูทั้งหมด
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
