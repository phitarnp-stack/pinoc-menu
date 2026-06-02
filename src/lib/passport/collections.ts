import type {
  PassportEntry,
  PassportFlavorCollection,
  PassportFlavorSource,
  PassportOriginCollection,
} from "@/src/types/passport";

const normalizeKey = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-");

const addEntryId = (entryIds: string[], entryId: string) =>
  entryIds.includes(entryId) ? entryIds : [...entryIds, entryId];

export function deriveOriginCollections(
  entries: PassportEntry[],
): PassportOriginCollection[] {
  const collections = new Map<string, PassportOriginCollection>();

  for (const entry of entries) {
    for (const origin of entry.originSnapshots) {
      const keySource =
        [origin.origin, origin.region].filter(Boolean).join(":") ||
        origin.productId;
      const key = normalizeKey(keySource);
      const existing = collections.get(key);

      if (existing) {
        collections.set(key, {
          ...existing,
          productIds: existing.productIds.includes(origin.productId)
            ? existing.productIds
            : [...existing.productIds, origin.productId],
          entryIds: addEntryId(existing.entryIds, entry.id),
          count: existing.count + 1,
        });
        continue;
      }

      collections.set(key, {
        key,
        origin: origin.origin,
        region: origin.region,
        productIds: [origin.productId],
        entryIds: [entry.id],
        firstCollectedAt: entry.triedAt,
        count: 1,
      });
    }
  }

  return [...collections.values()].sort((left, right) =>
    left.firstCollectedAt.localeCompare(right.firstCollectedAt),
  );
}

function addFlavor(
  collections: Map<string, PassportFlavorCollection>,
  entry: PassportEntry,
  label: string,
  source: PassportFlavorSource,
) {
  const key = `${source}:${normalizeKey(label)}`;
  const existing = collections.get(key);

  if (existing) {
    collections.set(key, {
      ...existing,
      entryIds: addEntryId(existing.entryIds, entry.id),
      count: existing.count + 1,
    });
    return;
  }

  collections.set(key, {
    key,
    label,
    source,
    entryIds: [entry.id],
    firstCollectedAt: entry.triedAt,
    count: 1,
  });
}

export function deriveFlavorCollections(
  entries: PassportEntry[],
): PassportFlavorCollection[] {
  const collections = new Map<string, PassportFlavorCollection>();

  for (const entry of entries) {
    for (const note of entry.flavorNotes) {
      addFlavor(collections, entry, note, "flavor_note");
    }

    for (const tasteProfileId of entry.tasteProfileIds) {
      addFlavor(collections, entry, tasteProfileId, "taste_profile");
    }

    for (const tag of entry.flavorPreferences) {
      addFlavor(collections, entry, tag, "recommendation_tag");
    }
  }

  return [...collections.values()].sort((left, right) =>
    left.firstCollectedAt.localeCompare(right.firstCollectedAt),
  );
}
