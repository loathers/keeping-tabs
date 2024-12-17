import {
  autosell,
  autosellPrice,
  cliExecute,
  closetAmount,
  displayAmount,
  Item,
  itemAmount,
  mallPrice,
  print,
  shopAmount,
  use,
  wellStocked,
} from "kolmafia";
import {
  AsdonMartin,
  bulkAutosell,
  bulkPutCloset,
  bulkPutDisplay,
  bulkPutShop,
  clamp,
  Kmail,
  sumNumbers,
} from "libram";
import { Options } from "./options";
import { TabTitle } from "./types";
import { coinmasterBest, coinmasterBuyAll } from "./coinmaster";
import { warn } from "./lib";

function amount(item: Item, options: Options) {
  if (options.keep) {
    return clamp(itemAmount(item) - options.keep, 0, itemAmount(item));
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

function makeBulk(
  bulkOperation: (items: Map<Item, number>) => boolean,
  baseAmount?: (item: Item) => number
) {
  const items = new Map<Item, number>();

  return (options: Options) => ({
    action: (item: Item) =>
      items.set(
        item,
        baseAmount && options.stock
          ? clamp((options.stock ?? 0) - baseAmount(item), 0, amount(item, options))
          : amount(item, options)
      ),
    finalize: () => {
      bulkOperation(items);
    },
  });
}

function makeMall(mallOptions?: { price?: (item: Item) => number; stock?: boolean }) {
  return (options: Options) => {
    const mallItems = new Map<Item, { quantity?: number; limit?: number; price: number }>();
    const quantity =
      options.stock && mallOptions?.stock
        ? (item: Item) => clamp((options.stock ?? 0) - shopAmount(item), 0, amount(item, options))
        : (item: Item) => amount(item, options);

    return {
      action: (item: Item) =>
        mallItems.set(item, {
          quantity: quantity(item),
          limit: options.limit,
          price: mallOptions?.price ? mallOptions.price(item) : options.price ?? 0,
        }),
      finalize: () => bulkPutShop(mallItems),
    };
  };
}

export const actions: {
  [T in TabTitle]: (options: Options) => {
    action: (item: Item) => void;
    finalize?: () => void;
  };
} = {
  mall: makeMall({ stock: true }),
  sell: (options: Options) => {
    const mallAction = makeMall()(options);
    const autosellAction = makeBulk(bulkAutosell)(options);

    return {
      action: (item: Item) => {
        if (
          wellStocked(
            `${item}`,
            1000,
            clamp(autosellPrice(item) * 2, 100, autosellPrice(item) * 2)
          ) ||
          !item.tradeable
        ) {
          autosellAction.action(item);
        } else {
          mallAction.action(item);
        }
      },
      finalize: () => {
        mallAction.finalize();
        autosellAction.finalize();
      },
    };
  },
  low: makeMall({ price: mallPrice }),
  display: makeBulk(bulkPutDisplay, displayAmount),
  use: (options: Options) => {
    return { action: (item: Item) => use(amount(item, options), item) };
  },
  autosell: makeBulk(bulkAutosell),
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
        if (sumNumbers([...itemQuantities.values()]) > 0)
          Kmail.send(target, options.body ?? "", itemQuantities);
      },
    };
  },
  closet: makeBulk(bulkPutCloset, closetAmount),
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
  smash: (options: Options) => {
    return {
      action: (item: Item) => cliExecute(`smash ${amount(item, options)} ${item}`),
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
