# Release notes

## 1.0.8, October 23, 2023

- **Bug fix**: Dynamic width calculation did not handle the span element's styles.

- **Change event trigger**

    When selecting or deselecting items on picker, it did not triggered change event on select.

- **Search on description**

    Now default value also search from `data-desc` if it is given on `option`.

## 1.0.7, May 31, 2023

- **Added sass variables and defaults for disabled select**

    Change text color `$ezmodus-dropdown-disabled-color`.

    Change button background color `$ezmodus-dropdown-disabled-background-color`.

    Change mouse cursor on hover `$ezmodus-dropdown-disabled-cursor`.

    Change tick color `$ezmodus-dropdown-disabled-tick-color`.

- **DATA-SELECTED-MAX**

    Fixed error to pickup the max count and limit selection.

## 1.0.6, May 31, 2023

- **DISABLED-support**

    If `select` has `disabled` attribute now also the button is disabled (menu does not open)

- **DATA-DYNAMIC**

    Fix how calculating width is done `data-dynamic`.

## 1.0.5, March 23, 2023

- **Bug fix**: After using search and leaving input empty, `no results` were showing, now hidden.

- **Auto focus**

    Changed default behaviour and search input focus is now default `true` when using "desktop" devices.
    Added `data-search-focus-mobile` (defaults: `false`). This is separate focus on touch based devices. If set true then keyboard is shown if opening menu has search.

## 1.0.4, March 19, 2023

- **DATA-SIZE**

    This is an alternative way to setup size of the menu for select picker. It is more preferable way to setup. Because when using `<select size="4" />` browser will first render select as normally. This means select will be increased in height. When using `data-size` and keeping normal size undefined the select itself is like normal input size. Otherwise you may see small blink of bigger size elements while loading the page until the ezmodus select picker transforms the select element.

- **Auto focus on search**

    Set `data-search-focus="true"` and while opening the menu with search then automatically sets focus on search input.

## 1.0.3, March 11, 2023

- **ARIA-support**

    ARIA-attributes (`aria-*`) and roles (`role`) are passed as is. `<select>` attributes are moved to dropdown button and `<option>`' attributes are moved to list items.

    ARIA understands HTML elements automatically, so these may not be needed, but support for this doesn't hurt.

- **Dynamic width**

    Sometimes select options can be short, example "Yes" and "No", but they may have `data-desc` with long text or vice versa. This may look stupid if everything is wrapped in very narrow menu.

    Set into select `data-dynamic="80"` to go through all elements context width and sets new min-width 80% of the longest element. Value of 100 should give list items to be "one liners".

- **Improved search**

    Search was based on simple `indexOf('your string')`. Search string had to match fully to get listed. New search is improved.

    [Click here to see how search works](search.md)

## 1.0.2, March 5, 2023

- **Distribution files**

    Distribution files were development format, updated to production and minified.

## 1.0.1, March 5, 2023

- **Fixed dropdown focusout**

    Menu was not closing if no action on menu was first done. Event was set into wrong place and is now on dropdown.

- **`<option>` class extension**

    Support for disabled items `<option disabled>`. This gives menu item new data-attribute: `data-disabled["true"]`

    Support to pass any class name from `<option>` to list item `li`. Gives developer more flexibility to add extra styling for special reasons, example highlighting errors with own class.

    Added SCSS variables to control disabled styling, `$ezmodus-list-item-disabled-color` and `$ezmodus-list-item-disabled-background-color`.

- **Menu**

    Added missing foreground SCSS variable for menu item, `$ezmodus-list-item-color`.

    Added Keyboard event for SPACE. Normally items can be tabbed through, but now with SPACE you can toggle the list items to be selected or not.


- **Updated documentation**

    Seperate release notes.

    Example picture for disabled options and passing option class.

---

[Back to README.md](../README.md)
