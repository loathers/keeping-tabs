export type InventoryType = "inventory" | "hagnk" | "closet";

export const ALL_TAB_TITLES = [
  "mall",
  "display",
  "use",
  "autosell",
  "kmail",
  "sell",
  "closet",
  "fuel",
  "smash",
  "collection",
  "low",
  "coinmaster",
] as const;
export type TabTitle = (typeof ALL_TAB_TITLES)[number];
export type TabId = number;

export function isTabTitle(value: string): value is TabTitle {
  return ALL_TAB_TITLES.includes(value as TabTitle);
}

const ALL_ACTION_OPTIONS = ["keep", "stock", "limit", "price", "target"] as const;
export type ActionOption = (typeof ALL_ACTION_OPTIONS)[number];

export function isActionOption(value: string): value is ActionOption {
  return ALL_ACTION_OPTIONS.includes(value as ActionOption);
}

export type Tab = {
  title: TabTitle;
  id: TabId;
  type: InventoryType;
  options: string[];
  alias?: string;
};
