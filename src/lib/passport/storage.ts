import { evaluatePassportBadges } from "./badges";
import { deriveFlavorCollections, deriveOriginCollections } from "./collections";
import type { MenuItem, Product } from "@/src/types/menu";
import type {
  GuestPassport,
  PassportEntry,
  PassportOriginSnapshot,
  PassportSyncStatus,
  PassportVerificationSource,
} from "@/src/types/passport";

export const PASSPORT_STORAGE_KEY = "pinoc-guest-passport-v1";
const PASSPORT_BACKUP_STORAGE_KEY = `${PASSPORT_STORAGE_KEY}-backup`;

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const safeStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const backupRawPassport = (raw: string) => {
  if (!window.localStorage.getItem(PASSPORT_BACKUP_STORAGE_KEY)) {
    window.localStorage.setItem(PASSPORT_BACKUP_STORAGE_KEY, raw);
  }
};

const isPassportSyncStatus = (value: unknown): value is PassportSyncStatus =>
  value === "ready_for_sync" || value === "synced" || value === "local_only";

const normalizeEntry = (entry: PassportEntry): PassportEntry => ({
  ...entry,
  status: entry.status === "verified" ? "verified" : "collected",
  productIds: safeStringArray(entry.productIds),
  originSnapshots: Array.isArray(entry.originSnapshots)
    ? entry.originSnapshots
    : [],
  flavorNotes: safeStringArray(entry.flavorNotes),
  tasteProfileIds: safeStringArray(entry.tasteProfileIds),
  feelingTags: safeStringArray(entry.feelingTags) as PassportEntry["feelingTags"],
  flavorPreferences: safeStringArray(
    entry.flavorPreferences,
  ) as PassportEntry["flavorPreferences"],
});

const normalizePassport = (value: Record<string, unknown>): GuestPassport => {
  const emptyPassport = createEmptyPassport();
  const entries = Array.isArray(value.entries)
    ? (value.entries.filter(isRecord) as unknown as PassportEntry[])
    : [];
  const badgeAwards = Array.isArray(value.badgeAwards)
    ? value.badgeAwards
    : [];
  const sync = isRecord(value.sync)
    ? {
        status: isPassportSyncStatus(value.sync.status)
          ? value.sync.status
          : "local_only",
        lastSyncedAt:
          typeof value.sync.lastSyncedAt === "string"
            ? value.sync.lastSyncedAt
            : undefined,
      }
    : {
        status: "local_only" as const,
      };

  return {
    version: 1,
    guestId:
      typeof value.guestId === "string" ? value.guestId : emptyPassport.guestId,
    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : emptyPassport.createdAt,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : emptyPassport.updatedAt,
    entries: entries.map(normalizeEntry),
    badgeAwards: badgeAwards as GuestPassport["badgeAwards"],
    sync,
  };
};

const completePassport = (passport: GuestPassport): GuestPassport => ({
  ...passport,
  badgeAwards: Array.isArray(passport.badgeAwards)
    ? passport.badgeAwards
    : [],
  sync: passport.sync ?? {
    status: "local_only",
  },
});

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

    if (isRecord(parsed)) {
      backupRawPassport(raw);
      const normalized = completePassport(normalizePassport(parsed));
      const nextPassport = {
        ...normalized,
        badgeAwards: evaluatePassportBadges(normalized),
      };

      writePassport(nextPassport);
      return nextPassport;
    }
  } catch {
    backupRawPassport(raw);
    return createEmptyPassport();
  }

  backupRawPassport(raw);
  return createEmptyPassport();
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
    status: "collected",
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
  const existingEntry = passport.entries.find(
    (current) => current.menuItemId === entry.menuItemId,
  );
  const entries = existingEntry
    ? passport.entries.map((current) =>
        current.menuItemId === entry.menuItemId
          ? {
              ...current,
              ...entry,
              id: current.id,
              note: entry.note ?? current.note,
              triedAt: current.triedAt,
              status: current.status,
              verifiedAt: current.verifiedAt,
              verificationMethod: current.verificationMethod,
              verificationCode: current.verificationCode,
              verificationSource: current.verificationSource,
            }
          : current,
      )
    : [entry, ...passport.entries];
  const nextPassport: GuestPassport = {
    ...passport,
    entries,
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

export function verifyPassportEntry({
  categoryName,
  categorySlug,
  code,
  item,
  linkedProducts,
  source = "menu_qr",
}: {
  categoryName: string;
  categorySlug: string;
  code: string;
  item: MenuItem;
  linkedProducts: Product[];
  source?: PassportVerificationSource;
}): GuestPassport {
  const passport = readPassport();
  const now = new Date().toISOString();
  const existingEntry = passport.entries.find(
    (entry) => entry.menuItemId === item.id,
  );
  const verification = {
    status: "verified" as const,
    verifiedAt: now,
    verificationMethod: "qr_stamp" as const,
    verificationCode: code,
    verificationSource: source,
  };
  const verifiedEntry = existingEntry
    ? {
        ...existingEntry,
        ...verification,
      }
    : {
        ...createPassportEntry({
          item,
          categorySlug,
          categoryName,
          linkedProducts,
        }),
        ...verification,
      };
  const entries = existingEntry
    ? passport.entries.map((entry) =>
        entry.menuItemId === item.id ? verifiedEntry : entry,
      )
    : [verifiedEntry, ...passport.entries];
  const nextPassport: GuestPassport = {
    ...passport,
    entries,
    sync: {
      status: "local_only",
    },
  };
  const nextWithBadges: GuestPassport = {
    ...nextPassport,
    badgeAwards: evaluatePassportBadges(nextPassport),
  };

  writePassport(nextWithBadges);

  return nextWithBadges;
}
