import {
  autosell,
  autosellPrice,
  cliExecute,
  isDarkMode,
  Item,
  itemAmount,
  mallPrice,
  print,
  putCloset,
  putDisplay,
  putShop,
  toInt,
  toItem,
  use,
  visitUrl,
  wellStocked,
} from "kolmafia";
import { Kmail } from "libram";
import { InventoryType, isTabTitle, TabId, TabTitle } from "./types";
import { Options } from "./options";

const HIGHLIGHT = isDarkMode() ? "yellow" : "blue";

function amount(item: Item, options: Options) {
  if (options.keep) {
    return Math.max(0, itemAmount(item) - options.keep);
  } else {
    return itemAmount(item);
  }
}

function filters(options: Options): (item: Item) => boolean {
  if (options.priceUpperThreshold && options.priceLowerThreshold) {
    const between = (x: number, lower: number, upper: number) => lower < x && x < upper;
    const upperThreshold = options.priceUpperThreshold;
    const lowerThreshold = options.priceLowerThreshold;
    return (item: Item) => between(mallPrice(item), lowerThreshold, upperThreshold);
  }
  return (item: Item) => true;
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
    return {
      action: (item: Item) => {
        print(`${item}: ${amount(item, options)}`);
        putDisplay(amount(item, options), item);
      },
    };
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
        print(`Sending Kmail to ${target}`);
        Kmail.send(target, options.body ?? "", itemQuantities);
      },
    };
  },
  closet: (options: Options) => {
    return {
      action: (item: Item) => putCloset(amount(item, options), item),
    };
  },
  fuel: (options: Options) => {
    return {
      action: (item: Item) => cliExecute(`asdonmartin fuel ${amount(item, options)} ${item}`),
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
    /<a href="inventory.php\?which=f(\d+)">([A-Za-z0-9;&]+)(:[A-Za-z0-9;&\-#,<>=]+)?<\/a>/g;
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
        type: "inventory",
      });
    }
  }

  return tabs;
}

export function main(args = "closet use mall autosell display kmail fuel"): void {
  cliExecute("refresh inventory");
  const tabs = favoriteTabs();
  const commands: TabTitle[] = args.split(" ").filter(isTabTitle);
  for (const command of commands) {
    for (const tab of tabs) {
      if (tab.title === command) {
        const options = Options.parse(tab.options);
        const tabForOptions = actions[tab.title](options);

        if (options.empty()) {
          print(`Running ${tab.title}`, HIGHLIGHT);
        } else {
          print(`Running ${tab.title} with ${options}`, HIGHLIGHT);
        }

        items(tab.id, tab.type).filter(filters(options)).map(tabForOptions.action);
        tabForOptions.finalize?.();
      }
    }
  }
}
