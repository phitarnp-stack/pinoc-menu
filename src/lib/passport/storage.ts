import { evaluatePassportBadges } from "./badges";
import { deriveFlavorCollections, deriveOriginCollections } from "./collections";
import type { MenuItem, Product } from "@/src/types/menu";
import type {
  GuestPassport,
  PassportEntry,
  PassportOriginSnapshot,
} from "@/src/types/passport";

export const PASSPORT_STORAGE_KEY = "pinoc-guest-passport-v1";

type CreatePassportEntryInput = {
  item: MenuItem;
  categorySlug: string;
  categoryName: string;
  linkedProducts: Product[];
  note?: string;
};

const isBrowser = () => typeof window !== "undefined";

const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

const createEmptyPassport = (): GuestPassport => {
  const now = new Date().toISOString();

  return {
    version: 1,
    guestId: createId("guest"),
    createdAt: now,
    updatedAt: now,
    entries: [],
    badgeAwards: [],
    sync: {
      status: "local_only",
    },
  };
};

const isPassport = (value: unknown): value is GuestPassport =>
  Boolean(
    value &&
      typeof value === "object" &&
      (value as GuestPassport).version === 1 &&
      Array.isArray((value as GuestPassport).entries),
  );

export function readPassport(): GuestPassport {
  if (!isBrowser()) {
    return createEmptyPassport();
  }

  const raw = window.localStorage.getItem(PASSPORT_STORAGE_KEY);

  if (!raw) {
    const passport = createEmptyPassport();
    writePassport(passport);
    return passport;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (isPassport(parsed)) {
      return {
        ...parsed,
        badgeAwards: evaluatePassportBadges(parsed),
      };
    }
  } catch {
    window.localStorage.removeItem(PASSPORT_STORAGE_KEY);
  }

  const passport = createEmptyPassport();
  writePassport(passport);
  return passport;
}

export function writePassport(passport: GuestPassport) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    PASSPORT_STORAGE_KEY,
    JSON.stringify({
      ...passport,
      updatedAt: new Date().toISOString(),
    }),
  );
}

const createOriginSnapshots = (products: Product[]): PassportOriginSnapshot[] =>
  products.map((product) => ({
    productId: product.id,
    productName: product.name,
    productType: product.productType,
    origin: product.origin,
    region: product.region,
    producer: product.producer,
    variety: product.variety,
    process: product.process,
  }));

export function createPassportEntry({
  item,
  categorySlug,
  categoryName,
  linkedProducts,
  note,
}: CreatePassportEntryInput): PassportEntry {
  return {
    id: createId("passport-entry"),
    menuItemId: item.id,
    productIds: linkedProducts.map((product) => product.id),
    menuItemSlug: item.slug,
    categoryId: item.categoryId,
    categorySlug,
    categoryName,
    nameSnapshot: item.name,
    descriptionSnapshot: item.description,
    imageUrlSnapshot: item.imageUrl,
    priceSnapshot: item.price,
    triedAt: new Date().toISOString(),
    note: note?.trim() || undefined,
    originSnapshots: createOriginSnapshots(linkedProducts),
    flavorNotes: item.flavorNotes,
    tasteProfileIds: item.tasteProfileIds,
    drinkType: item.drinkType,
    feelingTags: item.feelingTags ?? [],
    adventureLevel: item.adventureLevel,
    bodyLevel: item.bodyLevel,
    comfortLevel: item.comfortLevel,
    intensityLevel: item.intensityLevel,
    flavorPreferences: item.flavorPreferences ?? [],
  };
}

export function addPassportEntry(entry: PassportEntry): GuestPassport {
  const passport = readPassport();
  const nextPassport: GuestPassport = {
    ...passport,
    entries: [entry, ...passport.entries],
    sync: {
      status: "local_only",
    },
  };

  const nextWithBadges: GuestPassport = {
    ...nextPassport,
    badgeAwards: evaluatePassportBadges(nextPassport),
  };

  deriveOriginCollections(nextWithBadges.entries);
  deriveFlavorCollections(nextWithBadges.entries);
  writePassport(nextWithBadges);

  return nextWithBadges;
}
