import type { MenuItem } from "@/src/types/menu";

export const defaultDrinkStory = {
  storyTitle: "A Journey Worth Slowing Down",
  storyDescription:
    "A cup designed to reveal its character gradually. Take your time and discover each layer.",
  servingRitual:
    "Served with intention. Notice the aroma before the first sip.",
  whyWeCreatedIt: "We believe every drink deserves a story.",
  bestFor: ["Slow moments", "Curious minds", "Meaningful conversations"],
};

export function getMenuItemStory(item: MenuItem) {
  const useCustomStory = item.storyStatus === "custom";

  return {
    storyTitle:
      useCustomStory && item.storyTitle
        ? item.storyTitle
        : defaultDrinkStory.storyTitle,
    storyDescription:
      useCustomStory && item.storyDescription
        ? item.storyDescription
        : defaultDrinkStory.storyDescription,
    servingRitual:
      useCustomStory && item.servingRitual
        ? item.servingRitual
        : defaultDrinkStory.servingRitual,
    whyWeCreatedIt:
      useCustomStory && item.whyWeCreatedIt
        ? item.whyWeCreatedIt
        : defaultDrinkStory.whyWeCreatedIt,
    bestFor:
      useCustomStory && item.bestFor && item.bestFor.length > 0
        ? item.bestFor
        : defaultDrinkStory.bestFor,
  };
}
