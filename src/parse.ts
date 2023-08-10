import { Coinmaster, isCoinmasterItem, Item, sellsItem, toInt, toItem, visitUrl } from "kolmafia";
import { InventoryType, isTabTitle, Tab, TabId } from "./types";
import { warn } from "./lib";

export function favoriteTabs(aliases: Map<string, string>): Tab[] {
  // visit the consumables tab to ensure that you get clickable links for
  // all favorite tabs
  const inventory = visitUrl(`inventory.php?which=1`);
  const tabRegex =
    /<a href="inventory.php\?which=f(\d+)">([A-Za-z0-9;&]+)(:[A-Za-z0-9;&\-#,<>=]+)?<\/a>/g;

  const tabs: Tab[] = [];

  let match;
  let aliasMatch;

  while ((match = tabRegex.exec(inventory)) !== null) {
    const title = match[2];
    const options = match[3];
    const alias = aliases.get(title);
    const id = parseInt(match[1]);

    if (isTabTitle(title)) {
      tabs.push({
        title,
        id,
        options: (options ?? ":").substring(1).split(","),
        type: "inventory",
      });
    } else if (alias && (aliasMatch = /([A-Za-z0-9;&]+)(:[A-Za-z0-9;&\-#,<>=]+)?/g.exec(alias))) {
      const aliasTitle = aliasMatch[1];
      const options = aliasMatch[2];
      if (isTabTitle(aliasTitle)) {
        tabs.push({
          title: aliasTitle,
          id: parseInt(match[1]),
          options: (options ?? ":").substring(1).split(","),
          type: "inventory",
          alias: title,
        });
      }
    }
  }

  return tabs;
}

export function parseItems(tabId: TabId, type: InventoryType): Item[] {
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

function notesText(): string {
  const questLogNotesHtml = visitUrl("questlog.php?which=4");
  return questLogNotesHtml.substring(
    questLogNotesHtml.indexOf(">", questLogNotesHtml.indexOf("<textarea")) + 1,
    questLogNotesHtml.indexOf("</textarea")
  );
}

function parseAliases(): Map<string, string> {
  const questLogAliases: RegExpExecArray[] = notesText()
    .split("\n")
    .map((s) => /^keeping-tabs: ?([A-Za-z0-9\- ]+)=(.*)/g.exec(s))
    .filter((r) => r !== null) as RegExpExecArray[];

  const values: [string, string][] = questLogAliases.map((r) => [r[1], r[2]]);
  return new Map(values);
}

function parseCollections(): Map<string, Item[]> {
  const questLogEntries = notesText()
    .split("\n")
    .map((s) => /^keeping-tabs-collection: ?'([^']*)'=(.*)\s*/g.exec(s))
    .filter((r) => r !== null && r.length > 1) as RegExpMatchArray[];

  const values: [string, Item[]][] = questLogEntries.map((r) => [
    r[1],
    r[2].split(",").map((i) => toItem(toInt(i))),
  ]);
  return new Map(values);
}

function parseCoinmasters(): Map<Item, [Coinmaster, Item]> {
  const questLogEntries: RegExpExecArray[] = notesText()
    .split("\n")
    .map((s) => /^keeping-tabs-coinmaster: ?([0-9]+)=([0-9]+)/g.exec(s))
    .filter((r) => r !== null) as RegExpExecArray[];

  const values: [Item, [Coinmaster, Item]][] = questLogEntries.map((r) => {
    const coin = toItem(toInt(r[1]));
    const item = toItem(toInt(r[2]));
    const coinmaster = Coinmaster.all().find((c) => c.item === coin && sellsItem(c, item));
    if (isCoinmasterItem(item) && coinmaster) {
      return [coin, [coinmaster, item]];
    } else {
      warn(`${item} is not a coinmaster item`);
      return [Item.none, [Coinmaster.none, Item.none]];
    }
  });

  return new Map(values.filter((value: [Item, [Coinmaster, Item]]) => value[0] !== Item.none));
}

export function parseNotes(): {
  aliases: Map<string, string>;
  collections: Map<string, Item[]>;
  coinmasters: Map<Item, [Coinmaster, Item]>;
} {
  return {
    aliases: parseAliases(),
    collections: parseCollections(),
    coinmasters: parseCoinmasters(),
  };
}
