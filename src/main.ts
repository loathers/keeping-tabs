import { cliExecute, isAccessible, isDarkMode, print, sellPrice } from "kolmafia";
import { ALL_TAB_TITLES, isTabTitle, Tab, TabId, TabTitle } from "./types";
import { Options } from "./options";
import { actions, filters } from "./actions";
import { favoriteTabs, parseItems, parseNotes } from "./parse";
import { coinmasterBest } from "./coinmaster";
import { set } from "libram";

const HIGHLIGHT = isDarkMode() ? "yellow" : "blue";
const DEFAULT_ACTIONS = "closet use coinmaster mall autosell display sell kmail fuel collection";

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
