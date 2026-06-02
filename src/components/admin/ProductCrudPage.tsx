"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  publishProductToMenu,
  saveProduct,
  updateProductStatus,
  type ProductMenuCategoryId,
} from "@/src/lib/menu/adminWrites";
import type {
  Product,
  ProductStatus,
  ProductType,
  PublicFieldVisibility,
  RoastLevel,
} from "@/src/types/menu";
import { AdminBackLink } from "./AdminBackLink";
import { ImageUploadField } from "./ImageUploadField";

type ProductCrudPageProps = {
  title: string;
  description: string;
  initialProducts: Product[];
  defaultProductType: ProductType;
};

type ProductFormState = {
  name: string;
  productType: ProductType;
  status: ProductStatus;
  price: string;
  description: string;
  flavorNotes: string;
  imagePlaceholder: string;
  imageUrl: string;
  availableFor: string;
  isHouseBlend: "yes" | "no";
  houseBlendOrder: string;
  houseBlendLabel: string;
  origin: string;
  region: string;
  producer: string;
  batchNumber: string;
  season: string;
  percent: string;
  altitude: string;
  variety: string;
  process: string;
  roastLevel: RoastLevel;
  brewRecommendation: string;
  isSeasonal: "yes" | "no";
  availableFrom: string;
  availableUntil: string;
  publicFieldVisibility: Required<PublicFieldVisibility>;
};

const productTypes: { label: string; value: ProductType }[] = [
  { label: "Coffee Beans", value: "coffee_bean" },
  { label: "Craft Cocoa", value: "craft_cocoa" },
  { label: "Matcha", value: "matcha" },
];

const roastLevels: RoastLevel[] = [
  "Light",
  "Medium-Light",
  "Medium",
  "Medium-Dark",
];

const availableForOptions = [
  "Americano",
  "Latte",
  "Cappuccino",
  "Filter Coffee",
  "Cold Brew",
  "Signature Coffee",
  "Matcha Latte",
  "Cocoa Latte",
];

const coffeeMenuCategoryOptions: {
  label: string;
  value: ProductMenuCategoryId;
}[] = [
  { label: "Filter Coffee", value: "filter-coffee" },
  { label: "Classic Coffee", value: "classic-coffee" },
  { label: "Special", value: "special" },
];

const productVisibilityDefaults: Record<
  ProductType,
  Required<PublicFieldVisibility>
> = {
  coffee_bean: {
    origin: true,
    producer: true,
    region: true,
    altitude: true,
    variety: true,
    process: true,
    roastLevel: true,
    brewRecommendation: true,
    availableFor: true,
    seasonalAvailability: true,
  },
  matcha: {
    origin: true,
    producer: true,
    region: true,
    altitude: false,
    variety: false,
    process: true,
    roastLevel: false,
    brewRecommendation: true,
    availableFor: true,
    seasonalAvailability: true,
  },
  craft_cocoa: {
    origin: true,
    producer: true,
    region: true,
    altitude: false,
    variety: true,
    process: true,
    roastLevel: false,
    brewRecommendation: false,
    availableFor: true,
    seasonalAvailability: true,
  },
};

const makeDefaultFormState = (
  productType: ProductType,
): ProductFormState => ({
  name: "",
  productType,
  status: "active",
  price: "",
  description: "",
  flavorNotes: "",
  imagePlaceholder: "",
  imageUrl: "",
  availableFor: "",
  isHouseBlend: "no",
  houseBlendOrder: "",
  houseBlendLabel: "",
  origin: "",
  region: "",
  producer: "",
  batchNumber: "",
  season: "",
  percent: "",
  altitude: "",
  variety: "",
  process: "",
  roastLevel: "Medium",
  brewRecommendation: "",
  isSeasonal: "no",
  availableFrom: "",
  availableUntil: "",
  publicFieldVisibility: productVisibilityDefaults[productType],
});

const productTypeLabel = (productType: ProductType) =>
  productTypes.find((item) => item.value === productType)?.label ?? productType;

const normalizeNotes = (notes: string) =>
  notes
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);

const normalizeAvailableFor = (availableFor: string) =>
  availableFor
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const createSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const createId = (name: string) =>
  `product-${createSlug(name)}-${Date.now().toString(36)}`;

