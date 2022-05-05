export type InventoryType = "inventory" | "hagnk" | "closet";

const ALL_TAB_TITLES = [
  "mall",
  "display",
  "use",
  "autosell",
  "kmail",
  "sell",
  "closet",
  "fuel",
] as const;
type TabTitleTuple = typeof ALL_TAB_TITLES;
export type TabTitle = TabTitleTuple[number];
export type TabId = number;

export function isTabTitle(value: string): value is TabTitle {
  return ALL_TAB_TITLES.includes(value as TabTitle);
}

const ALL_ACTION_OPTIONS = ["keep", "target"] as const;
type ActionOptionTuple = typeof ALL_ACTION_OPTIONS;
export type ActionOption = ActionOptionTuple[number];

export function isActionOption(value: string): value is ActionOption {
  return ALL_ACTION_OPTIONS.includes(value as ActionOption);
}
