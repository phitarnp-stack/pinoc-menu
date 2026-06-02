"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { saveMenuItem, updateMenuItemStatus } from "@/src/lib/menu/adminWrites";
import type {
  MenuCategory,
  MenuItem,
  MenuLabel,
  SpecialCategory,
  TasteProfile,
  VisibilityStatus,
} from "@/src/types/menu";

type MenuItemCrudPageProps = {
  title: string;
  description: string;
  initialItems: MenuItem[];
  menuCategories: MenuCategory[];
  tasteProfiles: TasteProfile[];
  fixedCategoryId?: string;
};

type MenuItemFormState = {
  name: string;
  categoryId: string;
  price: string;
  description: string;
  flavorNotes: string;
  tasteProfileIds: string[];
  recommendedFor: string;
  imagePlaceholder: string;
  imageUrl: string;
  isActive: "active" | "inactive";
  specialCategory: SpecialCategory;
  visibility: VisibilityStatus;
  menuLabel: "" | MenuLabel;
  availableFrom: string;
  availableUntil: string;
};

const specialCategoryOptions: {
  label: string;
  value: SpecialCategory;
}[] = [
  { label: "Coffee", value: "coffee" },
  { label: "Non Coffee", value: "non_coffee" },
  { label: "Cold Brew", value: "cold_brew" },
];

const menuLabelOptions: { label: string; value: MenuLabel }[] = [
  { label: "New", value: "new" },
  { label: "Seasonal", value: "seasonal" },
  { label: "Limited", value: "limited" },
];

const makeDefaultFormState = (
  menuCategories: MenuCategory[],
  fixedCategoryId?: string,
): MenuItemFormState => ({
  name: "",
  categoryId: fixedCategoryId ?? menuCategories[0]?.id ?? "",
  price: "",
  description: "",
  flavorNotes: "",
  tasteProfileIds: [],
  recommendedFor: "",
  imagePlaceholder: "",
  imageUrl: "",
  isActive: "active",
  specialCategory: "coffee",
  visibility: "visible",
  menuLabel: "",
  availableFrom: "",
  availableUntil: "",
});

const normalizeNotes = (notes: string) =>
  notes
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);

const createSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const createId = (name: string) =>
  `item-${createSlug(name)}-${Date.now().toString(36)}`;

const formatPrice = (price: number) => `฿${price}`;