const formatPrice = (price: number) => `฿${price}`;

function VisibilityIcon({ isVisible }: { isVisible: boolean }) {
  return isVisible ? (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 12s3.4-6 9-6 9 6 9 6-3.4 6-9 6-9-6-9-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m4 4 16 16M10.7 6.2A9.8 9.8 0 0 1 12 6c5.6 0 9 6 9 6a16.4 16.4 0 0 1-2.2 2.8M7.2 7.5C4.5 9.1 3 12 3 12s3.4 6 9 6c1.4 0 2.7-.4 3.8-.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M10.4 10.6a2.4 2.4 0 0 0 3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function VisibilityFieldHeader({
  label,
  isVisible,
  onToggle,
}: {
  label: string;
  isVisible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        isVisible
          ? "flex w-fit items-center gap-2 text-sm font-semibold text-[#5f4635] transition hover:text-[#2b1a12]"
          : "flex w-fit items-center gap-2 text-sm font-semibold text-[#8b7666] transition hover:text-[#5f4635]"
      }
      aria-pressed={isVisible}
      title={isVisible ? "Visible publicly" : "Hidden publicly"}
    >
      <span>{label}</span>
      <span
        className={
          isVisible
            ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2b1a12] text-[#fff8ed]"
            : "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#3d2618]/14 bg-[#f6efe6]/70 text-[#8b7666]"
        }
      >
        <VisibilityIcon isVisible={isVisible} />
      </span>
    </button>
  );
}

const normalizeVisibility = (
  productType: ProductType,
  visibility?: PublicFieldVisibility,
) => ({
  ...productVisibilityDefaults[productType],
  ...visibility,
});

export function ProductCrudPage({
  title,
  description,
  initialProducts,
  defaultProductType,
}: ProductCrudPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [formState, setFormState] = useState<ProductFormState>(
    makeDefaultFormState(defaultProductType),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "warning" | "error";
    message: string;
  } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [customAvailableFor, setCustomAvailableFor] = useState("");
  const [coffeeMenuCategoryByProductId, setCoffeeMenuCategoryByProductId] =
    useState<Record<string, ProductMenuCategoryId | "">>({});
  const [publishedMenuItems, setPublishedMenuItems] = useState<
    Record<
      string,
      {
        href: string;
        status: "created" | "existing";
      }
    >
  >({});

  const activeCount = useMemo(
    () => products.filter((product) => product.status === "active").length,
    [products],
  );

  const inactiveCount = products.length - activeCount;
  const isEditing = editingId !== null;
  const isCoffeeBeanForm = formState.productType === "coffee_bean";
  const isCraftCocoaForm = formState.productType === "craft_cocoa";
  const [showHouseBlendsOnly, setShowHouseBlendsOnly] = useState(false);
  const visibleProducts = useMemo(
    () =>
      showHouseBlendsOnly
        ? products.filter((product) => product.isHouseBlend)
        : products,
    [products, showHouseBlendsOnly],
  );
  const selectedAvailableFor = useMemo(
    () => normalizeAvailableFor(formState.availableFor),
    [formState.availableFor],
  );
  const availableForChoices = useMemo(
    () =>
      Array.from(
        new Set([
          ...availableForOptions,
          ...products.flatMap((product) =>
            normalizeAvailableFor(product.availableFor),
          ),
          ...selectedAvailableFor,
        ]),
      ).filter(Boolean),
    [products, selectedAvailableFor],
  );

  const updateField = <Key extends keyof ProductFormState>(
    field: Key,
    value: ProductFormState[Key],
  ) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormState(makeDefaultFormState(defaultProductType));
    setCustomAvailableFor("");
  };

  const toggleAvailableFor = (option: string) => {
    const nextOptions = selectedAvailableFor.includes(option)
      ? selectedAvailableFor.filter((item) => item !== option)
      : [...selectedAvailableFor, option];

    updateField("availableFor", nextOptions.join(", "));
  };

  const addCustomAvailableFor = () => {
    const nextOption = customAvailableFor.trim();

    if (!nextOption) {
      return;
    }

    if (!selectedAvailableFor.includes(nextOption)) {
      updateField(
        "availableFor",
        [...selectedAvailableFor, nextOption].join(", "),
      );
    }

    setCustomAvailableFor("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const nextProduct: Product = {
      id: editingId ?? createId(formState.name),
      slug: editingId
        ? products.find((product) => product.id === editingId)?.slug ??
          createSlug(formState.name)
        : createSlug(formState.name),
      name: formState.name.trim(),
      productType: formState.productType,
      status: formState.status,
      price: Number(formState.price),
      description:
        formState.description.trim() ||
        (isCraftCocoaForm
          ? normalizeNotes(formState.flavorNotes).join(", ")
          : ""),
      flavorNotes: normalizeNotes(formState.flavorNotes),
      tasteProfileIds: [],
      imagePlaceholder:
        formState.imagePlaceholder.trim() ||
        formState.name.trim() ||
        productTypeLabel(formState.productType),
      imageUrl: formState.imageUrl.trim() || undefined,
      availableFor:
        formState.availableFor.trim() ||
        (isCraftCocoaForm ? "Cocoa Latte" : ""),
      isHouseBlend:
        formState.productType === "coffee_bean" &&
        formState.isHouseBlend === "yes",
      houseBlendOrder:
        formState.productType === "coffee_bean" &&
        formState.houseBlendOrder.trim()
          ? Number(formState.houseBlendOrder)
          : undefined,
      houseBlendLabel:
        formState.productType === "coffee_bean"
          ? formState.houseBlendLabel.trim() || undefined
          : undefined,
      origin: formState.origin.trim() || undefined,
      region: formState.region.trim() || undefined,
      producer: formState.producer.trim() || undefined,
      batchNumber: formState.batchNumber.trim() || undefined,
      season: formState.season.trim() || undefined,
      percent: formState.percent.trim() || undefined,
      altitude: formState.altitude.trim() || undefined,
      variety: formState.variety.trim() || undefined,
      process: formState.process.trim() || undefined,
      roastLevel: formState.roastLevel,
      brewRecommendation: formState.brewRecommendation.trim() || undefined,
      isSeasonal: formState.isSeasonal === "yes",
      availableFrom: formState.availableFrom || undefined,
      availableUntil: formState.availableUntil || undefined,
      publicFieldVisibility: formState.publicFieldVisibility,
    };

    setPendingId("form");

    try {
      const result = await saveProduct(
        nextProduct,
        editingId ? "edit" : "create",
      );

      if (editingId) {
        setProducts((current) =>
          current.map((product) =>
            product.id === editingId ? nextProduct : product,
          ),
        );
      } else {
        setProducts((current) => [nextProduct, ...current]);
      }

      setFeedback(
        result.source === "mock"
          ? { tone: "warning", message: result.warning ?? "Saved locally." }
          : { tone: "success", message: "Saved to Supabase." },
      );
      resetForm();
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Supabase write failed. Please try again.",
      });
    } finally {
      setPendingId(null);
    }
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setFormState({
      name: product.name,
      productType: product.productType,
      status: product.status,
      price: String(product.price),
      description: product.description,
      flavorNotes: product.flavorNotes.join(", "),
      imagePlaceholder: product.imagePlaceholder,
      imageUrl: product.imageUrl ?? "",
      availableFor: product.availableFor,
      isHouseBlend: product.isHouseBlend ? "yes" : "no",
      houseBlendOrder:
        product.houseBlendOrder !== undefined ? String(product.houseBlendOrder) : "",
      houseBlendLabel: product.houseBlendLabel ?? "",
      origin: product.origin ?? "",
      region: product.region ?? "",
      producer: product.producer ?? "",
      batchNumber: product.batchNumber ?? "",
      season: product.season ?? "",
      percent: product.percent ?? "",
      altitude: product.altitude ?? "",
      variety: product.variety ?? "",
      process: product.process ?? "",
      roastLevel: product.roastLevel ?? "Medium",
      brewRecommendation: product.brewRecommendation ?? "",
      isSeasonal: product.isSeasonal ? "yes" : "no",
      availableFrom: product.availableFrom ?? "",
      availableUntil: product.availableUntil ?? "",
      publicFieldVisibility: normalizeVisibility(
        product.productType,
        product.publicFieldVisibility,
      ),
    });
  };

  const toggleProductStatus = async (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const nextStatus = product.status === "active" ? "inactive" : "active";
    setFeedback(null);
    setPendingId(productId);

    try {
      const result = await updateProductStatus(productId, nextStatus);

      setProducts((current) =>
        current.map((item) =>
          item.id === productId
            ? {
                ...item,
                status: nextStatus,
              }
            : item,
        ),
      );
      setFeedback(
        result.source === "mock"
          ? { tone: "warning", message: result.warning ?? "Saved locally." }
          : { tone: "success", message: "Product status saved to Supabase." },
      );
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Supabase write failed. Please try again.",
      });
    } finally {
      setPendingId(null);
    }
  };

  const handlePublishProduct = async (product: Product) => {
    const pendingPublishId = `publish-${product.id}`;
    const selectedCategoryId =
      coffeeMenuCategoryByProductId[product.id] || undefined;

    setFeedback(null);
    setPendingId(pendingPublishId);

    try {
      const result = await publishProductToMenu(product, selectedCategoryId);

      setPublishedMenuItems((current) => ({
        ...current,
        [product.id]: {
          href: result.menuItemHref,
          status: result.status,
        },
      }));
      setProducts((current) => [...current]);
      setFeedback(
        result.source === "mock"
          ? {
              tone: "warning",
              message:
                result.warning ??
                "Supabase is unavailable, so this menu item was only created locally.",
            }
          : {
              tone: result.status === "existing" ? "warning" : "success",
              message:
                result.status === "existing"
                  ? "Already in menu. No duplicate was created."
                  : "Menu item created and linked to this product.",
            },
      );
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not publish this product to the menu.",
      });
    } finally {
      setPendingId(null);
    }
  };

  const archiveProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Archive ${product.name}? It will be marked inactive and hidden from active product workflows.`,
    );

    if (!confirmed) {
      return;
    }

    if (product.status === "inactive") {
      setFeedback({
        tone: "warning",
        message: "This product is already archived.",
      });
      return;
    }

    await toggleProductStatus(product.id);
  };

  const togglePublicFieldVisibility = (
    field: keyof Required<PublicFieldVisibility>,
  ) => {
    setFormState((current) => ({
      ...current,
      publicFieldVisibility: {
        ...current.publicFieldVisibility,
        [field]: !current.publicFieldVisibility[field],
      },
    }));
  };

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl py-12 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <AdminBackLink label="Back to Products" fallbackHref="/admin/products" />
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#5f4635]">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-80">
              <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-4 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                  Active
                </p>
                <p className="mt-2 text-3xl font-semibold">{activeCount}</p>
              </div>
              <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-4 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                  Inactive
                </p>
                <p className="mt-2 text-3xl font-semibold">{inactiveCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/68 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                    {isEditing ? "Edit Product" : "Add Product"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {isEditing ? "Update details" : `Create ${title}`}
                  </h2>
                </div>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>

              {feedback ? (
                <div
                  className={
                    feedback.tone === "error"
                      ? "mt-5 rounded-lg border border-red-900/20 bg-red-50/70 px-4 py-3 text-sm leading-6 text-red-900"
                      : feedback.tone === "warning"
                        ? "mt-5 rounded-lg border border-[#9a6b39]/25 bg-[#fff8ed]/76 px-4 py-3 text-sm leading-6 text-[#7d4d2f]"
                        : "mt-5 rounded-lg border border-[#2b1a12]/12 bg-[#fff8ed]/76 px-4 py-3 text-sm leading-6 text-[#2b1a12]"
                  }
                >
                  {feedback.message}
                </div>
              ) : null}

              <div className="mt-7 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Name
                  <input
                    required
                    value={formState.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Type
                    <select
                      value={formState.productType}
                      onChange={(event) =>
                        setFormState((current) => {
                          const nextProductType = event.target
                            .value as ProductType;

                          return {
                            ...current,
                            productType: nextProductType,
                            publicFieldVisibility:
                              productVisibilityDefaults[nextProductType],
                          };
                        })
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      {productTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Status
                    <select
                      value={formState.status}
                      onChange={(event) =>
                        updateField("status", event.target.value as ProductStatus)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                </div>

                {isCoffeeBeanForm ? (
                  <div className="grid gap-4 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                        House Blend Settings
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                        Show this bean in the Classic Menu House Blend section.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1fr_0.7fr]">
                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        Is House Blend?
                        <select
                          value={formState.isHouseBlend}
                          onChange={(event) =>
                            updateField(
                              "isHouseBlend",
                              event.target.value as "yes" | "no",
                            )
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </label>

                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        Display Order
                        <input
                          min="0"
                          type="number"
                          value={formState.houseBlendOrder}
                          onChange={(event) =>
                            updateField("houseBlendOrder", event.target.value)
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                          placeholder="1"
                        />
                      </label>
                    </div>

                    <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                      House Blend Label / Short Name
                      <input
                        value={formState.houseBlendLabel}
                        onChange={(event) =>
                          updateField("houseBlendLabel", event.target.value)
                        }
                        className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                        placeholder="House Blend No.1"
                      />
                    </label>
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Price
                    <input
                      required
                      min="0"
                      type="number"
                      value={formState.price}
                      onChange={(event) =>
                        updateField("price", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>

                  {isCraftCocoaForm ? (
                    <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                      Percent
                      <input
                        value={formState.percent}
                        onChange={(event) =>
                          updateField("percent", event.target.value)
                        }
                        className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                        placeholder="70%"
                      />
                    </label>
                  ) : (
                    <div className="grid gap-2">
                      <VisibilityFieldHeader
                        label="Roast Level"
                        isVisible={formState.publicFieldVisibility.roastLevel}
                        onToggle={() => togglePublicFieldVisibility("roastLevel")}
                      />
                      <select
                        value={formState.roastLevel}
                        onChange={(event) =>
                          updateField(
                            "roastLevel",
                            event.target.value as RoastLevel,
                          )
                        }
                        className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      >
                        {roastLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {isCraftCocoaForm ? (
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    BATCH #?
                    <input
                      value={formState.batchNumber}
                      onChange={(event) =>
                        updateField("batchNumber", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="#308"
                    />
                  </label>
                ) : (
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Description
                    <textarea
                      required
                      value={formState.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      className="min-h-28 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>
                )}

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  {isCraftCocoaForm ? "Tasting Note" : "Flavor Notes"}
                  <input
                    required
                    value={formState.flavorNotes}
                    onChange={(event) =>
                      updateField("flavorNotes", event.target.value)
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    placeholder={
                      isCraftCocoaForm
                        ? "Cacao nib, dried fruit, brown sugar"
                        : "Jasmine, cacao, honey"
                    }
                  />
                </label>

                {isCraftCocoaForm ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                      Province
                      <input
                        value={formState.region}
                        onChange={(event) =>
                          updateField("region", event.target.value)
                        }
                        className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                      Farmer
                      <input
                        value={formState.producer}
                        onChange={(event) =>
                          updateField("producer", event.target.value)
                        }
                        className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      />
                    </label>
                  </div>
                ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <VisibilityFieldHeader
                      label="Origin"
                      isVisible={formState.publicFieldVisibility.origin}
                      onToggle={() => togglePublicFieldVisibility("origin")}
                    />
                    <input
                      value={formState.origin}
                      onChange={(event) =>
                        updateField("origin", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <VisibilityFieldHeader
                      label="Region"
                      isVisible={formState.publicFieldVisibility.region}
                      onToggle={() => togglePublicFieldVisibility("region")}
                    />
                    <input
                      value={formState.region}
                      onChange={(event) =>
                        updateField("region", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </div>
                </div>
                )}

                {!isCraftCocoaForm ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <VisibilityFieldHeader
                      label="Producer / Farm"
                      isVisible={formState.publicFieldVisibility.producer}
                      onToggle={() => togglePublicFieldVisibility("producer")}
                    />
                    <input
                      value={formState.producer}
                      onChange={(event) =>
                        updateField("producer", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <VisibilityFieldHeader
                      label="Altitude"
                      isVisible={formState.publicFieldVisibility.altitude}
                      onToggle={() => togglePublicFieldVisibility("altitude")}
                    />
                    <input
                      value={formState.altitude}
                      onChange={(event) =>
                        updateField("altitude", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="1,750 masl"
                    />
                  </div>
                </div>
                ) : null}

                {!isCraftCocoaForm ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <VisibilityFieldHeader
                      label="Variety"
                      isVisible={formState.publicFieldVisibility.variety}
                      onToggle={() => togglePublicFieldVisibility("variety")}
                    />
                    <input
                      value={formState.variety}
                      onChange={(event) =>
                        updateField("variety", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <VisibilityFieldHeader
                      label="Process"
                      isVisible={formState.publicFieldVisibility.process}
                      onToggle={() => togglePublicFieldVisibility("process")}
                    />
                    <input
                      value={formState.process}
                      onChange={(event) =>
                        updateField("process", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </div>
                </div>
                ) : null}

                {!isCraftCocoaForm ? (
                <div className="grid gap-2">
                  <VisibilityFieldHeader
                    label="Brew Recommendation"
                    isVisible={
                      formState.publicFieldVisibility.brewRecommendation
                    }
                    onToggle={() =>
                      togglePublicFieldVisibility("brewRecommendation")
                    }
                  />
                  <textarea
                    value={formState.brewRecommendation}
                    onChange={(event) =>
                      updateField("brewRecommendation", event.target.value)
                    }
                    className="min-h-24 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    placeholder="Best as filter with a gentle pour, or as a bright Americano."
                  />
                </div>
                ) : null}

                {!isCraftCocoaForm ? (
                <div className="grid gap-2">
                  <VisibilityFieldHeader
                    label="Available For"
                    isVisible={formState.publicFieldVisibility.availableFor}
                    onToggle={() => togglePublicFieldVisibility("availableFor")}
                  />
                  <div className="flex flex-wrap gap-2">
                    {availableForChoices.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleAvailableFor(option)}
                        className={
                          selectedAvailableFor.includes(option)
                            ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                            : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <input
                    required
                    value={formState.availableFor}
                    onChange={(event) =>
                      updateField("availableFor", event.target.value)
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    placeholder="Selected usages"
                  />
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <input
                      value={customAvailableFor}
                      onChange={(event) =>
                        setCustomAvailableFor(event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="Add custom option"
                    />
                    <button
                      type="button"
                      onClick={addCustomAvailableFor}
                      className="min-h-12 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/70"
                    >
                      Add
                    </button>
                  </div>
                </div>
                ) : null}

                {isCraftCocoaForm ? (
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Season
                    <input
                      value={formState.season}
                      onChange={(event) =>
                        updateField("season", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="2025 harvest"
                    />
                  </label>
                ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <VisibilityFieldHeader
                      label="Seasonal"
                      isVisible={
                        formState.publicFieldVisibility.seasonalAvailability
                      }
                      onToggle={() =>
                        togglePublicFieldVisibility("seasonalAvailability")
                      }
                    />
                    <select
                      value={formState.isSeasonal}
                      onChange={(event) =>
                        updateField(
                          "isSeasonal",
                          event.target.value as "yes" | "no",
                        )
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Available From
                    <input
                      type="date"
                      value={formState.availableFrom}
                      onChange={(event) =>
                        updateField("availableFrom", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Available Until
                    <input
                      type="date"
                      value={formState.availableUntil}
                      onChange={(event) =>
                        updateField("availableUntil", event.target.value)
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>
                </div>
                )}

                {!isCraftCocoaForm ? (
                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Image Placeholder
                  <input
                    required
                    value={formState.imagePlaceholder}
                    onChange={(event) =>
                      updateField("imagePlaceholder", event.target.value)
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>
                ) : null}

                <ImageUploadField
                  bucket="products"
                  currentUrl={formState.imageUrl}
                  guidelines={{
                    recommendedSize: "1080 x 1350 px",
                    aspectRatio: "4:5",
                    minimumWidth: "1080 px",
                    formats: "JPG / PNG / WEBP",
                  }}
                  label="Product Image"
                  objectNameSeed={formState.name || "product"}
                  onChange={(url) => updateField("imageUrl", url)}
                />

                {!isCraftCocoaForm ? (
                <p className="rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                  Click each field label icon to control public visibility.
                </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={pendingId === "form"}
                className="mt-7 min-h-12 w-full rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed] shadow-[0_14px_30px_rgba(43,26,18,0.18)] transition hover:bg-[#412719]"
              >
                {pendingId === "form"
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </form>

            <div className="grid gap-4">
              {defaultProductType === "coffee_bean" ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-4 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                      Coffee Bean View
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#5f4635]">
                      House Blends are shown in the Classic Menu top section.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHouseBlendsOnly((current) => !current)}
                    className={
                      showHouseBlendsOnly
                        ? "min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed]"
                        : "min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/70"
                    }
                  >
                    {showHouseBlendsOnly ? "Showing House Blends" : "Show House Blends"}
                  </button>
                </div>
              ) : null}

              {visibleProducts.map((product) => {
                const publishState = publishedMenuItems[product.id];
                const isPublishing = pendingId === `publish-${product.id}`;

                return (
                <article
                  key={product.id}
                  className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-4 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur"
                >
                  <div className="grid gap-4 sm:grid-cols-[4.25rem_1fr]">
                    <div className="h-16 w-16 overflow-hidden rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/70">
                      {product.imageUrl ? (
                        <img
                          alt={product.name}
                          src={product.imageUrl}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-[0.62rem] font-semibold uppercase leading-3 tracking-[0.12em] text-[#7d4d2f]">
                          {product.imagePlaceholder || "Product"}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold leading-tight">
                          {product.name}
                        </h2>
                        <span
                          className={
                            product.status === "active"
                              ? "rounded-full bg-[#2b1a12] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#fff8ed]"
                              : "rounded-full bg-[#7d4d2f]/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#7d4d2f]"
                          }
                        >
                          {product.status}
                        </span>
                        {product.isSeasonal ? (
                          <span className="rounded-full border border-[#3d2618]/12 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#7d4d2f]">
                            Seasonal
                          </span>
                        ) : null}
                        {product.isHouseBlend ? (
                          <span className="rounded-full border border-[#7d4d2f]/20 bg-[#fff8ed]/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#7d4d2f]">
                            House Blend
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                        {product.flavorNotes.slice(0, 3).join(", ") ||
                          product.description}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a6a55]">
                        {productTypeLabel(product.productType)} /{" "}
                        {formatPrice(product.price)}
                        {product.productType === "craft_cocoa" &&
                        product.batchNumber
                          ? ` / ${product.batchNumber}`
                          : ""}
                        {product.productType === "coffee_bean" &&
                        product.isHouseBlend &&
                        product.houseBlendOrder !== undefined
                          ? ` / House #${product.houseBlendOrder}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="grid gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7d4d2f]">
                          Customer Menu
                        </p>
                        {product.productType === "coffee_bean" ? (
                          <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                            Category
                            <select
                              value={coffeeMenuCategoryByProductId[product.id] ?? ""}
                              onChange={(event) =>
                                setCoffeeMenuCategoryByProductId((current) => ({
                                  ...current,
                                  [product.id]: event.target
                                    .value as ProductMenuCategoryId,
                                }))
                              }
                              className="min-h-11 rounded-lg border border-[#3d2618]/14 bg-[#fff8ed]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                            >
                              <option value="">Choose category</option>
                              {coffeeMenuCategoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        ) : (
                          <p className="text-sm leading-6 text-[#5f4635]">
                            Publishes to{" "}
                            {product.productType === "matcha"
                              ? "Matcha"
                              : "Craft Cocoa"}
                            .
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePublishProduct(product)}
                        disabled={isPublishing}
                        className="min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#412719]"
                      >
                        {isPublishing
                          ? "Publishing..."
                          : publishState?.status === "existing"
                            ? "Already in menu"
                            : "Create menu item from product"}
                      </button>
                    </div>

                    {publishState ? (
                      <Link
                        href={publishState.href}
                        className="mt-4 inline-flex text-sm font-semibold text-[#7d4d2f] transition hover:text-[#2b1a12]"
                      >
                        View public menu item
                      </Link>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:border-[#3d2618]/30 hover:bg-[#f6efe6]/70"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleProductStatus(product.id)}
                      disabled={pendingId === product.id}
                      className="min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#412719]"
                    >
                      {pendingId === product.id
                        ? "Saving..."
                        : product.status === "active"
                          ? "Deactivate"
                            : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => archiveProduct(product)}
                      disabled={
                        pendingId === product.id || product.status === "inactive"
                      }
                      className="min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:border-[#3d2618]/30 hover:bg-[#f6efe6]/70 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {product.status === "inactive" ? "Archived" : "Archive"}
                    </button>
                  </div>
                </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
