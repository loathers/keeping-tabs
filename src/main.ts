import {
  autosell,
  cliExecute,
  getShop,
  Item,
  itemAmount,
  print,
  putDisplay,
  putShop,
  repriceShop,
  shopPrice,
  toInt,
  toItem,
  use,
  visitUrl,
} from "kolmafia";
import { $item } from "libram";

type TabTitle = "mall this" | "display this" | "use this" | "autosell this";

const tabLookup: { [Title in TabTitle]: number } = {
  "mall this": 2,
  "display this": 3,
  "use this": 4,
  "autosell this": 5,
};

const actions: { [Title in TabTitle]: (item: Item) => void } = {
  "mall this": (item: Item) => putShop(0, 0, item),
  "display this": (item: Item) => putDisplay(itemAmount(item), item),
  "use this": (item: Item) => use(itemAmount(item), item),
  "autosell this": (item: Item) => autosell(itemAmount(item), item),
};

function getItemsInTab(title: TabTitle): Item[] {
  print(`Matching tab ${title}`);
  const tab = visitUrl(`inventory.php?which=f${tabLookup[title]}`);
  const regexp = /ic(\d+)/g;

  let match;
  const items: Item[] = [];

  while ((match = regexp.exec(tab)) !== null) {
    const item = toItem(toInt(match[1]));
    items.push(item);
  }
  return items;
}

const fixedPrices = new Map<Item, number>([[$item`pocket wish`, 49995]]);

function shopItems(): Item[] {
  return Object.keys(getShop()).map((itemStr) => toItem(itemStr));
}

export function main(args = "use mall autosell display"): void {
  const commandLookup = new Map<string, TabTitle>([
    ["mall", "mall this"],
    ["display", "display this"],
    ["use", "use this"],
    ["autosell", "autosell this"],
  ]);
  const commands = args.split(" ").map((command) => commandLookup.get(command));
  for (const command of commands) {
    if (command) {
      print(`Executing ${command}`, "yellow");
      getItemsInTab(command).forEach(actions[command]);
    }
  }
  if (commands.includes("mall this")) {
    shopItems().forEach((item) => {
      const fixedPrice = fixedPrices.get(item);
      if (fixedPrice) {
        repriceShop(fixedPrice, item);
      }
    });
    cliExecute("reprice");
    const maxPriceItems = shopItems().filter((i) => shopPrice(i) === 999999999);
    if (maxPriceItems.length > 0) {
      print("Some Items are Still at Max Price", "red");
      maxPriceItems.forEach((i) => print(`* ${i}`, "red"));
    }
  }
}
