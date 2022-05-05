# Keeping Tabs on your Items

This is a script to manage your inventory for the KoLMafia client for the web browser game Kingdom of Loathing.

## How to install

```text
svn checkout https://github.com/pstalcup/keeping-tabs/branches/release/
```

## How to use

Using the native KoL interface, create native tabs to match the specific actions that you want to complete. The names of the tab must match exactly the format of `action:options`.

## Enabling "favorites"

In order to use this script, you must enable favorites. This can be found by going to the `Options` button in KoL, then clicking the `Inventory` Submenu.
Under the heading "Right Click", there is a checkbox that says "Add to Favorites (inventory only)". Clicking this check box adds an option when right clicking an item in your inventory.

Now you can add "favorites" tabs by going to your inventory and clicking "\[+\]" next to "\[recent items\]". After creating the tab, if you need to change its name you can click on the tab and click "rename".

## Actions

When naming a tab, you specify what to do with all items in that tab by naming the tab `action:options`. Currently supported actions are:

* `mall`
  * This will add the item to your mall store
  * Supports "keep", by specifying "keepN", where N is a positive number of items to retain
* `autosell`
  * This will autosell the item
  * Supports "keep", by specifying "keepN", where N is a positive number of items to retain
* `sell`
  * This will either autosell the item or add it to your mall store. It will add it to your mall store only if there are less than 1000 stocked at autosell price
  * Supports "keep", by specifying "keepN", where N is a positive number of items to retain
* `use`
  * This will use the item
  * Supports "keep", by specifying "keepN", where N is a positive number of items to retain
* `display`
  * This will add the item to your display case
  * Supports "keep", by specifying "keepN", where N is a positive number of items to retain
* `kmail:user#`
  * This will Kmail all of the items in this tab to the user
  * Supports "target", by specifiying "\#playernumber" (this is the default option if no other options are specified, without the #)
  * Supports "keep", by specifying "keepN", where N is a positive number of items to retain

After adding your items to the favorite tabs in the game, just run hte command `keeping-tabs` on the command line. By default, it will run the command groups in the order `use mall autosell display kmail`

You can also specify which group of actions you want run, and which order you'd like to run them in, for example `keeping-tabs use mall kmail` would, in order, use items in the `use` tab, add all items in the `mall` tab to your mall store, and kmail all items specified in any kmail tabs to the matching users

## TODO

* [ ] Add more mall options (add at fixed price, add at min price, limit the items for sale)
* [ ] Add confirmation for kmailing, optionally?
* [x] Add option to keep certain number of items (using format of keepN)
* [ ] Add `pull` to pull specific items from Hagnks
* [ ] Add `closet`to add specfic things to your closet
* [ ] Add `uncloset` option to run the tab again a second time, this time on your closet
* [ ] Add options to run a tab on a specific day of the week (maybe `monday` which only runs the tab on Mondays)
* [ ] Add `trade` to set up trade request with someone
