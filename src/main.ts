import {
  cliExecute,
  isAccessible,
  isDarkMode,
  Item,
  print,
  sellPrice,
  toInt,
  toItem,
  visitUrl,
} from "kolmafia";
import { ALL_TAB_TITLES, InventoryType, isTabTitle, Tab, TabId, TabTitle } from "./types";
import { Options } from "./options";
import { actions, filters } from "./actions";
import { favoriteTabs, parseItems, parseNotes } from "./parse";
import { coinmasterBest } from "./coinmaster";
import { set } from "libram";

const HIGHLIGHT = isDarkMode() ? "yellow" : "blue";
const DEFAULT_ACTIONS =
  "closet use coinmaster mall autosell display sell kmail fuel collection low hawk";

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

function notesText(): string {
  const questLogNotesHtml = visitUrl("questlog.php?which=4");
  return questLogNotesHtml.substring(
    questLogNotesHtml.indexOf(">", questLogNotesHtml.indexOf("<textarea")) + 1,
    questLogNotesHtml.indexOf("</textarea")
  );
}

function tabAliases(): Map<string, string> {
  const questLogAliases: RegExpExecArray[] = notesText()
    .split("\n")
    .map((s) => /keeping-tabs: ?([A-Za-z0-9\- ]+)=(.*)/g.exec(s))
    .filter((r) => r !== null) as RegExpExecArray[];

  const values: [string, string][] = questLogAliases.map((r) => [r[1], r[2]]);
  return new Map(values);
}

function tabCollections(): Map<string, Item[]> {
  const questLogEntries: RegExpExecArray[] = notesText()
    .split("\n")
    .map((s) => /keeping-tabs-collection: ?'(.*)'=([0-9,]+)/g.exec(s))
    .filter((r) => r !== null) as RegExpExecArray[];

  const values: [string, Item[]][] = questLogEntries.map((r) => [
    r[1],
    r[2].split(",").map((i) => toItem(toInt(i))),
  ]);
  return new Map(values);
}

function tabString(tab: Tab): string {
  const options = Options.parse(tab.options);
  const title = tab.alias ? `${tab.title} (alias ${tab.alias})` : tab.title;
  return options.empty() ? title : `${title} with ${options}`;
}

function help(mode: "execute" | "debug") {
  switch (mode) {
    case "execute":
      print(`keeping-tabs help | debug [command] | [...actions]`, HIGHLIGHT);
      print(`help - print this dialog`);
      print(`debug - run debugging commands (use "debug help" to see available commands)`);
      print(`actions`);
      print(`Any of ${ALL_TAB_TITLES.join(", ")}`);
      print(` - execute all tabs matching that title`);
      print(` - default actions: ${DEFAULT_ACTIONS}`);
      break;
    case "debug":
      print(`keeping-tabs debug [command]`, HIGHLIGHT);
      print(`alias - print all parsed aliases from notes`);
      print(`collections - print all item target collections from notes`);
      print(
        `coinmasters - print all coinmaster items, target items (and best option based on mall price) from notes`
      );
      break;
  }
}

function execute(splitArgs: string[]) {
  const parsedNotes = parseNotes();

  cliExecute("refresh inventory");
  const tabs = favoriteTabs(parsedNotes.aliases);
  const commands: TabTitle[] = splitArgs.filter(isTabTitle);
  for (const command of commands) {
    for (const tab of tabs) {
      if (tab.title === command) {
        const options = Options.parse(tab.options, parsedNotes);
        const tabForOptions = actions[tab.title](options);

        print(`Running ${tabString(tab)}`, HIGHLIGHT);

        parseItems(tab.id, tab.type).filter(filters(options)).map(tabForOptions.action);
        tabForOptions.finalize?.();
      }
    }
  }
  set("_keepingTabs", ["keeping-tabs", splitArgs].join(" "));
}

function debug(option: string) {
  const parsedNotes = parseNotes();
  if (option === "alias") {
    print(`Parsed aliases:`, HIGHLIGHT);
    [...parsedNotes.aliases.entries()].forEach((v) => {
      const [alias, title] = v;
      print(`Alias ${alias} for action ${title}`, HIGHLIGHT);
    });
  } else if (option === "collections") {
    print(`Parsed collections:`, HIGHLIGHT);
    [...parsedNotes.collections.entries()].forEach((v) => {
      const [item, target] = v;
      print(`Send ${item} to ${target}`);
    });
  } else if (option === "coinmasters") {
    print(`Parsed coinmasters:`, HIGHLIGHT);
    [...parsedNotes.coinmasters.entries()].forEach((v) => {
      const [coin, [coinmaster, target]] = v;
      print(
        `Buy ${target} from ${coinmaster} using ${sellPrice(coinmaster, target)} ${coin} ${
          isAccessible(coinmaster) ? "" : "(currently unaccessible)"
        }`
      );
      const best = coinmasterBest(coin);
      if (best) {
        const [coinmaster, target] = best;
        print(
          `Best: Buy ${target} from ${coinmaster} using ${sellPrice(coinmaster, target)} ${coin} ${
            isAccessible(coinmaster) ? "" : "(currently unaccessible)"
          }`
        );
      }
    });
  } else {
    print(`Invalid debug option '${option}'`);
  }
}

export function main(args = DEFAULT_ACTIONS): void {
  const splitArgs = args.split(" ");
  if (splitArgs[0] === "debug") {
    if (splitArgs.length !== 2 || splitArgs[1] === "help") {
      help("debug");
    } else {
      debug(splitArgs[1]);
    }
  } else if (splitArgs[0] === "help") {
    help("execute");
  } else {
    execute(splitArgs);
  }
}
