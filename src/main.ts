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
import { ALL_TAB_TITLES, InventoryType, isTabTitle, Tab, TabId, TabTitle } from "./types";
import { Options } from "./options";
import { actions, filters } from "./actions";

const HIGHLIGHT = isDarkMode() ? "yellow" : "blue";
const DEFAULT_ACTIONS = "closet use mall autosell display sell kmail fuel collection";

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

function favoriteTabs(): Tab[] {
  // visit the consumables tab to ensure that you get clickable links for
  // all favorite tabs
  const inventory = visitUrl(`inventory.php?which=1`);
  const tabRegex =
    /<a href="inventory.php\?which=f(\d+)">([A-Za-z0-9;&]+)(:[A-Za-z0-9;&\-#,<>=]+)?<\/a>/g;
  const aliasRegex = /([A-Za-z0-9;&]+)(:[A-Za-z0-9;&\-#,<>=]+)?/g;

  const tabs: Tab[] = [];
  const aliases = tabAliases();

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
    } else if (alias && (aliasMatch = aliasRegex.exec(alias))) {
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

function tabString(tab: Tab): string {
  const options = Options.parse(tab.options, new Map());

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
      break;
  }
}

function execute(splitArgs: string[]) {
  cliExecute("refresh inventory");
  const tabs = favoriteTabs();
  const commands: TabTitle[] = splitArgs.filter(isTabTitle);
  for (const command of commands) {
    for (const tab of tabs) {
      if (tab.title === command) {
        const options = Options.parse(tab.options, tabCollections());
        const tabForOptions = actions[tab.title](options);

        print(`Running ${tabString(tab)}`, HIGHLIGHT);

        items(tab.id, tab.type).filter(filters(options)).map(tabForOptions.action);
        tabForOptions.finalize?.();
      }
    }
  }
}

function debug(option: string) {
  if (option === "alias") {
    const aliases = tabAliases();
    print(`Parsed aliases:`, HIGHLIGHT);
    [...aliases.entries()].forEach((v) => {
      const [alias, title] = v;
      print(`Alias ${alias} for action ${title}`, HIGHLIGHT);
    });
  } else if (option === "collections") {
    const collections = tabCollections();
    print(`Parsed collections:`, HIGHLIGHT);
    [...collections.entries()].forEach((v) => {
      const [item, target] = v;
      print(`Send ${item} to ${target}`);
    });
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
