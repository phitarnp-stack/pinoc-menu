"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  deleteMenuItem,
  saveMenuItemBeanLinks,
  saveMenuItem,
  updateMenuItemStatus,
} from "@/src/lib/menu/adminWrites";
import type {
  ClassicGroup,
  MenuCategory,
  HeroContentMode,
  MenuItem,
  MenuItemProduct,
  MenuItemStatus,
  MenuLabel,
  OverlayField,
  Product,
  RecommendationAdventureLevel,
  RecommendationComfortLevel,
  RecommendationDrinkType,
  RecommendationFlavorPreference,
  RecommendationFeelingTag,
  SpecialCategory,
  StoryStatus,
  TasteProfile,
  VisibilityStatus,
} from "@/src/types/menu";
import { AdminBackLink } from "./AdminBackLink";
import { ImageUploadField } from "./ImageUploadField";
import { QRStampPanel } from "./QRStampPanel";
import { HeroImageFrame } from "@/src/components/media/HeroImageFrame";

type MenuItemCrudPageProps = {
  title: string;
  description: string;
  initialItems: MenuItem[];
  initialMenuItemProducts: MenuItemProduct[];
  menuCategories: MenuCategory[];
  products: Product[];
  tasteProfiles: TasteProfile[];
  fixedCategoryId?: string;
};

type AdminMenuView = MenuItemStatus;

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
  heroContentMode: HeroContentMode;
  customOverlayTitle: string;
  customOverlayText: string;
  overlayFields: OverlayField[];
  isActive: "active" | "inactive";
  status: MenuItemStatus;
  specialCategory: SpecialCategory;
  visibility: VisibilityStatus;
  menuLabel: "" | MenuLabel;
  availableFrom: string;
  availableUntil: string;
  classicGroup: ClassicGroup;
  selectedBeanIds: string[];
  defaultBeanId: string;
  drinkType: "" | RecommendationDrinkType;
  feelingTags: RecommendationFeelingTag[];
  adventureLevel: "" | RecommendationAdventureLevel;
  bodyLevel: string;
  flavorPreferences: RecommendationFlavorPreference[];
  comfortLevel: "" | RecommendationComfortLevel;
  intensityLevel: string;
  storyStatus: StoryStatus;
  storyTitle: string;
  storyDescription: string;
  servingRitual: string;
  whyWeCreatedIt: string;
  bestFor: string;
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

const drinkTypeOptions: {
  label: string;
  value: RecommendationDrinkType;
}[] = [
  { label: "Coffee", value: "coffee" },
  { label: "Milk Coffee", value: "milk_coffee" },
  { label: "Matcha", value: "matcha" },
  { label: "Craft Cocoa", value: "craft_cocoa" },
  { label: "Non Coffee", value: "non_coffee" },
  { label: "Cold Brew", value: "cold_brew" },
];

const feelingTagOptions: {
  label: string;
  value: RecommendationFeelingTag;
}[] = [
  { label: "Light & Refreshing", value: "light_refreshing" },
  { label: "Bright & Fruity", value: "bright_fruity" },
  { label: "Deep & Chocolatey", value: "deep_chocolatey" },
  { label: "Creamy & Smooth", value: "creamy_smooth" },
  { label: "Clean & Delicate", value: "clean_delicate" },
  { label: "Bold & Intense", value: "bold_intense" },
];

const adventureLevelOptions: {
  label: string;
  value: RecommendationAdventureLevel;
}[] = [
  { label: "Familiar", value: "familiar" },
  { label: "Curious", value: "curious" },
  { label: "Adventurous", value: "adventurous" },
];

const flavorPreferenceOptions: {
  label: string;
  value: RecommendationFlavorPreference;
}[] = [
  { label: "Fruity", value: "fruity" },
  { label: "Citrus", value: "citrus" },
  { label: "Floral", value: "floral" },
  { label: "Chocolatey", value: "chocolatey" },
  { label: "Nutty", value: "nutty" },
  { label: "Sweet & Smooth", value: "sweet_smooth" },
];

const comfortLevelOptions: {
  label: string;
  value: RecommendationComfortLevel;
}[] = [
  { label: "Comfort Zone", value: "comfort_zone" },
  { label: "Something New", value: "something_new" },
  { label: "Explore Origin", value: "explore_origin" },
  { label: "Surprise Me", value: "surprise_me" },
];