export function MenuItemCrudPage({
  title,
  description,
  initialItems,
  menuCategories,
  tasteProfiles,
  fixedCategoryId,
}: MenuItemCrudPageProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [formState, setFormState] = useState<MenuItemFormState>(
    makeDefaultFormState(menuCategories, fixedCategoryId),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "warning" | "error";
    message: string;
  } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const activeCount = useMemo(
    () => items.filter((item) => item.isActive).length,
    [items],
  );
  const isEditing = editingId !== null;
  const isSpecialForm = fixedCategoryId === "special";

  const resetForm = () => {
    setEditingId(null);
    setFormState(makeDefaultFormState(menuCategories, fixedCategoryId));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    const existingItem = editingId
      ? items.find((item) => item.id === editingId)
      : undefined;

    const nextItem: MenuItem = {
      id: editingId ?? createId(formState.name),
      slug: editingId
        ? items.find((item) => item.id === editingId)?.slug ??
          createSlug(formState.name)
        : createSlug(formState.name),
      name: formState.name.trim(),
      categoryId: fixedCategoryId ?? formState.categoryId,
      price: Number(formState.price),
      description: formState.description.trim(),
      flavorNotes: normalizeNotes(formState.flavorNotes),
      tasteProfileIds: formState.tasteProfileIds,
      recommendedFor: formState.recommendedFor.trim(),
      imagePlaceholder: formState.imagePlaceholder.trim(),
      imageUrl: formState.imageUrl.trim() || undefined,
      isActive: formState.isActive === "active",
      specialCategory: isSpecialForm ? formState.specialCategory : undefined,
      visibility: isSpecialForm ? formState.visibility : undefined,
      menuLabel: isSpecialForm
        ? formState.menuLabel || undefined
        : undefined,
      isSeasonal: isSpecialForm && formState.menuLabel === "seasonal",
      availableFrom: formState.availableFrom || undefined,
      availableUntil: formState.availableUntil || undefined,
      sortOrder: existingItem?.sortOrder ?? items.length + 1,
    };

    setPendingId("form");

    try {
      const result = await saveMenuItem(nextItem, editingId ? "edit" : "create");

      if (editingId) {
        setItems((current) =>
          current.map((item) => (item.id === editingId ? nextItem : item)),
        );
      } else {
        setItems((current) => [nextItem, ...current]);
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

  const editItem = (item: MenuItem) => {
    setEditingId(item.id);
    setFormState({
      name: item.name,
      categoryId: item.categoryId,
      price: String(item.price),
      description: item.description,
      flavorNotes: item.flavorNotes.join(", "),
      tasteProfileIds: item.tasteProfileIds,
      recommendedFor: item.recommendedFor,
      imagePlaceholder: item.imagePlaceholder,
      imageUrl: item.imageUrl ?? "",
      isActive: item.isActive ? "active" : "inactive",
      specialCategory: item.specialCategory ?? "coffee",
      visibility: item.visibility ?? (item.isActive ? "visible" : "hidden"),
      menuLabel: item.menuLabel ?? "",
      availableFrom: item.availableFrom ?? "",
      availableUntil: item.availableUntil ?? "",
    });
  };

  const toggleStatus = async (itemId: string) => {
    const item = items.find((currentItem) => currentItem.id === itemId);

    if (!item) {
      return;
    }

    const nextIsActive = !item.isActive;
    const nextVisibility = isSpecialForm
      ? nextIsActive
        ? "visible"
        : "hidden"
      : item.visibility;

    setFeedback(null);
    setPendingId(itemId);

    try {
      const result = await updateMenuItemStatus(item, nextIsActive);

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === itemId
            ? {
                ...currentItem,
                isActive: nextIsActive,
                visibility: nextVisibility,
              }
            : currentItem,
        ),
      );
      setFeedback(
        result.source === "mock"
          ? { tone: "warning", message: result.warning ?? "Saved locally." }
          : { tone: "success", message: "Status saved to Supabase." },
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

  const archiveItem = async (item: MenuItem) => {
    const confirmed = window.confirm(
      `Archive ${item.name}? It will be marked inactive and hidden from the customer menu.`,
    );

    if (!confirmed) {
      return;
    }

    if (!item.isActive) {
      setFeedback({
        tone: "warning",
        message: "This menu item is already archived.",
      });
      return;
    }

    await toggleStatus(item.id);
  };

  const toggleTasteProfile = (tasteProfileId: string) => {
    setFormState((current) => ({
      ...current,
      tasteProfileIds: current.tasteProfileIds.includes(tasteProfileId)
        ? current.tasteProfileIds.filter((id) => id !== tasteProfileId)
        : [...current.tasteProfileIds, tasteProfileId],
    }));
  };

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl py-12 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/admin"
                className="mb-8 inline-flex text-xs font-semibold uppercase tracking-[0.28em] text-[#7d4d2f] transition hover:text-[#2b1a12]"
              >
                Admin
              </Link>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#5f4635]">
                {description}
              </p>
            </div>
            <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-4 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur sm:w-40">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                Active
              </p>
              <p className="mt-2 text-3xl font-semibold">{activeCount}</p>
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
                    {isEditing ? "Edit Item" : "Add Item"}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {isEditing ? "Update details" : "Create menu item"}
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
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Category
                    <select
                      disabled={fixedCategoryId !== undefined}
                      value={formState.categoryId}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          categoryId: event.target.value,
                        }))
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    >
                      {menuCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Price
                    <input
                      required
                      min="0"
                      type="number"
                      value={formState.price}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          price: event.target.value,
                        }))
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Description
                  <textarea
                    required
                    value={formState.description}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="min-h-28 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Flavor Notes
                  <input
                    required
                    value={formState.flavorNotes}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        flavorNotes: event.target.value,
                      }))
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <div className="grid gap-2">
                  <p className="text-sm font-semibold text-[#5f4635]">
                    Taste Profiles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tasteProfiles.map((profile) => (
                      <button
                        type="button"
                        key={profile.id}
                        onClick={() => toggleTasteProfile(profile.id)}
                        className={
                          formState.tasteProfileIds.includes(profile.id)
                            ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                            : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                        }
                      >
                        {profile.name}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Recommended For
                  <input
                    required
                    value={formState.recommendedFor}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        recommendedFor: event.target.value,
                      }))
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Image Placeholder
                  <input
                    required
                    value={formState.imagePlaceholder}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        imagePlaceholder: event.target.value,
                      }))
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Image URL
                  <input
                    type="url"
                    value={formState.imageUrl}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        imageUrl: event.target.value,
                      }))
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                    placeholder="https://example.com/menu-item.jpg"
                  />
                </label>

                {formState.imageUrl ? (
                  <div className="overflow-hidden rounded-lg border border-[#3d2618]/12 bg-[#f6efe6]/60">
                    <img
                      alt={`${formState.name || "Menu item"} preview`}
                      src={formState.imageUrl}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                ) : null}

                {isSpecialForm ? (
                  <div className="grid gap-4 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                      Special Menu
                    </p>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        Special Category
                        <select
                          value={formState.specialCategory}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              specialCategory: event.target
                                .value as SpecialCategory,
                            }))
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                        >
                          {specialCategoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        Visibility
                        <select
                          value={formState.visibility}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              visibility: event.target
                                .value as VisibilityStatus,
                              isActive:
                                event.target.value === "visible"
                                  ? "active"
                                  : "inactive",
                            }))
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                        >
                          <option value="visible">Visible</option>
                          <option value="hidden">Hidden</option>
                        </select>
                      </label>

                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        Menu Label
                        <select
                          value={formState.menuLabel}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              menuLabel: event.target.value as
                                | ""
                                | MenuLabel,
                            }))
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                        >
                          <option value="">None</option>
                          {menuLabelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        Start Date
                        <input
                          type="date"
                          value={formState.availableFrom}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              availableFrom: event.target.value,
                            }))
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                        />
                      </label>

                      <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                        End Date
                        <input
                          type="date"
                          value={formState.availableUntil}
                          onChange={(event) =>
                            setFormState((current) => ({
                              ...current,
                              availableUntil: event.target.value,
                            }))
                          }
                          className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                        />
                      </label>
                    </div>
                  </div>
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
                    : "Add Item"}
              </button>
            </form>

            <div className="grid gap-4">
              {items.map((item) => {
                const category = menuCategories.find(
                  (menuCategory) => menuCategory.id === item.categoryId,
                );

                return (
                  <article
                    key={item.id}
                    className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur"
                  >
                    {item.imageUrl ? (
                      <img
                        alt={item.name}
                        src={item.imageUrl}
                        className="mb-5 aspect-[4/3] w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="mb-5 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/60 px-4 py-8 text-sm font-semibold text-[#7d4d2f]">
                        {item.imagePlaceholder}
                      </div>
                    )}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold">{item.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                          {item.description}
                        </p>
                      </div>
                      <span
                        className={
                          item.isActive
                            ? "w-fit rounded-full bg-[#2b1a12] px-3 py-1 text-xs font-semibold text-[#fff8ed]"
                            : "w-fit rounded-full bg-[#7d4d2f]/15 px-3 py-1 text-xs font-semibold text-[#7d4d2f]"
                        }
                      >
                        {item.isActive ? "active" : "inactive"}
                      </span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#5f4635]">
                        {category?.name ?? "Uncategorized"}
                      </span>
                      <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#5f4635]">
                        {formatPrice(item.price)}
                      </span>
                      {item.specialCategory ? (
                        <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#5f4635]">
                          {specialCategoryOptions.find(
                            (option) => option.value === item.specialCategory,
                          )?.label ?? item.specialCategory}
                        </span>
                      ) : null}
                      {item.menuLabel ? (
                        <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#7d4d2f]">
                          {item.menuLabel}
                        </span>
                      ) : null}
                      {item.visibility ? (
                        <span className="rounded-full border border-[#3d2618]/12 px-3 py-1 text-xs font-semibold text-[#5f4635]">
                          {item.visibility}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-5 text-sm leading-7 text-[#5f4635]">
                      <span className="font-semibold text-[#241710]">
                        Flavor:
                      </span>{" "}
                      {item.flavorNotes.join(", ")}
                    </p>
                    {item.availableFrom || item.availableUntil ? (
                      <p className="mt-3 text-sm leading-7 text-[#5f4635]">
                        <span className="font-semibold text-[#241710]">
                          Dates:
                        </span>{" "}
                        {item.availableFrom ?? "Now"} -{" "}
                        {item.availableUntil ?? "Open"}
                      </p>
                    ) : null}
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => editItem(item)}
                        className="min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:border-[#3d2618]/30 hover:bg-[#f6efe6]/70"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(item.id)}
                        disabled={pendingId === item.id}
                        className="min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#412719]"
                      >
                        {pendingId === item.id
                          ? "Saving..."
                          : item.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => archiveItem(item)}
                        disabled={pendingId === item.id || !item.isActive}
                        className="min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:border-[#3d2618]/30 hover:bg-[#f6efe6]/70 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {item.isActive ? "Archive" : "Archived"}
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
