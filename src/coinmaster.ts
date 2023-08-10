import { buy, Coinmaster, Item, mallPrice, sellPrice, sellsItem } from "kolmafia";
import { $item } from "libram";

export function coinmasterBuyAll(
  coinmaster: Coinmaster,
  target: Item,
  availableCoins: number
): void {
  const toBuy = Math.floor(availableCoins / sellPrice(coinmaster, target));
  if (toBuy > 0) {
    buy(coinmaster, toBuy, target);
  }
}

function getSellableItem(item: Item) {
  if (item === $item`Merc Core deployment orders`) {
    return $item`one-day ticket to Conspiracy Island`;
  }
  return item;
}

export function coinmasterBest(coin: Item): [Coinmaster, Item] | undefined {
  const coinmasters = Coinmaster.all().filter((c) => c.item === coin);
  const price = (c: Coinmaster, i: Item) => mallPrice(i) / sellPrice(c, i);

  const availablePurchases = coinmasters
    .map((c): [Coinmaster, Item][] =>
      Item.all()
        .filter((i) => sellsItem(c, i) && getSellableItem(i).tradeable)
        .map((i) => [c, getSellableItem(i)])
    )
    .reduce((arr, results) => [...arr, ...results], []);

  if (availablePurchases.length > 0) {
    const best = availablePurchases.reduce((best, current) =>
      price(...best) < price(...current) ? current : best
    );
    if (!coin.tradeable || price(...best) > mallPrice(coin)) {
      return best;
    }
  }
  return;
}
