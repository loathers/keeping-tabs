import {
  autosell,
  autosellPrice,
  cliExecute,
  closetAmount,
  displayAmount,
  isCoinmasterItem,
  Item,
  itemAmount,
  mallPrice,
  print,
  putCloset,
  putDisplay,
  putShop,
  shopAmount,
  use,
  wellStocked,
} from "kolmafia";
import { AsdonMartin, Kmail } from "libram";
import { Options } from "./options";
import { TabTitle } from "./types";
import { coinmasterBest, coinmasterBuyAll } from "./coinmaster";
import { warn } from "./lib";

function amount(item: Item, options: Options) {
  if (options.keep) {
    return Math.max(0, itemAmount(item) - options.keep);
  } else {
    return itemAmount(item);
  }
}

export function filters(options: Options): (item: Item) => boolean {
  if (options.priceUpperThreshold && options.priceLowerThreshold) {
    const between = (x: number, lower: number, upper: number) => lower < x && x < upper;
    const upperThreshold = options.priceUpperThreshold;
    const lowerThreshold = options.priceLowerThreshold;
    return (item: Item) => between(mallPrice(item), lowerThreshold, upperThreshold);
  }
  return (item: Item) => true;
}

export const actions: {
  [T in TabTitle]: (options: Options) => {
    action: (item: Item) => void;
    finalize?: () => void;
  };
} = {
  mall: (options: Options) => {
    if (options.stock) {
      return {
        action: (item: Item) =>
          putShop(
            0,
            0,
            Math.min(Math.max(0, (options.stock ?? 0) - shopAmount(item)), amount(item, options)),
            item
          ),
      };
    }
    return { action: (item: Item) => putShop(0, 0, amount(item, options), item) };
  },
  sell: (options: Options) => {
    return {
      action: (item: Item) => {
        if (
          wellStocked(`${item}`, 1000, Math.max(100, autosellPrice(item) * 2)) ||
          !item.tradeable
        ) {
          autosell(amount(item, options), item);
        } else {
          putShop(0, 0, amount(item, options), item);
        }
      },
    };
  },
  low: (options) => {
    return {
      action: (item) => {
        putShop(mallPrice(item), 0, amount(item, options), item);
      },
    };
  },
  display: (options: Options) => {
    if (options.stock) {
      return {
        action: (item: Item) =>
          putDisplay(
            Math.min(
              Math.max(0, (options.stock ?? 0) - displayAmount(item)),
              amount(item, options)
            ),
            item
          ),
      };
    }
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
        print(`Sending Kmail to ${target}`);
        Kmail.send(target, options.body ?? "", itemQuantities);
      },
    };
  },
  closet: (options: Options) => {
    if (options.stock) {
      return {
        action: (item: Item) =>
          putDisplay(
            Math.min(Math.max(0, (options.stock ?? 0) - closetAmount(item)), amount(item, options)),
            item
          ),
      };
    }
    return {
      action: (item: Item) => putCloset(amount(item, options), item),
    };
  },
  fuel: (options: Options) => {
    if (!AsdonMartin.installed()) {
      warn("Asdon martin not installed, skipping fuel action");
      return {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        action: (item: Item) => {},
      };
    }
    return {
      action: (item: Item) => cliExecute(`asdonmartin fuel ${amount(item, options)} ${item}`),
    };
  },
  collection: (options: Options) => {
    const kmails = new Map<string, Item[]>();
    return {
      action: (item: Item) => {
        options.collections.forEach((colItems, target) => {
          if (colItems.includes(item)) {
            const items = kmails.get(target);
            if (items) {
              kmails.set(target, [...items, item]);
            } else {
              kmails.set(target, [item]);
            }
          }
        });
      },
      finalize: () => {
        [...kmails.entries()].map((v) => {
          const [target, items] = v;
          const itemQuantities = new Map<Item, number>(items.map((i) => [i, amount(i, options)]));
          print(`Sending Kmail to ${target}`);
          Kmail.send(
            target,
            options.body ?? "For your collection, courtesy of keeping-tabs",
            itemQuantities
          );
        });
      },
    };
  },
  coinmaster: (options: Options) => ({
    action: (item: Item) => {
      const targetPair = options.coinmasters.get(item);
      const availableCoins = amount(item, options);
      if (targetPair) {
        const [coinmaster, targetItem] = targetPair;
        coinmasterBuyAll(coinmaster, targetItem, availableCoins);
      } else if (options.best) {
        const best = coinmasterBest(item);
        if (best && best[1] !== item) {
          print(`Computed best for ${item} is ${best[1]} from ${best[0]}`);
          coinmasterBuyAll(...best, availableCoins);
        }
      }
    },
  }),
};
