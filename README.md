# Keeping Tabs on your Items

This is a script to manage your inventory for the KoLMafia client for the web browser game Kingdom of Loathing.

## How to install

```text
svn checkout https://github.com/pstalcup/keeping-tabs/branches/release/
```

## How to use

Using the native KoL interface, create native tabs to match the specific actions that you want to complete. The names of the tab must match exactly the format of `action:options`. 

Current supported actions are:

* `mall`
  * This will add the item to your mall store
  * No options are supported
* `autosell`
  * This will autosell the item
  * No options are supported
* `use`
  * This will use the item
  * No options are supported
* `display`
  * This will add the item to your display case
  * No options are supported
* `kmail:user#`
  * This will Kmail all of the items in this tab to the user
  * The only supported option is the User# of the player you want to Kmail the item to
  
After adding your items to the favorite tabs in the game, just run hte command `keeping-tabs` on the command line.

You can also specify which group of actions you want run, and which order you'd like to run them in, for example `keeping-tabs use mall kmail` would, in order, use items in the `use` tab, add all items in the `mall` tab to your mall store, and kmail all items specified in any kmail tabs to the matching users
