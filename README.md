# Keeping Tabs on your Items

This is a script to manage your inventory for the KoLMafia client for the web browser game Kingdom of Loathing.

## How to install

```text
git checkout https://github.com/loathers/keeping-tabs.git release
```

## How to use

Using the native KoL interface, create native tabs to match the specific actions that you want to complete. The names of the tab must match exactly the format of `action:options`.

## Enabling "favorites"

In order to use this script, you must enable favorites. This can be found by going to the `Options` button in KoL, then clicking the `Inventory` Submenu.
Under the heading "Right Click", there is a checkbox that says "Add to Favorites (inventory only)". Clicking this check box adds an option when right clicking an item in your inventory.

Now you can add "favorites" tabs by going to your inventory and clicking "\[+\]" next to "\[recent items\]". After creating the tab, if you need to change its name you can click on the tab and click "rename".

## Naming Tabs

When naming a tab, you specify what to do with all items in that tab by naming the tab `action:options`.

### Actions

* `mall`
  * This will add the item to your mall store
* `autosell`
  * This will autosell the item
* `sell`
  * This will either autosell the item or add it to your mall store. It will add it to your mall store only if there are less than 1000 stocked at autosell price
* `use`
  * This will use the item
* `display`
  * This will add the item to your display case
* `closet`
  * This will add the item to your closet
* `kmail`
  * This will Kmail the item to the specified user (all items will be in a batch). A `#target` option must be specified.
* `fuel`
  * This will convert items in this tab into Asdon Martin fuel
* `collection`
  * This will send any items with a matching keeping-tabs-collection directive in your notes to the relevant party

### Options

All options are supported in all tabs, unless specified. They are white space sensitive, so `< 100` is not the same as `<100`. Multiple options can be supplied by providing a comma seperated list.

* `keepN`
  * Keeps `N` copies of the item after running
* `<N`
  * Only performs the given operation on items that have a `mallPrice` that is less than `N`
* `>N`
  * Only performs the given operation on items that hvae a `mallPrice` that is greater than `N`
* `#target`
  * (only supported by `kmail`) to whom to send the kmail. Can be player name or player ID number
* `body=text`
  * (only supported by `kmail` and `collection`) the text of the kmail to send

### Examples

`autosell:keep10`: Autosell all items but keep 10 of each item.

`kmail:#sellbot,<1000`: Kmail any item with `mallPrice` < 1000 to sellbot.

`mall:>1000,<10000`: Mall any item worth more than 1000 and less than 10000.

## Aliasing

Sometimes the names for tabs can get long, and make the right click menu hard to use. In this case, you can provide aliases for your tab actions in your Quest Log notes section. They should be provided in the following format:

`keeping-tabs: alias=tabtitle`

Where `alias` should be a title consisting of only alphanumeric characters, spaces, or `-`, and `tabtitle` should be a valid tab name from the previous section (See "Naming Tabs")

You can create an arbitrary amount of aliases by putting multiple rows in your notes:

```
keeping-tabs: alias1=tabtitle1
keeping-tabs: alias2=tabtitle2
```

It is recommended to run `keeping-tabs debug aliases` to verify all of your aliases are parsed correctly.

## Collections Directives

If you want to have a single tab full of items to send to many other players, you can use the `collection` action.

To use it, you must specify the players in your Quest Log notes section in the following format:

`keeping-tabs-collection: 'playername'=itemid`

If you want to specify multiple items, you can instead use:

`keeping-tabs-collection: 'playername'=itemid1,itemid2`

To find the items ID, you can type `js toInt(Item.get("item name here"))` in the KoLMafia CLI

You can create an arbitrary amount of collection directives by putting multiple rows in your notes:

```
keeping-tabs-collection: 'playername1'=itemid1,itemid2
keeping-tabs-collection: 'playername2'=itemid3,itemid
```

Keep in mind that it will only send out items that are in a corresponding `collection` tab, so adding a directive merely specifies where the matching item will go.

It is recommended that you run `keeping-tabs debug collections` after adding a collection to verify it is registered and is the item you expect.

## Running

To get a full help documentation, you can run `keeping-tabs help`.

After adding your items to the favorite tabs in the game, just run hte command `keeping-tabs` on the command line. By default, it will run the command groups in the order `use mall autosell display kmail`

You can also specify which group of actions you want run, and which order you'd like to run them in, for example `keeping-tabs use mall kmail` would, in order, use items in the `use` tab, add all items in the `mall` tab to your mall store, and kmail all items specified in any kmail tabs to the matching users

## Debugging

In order to see more information about how keeping-tabs processes your inventory, you can use the `debug` command.

Use `keeping-tabs debug help` to see a full list of available debug commands.

## TODO

* [ ] Add more mall options (add at fixed price, add at min price, limit the items for sale)
* [ ] Add confirmation for kmailing, optionally?
* [x] Add option to keep certain number of items (using format of keepN)
* [ ] Add `pull` to pull specific items from Hagnks
* [x] Add `closet`to add specfic things to your closet
* [ ] Add `uncloset` option to run the tab again a second time, this time on your closet
* [ ] Add options to run a tab on a specific day of the week (maybe `monday` which only runs the tab on Mondays)
* [ ] Add `trade` to set up trade request with someone