const classicGroupOptions: { label: string; value: ClassicGroup }[] = [
  { label: "None", value: "none" },
  { label: "Black Coffee", value: "black_coffee" },
  { label: "Milk Coffee", value: "milk_coffee" },
  { label: "Juice w/ Coffee", value: "juice_with_coffee" },
];

const menuStatusOptions: {
  description: string;
  label: string;
  value: MenuItemStatus;
}[] = [
  {
    description: "Visible to customers and currently available.",
    label: "Active",
    value: "active",
  },
  {
    description: "Hidden from customers, but ready to reactivate later.",
    label: "Inactive",
    value: "inactive",
  },
  {
    description: "Moved out of daily management into the archive.",
    label: "Archived",
    value: "archived",
  },
];

const heroContentModeOptions: {
  description: string;
  label: string;
  value: HeroContentMode;
}[] = [
  {
    description: "Only the image. Best for editorial or campaign photography.",
    label: "Image only",
    value: "image_only",
  },
  {
    description: "Use selected menu details on top of the image.",
    label: "Image with menu info",
    value: "image_with_menu_info",
  },
  {
    description: "Write your own overlay text for launches or collaborations.",
    label: "Custom overlay",
    value: "custom_overlay",
  },
];

const overlayFieldOptions: { label: string; value: OverlayField }[] = [
  { label: "Name", value: "name" },
  { label: "Taste Note", value: "taste_note" },
  { label: "Description", value: "description" },
  { label: "Story Title", value: "story_title" },
  { label: "Story Description", value: "story_description" },
  { label: "Price", value: "price" },
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
  heroContentMode: "image_with_menu_info",
  customOverlayTitle: "",
  customOverlayText: "",
  overlayFields: ["name", "taste_note", "price"],
  isActive: "active",
  status: "active",
  specialCategory: "coffee",
  visibility: "visible",
  menuLabel: "",
  availableFrom: "",
  availableUntil: "",
  classicGroup: "none",
  selectedBeanIds: [],
  defaultBeanId: "",
  drinkType: "",
  feelingTags: [],
  adventureLevel: "",
  bodyLevel: "3",
  flavorPreferences: [],
  comfortLevel: "",
  intensityLevel: "3",
  storyStatus: "default",
  storyTitle: "",
  storyDescription: "",
  servingRitual: "",
  whyWeCreatedIt: "",
  bestFor: "",
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

const getMenuItemStatus = (item: MenuItem): MenuItemStatus =>
  item.status ?? (item.isActive ? "active" : "inactive");

export function MenuItemCrudPage({
  title,
  description,
  initialItems,
  initialMenuItemProducts,
  menuCategories,
  products,
  tasteProfiles,
  fixedCategoryId,
}: MenuItemCrudPageProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [menuItemProducts, setMenuItemProducts] =
    useState<MenuItemProduct[]>(initialMenuItemProducts);
  const [formState, setFormState] = useState<MenuItemFormState>(
    makeDefaultFormState(menuCategories, fixedCategoryId),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "warning" | "error";
    message: string;
  } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [menuView, setMenuView] = useState<AdminMenuView>("active");

  const activeCount = useMemo(
    () => items.filter((item) => getMenuItemStatus(item) === "active").length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => getMenuItemStatus(item) === "inactive").length,
    [items],
  );
  const archivedCount = useMemo(
    () => items.filter((item) => getMenuItemStatus(item) === "archived").length,
    [items],
  );
  const visibleItems = useMemo(
    () => items.filter((item) => getMenuItemStatus(item) === menuView),
    [items, menuView],
  );
  const isEditing = editingId !== null;
  const editingItem = editingId
    ? items.find((item) => item.id === editingId)
    : undefined;
  const isSpecialForm = fixedCategoryId === "special";
  const imageBucket =
    isSpecialForm || formState.categoryId === "special"
      ? "specials"
      : "menu-items";
  const isClassicMenuItem =
    !isSpecialForm && (fixedCategoryId ?? formState.categoryId) === "classic-coffee";
  const activeCoffeeBeans = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.productType === "coffee_bean" && product.status === "active",
        )
        .sort(
          (left, right) =>
            (left.isHouseBlend === right.isHouseBlend
              ? 0
              : left.isHouseBlend
                ? -1
                : 1) ||
            (left.houseBlendOrder ?? 9999) -
              (right.houseBlendOrder ?? 9999) ||
            left.name.localeCompare(right.name),
        ),
    [products],
  );

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
      heroContentMode: formState.heroContentMode,
      customOverlayTitle: formState.customOverlayTitle.trim() || undefined,
      customOverlayText: formState.customOverlayText.trim() || undefined,
      overlayFields: formState.overlayFields,
      isActive: formState.status === "active",
      status: formState.status,
      specialCategory: isSpecialForm ? formState.specialCategory : undefined,
      visibility: isSpecialForm ? formState.visibility : undefined,
      menuLabel: isSpecialForm
        ? formState.menuLabel || undefined
        : undefined,
      isSeasonal: isSpecialForm && formState.menuLabel === "seasonal",
      availableFrom: formState.availableFrom || undefined,
      availableUntil: formState.availableUntil || undefined,
      classicGroup: isClassicMenuItem ? formState.classicGroup : "none",
      drinkType: formState.drinkType || undefined,
      feelingTags: formState.feelingTags,
      adventureLevel: formState.adventureLevel || undefined,
      bodyLevel: Number(formState.bodyLevel),
      flavorPreferences: formState.flavorPreferences,
      comfortLevel: formState.comfortLevel || undefined,
      intensityLevel: Number(formState.intensityLevel),
      storyStatus: formState.storyStatus,
      storyTitle: formState.storyTitle.trim() || undefined,
      storyDescription: formState.storyDescription.trim() || undefined,
      servingRitual: formState.servingRitual.trim() || undefined,
      whyWeCreatedIt: formState.whyWeCreatedIt.trim() || undefined,
      bestFor: normalizeNotes(formState.bestFor),
      sortOrder: existingItem?.sortOrder ?? items.length + 1,
    };

    setPendingId("form");

    try {
      const result = await saveMenuItem(nextItem, editingId ? "edit" : "create");
      const savedItem = result.menuItem ?? nextItem;
      const selectedBeanLinks = formState.selectedBeanIds.map(
        (productId, index) => ({
          productId,
          isDefault:
            productId ===
            (formState.defaultBeanId || formState.selectedBeanIds[0] || ""),
          sortOrder: index + 1,
        }),
      );
      let beanLinkResult = result;

      if (isClassicMenuItem) {
        beanLinkResult = await saveMenuItemBeanLinks(
          savedItem.id,
          selectedBeanLinks,
        );
        const activeCoffeeBeanIds = new Set(
          activeCoffeeBeans.map((bean) => bean.id),
        );
        setMenuItemProducts((current) => [
          ...current.filter(
            (mapping) =>
              mapping.menuItemId !== savedItem.id ||
              !activeCoffeeBeanIds.has(mapping.productId),
          ),
          ...selectedBeanLinks.map((link) => ({
            id: `mip-${savedItem.id}-${link.productId}`,
            menuItemId: savedItem.id,
            productId: link.productId,
            role: link.isDefault ? ("default" as const) : ("option" as const),
            isDefault: link.isDefault,
            isActive: true,
            sortOrder: link.sortOrder,
          })),
        ]);
      }

      if (editingId) {
        setItems((current) =>
          current.map((item) => (item.id === editingId ? savedItem : item)),
        );
      } else {
        setItems((current) => [savedItem, ...current]);
      }

      setFeedback(
        result.source === "mock" || beanLinkResult.source === "mock"
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
    const linkedBeans = menuItemProducts
      .filter((mapping) => mapping.menuItemId === item.id && mapping.isActive)
      .sort((left, right) => left.sortOrder - right.sortOrder);
    const defaultBean =
      linkedBeans.find((mapping) => mapping.isDefault) ?? linkedBeans[0];

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
      heroContentMode: item.heroContentMode ?? "image_with_menu_info",
      customOverlayTitle: item.customOverlayTitle ?? "",
      customOverlayText: item.customOverlayText ?? "",
      overlayFields: item.overlayFields?.length
        ? item.overlayFields
        : ["name", "taste_note", "price"],
      isActive: item.isActive ? "active" : "inactive",
      status: getMenuItemStatus(item),
      specialCategory: item.specialCategory ?? "coffee",
      visibility: item.visibility ?? (item.isActive ? "visible" : "hidden"),
      menuLabel: item.menuLabel ?? "",
      availableFrom: item.availableFrom ?? "",
      availableUntil: item.availableUntil ?? "",
      classicGroup: item.classicGroup ?? "none",
      selectedBeanIds: linkedBeans.map((mapping) => mapping.productId),
      defaultBeanId: defaultBean?.productId ?? "",
      drinkType: item.drinkType ?? "",
      feelingTags: item.feelingTags ?? [],
      adventureLevel: item.adventureLevel ?? "",
      bodyLevel: String(item.bodyLevel ?? 3),
      flavorPreferences: item.flavorPreferences ?? [],
      comfortLevel: item.comfortLevel ?? "",
      intensityLevel: String(item.intensityLevel ?? 3),
      storyStatus: item.storyStatus ?? "default",
      storyTitle: item.storyTitle ?? "",
      storyDescription: item.storyDescription ?? "",
      servingRitual: item.servingRitual ?? "",
      whyWeCreatedIt: item.whyWeCreatedIt ?? "",
      bestFor: item.bestFor?.join(", ") ?? "",
    });
  };

  const updateItemStatus = async (
    itemId: string,
    nextStatus: MenuItemStatus,
  ) => {
    const item = items.find((currentItem) => currentItem.id === itemId);

    if (!item) {
      return;
    }

    const nextIsActive = nextStatus === "active";
    const nextVisibility = isSpecialForm
      ? nextIsActive
        ? "visible"
        : "hidden"
      : item.visibility;

    setFeedback(null);
    setPendingId(itemId);

    try {
      const result = await updateMenuItemStatus(item, nextIsActive, nextStatus);

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === itemId
            ? {
                ...currentItem,
                isActive: nextIsActive,
                status: nextStatus,
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

  const toggleStatus = async (itemId: string) => {
    const item = items.find((currentItem) => currentItem.id === itemId);

    if (!item) {
      return;
    }

    await updateItemStatus(
      itemId,
      getMenuItemStatus(item) === "active" ? "inactive" : "active",
    );
  };

  const archiveItem = async (item: MenuItem) => {
    const confirmed = window.confirm(
      `Archive ${item.name}? It will move out of the active/inactive lists and stay hidden from the customer menu.`,
    );

    if (!confirmed) {
      return;
    }

    if (getMenuItemStatus(item) === "archived") {
      setFeedback({
        tone: "warning",
        message: "This menu item is already archived.",
      });
      return;
    }

    await updateItemStatus(item.id, "archived");
  };

  const permanentlyDeleteItem = async (item: MenuItem) => {
    const confirmed = window.confirm(
      `Permanently delete ${item.name}? This removes the menu item and its menu/product links. Products will not be deleted.`,
    );

    if (!confirmed) {
      return;
    }

    setFeedback(null);
    setPendingId(`delete-${item.id}`);

    try {
      const result = await deleteMenuItem(item);

      setItems((current) =>
        current.filter((currentItem) => currentItem.id !== item.id),
      );
      setFeedback(
        result.source === "mock"
          ? {
              tone: "warning",
              message:
                result.warning ??
                "Deleted locally. Supabase is unavailable for this session.",
            }
          : { tone: "success", message: "Menu item permanently deleted." },
      );

      if (editingId === item.id) {
        resetForm();
      }
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Supabase delete failed. Please try again.",
      });
    } finally {
      setPendingId(null);
    }
  };

  const toggleTasteProfile = (tasteProfileId: string) => {
    setFormState((current) => ({
      ...current,
      tasteProfileIds: current.tasteProfileIds.includes(tasteProfileId)
        ? current.tasteProfileIds.filter((id) => id !== tasteProfileId)
        : [...current.tasteProfileIds, tasteProfileId],
    }));
  };

  const toggleFeelingTag = (feelingTag: RecommendationFeelingTag) => {
    setFormState((current) => ({
      ...current,
      feelingTags: current.feelingTags.includes(feelingTag)
        ? current.feelingTags.filter((tag) => tag !== feelingTag)
        : [...current.feelingTags, feelingTag],
    }));
  };

  const toggleFlavorPreference = (
    flavorPreference: RecommendationFlavorPreference,
  ) => {
    setFormState((current) => ({
      ...current,
      flavorPreferences: current.flavorPreferences.includes(flavorPreference)
        ? current.flavorPreferences.filter((tag) => tag !== flavorPreference)
        : [...current.flavorPreferences, flavorPreference],
    }));
  };

  const toggleOverlayField = (overlayField: OverlayField) => {
    setFormState((current) => ({
      ...current,
      overlayFields: current.overlayFields.includes(overlayField)
        ? current.overlayFields.filter((field) => field !== overlayField)
        : [...current.overlayFields, overlayField],
    }));
  };

  const toggleSelectedBean = (productId: string) => {
    setFormState((current) => {
      const isSelected = current.selectedBeanIds.includes(productId);
      const selectedBeanIds = isSelected
        ? current.selectedBeanIds.filter((id) => id !== productId)
        : [...current.selectedBeanIds, productId];
      const defaultBeanId = selectedBeanIds.includes(current.defaultBeanId)
        ? current.defaultBeanId
        : selectedBeanIds[0] ?? "";

      return {
        ...current,
        selectedBeanIds,
        defaultBeanId,
      };
    });
  };

  const moveSelectedBean = (productId: string, direction: -1 | 1) => {
    setFormState((current) => {
      const currentIndex = current.selectedBeanIds.indexOf(productId);
      const nextIndex = currentIndex + direction;

      if (
        currentIndex < 0 ||
        nextIndex < 0 ||
        nextIndex >= current.selectedBeanIds.length
      ) {
        return current;
      }

      const selectedBeanIds = [...current.selectedBeanIds];
      const [beanId] = selectedBeanIds.splice(currentIndex, 1);
      selectedBeanIds.splice(nextIndex, 0, beanId);

      return {
        ...current,
        selectedBeanIds,
      };
    });
  };

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl py-12 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <AdminBackLink
                label="Back to Admin"
                fallbackHref="/admin"
              />
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

              {editingItem ? (
                <QRStampPanel
                  className="mt-5"
                  menuItemId={editingItem.id}
                />
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

                <div className="grid gap-2">
                  <p className="text-sm font-semibold text-[#5f4635]">
                    Menu State
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {menuStatusOptions.map((option) => {
                      const isSelected = formState.status === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormState((current) => ({
                              ...current,
                              status: option.value,
                              isActive:
                                option.value === "active" ? "active" : "inactive",
                              visibility:
                                isSpecialForm && option.value !== "active"
                                  ? "hidden"
                                  : current.visibility,
                            }))
                          }
                          className={
                            isSelected
                              ? "rounded-lg bg-[#2b1a12] px-4 py-3 text-left text-sm font-semibold text-[#fff8ed]"
                              : "rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/50 px-4 py-3 text-left text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          <span>{option.label}</span>
                          <span
                            className={
                              isSelected
                                ? "mt-1 block text-xs font-medium leading-5 text-[#ead9c2]"
                                : "mt-1 block text-xs font-medium leading-5 text-[#8a6a55]"
                            }
                          >
                            {option.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
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

                {isClassicMenuItem ? (
                  <div className="grid gap-4 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                        Classic Menu Settings
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                        Control where this drink appears and which beans guests
                        can choose.
                      </p>
                    </div>

                    <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                      Classic Group
                      <select
                        value={formState.classicGroup}
                        onChange={(event) =>
                          setFormState((current) => ({
                            ...current,
                            classicGroup: event.target.value as ClassicGroup,
                          }))
                        }
                        className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      >
                        {classicGroupOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="grid gap-3">
                      <p className="text-sm font-semibold text-[#5f4635]">
                        Available Beans
                      </p>
                      {activeCoffeeBeans.length > 0 ? (
                        <div className="grid gap-2">
                          {activeCoffeeBeans.map((bean) => {
                            const isSelected =
                              formState.selectedBeanIds.includes(bean.id);
                            const orderIndex =
                              formState.selectedBeanIds.indexOf(bean.id);

                            return (
                              <div
                                key={bean.id}
                                className={
                                  isSelected
                                    ? "rounded-lg border border-[#7d4d2f]/20 bg-[#fff8ed]/70 p-3"
                                    : "rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/36 p-3"
                                }
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <label className="flex items-start gap-3 text-sm font-semibold text-[#5f4635]">
                                    <input
                                      checked={isSelected}
                                      type="checkbox"
                                      onChange={() => toggleSelectedBean(bean.id)}
                                      className="mt-1 h-4 w-4 accent-[#2b1a12]"
                                    />
                                    <span>
                                      <span className="block text-[#241710]">
                                        {bean.houseBlendLabel || bean.name}
                                      </span>
                                      <span className="mt-1 block text-xs font-medium leading-5 text-[#8a6a55]">
                                        {bean.flavorNotes
                                          .slice(0, 3)
                                          .join(" • ")}
                                      </span>
                                    </span>
                                  </label>

                                  {isSelected ? (
                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setFormState((current) => ({
                                            ...current,
                                            defaultBeanId: bean.id,
                                          }))
                                        }
                                        className={
                                          formState.defaultBeanId === bean.id
                                            ? "min-h-9 rounded-full bg-[#2b1a12] px-4 text-xs font-semibold text-[#fff8ed]"
                                            : "min-h-9 rounded-full border border-[#3d2618]/14 px-4 text-xs font-semibold text-[#5f4635]"
                                        }
                                      >
                                        Default Bean
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          moveSelectedBean(bean.id, -1)
                                        }
                                        disabled={orderIndex <= 0}
                                        className="min-h-9 rounded-full border border-[#3d2618]/14 px-3 text-xs font-semibold text-[#5f4635] disabled:opacity-40"
                                      >
                                        Up
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          moveSelectedBean(bean.id, 1)
                                        }
                                        disabled={
                                          orderIndex < 0 ||
                                          orderIndex >=
                                            formState.selectedBeanIds.length - 1
                                        }
                                        className="min-h-9 rounded-full border border-[#3d2618]/14 px-3 text-xs font-semibold text-[#5f4635] disabled:opacity-40"
                                      >
                                        Down
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/50 p-3 text-sm leading-6 text-[#8a6a55]">
                          Add active coffee bean products first, then return here
                          to configure available beans.
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border border-[#3d2618]/10 bg-[#fff8ed]/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7d4d2f]">
                        Customer Preview
                      </p>
                      <div className="mt-3 flex items-baseline justify-between gap-4">
                        <p className="text-lg font-semibold">
                          {formState.name || "Drink name"}
                        </p>
                        <p className="font-semibold">
                          {formatPrice(Number(formState.price || 0))}
                        </p>
                      </div>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6a55]">
                        Available Beans
                      </p>
                      <ul className="mt-2 grid gap-1 text-sm leading-6 text-[#5f4635]">
                        {formState.selectedBeanIds.length > 0 ? (
                          formState.selectedBeanIds.map((beanId) => {
                            const bean = activeCoffeeBeans.find(
                              (item) => item.id === beanId,
                            );

                            if (!bean) {
                              return null;
                            }

                            return (
                              <li key={beanId}>
                                • {bean.houseBlendLabel || bean.name}
                                {formState.defaultBeanId === beanId
                                  ? " (default)"
                                  : ""}
                              </li>
                            );
                          })
                        ) : (
                          <li>• Ask the barista for today&apos;s beans.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : null}

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

                <div className="grid gap-4 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                      Find Your Cup Profile
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                      Quick tags for recommendations, search, and future
                      personalization.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-semibold text-[#5f4635]">
                      Drink Type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {drinkTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormState((current) => ({
                              ...current,
                              drinkType: option.value,
                            }))
                          }
                          className={
                            formState.drinkType === option.value
                              ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                              : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-semibold text-[#5f4635]">
                      Feeling Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {feelingTagOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleFeelingTag(option.value)}
                          className={
                            formState.feelingTags.includes(option.value)
                              ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                              : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-semibold text-[#5f4635]">
                      Adventure Level
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {adventureLevelOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormState((current) => ({
                              ...current,
                              adventureLevel: option.value,
                            }))
                          }
                          className={
                            formState.adventureLevel === option.value
                              ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                              : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-[#5f4635]">
                        Body / Strength
                      </p>
                      <p className="text-xs font-semibold text-[#7d4d2f]">
                        {formState.bodyLevel}/5
                      </p>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setFormState((current) => ({
                              ...current,
                              bodyLevel: String(level),
                            }))
                          }
                          className={
                            formState.bodyLevel === String(level)
                              ? "min-h-10 rounded-full bg-[#2b1a12] text-sm font-semibold text-[#fff8ed]"
                              : "min-h-10 rounded-full border border-[#3d2618]/14 text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-[#8a6a55]">
                      <span>Very Light</span>
                      <span>Very Heavy</span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-semibold text-[#5f4635]">
                      Flavor Preferences
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {flavorPreferenceOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleFlavorPreference(option.value)}
                          className={
                            formState.flavorPreferences.includes(option.value)
                              ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                              : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-semibold text-[#5f4635]">
                      Customer Journey
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {comfortLevelOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormState((current) => ({
                              ...current,
                              comfortLevel: option.value,
                            }))
                          }
                          className={
                            formState.comfortLevel === option.value
                              ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold text-[#fff8ed]"
                              : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-[#5f4635]">
                        Intensity
                      </p>
                      <p className="text-xs font-semibold text-[#7d4d2f]">
                        {formState.intensityLevel}/5
                      </p>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setFormState((current) => ({
                              ...current,
                              intensityLevel: String(level),
                            }))
                          }
                          className={
                            formState.intensityLevel === String(level)
                              ? "min-h-10 rounded-full bg-[#2b1a12] text-sm font-semibold text-[#fff8ed]"
                              : "min-h-10 rounded-full border border-[#3d2618]/14 text-sm font-semibold text-[#5f4635]"
                          }
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                      Drink Story
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                      Leave Default for the Pinoc house story, or write a custom
                      editorial story for this drink.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(["default", "custom"] as StoryStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setFormState((current) => ({
                            ...current,
                            storyStatus: status,
                          }))
                        }
                        className={
                          formState.storyStatus === status
                            ? "rounded-full bg-[#2b1a12] px-4 py-2 text-sm font-semibold capitalize text-[#fff8ed]"
                            : "rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold capitalize text-[#5f4635]"
                        }
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Story Title
                    <input
                      value={formState.storyTitle}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          storyTitle: event.target.value,
                        }))
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="A Journey Worth Slowing Down"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Story Description
                    <textarea
                      value={formState.storyDescription}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          storyDescription: event.target.value,
                        }))
                      }
                      className="min-h-24 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="A cup designed to reveal its character gradually."
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Serving Ritual
                    <textarea
                      value={formState.servingRitual}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          servingRitual: event.target.value,
                        }))
                      }
                      className="min-h-24 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="Served with intention. Notice the aroma before the first sip."
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Why We Created It
                    <textarea
                      value={formState.whyWeCreatedIt}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          whyWeCreatedIt: event.target.value,
                        }))
                      }
                      className="min-h-24 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="We believe every drink deserves a story."
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                    Best For
                    <input
                      value={formState.bestFor}
                      onChange={(event) =>
                        setFormState((current) => ({
                          ...current,
                          bestFor: event.target.value,
                        }))
                      }
                      className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                      placeholder="Slow moments, Curious minds, Meaningful conversations"
                    />
                  </label>
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

                <ImageUploadField
                  bucket={imageBucket}
                  currentUrl={formState.imageUrl}
                  guidelines={{
                    recommendedSize: "1080 x 1350 px",
                    aspectRatio: "4:5",
                    minimumWidth: "1080 px",
                    formats: "JPG / PNG / WEBP",
                    usedIn: [
                      "Home",
                      "Menu List",
                      "Quiet List",
                      "Featured Menu",
                    ],
                  }}
                  label={isSpecialForm ? "Special Image" : "Menu Item Image"}
                  objectNameSeed={formState.name || "menu-item"}
                  onChange={(url) =>
                    setFormState((current) => ({
                      ...current,
                      imageUrl: url,
                    }))
                  }
                />

                <div className="grid gap-4 rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7d4d2f]">
                      Image Presentation
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                      Image first, story second. Choose whether this visual
                      speaks alone or carries selected menu information.
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
                        {overlayFieldOptions.map((option) => (
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
                      alt={formState.name || "Menu image preview"}
                      imageUrl={formState.imageUrl || undefined}
                      placeholder={formState.imagePlaceholder || "Menu"}
                      mode={formState.heroContentMode}
                      overlayFields={formState.overlayFields}
                      compact
                      content={{
                        name: formState.name || "Menu Name",
                        tasteNote:
                          normalizeNotes(formState.flavorNotes)
                            .slice(0, 3)
                            .join(" / ") || "Taste note",
                        description: formState.description,
                        storyTitle: formState.storyTitle,
                        storyDescription: formState.storyDescription,
                        price: formState.price ? formatPrice(Number(formState.price)) : "",
                        customTitle: formState.customOverlayTitle,
                        customText: formState.customOverlayText,
                      }}
                      aspectClass="aspect-[4/5]"
                      className="rounded-lg border border-[#3d2618]/10"
                    />
                  </div>
                </div>

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
                              status:
                                event.target.value === "visible"
                                  ? "active"
                                  : current.status === "archived"
                                    ? "archived"
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
              <div className="grid grid-cols-3 rounded-full border border-[#3d2618]/12 bg-[#fff8ed]/58 p-1 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur">
                {([
                  ["active", `Active Menu Items (${activeCount})`],
                  ["inactive", `Inactive (${inactiveCount})`],
                  ["archived", `Archived Menu Items (${archivedCount})`],
                ] as [AdminMenuView, string][]).map(([view, label]) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setMenuView(view)}
                    className={
                      menuView === view
                        ? "min-h-11 rounded-full bg-[#2b1a12] px-4 text-sm font-semibold text-[#fff8ed]"
                        : "min-h-11 rounded-full px-4 text-sm font-semibold text-[#5f4635] transition hover:bg-[#f6efe6]/70"
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>

              {visibleItems.length === 0 ? (
                <div className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 text-sm leading-7 text-[#5f4635] shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur">
                  {menuView === "active"
                    ? "No active menu items here yet."
                    : menuView === "inactive"
                      ? "No inactive menu items yet."
                    : "No archived menu items yet."}
                </div>
              ) : null}

              {visibleItems.map((item) => {
                const category = menuCategories.find(
                  (menuCategory) => menuCategory.id === item.categoryId,
                );
                const itemStatus = getMenuItemStatus(item);

                return (
                  <article
                    key={item.id}
                    className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-4 shadow-[0_14px_34px_rgba(84,55,34,0.1)] backdrop-blur"
                  >
                    <div className="grid gap-4 sm:grid-cols-[4.25rem_1fr]">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-[#3d2618]/10 bg-[#f6efe6]/70">
                        {item.imageUrl ? (
                          <img
                            alt={item.name}
                            src={item.imageUrl}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-[0.62rem] font-semibold uppercase leading-3 tracking-[0.12em] text-[#7d4d2f]">
                            {item.imagePlaceholder || "Menu"}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold leading-tight">
                            {item.name}
                          </h2>
                          <span
                            className={
                              itemStatus === "active"
                                ? "rounded-full bg-[#2b1a12] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#fff8ed]"
                                : itemStatus === "archived"
                                  ? "rounded-full bg-[#7d4d2f]/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#7d4d2f]"
                                : "rounded-full bg-[#7d4d2f]/15 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#7d4d2f]"
                            }
                          >
                            {itemStatus}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#5f4635]">
                          {item.flavorNotes.slice(0, 3).join(", ") ||
                            item.description}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a6a55]">
                          {category?.name ?? "Uncategorized"} /{" "}
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => editItem(item)}
                        className="min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:border-[#3d2618]/30 hover:bg-[#f6efe6]/70"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => editItem(item)}
                        className="min-h-11 rounded-full border border-[#7d4d2f]/20 bg-[#fff8ed]/70 px-5 text-sm font-semibold text-[#7d4d2f] transition hover:border-[#7d4d2f]/35 hover:bg-[#f6efe6]/70"
                      >
                        QR Stamp
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(item.id)}
                        disabled={pendingId === item.id}
                        className="min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed] transition hover:bg-[#412719]"
                      >
                        {pendingId === item.id
                          ? "Saving..."
                          : itemStatus === "active"
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => archiveItem(item)}
                        disabled={pendingId === item.id || itemStatus === "archived"}
                        className="min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635] transition hover:border-[#3d2618]/30 hover:bg-[#f6efe6]/70 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {itemStatus === "archived" ? "Archived" : "Archive"}
                      </button>
                      <button
                        type="button"
                        onClick={() => permanentlyDeleteItem(item)}
                        disabled={pendingId === `delete-${item.id}`}
                        className="min-h-11 rounded-full border border-red-900/25 bg-red-50/70 px-5 text-sm font-semibold text-red-900 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {pendingId === `delete-${item.id}`
                          ? "Deleting..."
                          : "Delete"}
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
