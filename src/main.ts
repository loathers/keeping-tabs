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
import { InventoryType, isTabTitle, Tab, TabId, TabTitle } from "./types";
import { Options } from "./options";
import { actions, filters } from "./actions";

const HIGHLIGHT = isDarkMode() ? "yellow" : "blue";

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

function tabAliases(): Map<string, string> {
  const questLogNotesHtml = visitUrl("questlog.php?which=4");
  const questLogNotes = questLogNotesHtml.substring(
    questLogNotesHtml.indexOf(">", questLogNotesHtml.indexOf("<textarea")) + 1,
    questLogNotesHtml.indexOf("</textarea")
  );

  const questLogRegex = /keeping-tabs: ?([A-Za-z0-9\- ]+)=(.*)/g;
  const questLogEntries: RegExpExecArray[] = questLogNotes
    .split("\n")
    .map((s) => questLogRegex.exec(s))
    .filter((r) => r !== null) as RegExpExecArray[];

  const values: [string, string][] = questLogEntries.map((r) => [r[1], r[2]]);
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
  const options = Options.parse(tab.options);

  const title = tab.alias ? `${tab.title} (alias ${tab.alias})` : tab.title;
  return options.empty() ? title : `${title} with ${options}`;
}

export function main(args = "closet use mall autosell display sell kmail fuel"): void {
  cliExecute("refresh inventory");
  const tabs = favoriteTabs();
  const commands: TabTitle[] = args.split(" ").filter(isTabTitle);
  for (const command of commands) {
    for (const tab of tabs) {
      if (tab.title === command) {
        const options = Options.parse(tab.options);
        const tabForOptions = actions[tab.title](options);

        print(`Running ${tabString(tab)}`, HIGHLIGHT);

        items(tab.id, tab.type).filter(filters(options)).map(tabForOptions.action);
        tabForOptions.finalize?.();
      }
    }
  }
}
