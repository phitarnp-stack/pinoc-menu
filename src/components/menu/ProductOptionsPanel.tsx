"use client";

import { BilingualLabel } from "@/src/components/language/BilingualLabel";
import { EducationHint } from "@/src/components/language/EducationHint";
import {
  DisplayModeToggle,
  useDisplayMode,
} from "@/src/components/language/DisplayModeToggle";
import { explainTerm, fieldExplanations } from "@/src/lib/menu/education";
import type { MenuItemProduct, Product } from "@/src/types/menu";

type LinkedProduct = {
  mapping: MenuItemProduct;
  product: Product;
};

type ProductOptionsPanelProps = {
  linkedProducts: LinkedProduct[];
};

const formatAvailability = (product: Product) => {
  if (!product.isSeasonal && !product.availableFrom && !product.availableUntil) {
    return "Ongoing";
  }

  return `${product.availableFrom ?? "Now"} - ${
    product.availableUntil ?? "Open"
  }`;
};

const isProductFieldVisible = (
  product: Product,
  field: keyof NonNullable<Product["publicFieldVisibility"]>,
) => product.publicFieldVisibility?.[field] ?? true;

const productLocation = (product: Product) =>
  [
    isProductFieldVisible(product, "origin") ? product.origin : undefined,
    isProductFieldVisible(product, "region") ? product.region : undefined,
  ]
    .filter(Boolean)
    .join(", ");

function DetailField({
  english,
  thai,
  value,
  explanation,
  wide = false,
}: {
  english: string;
  thai: string;
  value: string | undefined;
  explanation?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <p className="font-semibold text-[#241710]">
        <BilingualLabel english={english} thai={thai} compact />
        {explanation ? <EducationHint text={explanation} /> : null}
      </p>
      <p className="mt-1">{value || "Not listed"}</p>
      {explanation ? (
        <p className="mt-1 text-xs leading-5 text-[#8a6a55]">{explanation}</p>
      ) : null}
    </div>
  );
}

export function ProductOptionsPanel({
  linkedProducts,
}: ProductOptionsPanelProps) {
  const [mode, setMode] = useDisplayMode();

  if (linkedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-[#3d2618]/10 pt-8">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d4d2f]">
            <BilingualLabel english="Product Options" thai="ตัวเลือกวัตถุดิบ" />
          </p>
          <p className="mt-3 text-sm leading-7 text-[#5f4635]">
            Simple Mode keeps the story easy. Expert Mode opens the coffee-geek
            details when you want them.
          </p>
        </div>
        <DisplayModeToggle value={mode} onChange={setMode} />
      </div>

      <div className="mt-4 grid gap-3">
        {linkedProducts.map(({ mapping, product }) => (
          <div
            key={mapping.id}
            className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/70 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                {productLocation(product) ? (
                  <p className="mt-1 text-sm text-[#5f4635]">
                    {productLocation(product)}
                  </p>
                ) : null}
              </div>
              {mode === "expert" &&
              product.roastLevel &&
              isProductFieldVisible(product, "roastLevel") ? (
                <span className="rounded-full bg-[#2b1a12] px-3 py-1 text-xs font-semibold text-[#fff8ed]">
                  {product.roastLevel}
                </span>
              ) : null}
            </div>

            {product.imageUrl ? (
              <img
                alt={product.name}
                src={product.imageUrl}
                className="mt-4 aspect-[4/3] w-full rounded-lg object-cover"
              />
            ) : null}

            <div className="mt-4 grid gap-3 text-sm leading-6 text-[#5f4635]">
              <DetailField
                english="Flavor"
                thai="รสชาติที่สัมผัสได้"
                value={product.flavorNotes.join(", ")}
                explanation="อ่านเป็นภาพรวมของรสชาติ ไม่จำเป็นต้องรู้สึกครบทุกคำ"
              />
              <DetailField
                english="Feeling"
                thai="ความรู้สึกของแก้วนี้"
                value={product.description}
              />
              {isProductFieldVisible(product, "availableFor") ? (
                <DetailField
                  english="Recommended For"
                  thai="เหมาะสำหรับ"
                  value={product.availableFor}
                  explanation={fieldExplanations.availableFor}
                />
              ) : null}
              {isProductFieldVisible(product, "brewRecommendation") ? (
                <DetailField
                  english="Pairing / Brew"
                  thai="วิธีดื่มที่เหมาะ"
                  value={product.brewRecommendation}
                  explanation={fieldExplanations.brewRecommendation}
                />
              ) : null}
            </div>

            {mode === "expert" ? (
              <div className="mt-4 grid gap-3 border-t border-[#3d2618]/10 pt-4 text-sm leading-6 text-[#5f4635] sm:grid-cols-2">
                {isProductFieldVisible(product, "producer") ? (
                  <DetailField
                    english="Producer / Farm"
                    thai="ผู้ปลูก / ฟาร์ม"
                    value={product.producer}
                    explanation={fieldExplanations.producer}
                  />
                ) : null}
                {isProductFieldVisible(product, "origin") ? (
                  <DetailField
                    english="Origin"
                    thai="แหล่งที่มา"
                    value={product.origin}
                    explanation={fieldExplanations.origin}
                  />
                ) : null}
                {isProductFieldVisible(product, "region") ? (
                  <DetailField
                    english="Region"
                    thai="ภูมิภาค"
                    value={product.region}
                    explanation={fieldExplanations.region}
                  />
                ) : null}
                {isProductFieldVisible(product, "altitude") ? (
                  <DetailField
                    english="Altitude"
                    thai="ระดับความสูง"
                    value={product.altitude}
                    explanation={fieldExplanations.altitude}
                  />
                ) : null}
                {isProductFieldVisible(product, "variety") ? (
                  <DetailField
                    english="Variety"
                    thai="สายพันธุ์"
                    value={product.variety}
                    explanation={
                      explainTerm(product.variety) ?? fieldExplanations.variety
                    }
                  />
                ) : null}
                {isProductFieldVisible(product, "process") ? (
                  <DetailField
                    english="Process"
                    thai="วิธีแปรรูป"
                    value={product.process}
                    explanation={
                      explainTerm(product.process) ?? fieldExplanations.process
                    }
                  />
                ) : null}
                {isProductFieldVisible(product, "roastLevel") ? (
                  <DetailField
                    english="Roast Level"
                    thai="ระดับการคั่ว"
                    value={product.roastLevel}
                    explanation={fieldExplanations.roastLevel}
                  />
                ) : null}
                {isProductFieldVisible(product, "seasonalAvailability") ? (
                  <DetailField
                    english="Seasonal Availability"
                    thai="ช่วงเวลาที่มี"
                    value={formatAvailability(product)}
                    explanation={fieldExplanations.seasonalAvailability}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
