import {
  autosell,
  autosellPrice,
  cliExecute,
  Item,
  itemAmount,
  putDisplay,
  putShop,
  toInt,
  toItem,
  use,
  visitUrl,
  wellStocked,
} from "kolmafia";
import { Kmail } from "libram";

type InventoryType = "inventory" | "hagnk" | "closet";

const ALL_TAB_TITLES = ["mall", "display", "use", "autosell", "kmail", "sell", "pull"] as const;
type TabTitleTuple = typeof ALL_TAB_TITLES;
type TabTitle = TabTitleTuple[number];
type TabId = number;

function isTabTitle(value: string): value is TabTitle {
  return ALL_TAB_TITLES.includes(value as TabTitle);
}

const ALL_ACTION_OPTIONS = ["keep", "target"] as const;
type ActionOptionTuple = typeof ALL_ACTION_OPTIONS;
type ActionOption = ActionOptionTuple[number];

type Options = {
  keep?: number;
  target?: string;
  default?: string;
  limit?: number;
};

function parseOptions(optionsStr: string[]): Options {
  const options: Options = {};

  for (const optionStr of optionsStr) {
    const keep = optionStr.match(/keep(\d+)/);
    if (keep && keep[1]) {
      options.keep = parseInt(keep[1]);
      continue;
    }
    const target = optionStr.match(/#(.*)/);
    if (target && target[1]) {
      options.target = target[1];
      continue;
    }
    const limit = optionStr.match(/limit(\d+)/);
    if (limit && limit[1]) {
      options.limit = parseInt(limit[1]);
    }
    options.default = optionStr;
  }
  return options;
}

function amount(item: Item, options: Options) {
  if (options.keep) {
    return Math.max(0, itemAmount(item) - options.keep);
  } else {
    return itemAmount(item);
  }
}

const actions: {
  [T in TabTitle]: (options: Options) => {
    action: (item: Item) => void;
    finalize?: () => void;
  };
} = {
  mall: (options: Options) => {
    return { action: (item: Item) => putShop(0, 0, amount(item, options), item) };
  },
  sell: (options: Options) => {
    return {
      action: (item: Item) => {
        if (wellStocked(`${item}`, 1000, Math.min(100, autosellPrice(item) * 2))) {
          autosell(amount(item, options), item);
        } else {
          putShop(0, 0, amount(item, options), item);
        }
      },
    };
  },
  display: (options: Options) => {
    return { action: (item: Item) => putDisplay(amount(item, options), item) };
  },
  use: (options: Options) => {
    return { action: (item: Item) => use(amount(item, options), item) };
  },
  autosell: (options: Options) => {
    return { action: (item: Item) => autosell(amount(item, options), item) };
  },
  kmail: (options: Options) => {
    const items: Item[] = [];
    return {
      action: (item: Item) => items.push(item),
      finalize: () => {
        const target = options.target ?? options.default;
        if (!target) {
          throw "You must specify a User # to Kmail!";
        }
        const itemQuantities = new Map<Item, number>(items.map((i) => [i, amount(i, options)]));
        Kmail.send(target, "", itemQuantities);
      },
    };
  },
  pull: (options: Options) => {
    const items: Item[] = [];
    return {
      action: (item: Item) => items.push(item),
      finalize: () => cliExecute(`hagnk ${items.join(",")}`),
    };
  },
};

function items(tabId: TabId, type: InventoryType): Item[] {
  const tab = visitUrl(`${type}.php?which=f${tabId}`);
  const regexp = /ic(\d+)/g;
  const items: Item[] = [];

  let match;
  while ((match = regexp.exec(tab)) !== null) {
    const item = toItem(toInt(match[1]));
    items.push(item);
  }
  return items;
}

function favoriteTabs(): { title: TabTitle; id: TabId; type: InventoryType; options: string[] }[] {
  // visit the consumables tab to ensure that you get clickable links for
  // all favorite tabs
  const inventory = visitUrl(`inventory.php?which=1`);
  const regexp =
    /<a href="inventory.php\?which=f(\d+)">([A-Za-z0-9;&]+)(:[A-Za-z0-9;&\-#,]+)?<\/a>/g;
  const tabs: { title: TabTitle; id: TabId; type: InventoryType; options: string[] }[] = [];

  let match;
  while ((match = regexp.exec(inventory)) !== null) {
    const title = match[2];
    const options = match[3];
    if (isTabTitle(title)) {
      tabs.push({
        title,
        id: parseInt(match[1]),
        options: (options ?? ":").substring(1).split(","),
        type: title === "pull" ? "hagnk" : "inventory",
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
        const tabForOptions = actions[tab.title](parseOptions(tab.options));
        items(tab.id, tab.type).map(tabForOptions.action);
        tabForOptions.finalize?.();
      }
    }
  }
}
