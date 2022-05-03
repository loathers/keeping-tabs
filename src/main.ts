import {
  autosell,
  Item,
  itemAmount,
  print,
  putDisplay,
  putShop,
  toInt,
  toItem,
  use,
  visitUrl,
} from "kolmafia";
import { Kmail } from "libram";

const ALL_TAB_TITLES = ["mall", "display", "use", "autosell", "kmail"] as const;
type TabTitleTuple = typeof ALL_TAB_TITLES;
type TabTitle = TabTitleTuple[number];
type TabId = number;

function isTabTitle(value: string): value is TabTitle {
  return ALL_TAB_TITLES.includes(value as TabTitle);
}

const actions: {
  [T in TabTitle]: (options: string[]) => {
    action: (item: Item) => void;
    finalize?: () => void;
  };
} = {
  mall: (_options: string[]) => {
    return { action: (item: Item) => putShop(0, 0, item) };
  },
  display: (_options: string[]) => {
    return { action: (item: Item) => putDisplay(itemAmount(item), item) };
  },
  use: (_options: string[]) => {
    return { action: (item: Item) => use(itemAmount(item), item) };
  },
  autosell: (_options: string[]) => {
    return { action: (item: Item) => autosell(itemAmount(item), item) };
  },
  kmail: (options: string[]) => {
    const items: Item[] = [];
    return {
      action: (item: Item) => items.push(item),
      finalize: () => {
        const itemQuantities = new Map<Item, number>(items.map((i) => [i, itemAmount(i)]));
        Kmail.send(options[0], "", itemQuantities);
      },
    };
  },
};

function items(tabId: TabId): Item[] {
  const tab = visitUrl(`inventory.php?which=f${tabId}`);
  const regexp = /ic(\d+)/g;
  const items: Item[] = [];

  let match;
  while ((match = regexp.exec(tab)) !== null) {
    const item = toItem(toInt(match[1]));
    items.push(item);
  }
  return items;
}

function favoriteTabs(): { title: TabTitle; id: TabId; options: string[] }[] {
  // visit the consumables tab to ensure that you get clickable links for
  // all favorite tabs
  const inventory = visitUrl(`inventory.php?which=1`);
  const regexp = /<a href="inventory.php\?which=f(\d+)">([A-Za-z0-9;&]+)(:[A-Za-z0-9;&]+)?<\/a>/g;
  const tabs: { title: TabTitle; id: TabId; options: string[] }[] = [];

  let match;
  while ((match = regexp.exec(inventory)) !== null) {
    const title = match[2];
    const options = match[3];
    print(`${match[1]} ${match[2]} ${match[3]}`);
    if (isTabTitle(title)) {
      tabs.push({
        title,
        id: parseInt(match[1]),
        options: (options ?? ":").substring(1).split(","),
      });
    }
  }

  return tabs;
}

export function main(args = "use mall autosell display kmail"): void {
  const tabs = favoriteTabs();
  const commands: TabTitle[] = args.split(" ").filter(isTabTitle);
  for (const command of commands) {
    for (const tab of tabs) {
      if (tab.title === command) {
        const tabForOptions = actions[tab.title](tab.options);
        items(tab.id).map(tabForOptions.action);
        tabForOptions.finalize?.();
      }
    }
  }
}
