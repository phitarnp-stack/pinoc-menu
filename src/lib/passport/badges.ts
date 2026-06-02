import { deriveFlavorCollections, deriveOriginCollections } from "./collections";
import type {
  GuestPassport,
  PassportBadgeAward,
  PassportBadgeDefinition,
  PassportBadgeId,
  PassportEntry,
} from "@/src/types/passport";

export const passportBadgeDefinitions: PassportBadgeDefinition[] = [
  {
    id: "first-origin",
    name: "First Origin",
    description: "You collected your first origin story.",
    lockedDescription: "Add a cup with origin details to begin this collection.",
  },
  {
    id: "first-flavor",
    name: "First Flavor",
    description: "You started noticing the flavor language of your cups.",
    lockedDescription: "Add a cup to collect your first flavor note.",
  },
  {
    id: "coffee-first-step",
    name: "Coffee First Step",
    description: "Your coffee journey has begun.",
    lockedDescription: "Add a coffee or milk coffee to your Passport.",
  },
  {
    id: "matcha-discovery",
    name: "Matcha Discovery",
    description: "You added matcha to your discovery journal.",
    lockedDescription: "Add a matcha menu item to your Passport.",
  },
  {
    id: "cocoa-discovery",
    name: "Cocoa Discovery",
    description: "You collected a craft cocoa experience.",
    lockedDescription: "Add a craft cocoa menu item to your Passport.",
  },
  {
    id: "special-explorer",
    name: "Special Explorer",
    description: "You explored a Pinoc special.",
    lockedDescription: "Add a special menu item to your Passport.",
  },
  {
    id: "discovery-journal",
    name: "Discovery Journal",
    description: "Five cups now live in your Passport.",
    lockedDescription: "Collect five experiences to complete this badge.",
  },
];

const getFirstEntryId = (entries: PassportEntry[], predicate: (entry: PassportEntry) => boolean) =>
  entries.find(predicate)?.id;

export function evaluatePassportBadges(
  passport: GuestPassport,
): PassportBadgeAward[] {
  const currentAwards = new Map(
    passport.badgeAwards.map((award) => [award.badgeId, award]),
  );
  const nextAwards = [...passport.badgeAwards];
  const origins = deriveOriginCollections(passport.entries);
  const flavors = deriveFlavorCollections(passport.entries);

  const award = (badgeId: PassportBadgeId, sourceEntryId?: string) => {
    if (currentAwards.has(badgeId)) {
      return;
    }

    const nextAward: PassportBadgeAward = {
      badgeId,
      awardedAt: new Date().toISOString(),
      sourceEntryId,
    };

    currentAwards.set(badgeId, nextAward);
    nextAwards.push(nextAward);
  };

  if (origins.length > 0) {
    award("first-origin", origins[0]?.entryIds[0]);
  }

  if (flavors.length > 0) {
    award("first-flavor", flavors[0]?.entryIds[0]);
  }

  const coffeeEntryId = getFirstEntryId(
    passport.entries,
    (entry) =>
      entry.drinkType === "coffee" ||
      entry.drinkType === "milk_coffee" ||
      entry.categoryId === "classic-coffee" ||
      entry.categoryId === "filter-coffee",
  );

  if (coffeeEntryId) {
    award("coffee-first-step", coffeeEntryId);
  }

  const matchaEntryId = getFirstEntryId(
    passport.entries,
    (entry) => entry.drinkType === "matcha" || entry.categoryId === "matcha",
  );

  if (matchaEntryId) {
    award("matcha-discovery", matchaEntryId);
  }

  const cocoaEntryId = getFirstEntryId(
    passport.entries,
    (entry) =>
      entry.drinkType === "craft_cocoa" || entry.categoryId === "craft-cocoa",
  );

  if (cocoaEntryId) {
    award("cocoa-discovery", cocoaEntryId);
  }

  const specialEntryId = getFirstEntryId(
    passport.entries,
    (entry) => entry.categoryId === "special",
  );

  if (specialEntryId) {
    award("special-explorer", specialEntryId);
  }

  if (passport.entries.length >= 5) {
    award("discovery-journal", passport.entries[4]?.id);
  }

  return nextAwards;
}
